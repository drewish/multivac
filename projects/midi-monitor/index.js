function sendMiddleC(indexOfPort) {
  var message;
  var output = midi.outputs()[indexOfPort];
  message = [0x90, 0x45, 0x7f]; // note on, middle C, full velocity
  output.send(message);  //omitting the timestamp means send immediately.
  message = [0x80, 0x45, 0x00]; // note off, middle C, release velocity = 64,
  output.send(message, window.performance.now() + 500.0); // timestamp = now + 1000ms.
}

$().ready(function() {
  var activeNotes = [];
  var display = new Display();
  var input = new Midi();

  display.show([]);

  if (window.navigator.requestMIDIAccess) {
    $('.midiapi-help').hide();
  }

  input.once('input-found', function(input) {
    $('.midi-device-help').hide();
    console.log(input);
  });
  input.on('note-change', function(notes) {
    display.show(notes);
  });

  input.start();
});
