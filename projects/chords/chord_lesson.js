function ChordLesson() {

}

ChordLesson.prototype = new Lesson();

ChordLesson.prototype.setOptions = function(options) {
  options = options || {'octave': 3};

  this.sequence = ['C', 'F', 'G7'].map(function(name) {
    return new Chord(name, options.octave);
  });

  // make the first two notes active
  this.scores = [];
  this.add();
  this.add();
};

// Compare the chord to the active notes.
ChordLesson.prototype.matches = function(notes) {
  var pressed = notes.map(function(n) { return n.semitone; });
  var expected = this.currentItem.midi.map(function(n) { return n % 12; });
  var wrong = _.difference(pressed, expected);
console.log('expecting', expected, 'tried', pressed);

  // If they're pressing something that's not in the chord, fail.
  if (wrong.length) {
console.log('wrong', wrong);
    return false;
  }
  // If they're pressing the same number of notes it must be right then.
  if (pressed.length === this.currentItem.midi.length) {
console.log('got it');
    return true;
  }
  // Otherwise keep waiting.
console.log('waiting');
  return null;
};

