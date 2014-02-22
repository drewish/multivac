function Midi() {
  this.midi = null;
  this.activeNotes = [];
}

Midi.prototype = new Emitter();

Midi.prototype.start = function() {
  var self = this;

  if (window.navigator.requestMIDIAccess) {
    window.navigator.requestMIDIAccess().then(onMidiSuccess, onMidiError);
  }

  function onMidiSuccess(midiAccess) {
    self.midi = midiAccess;

    self.trigger('started');

    var inputs = midiAccess.inputs();
    for (var i = 0;i < inputs.length; i++) {
      inputs[i].onmidimessage = onMidiMessage;
      self.trigger('input-found', inputs[i]);
    }
  }

  function onMidiError(err) {
    self.trigger('error', err);
    console.log("MIDI connection error, code: " + err.code);
  }

  function onMidiMessage(event) {
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

    status = event.data[0] >> 4;
    note = new Note(event.data[1]);
    body = {
      channel: event.data[0] & 0xF,
      note: note,
      velocity: event.data[2]
    };

    if (status == 0x8 || (status == 0x9 && body.velocity === 0)) {
      delete this.activeNotes[note.toString()];
      self.trigger('note-off', body);
      self.trigger('note-change', this.activeNotes);
    }
    else if (status == 0x9) {
      this.activeNotes[note.toString()] = note;
      self.trigger('note-on', body);
      self.trigger('note-change', this.activeNotes);
    }
  }
};

Midi.prototype.stop = function() {
  var inputs = this.midi.inputs();
  for (var i = 0;i < inputs.length; i++) {
    inputs[i].onmidimessage = null;
  }
  this.midi = null;
};
