function Display(id) {
}

Display.prototype.show = function(notes, label) {
  this.canvas = document.getElementById('drawing');
  this.clear();

  var staves = this.drawGrandStaff();

  var treble = notes.filter(function(note) { return (note.octave > 2); });
  var bass = notes.filter(function(note) { return (note.octave < 5); });

  this.drawNotes(staves.treble, treble, label);
  this.drawNotes(staves.bass, bass, label);
};

Display.prototype.right = function(note) {
  console.log('right');
};

Display.prototype.wrong = function(actual, expected) {
  console.log('wrong', actual.toString());
};

Display.prototype.clear = function() {
  while (this.canvas.lastChild) {
    this.canvas.removeChild(this.canvas.lastChild);
  }
  this.renderer = new Vex.Flow.Renderer(this.canvas, Vex.Flow.Renderer.Backends.RAPHAEL);
  this.ctx = this.renderer.getContext();
};

Display.prototype.drawGrandStaff = function() {
  var trebleStave = new Vex.Flow.Stave(20, 40, 400).addClef('treble').setContext(this.ctx).draw();
  var bassStave = new Vex.Flow.Stave(20, 160, 400).addClef('bass').setContext(this.ctx).draw();

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
  var Voice = new Vex.Flow.Voice({
    num_beats: 4, beat_value: 4, resolution: Vex.Flow.RESOLUTION
  });

  // Add notes to voice
  Voice.addTickables([staveNote]);

  // Format and justify the notes
  new Vex.Flow.Formatter().joinVoices([Voice]).format([Voice], 300);

  // Render voice
  Voice.draw(stave.getContext(), stave);
};
