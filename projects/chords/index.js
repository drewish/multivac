$().ready(function() {

  var midi = new Midi();

  midi
    .once('started', function() {
      $('li.midiapi-help').hide();
    })
    .once('input-found', function(input) {
      $('li.midi-device-help').hide();
    });

  midi.start();


  var kbd = new Keyboard();
  kbd.start();
  var controller = new Controller(kbd);

  controller.run();
});
