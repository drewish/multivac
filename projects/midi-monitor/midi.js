var midi = null;  // global MIDIAccess object
var midiEmitter = new Emitter();

function onMidiSuccess(midiAccess) {
  midi = midiAccess;  // store in the global (in real usage, would probably keep in an object instance)

  inputs = midi.inputs();
  for (var i=0;i<inputs.length;i++) {
    midiEmitter.trigger('input-found', inputs[i]);

    inputs[i].onmidimessage = onMidiMessage;
  }
}

function onMidiError(err) {
  console.log("Error code: " + err.code);
  document.getElementById("output").textContent(message);
}

function onMidiMessage(event) {
  // Ignore the CLOCK and TICK events
  if (event.data[0] == 0xF8 || event.data[0] == 0xF9) {
    return;
  }

  var status;
  var channel;
  var body;

  // We don't support Running Status
  if (event.data.length == 3) {
    status = event.data[0] >> 4;
    channel = event.data[0] & 0xF;
    body = {
      note: new Note(event.data[1]),
      velocity: event.data[2],
      channel: channel
    };

    if (status == 0x8 || (status == 0x9 && body.velocity === 0)) {
      midiEmitter.trigger('note-off', body);
    }
    else if (status == 0x9) {
      midiEmitter.trigger('note-on', body);
    }
  }
}
