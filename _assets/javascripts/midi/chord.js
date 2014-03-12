/**
 *
 */
function Chord(name, octave) {
  octave = parseInt(octave, 10);

  var note_indexes = 'C|D|EF|G|A|B';
  var letter = name.substr(0, 1).toUpperCase();
  var root = note_indexes.indexOf(letter);
  if (root == -1) {
    throw new Error("Invalid note: " + letter);
  }
  this.letter = letter;

  // TODO figure out a nice way to incorporate the 7th offsets.
  var modifiers = {
    '':     { offsets: [0, 4, 7],  description: 'major' },
    '+':    { offsets: [0, 4, 8],  description: 'augmented' },
    '7':    { offsets: [0, 4, 10], description: 'dominant 7th' },
    'M7':   { offsets: [0, 4, 11], description: 'major 7th' },
    'dim':  { offsets: [0, 3, 6],  description: 'diminished' },
    'dim7': { offsets: [0, 3, 9],  description: 'diminished 7th' },
    'm':    { offsets: [0, 3, 7],  description: 'minor' },
    'm7':   { offsets: [0, 3, 10], description: 'minor 7th' },
  };
  var modifier = name.substr(1);
  if (!modifiers[modifier]) {
    throw new Error("Invalid modifier: " + modifier);
  }
  this.modifier = modifier;
  this.midi = modifiers[modifier].offsets.map(function(i) {
    return ((root + i) + (12 * octave));
  });
  this.description = modifiers[this.modifier].description;
 }

Chord.prototype.toString = function() {
  return [this.letter, this.modifier].join(' ');
};

Chord.prototype.notes = function() {
  return this.midi.map(function(n) { return new Note(n); });
};
