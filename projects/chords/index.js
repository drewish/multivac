
$().ready(function() {

  var display = new Display();
  // let this leak for debugging
  //var
  input = new Midi();
  //var
  controller = new Controller(input, display);

  input
    .once('started', function() {
      $('li.midiapi-help').hide();
    })
    .once('input-found', function(input) {
      $('li.midi-device-help').hide();
    })
    .start()
    .stop();

  function preview() {
    controller.preview($('[name="stave"]:checked').val(), $('#octave').val());
  }

  $('input[type="radio"]').change(function() {
    var stave = $('[name="stave"]:checked').val();
    var octave = parseInt($('#octave').val(), 10);
    if (stave == 'treble' && octave < 5) $('#octave').val(5);
    if (stave == 'bass' && octave > 4) $('#octave').val(4);
    preview();
  });
  $('input[type="number"]').change(function() {
    preview();
  });

  preview();

  $('#start').click(function() {
    $('#start, #stop').toggle();
    input.start();
    controller.start($('#octave').val());
  });
  $('#stop').click(function() {
    $('#start, #stop').toggle();
    input.stop();
    controller.stop();
    preview();
  });

});

/**
// When you need to see the events going by...
window.addEventListener("load", function() {
  if (window.navigator.requestMIDIAccess) {
    window.navigator.requestMIDIAccess().then(onMidiSuccess, onMidiError);
  }

  function onMidiSuccess(midiAccess) {
    console.log("MIDI connected", midiAccess.inputs());
    var inputs = midiAccess.inputs();
    for (var i = 0;i < inputs.length; i++) {
      inputs[i].onmidimessage = onMidiMessage;
    }
  }

  function onMidiError(err) {
    console.log("MIDI connection error, code: " + err.code);
  }

  function onMidiMessage(event) {
    // Ignore the CLOCK and TICK events
    if (event.data[0] == 0xF8 || event.data[0] == 0xF9) {
      return;
    }
    // We don't support Running Status, so we need 3 bytes.
    if (event.data.length != 3) {
      return;
    }

    // var t0 = performance.now();
    // do { 123456789 / 4 } while (performance.now() - t0 < 1000);
    // console.log(performance.now() - t0);
    console.log(event.data, event.receivedTime);

  }
}, false);
/**/
