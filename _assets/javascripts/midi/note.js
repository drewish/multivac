function Note(note, direction) {
  var note_indexes = 'C|D|EF|G|A|B';
  var parts;

  this.direction = direction || 'up';

  if (!isNaN(parseInt(note, 10))) {
    this.number = parseInt(note, 10);
    this.octave = Math.floor(this.number / 12) - 1;
    this.semitone = this.number % 12;
  }
  else if (typeof note === "string" || note instanceof String) {
    parts = note.toUpperCase().match(/^([A-G])(B|#)?\/?([0-9]?)$/);
    if (!parts) {
      throw new Error("Could not parse note from: " + note);
    }

    this.semitone = note_indexes.indexOf(parts[1]);
    if (parts[2] == '#') {
      this.semitone += 1;
      this.direction = 'up';
    }
    else if (parts[2] == 'b') {
      this.semitone -= 1;
      this.direction = 'down';
    }
    this.number = this.semitone;
    if (parts[3]) {
      this.octave = parseInt(parts[3], 10);
      this.number += (this.octave - 1) * 12;
    }
    this.semitone = this.number % 12;
  }
}

Note.prototype.letter = function () {
  // There's probably a more elegant way to do this… but this gets it done.
  var notes = '';
  if (this.direction == 'up') {
    notes = 'CCDDEFFGGAAB';
  }
  else {
    notes = 'CDDEEFGGAABB';
  }
  return notes.charAt(this.semitone);
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
  var parts = [this.letter(), this.accidental()];
  if (this.octave !== null) {
    parts.push('/' + this.octave);
  }
  return parts.join('');
};
