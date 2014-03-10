function Controller(input, output) {
  this.input = input;
  this.output = output;
  this.lesson = null;
  this.timer = null;
}

Controller.prototype = new Emitter();

Controller.prototype.start = function(lesson) {
  var self = this;

  self.lesson = lesson;

  // Start state
  pick();

  // This is roughtly setup as a state machine with each function being a state.
  // Timeouts and MIDI events are used to transition between the states.

  // Pick a new note, then we'll play it.
  function pick() {
    self.lesson.next();
    self.timer = setTimeout(wait, 250);
  }

  // Wait for a guess, mark it as right or wrong and if we wait too long let's
  // play the note again.
  function wait() {
    // Accept a guess...
    self.input.once('note-change', acceptGuess);
    // ...but don't wait too long.
    self.timer = setTimeout(timedout, 5000);
  }

  function acceptGuess(message) {
    clearTimeout(self.timer);

    // TODO: should allow for incomplete answers
    if (self.input.matches(self.lesson.currentItem)) {
      self.lesson.right(message[0]);
      self.timer = setTimeout(pick, 500);
    }
    else {
      self.lesson.wrong(message[0]);
      self.timer = setTimeout(wait, 1000);
    }
    self.input.clearNotes();
  }

  function timedout() {
    // Remove timer/handler from wait()
    self.input.off('note-change', acceptGuess);
    clearTimeout(self.timer);

    self.lesson.wrong(null);

    wait();
  }
};

Controller.prototype.stop = function() {
  clearTimeout(self.timer);
};
