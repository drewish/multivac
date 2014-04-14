/**
 *
 */
function Chord(name, octave, direction) {
  octave = parseInt(octave, 10);
  // TODO: I'm not sure I really like having the direction in here, I'd rather
  // have it figure out a key signature and do sharps/flats from that.
  this.direction = (direction == 'up') ? 'up' : 'down';

  var parts = name.match(/^([A-Ga-g])(b|B|#)?(m|M|dim|\+)?(7)?/);
  if (!parts) {
    throw new Error("Could not parse chord from: " + name);
  }

  var note_indexes = 'C|D|EF|G|A|B';
  var number = note_indexes.indexOf(parts[1]) + (octave + 1) * 12;
  if (parts[2] == '#') {
    number += 1;
  }
  else if ((parts[2] || '').toLowerCase() == 'b') {
    number -= 1;
  }
  this.letter = parts.slice(1,3).join('');

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
  var modifier = parts.slice(3,5).join('');
  if (!modifiers[modifier]) {
    throw new Error("Invalid modifier: " + modifier);
  }
  this.modifier = modifier;
  this.midi = modifiers[modifier].offsets.map(function(i) {
    return (number + i);
  });
  this.description = modifiers[this.modifier].description;
  this.inversion = 0;
}

Chord.prototype.invert = function() {
  this.inversion += 1;
  this.midi.push(this.midi.shift() + 12);
  return this;
};

Chord.prototype.offsetOctave = function(i) {
  this.midi = this.midi.map(function(n) { return n + (i * 12); });
  return this;
};

Chord.prototype.toString = function() {
  var name = this.letter + this.modifier;
  if (this.inversion == 1) {
    name += ' 1st inversion';
  }
  else if (this.inversion == 2) {
    name += ' 2nd inversion';
  }
  return name;
};

Chord.prototype.notes = function() {
  return this.midi.map(function(n) {
    return new Note(n, this.direction);
  }, this);
};
