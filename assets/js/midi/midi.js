function Midi() {
  this.midi = null;
  this.activeNotes = [];

  this.listen = (function (midiAccess) {
    this.midi = midiAccess;
    this.trigger('started');

    var inputs = this.midi.inputs();
    console.log("MIDI connected", inputs.length);

    for (var i = 0; i < inputs.length; i++) {
      inputs[i].onmidimessage = this.onMessage;
      this.trigger('input-found', inputs[i]);
      console.log("Listening to", inputs[i].manufacturer, inputs[i].name);
    }
  }).bind(this);

  this.onError = (function(err) {
    this.trigger('error', err);
    console.log("MIDI connection error, code: " + err.code);
  }.bind(this));

  this.onMessage = (function (event) {
    var status;
    var note;
    var body;

    // Ignore the CLOCK and TICK events
    if (event.data[0] == 0xF8 || event.data[0] == 0xF9) {
      return;
    }

    // We don't support Running Status, so we need 3 bytes.
    if (event.data.length != 3) {
      return;
    }

    //console.log('midi event', event.data);

    status = event.data[0] >> 4;
    note = new Note(event.data[1]);
    body = {
      channel: event.data[0] & 0xF,
      note: note,
      velocity: event.data[2]
    };

    if (status == 0x8 || (status == 0x9 && body.velocity === 0)) {
      this.activeNotes = this.activeNotes.filter(function(n) {
        return n.number != note.number;
      });

      this.trigger('note-off', body);
      this.trigger('note-change', this.activeNotes);
    }
    else if (status == 0x9) {
      // Make sure we don't put this in twice.
      this.activeNotes = this.activeNotes.filter(function(n) {
        return n.number != note.number;
      });
      this.activeNotes.push(note);

      this.trigger('note-on', body);
      this.trigger('note-change', this.activeNotes);
    }
  }).bind(this);
}

Midi.prototype = new Emitter();

Midi.prototype.start = function() {
  if (window.navigator.requestMIDIAccess) {
    window.navigator.requestMIDIAccess().then(this.listen, this.onError);
  }
  return this;
};

Midi.prototype.stop = function() {
  if (!this.midi) return this;

  var inputs = this.midi.inputs();
  for (var i = 0;i < inputs.length; i++) {
    inputs[i].onmidimessage = null;
  }
  this.midi = null;

  return this;
};


// Promise that resolves when no notes are being played.
Midi.prototype.promiseNoNotes = function() {
  var input = this;

  return new Promise(function(resolve, reject) {
    var compare = function (notes) {
      if (notes.length > 0) {
        return false;
      }

      input.off('note-change', compare);
      resolve();
      return true;
    };

    // Check the current value before setting up the listener
    if (!compare(input.activeNotes)) {
      input.on('note-change', compare);
    }
  });
};

// Promise that resolves when the midi numbers are pressed, or rejects when an
// incorrect note is played or the timeout is reached.
Midi.prototype.promiseMatches = function(expected, timeout) {
  var input = this;

  // // Matching relative positions right now.
  // expected = expected.map(function(n) { return n % 12; });

  return new Promise(function(resolve, reject) {
    // Only wait this long before rejecting.
    var timer = setTimeout(timedout, timeout);

    function timedout() {
      reject(null);
    }

    function compare(notes) {
      var pressed = notes.map(function(n) { return n.number; });
      var wrong = _.difference(pressed, expected);

      console.log('expecting', expected, 'tried', pressed);
      // If they're pressing something that's not in the list, fail.
      if (wrong.length) {
        input.off('note-change', compare);
        clearTimeout(timer);
        reject(notes);
        return true;
      }
      // If they're pressing the same number of notes it must be right then.
      else if (pressed.length === expected.length) {
        input.off('note-change', compare);
        clearTimeout(timer);
        resolve(notes);
        return false;
      }
      // Otherwise keep waiting.
      return null;
    }

    // Check the current note incase it matches before setting up a listener.
    if (compare(input.activeNotes) === null) {
      input.on('note-change', compare);
    }
  });
};
