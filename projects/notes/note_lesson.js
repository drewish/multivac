function NoteLesson() { }

NoteLesson.prototype = new Lesson();

// right and wrong should clear keyboard:
//    self.input.clearNotes();

NoteLesson.prototype.setOptions = function(options) {
  options = options || {stave: 'bass', octave: 3};

  // offset of 0 is a C scale, 1 C#, etc
  function majorScale(octave, offset) {
    var n = octave * 12 + (offset || 0);
    return [n, n+2, n+4, n+5, n+7, n+9, n+11, n+12].map(function(n) {
      return new Note(n);
    });
  }

  this.stave = options.stave == 'bass' ? 'bass' : 'treble';
  this.notes = majorScale(parseInt(options.octave, 10), 0);
  this.sequence = this.notes.slice(0);
  this.scores = [];
};

NoteLesson.prototype.label = function(item) {
  return [item.letter(), item.accidental()].join(' ');
};

NoteLesson.prototype.description = function(item) {
  return [item.letter(), item.accidental()].join(' ');
};
