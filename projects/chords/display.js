
function drawGrandStaff(activeNotes) {
  var canvas = document.getElementById('drawing');
  while (canvas.lastChild) {
    canvas.removeChild(canvas.lastChild);
  }
  var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.RAPHAEL);
  var ctx = renderer.getContext();

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
  var trebleAccidentals = [];
  var bassAccidentals = [];

  Object.keys(activeNotes).forEach(function(key) {
    var note = activeNotes[key];
    var accidental;
    if (note.accidental()) {
      accidental = new Vex.Flow.Accidental(note.accidental());
    }
    if (note.octave > 2) {
      trebleNotes.push(key);
      if (accidental) {
        trebleAccidentals.push(accidental);
      }
    }
    if (note.octave < 5) {
      bassNotes.push(key);
      if (accidental) {
        bassAccidentals.push(accidental);
      }
    }
  });

  var staveNote;
  if (trebleNotes.length) {
    staveNote = new Vex.Flow.StaveNote({clef: 'treble', keys: trebleNotes, duration: "w" });
    trebleAccidentals.forEach(function(accidental, i) {
      staveNote.addAccidental(i, accidental);
    });
    drawNotes(trebleStave, [staveNote]);
  }
  if (bassNotes.length) {
    staveNote = new Vex.Flow.StaveNote({clef: 'bass', keys: bassNotes, duration: "w" });
    bassAccidentals.forEach(function(accidental, i) {
      staveNote.addAccidental(i, accidental);
    });
    drawNotes(bassStave, [staveNote]);
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

