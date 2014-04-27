function NoteLesson() { }

NoteLesson.prototype = new Lesson();

// right and wrong should clear keyboard:
//    self.input.clearNotes();

NoteLesson.prototype.setOptions = function(options) {
  options = options || {stave: 'bass', octave: 3};
  this.stave = options.stave == 'bass' ? 'bass' : 'treble';
  var n = parseInt(options.octave, 10) * 12 + (parseInt(options.offset, 10) || 0);

  var majorScale  = [0, 2, 4, 5, 7, 9, 11, 12];
  var lines = [0, 4, 7, 11, 14, 17, 21, 24];
  var spaces = [2, 5, 9, 12, 16, 19, 23];
  // this.notes = [].concat(spaces, lines).map(function(i) {
  //   return new Note(n + i);
  // });

  this.levels = [
    lines.map(function(i) { return new Note(n + i); }),
    spaces.map(function(i) { return new Note(n + i); })
  ];

  this.sequence = [];

  this.setup();
};

NoteLesson.prototype.label = function(item) {
  return [item.letter(), item.accidental()].join(' ');
};

NoteLesson.prototype.description = function(item) {
  return [item.letter(), item.accidental()].join(' ');
};
