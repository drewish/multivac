/**
 *
 */
function Chord(name, octave) {
  var letter = name.substr(0, 1).toUpperCase();
  var note_indexes = 'C|D|EF|G|A|B';
  var root = note_indexes.indexOf(letter);
  if (root == -1) {
    throw new Error("Invalid note: " + letter);
  }
  this.letter = letter;

  var modifier = name.substr(1).toLowerCase();
  var offsets = {
    '':    [0, 4, 7], // major
    'm':   [0, 3, 7], // minor
    'dim': [0, 3, 6], // diminished
    '+':   [0, 4, 5], // augmented
  };
  octave = parseInt(octave, 10);
  if (modifier in offsets) {
    this.modifier = modifier;
    this.midi = offsets[modifier].map(function(i) {
      return (i + 12 * octave);
    });
  }
  else {
    throw new Error("Invalid modifier: " + modifier );
  }
}

Chord.prototype.toString = function() {
  return [this.letter, this.modifier, this.midi].join(' ');
};

Chord.prototype.notes = function() {
  return this.midi.map(function(n) { return new Note(n); });
};
