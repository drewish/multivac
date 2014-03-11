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
  var input = new Keyboard();
  var controller = new Controller(input, display);

  $('#start').click(function() {
    $('#start, #stop').toggle();
    input.start();
    controller.start($('#octave').val());
  });
  $('#stop').click(function() {
    $('#start, #stop').toggle();
    input.start();
    controller.stop();
  });

});
