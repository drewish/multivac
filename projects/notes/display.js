function Display(id) {
}

Display.prototype.preview = function(staveType, notes) {
  this.canvas = document.getElementById('drawing');
  this.clear();

  var stave = (staveType == 'bass') ? this.drawBassStaff() : this.drawTrebleStaff();

  if (!notes.length) return;

  // Create a voice in 4/4
  var voice = new Vex.Flow.Voice({
    num_beats: 4, beat_value: 4, resolution: Vex.Flow.RESOLUTION
  });

  voice.setStrict(false); // Avoid error about not enough notes

  var staveNotes = notes.map(function(n, i) {
    var staveNote = new Vex.Flow.StaveNote({
      clef: stave.clef, duration: "8",
      keys: [n.toString()]
    });

    if (n.accidental()) {
      staveNote.addAccidental(i, new Vex.Flow.Accidental(n.accidental()));
    }

    return staveNote;
  });

  // Add notes to voice
  voice.addTickables(staveNotes);

  // Format and justify the notes
  new Vex.Flow.Formatter().joinVoices([voice]).format([voice], 300);

  // Render voice
  voice.draw(stave.getContext(), stave);
};

Display.prototype.show = function(staveType, note, label) {
  this.canvas = document.getElementById('drawing');
  this.clear();

  var stave = (staveType == 'bass') ? this.drawBassStaff() : this.drawTrebleStaff();
  if (!note) return;

  this.drawNotes(stave, [note], label);
};

Display.prototype.right = function(note) {
  console.log('right', note);
};

Display.prototype.wrong = function(actual, expected) {
  if (actual === null) {
    console.log('wrong', 'timedout');
  } else {
    console.log('wrong', actual.toString(), expected);
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

Display.prototype.drawTrebleStaff = function(x) {
  var y = 110;
  x = x || 20;
  return new Vex.Flow.Stave(x, y, 400).addClef('treble').setContext(this.ctx).draw();
};

Display.prototype.drawBassStaff = function(x) {
  var y = 170;
  x = x || 20;
  return new Vex.Flow.Stave(x, y, 400).addClef('bass').setContext(this.ctx).draw();
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

  // Create a voice in 4/4
  var voice = new Vex.Flow.Voice({
    num_beats: 4, beat_value: 4, resolution: Vex.Flow.RESOLUTION
  });

  // Add notes to voice
  voice.addTickables([staveNote]);

  // Format and justify the notes
  new Vex.Flow.Formatter().joinVoices([voice]).format([voice], 300);

  // Render voice
  voice.draw(stave.getContext(), stave);
};
