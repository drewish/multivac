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
  var controller = new Controller(kbd);

  $('#start').click(function() {
    var lesson = new Lesson(display, {'octave': $('#octave').val()});
    $('#start, #stop, #settings').toggle();
    kbd.start();
    controller.start(lesson);
  });
  $('#stop').click(function() {
    $('#start, #stop, #settings').toggle();
    display.clear();
    kbd.stop();
    controller.stop();
  });

});
