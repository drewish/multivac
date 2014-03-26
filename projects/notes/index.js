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

  $('#start').click(function start() {
    $('#start, #stop').toggle();
    input.start();
    controller.start($('#octave').val());
  });
  $('#stop').click(function stop() {
    $('#start, #stop').toggle();
    input.stop();
    controller.stop();
    preview();
  });

});
