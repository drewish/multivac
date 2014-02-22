function Keyboard() {
  var self = this;
  var lastCharacter = "";

  this.activeNotes = [];
  this.key = function(event) {
    var code = event.charCode || event.keyCode;
    var character;
//    var regex = /^[ABDEG]B?$|^[ACDFG]#?$/;
  var regex = /[A-G]/;

//    if (event.shiftKey && code == 51) {
//      character = '#';
//    }
//    else {
      character = String.fromCharCode(code);
//    }

//    // If this and the last character make a valid name switch it to that.
//    if (lastCharacter && regex.test(lastCharacter + character)) {
//      // TODO: array slice to handle the remove/add at the same time?
//      delete self.activeNotes[lastCharacter];
//      character = lastCharacter + character.toLowerCase();
//      lastCharacter = '';
//      self.addNote(character);
//    }
    // Otherwise try to just use this character.
//    else
    if (character && regex.test(character)) {
//      lastCharacter = character;
      self.addNote(character);
    }
    // If it's invalid don't keep it around.
//    else {
//      lastCharacter = '';
//    }
  };
}

Keyboard.prototype = new Emitter();

Keyboard.prototype.start = function() {
  window.addEventListener('keyup', this.key);
};

Keyboard.prototype.stop = function() {
  window.removeEventListener('keyup', this.key);
};

Keyboard.prototype.addNote = function(name) {
  // Make sure we don't put this in twice.
  this.activeNotes = this.activeNotes.filter(function(n) {
    return n.toString() != name;
  });
  this.activeNotes.push(new Note(name));

  this.trigger('note-change', this.activeNotes);
};

Keyboard.prototype.removeNote = function(name) {
  this.activeNotes = this.activeNotes.filter(function(n) {
    return n.toString() != name;
  });
  this.trigger('note-change', this.activeNotes);
};

Keyboard.prototype.clearNotes = function(name) {
  this.activeNotes = [];
  this.trigger('note-change', this.activeNotes);
};

// Compare the specified note to the active notes.
// TODO: should allow for incomplete answers (e.g. A is incomplete match for A#)
Keyboard.prototype.matches = function(note) {
  // Ignore octave and accidentals
  var letter = note.letter();
  return this.activeNotes.some(function(n) {
    return n.letter() == letter;
  });
};
