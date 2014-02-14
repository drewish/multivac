function Controller(input, output) {
  this.input = input;
  this.output = output;
  this.lesson = new Lesson();
  this.note = null;

  this.on('playing', function(note) { output.show([note], note.letter() + note.accidental()); });
  this.on('right', function(note) { output.show([]); });
  //this.on('wrong', function(note) { output.show([]); });
}

Controller.prototype = new Emitter();

Controller.prototype.run = function() {
  var self = this;

  // This is roughtly setup as a state machine with each function being a state.
  // Timeouts and MIDI events are used to transition between the states.

  // Pick a new note, then we'll play it.
  function pick() {
    self.note = new Note(self.lesson.next());
    self.trigger('picked', self.note);
    setTimeout(play, 250);
  }

  // Play the note, then we'll wait for them.
  function play() {
console.log("playing", self.note.toString());
    self.trigger('playing', self.note);
    // Let them guess while it's still playing.
    setTimeout(wait, 100);
  }

  // Wait for a guess, mark it as right or wrong and if we wait too long let's
  // play the note again.
  function wait() {
    var timeout;

    function acceptGuess(message) {
      var picked = _.values(message)[0];
console.log('picked', picked.toString());
      self.input.clearNotes();

      clearTimeout(timeout);
      if (self.lesson.check(picked)) {
        right();
      }
      else {
        wrong(picked);
      }
    }

    function timedout() {
      self.input.off('note-change', acceptGuess);
      play();
    }

    self.trigger('waiting');

    // Accept a guess...
    self.input.once('note-change', acceptGuess);
    // ...but don't wait too long.
    timeout = setTimeout(timedout, 5000);
  }

  // They got it right, give feedback then pick another note.
  function right() {
console.log('right');
    self.trigger('right');
    self.lesson.right();

    setTimeout(pick, 500);
  }

  // They were wrong, give feed back then play it again.
  function wrong(note) {
console.log('wrong', note);
    self.trigger('wrong', note.toString());
    self.lesson.wrong(note);

    setTimeout(play, 1000);
  }

  // Start state
  pick();
};
