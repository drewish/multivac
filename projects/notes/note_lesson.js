function NoteLesson() { }

NoteLesson.prototype = new Lesson();

// right and wrong should clear keyboard:
//    self.input.clearNotes();

NoteLesson.prototype.setOptions = function(options) {
  this.stave = options.stave == 'bass' ? 'bass' : 'treble';


  if (this.stave == 'bass') {
    var start = 36;
    var makeNote = function(i) { return new Note(start + i); };
    this.levels = [
      [7, 11, 14, 17, 21].map(makeNote),
      [9, 12, 16, 19].map(makeNote),
      [4, 5, 23, 24].map(makeNote),
    ];
  }
  else {
    var makeNote = function(s) { return new Note(s); };
    this.levels = [
      ['e/4', 'g/4', 'b/4', 'd/5', 'f/5'].map(makeNote),
      ['f/4', 'a/4', 'c/5', 'e/5'].map(makeNote),
      ['d/4', 'c/4', 'g/5', 'a/5'].map(makeNote),
    ];
  }

  this.sequence = [];

  this.setup();
};

NoteLesson.prototype.label = function(item) {
  return [item.letter(), item.accidental()].join(' ');
};

NoteLesson.prototype.description = function(item) {
  return [item.letter(), item.accidental()].join(' ');
};
