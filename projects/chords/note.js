function Note(number, direction) {
  this.number = number;
  this.direction = direction || 'up';
  this.octave = Math.floor(this.number / 12) - 1;
  this.semitone = this.number % 12;
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
  return notes[this.semitone];
};

Note.prototype.accidental = function () {
  if ([1, 3, 6, 8, 10].indexOf(this.semitone) == -1) {
    return "";
  }
  if (this.direction == 'up') {
    return "#";
  }
  return "b";
};

Note.prototype.toString = function () {
  return this.letter() + this.accidental() + '/' + this.octave;
};
