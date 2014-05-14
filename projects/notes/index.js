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
    var stave = $('[name="stave"]:checked').val();
    localStorage.setItem('stave', stave);

    controller.preview(stave);
  }

  $('input[type="radio"]').change(function() {
    preview();
  });

  $('[name="stave"][value="' + (localStorage.getItem('stave') || "treble") + '"]')
    .prop('checked', true)
    .change();

  $('#start').click(function start() {
    $('#start, #stop').toggle();
    input.start();
    controller.start();
  });
  $('#stop').click(function stop() {
    $('#start, #stop').toggle();
    input.stop();
    controller.stop();
    preview();
  });
});
