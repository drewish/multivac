function ChordLesson() { }

ChordLesson.prototype = new Lesson();

ChordLesson.prototype.setOptions = function(options) {
  options = options || {stave: 'bass', octave: 3};
  var octave = options.octave;

  this.stave = options.stave == 'bass' ? 'bass' : 'treble';
  this.octave = octave;

  this.sequence = [
    // // C Major
    // (new Chord('C', octave)),
    // (new Chord('F', octave)).invert().invert().offsetOctave(-1),
    // (new Chord('G7', octave)).invert().offsetOctave(-1)

    // G Major
    (new Chord('G', octave)),
    (new Chord('C', octave)).invert().invert(),
    (new Chord('D7', octave)).invert()

    // // F Major
    // (new Chord('F', octave)),
    // (new Chord('Bb', octave)).invert().invert().offsetOctave(-1),
    // (new Chord('C7', octave)).invert().offsetOctave(-1)
  ];

  // make the first two notes active
  this.scores = [];
};

ChordLesson.prototype.label = function(item) {
  return item.letter + item.modifier;
};

ChordLesson.prototype.description = function(item) {
  return item.toString();
};
