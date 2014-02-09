
$().ready(function() {
  var activeNotes = [];

  var midi = new Midi();

  midi
    .once('started', function() {
      $('li.midiapi-help').hide();
    })
    .once('input-found', function(input) {
      $('li.midi-device-help').hide();
    });

  midi.on('note-on', function(event) {
    var note = event.note;
    activeNotes[note.toString()] = note;

    console.log(activeNotes);
    drawGrandStaff(activeNotes);
  });

  midi.on('note-off', function(event) {
    var note = event.note;
    delete activeNotes[note.toString()];

    console.log(activeNotes);
    drawGrandStaff(activeNotes);
  });

  midi.start();

  drawGrandStaff(activeNotes);
});
