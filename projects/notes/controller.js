function Controller(input, output) {
  this.input = input;
  this.output = output;
  this.lesson = new NoteLesson();
  this.lesson.display = output;
}

Controller.prototype = new Emitter();

Controller.prototype.preview = function(stave, octave) {
  this.lesson.setOptions({stave: stave, octave: octave});

  this.output.preview(this.lesson.stave, this.lesson.sequence);
};

Controller.prototype.start = function() {
  var self = this;

  this.playing = true;

  // make the first two notes active
  this.lesson.add();
  this.lesson.add();

  // Start state
  pick();

  // Pick a new note, then we'll play it.
  function pick() {
    self.lesson.next();
    wait();
  }

  function wait() {
    var timeout = 5000;

    if (!self.playing) return;

    self.input.promiseMatches([self.lesson.currentItem], timeout)
      .then(
        function resolved(pressed) {
          self.lesson.right(pressed);
          self.input.clearNotes();
          pick();
        },
        function rejected(pressed) {
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
