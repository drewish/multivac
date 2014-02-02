
function Note(number, direction) {
  this.number = number;
  this.direction = direction || 'up';
}

Note.prototype.letter = function () {
  // There's probably a more elegant way to do this… but this gets it done.
  var notes = '';
  if (this.direction == 'up') {
      notes = 'CCDDEFFGGAAB';
  }
  if (this.direction == 'down') {
      notes = 'CDDEEFGGAABB';
  }
  return notes[this.number % 12];
};

Note.prototype.accidental = function () {
  var index = this.number % 12;
  if (index == 1 || index == 3 || index == 6 || index == 8 || index == 10) {
    if (this.direction == 'up') {
      return "#";
    }
    return "b";
  }
  return "";
};

Note.prototype.octave = function () {
  return Math.floor(this.number / 12) - 1;
};

Note.prototype.semitone = function () {
  return this.number % 12;
};

Note.prototype.toString = function () {
  return this.letter() + this.accidental() + '/' + this.octave();
};
