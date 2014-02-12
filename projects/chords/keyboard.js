function Keyboard() {
  var self = this;
  var lastCharacter = "";

  this.activeNotes = [];
  this.key = function(event) {
    var code = event.charCode || event.keyCode;
    var character;
    var regex = /^[ABDEG]B?$|^[ACDFG]#?$/;

    if (event.shiftKey && code == 51) {
      character = '#';
    }
    else {
      character = String.fromCharCode(code);
    }

    // If this and the last character make a valid name switch it to that.
    if (lastCharacter && regex.test(lastCharacter + character)) {
      // TODO: array slice to handle the remove/add at the same time?
      delete self.activeNotes[lastCharacter];
      character = lastCharacter + character.toLowerCase();
      lastCharacter = '';
      self.addNote(character);
    }
    // Otherwise try to just use this character.
    else if (character && regex.test(character)) {
      lastCharacter = character;
      self.addNote(character);
    }
    // If it's invalid don't keep it around.
    else {
      lastCharacter = '';
    }

    console.log(self.activeNotes);
  };
}

Keyboard.prototype = new Emitter();

Keyboard.prototype.start = function() {
  window.addEventListener('keyup', this.key);
  this.on('note-change', function(a) {console.log('pressing', a);});
};

Keyboard.prototype.stop = function() {
  window.removeEventListener('keyup', this.key);
};

Keyboard.prototype.addNote = function(name) {
  if (name in this.activeNotes) {
    return;
  }
  this.activeNotes[name] = new Note(name);
  this.trigger('note-change', this.activeNotes);
};

// Keyboard.prototype.removeNote = function(name) {
//   delete self.activeNotes[name];
//   this.trigger('note-change', this.activeNotes);
// };

Keyboard.prototype.clearNotes = function(name) {
  this.activeNotes = [];
  this.trigger('note-change', this.activeNotes);
};
