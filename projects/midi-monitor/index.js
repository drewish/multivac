var midi = null;  // global MIDIAccess object
var midiEmitter = new Emitter();

function onMidiSuccess(midiAccess) {
  midi = midiAccess;  // store in the global (in real usage, would probably keep in an object instance)

  var inputs = midi.inputs();
  for (var i = 0;i < inputs.length; i++) {
    inputs[i].onmidimessage = onMidiMessage;
    midiEmitter.trigger('input-found', inputs[i]);
  }
}

function onMidiError(err) {
  console.log("Error code: " + err.code);
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

function sendMiddleC(indexOfPort) {
  var message;
  var output = midi.outputs()[indexOfPort];
  message = [0x90, 0x45, 0x7f]; // note on, middle C, full velocity
  output.send(message);  //omitting the timestamp means send immediately.
  message = [0x80, 0x45, 0x00]; // note off, middle C, release velocity = 64,
  output.send(message, window.performance.now() + 500.0); // timestamp = now + 1000ms.
}

function drawGrandStaff(activeNotes) {
  var canvas = document.getElementById('drawing');
  // var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);
  // var canvas = document.getElementById('svg-canvas');
  var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.RAPHAEL);
  var ctx = renderer.getContext();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Create the staves
  var trebleStave = new Vex.Flow.Stave(20, 40, 400)
    .addClef('treble').setContext(ctx).draw();
  var bassStave = new Vex.Flow.Stave(20, 160, 400)
    .addClef('bass').setContext(ctx).draw();

  new Vex.Flow.StaveConnector(trebleStave, bassStave)
    .setType(3).setContext(ctx).draw();
  new Vex.Flow.StaveConnector(trebleStave, bassStave)
    .setType(1).setContext(ctx).draw();
  new Vex.Flow.StaveConnector(trebleStave, bassStave)
    .setType(6).setContext(ctx).draw();

  var trebleNotes = [];
  var bassNotes = [];

  Object.keys(activeNotes).forEach(function(key) {
    var note = activeNotes[key];
    if (note.octave() > 2) {
      trebleNotes.push(key);
    }
    if (note.octave() < 5) {
      bassNotes.push(key);
    }
  });

  if (trebleNotes.length) {
    drawNotes(trebleStave, [
      new Vex.Flow.StaveNote({clef: 'treble', keys: trebleNotes, duration: "w" })
    ]);
  }
  if (bassNotes.length) {
    drawNotes(bassStave, [
      new Vex.Flow.StaveNote({clef: 'bass', keys: bassNotes, duration: "w" })
    ]);
  }
}

function drawNotes(stave, notes) {
  // Create a voice in 4/4
  var Voice = new Vex.Flow.Voice({
    num_beats: 4,
    beat_value: 4,
    resolution: Vex.Flow.RESOLUTION
  });

  // Add notes to voice
  Voice.addTickables(notes);

  // Format and justify the notes
  new Vex.Flow.Formatter().joinVoices([Voice]).format([Voice], 300);

  // Render voice
  Voice.draw(stave.getContext(), stave);
}


$().ready(function() {
  var activeNotes = [];

  if (window.navigator.requestMIDIAccess) {
    $('.midiapi-help').hide();
    window.navigator.requestMIDIAccess().then(onMidiSuccess, onMidiError);
  }

  midiEmitter.on('input-found', function(input) {
    $('.midi-device-help').hide();
    console.log(input);
  });

  midiEmitter.on('note-on', function(event) {
    var note = event.note;
    activeNotes[note.toString()] = note;

    console.log(activeNotes);
    drawGrandStaff(activeNotes);
  });

  midiEmitter.on('note-off', function(event) {
    var note = event.note;
    var index;

    delete activeNotes[note.toString()];

    console.log(activeNotes);
    drawGrandStaff(activeNotes);
  });

  drawGrandStaff(activeNotes);
});
