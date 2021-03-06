function Display(id) {
}

Display.prototype.preview = function(staveType, levels) {
  this.canvas = document.getElementById('drawing');
  this.clear();

  if (!levels.length) return;

  levels.forEach(function(chords, index) {
    var stave = (staveType == 'bass') ?
      this.drawBassStaff(index, 'Level ' + index) :
      this.drawTrebleStaff(index, 'Level ' + index);

    var staveNotes = [];

    chords.forEach(function(chord, i) {
      var notes = chord.notes();
      var staveNote = new Vex.Flow.StaveNote({
        clef: stave.clef, duration: "q",
        keys: notes.map(function(n) { return n.toString(); }),
        // stem_direction: -1
      });

      notes.forEach(function(note, i) {
        if (note.accidental()) {
          staveNote.addAccidental(i, new Vex.Flow.Accidental(note.accidental()));
        }
      });

      var just = Vex.Flow.Annotation.VerticalJustify[stave.clef == 'bass' ? 'BOTTOM' : 'TOP'];
      staveNote.addAnnotation(0, (new Vex.Flow.Annotation(chord.toString()))
        .setFont("Times", 12)
        .setVerticalJustification(just)
      );

      staveNotes.push(staveNote);
    });

    Vex.Flow.Formatter.FormatAndDraw(this.ctx, stave, staveNotes, {auto_beam: true});

  }, this);
};

Display.prototype.show = function(staveType, chord, label) {
  this.canvas = document.getElementById('drawing');
  this.clear();

  var stave = (staveType == 'bass') ? this.drawBassStaff(0, label) : this.drawTrebleStaff(0, label);

  if (!chord) return;

  this.drawNotes(stave, chord.notes());
};

Display.prototype.right = function(note) {
  console.log('right');
};

Display.prototype.wrong = function(actual, expected) {
// staveNote.setKeyStyle(0, {shadowBlur:15, shadowColor:'blue', fillStyle:'blue'});


  if (actual === null) {
    console.log('wrong', 'timedout');
  } else {
    console.log('wrong', actual.toString());
  }
};

Display.prototype.clear = function() {
  while (this.canvas.lastChild) {
    this.canvas.removeChild(this.canvas.lastChild);
  }
  this.renderer = new Vex.Flow.Renderer(this.canvas, Vex.Flow.Renderer.Backends.RAPHAEL);
  this.ctx = this.renderer.getContext();
};

Display.prototype.updateScores = function(scores) {
  var message = '';
  scores.forEach(function(item) {
    // TODO get foundation classes/markup out of here
    message += item.name + ' <div class="progress large-2"><span class="meter" style="width: ' + item.percent + '%"></span></div>';
  });
  // TODO: get the jquery out of here... and the hard coded id selector.
  $('#scores').html(message);
};


Display.prototype.drawTrebleStaff = function(measureNumber, label) {
  var width = 135;
  var y = 110;
  var x = (measureNumber || 0) * width + 20;
  var stave = new Vex.Flow.Stave(x, y, width).setContext(this.ctx);
  stave.clef = 'treble';
  if (!measureNumber) stave.addModifier(new Vex.Flow.Clef(stave.clef));
  if (label) stave.setText(label, Vex.Flow.Modifier.Position.BELOW, {shift_y: 10});
  return stave.draw();
};

Display.prototype.drawBassStaff = function(measureNumber, label) {
  var width = 135;
  var y = 170;
  var x = (measureNumber || 0) * width + 20;
  var stave = new Vex.Flow.Stave(x, y, width).setContext(this.ctx);
  stave.clef = 'bass';
  if (!measureNumber) stave.addModifier(new Vex.Flow.Clef(stave.clef));
  if (label) stave.setText(label, Vex.Flow.Modifier.Position.BELOW, {shift_y: 10});
  return stave.draw();
};


Display.prototype.drawGrandStaff = function() {
  var trebleStave = this.drawTrebleStaff();
  var bassStave = this.drawBassStaff();

  new Vex.Flow.StaveConnector(trebleStave, bassStave).setType(3).setContext(this.ctx).draw();
  new Vex.Flow.StaveConnector(trebleStave, bassStave).setType(1).setContext(this.ctx).draw();
  new Vex.Flow.StaveConnector(trebleStave, bassStave).setType(6).setContext(this.ctx).draw();

  return {treble: trebleStave, bass: bassStave};
};

Display.prototype.drawNotes = function(stave, notes, label) {
  if (!notes.length) return;

  var staveNote = new Vex.Flow.StaveNote({
    clef: stave.clef, duration: "w",
    keys: notes.map(function(n) { return n.toString(); })
  });

  notes.forEach(function(note, i) {
    if (note.accidental()) {
      staveNote.addAccidental(i, new Vex.Flow.Accidental(note.accidental()));
    }
  });

  if (label) {
    var just = Vex.Flow.Annotation.VerticalJustify[stave.clef == 'bass' ? 'BOTTOM' : 'TOP'];
    staveNote.addAnnotation(0, (new Vex.Flow.Annotation(label))
      .setFont("Times", 12)
      .setJustification(Vex.Flow.Annotation.Justify.CENTER)
      .setVerticalJustification(just)
    );
  }

  Vex.Flow.Formatter.FormatAndDraw(this.ctx, stave, [staveNote]);
};
