function Controller(input, output) {
  this.input = input;
  this.output = output;
  this.lesson = new NoteLesson();
  this.lesson.display = output;
}

Controller.prototype = new Emitter();

Controller.prototype.start = function(octave) {
  var self = this;

  this.playing = true;
  this.lesson.setOptions({octave: octave});

  // Start state
  pick();

  // Pick a new note, then we'll play it.
  function pick() {
    if (!self.playing) return;

    self.lesson.next();
    wait();
  }

  function wait() {
    var timeout = 5000;

    self.input.promiseMatches([self.lesson.currentItem], timeout)
      .then(
        function(pressed) {
          self.lesson.right(pressed);
          self.input.clearNotes();
          pick();
        },
        function(pressed) {
          self.lesson.wrong(pressed);
          self.input.clearNotes();
          wait();
        }
      );
  }
};

Controller.prototype.stop = function() {
  this.playing = false;
};
