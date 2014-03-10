$().ready(function() {

  // var midi = new Midi();

  // midi
  //   .once('started', function() {
  //     $('li.midiapi-help').hide();
  //   })
  //   .once('input-found', function(input) {
  //     $('li.midi-device-help').hide();
  //   });

  // midi.start();

  var display = new Display();
  var kbd = new Keyboard();
  var controller = new Controller(kbd, display);

  $('#start').click(function() {
    $('#start, #stop').toggle();
    kbd.start();
    controller.start($('#octave').val());
  });
  $('#stop').click(function() {
    $('#start, #stop').toggle();
    kbd.stop();
    controller.stop();
  });

});