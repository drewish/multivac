function Controller(input, output) {
  this.input = input;
  this.output = output;
  this.lesson = new NoteLesson();
  this.lesson.display = output;
}

Controller.prototype = new Emitter();

Controller.prototype.preview = function(stave, octave) {
  this.lesson.setOptions({stave: stave, octave: octave});

  this.output.preview(this.lesson.stave, this.lesson.levels);
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
    if (!self.playing) return;

    self.lesson.next();
    wait();
  }

  function wait() {
    var start = performance.now();
    var timeout = 5000;

    self.input.promiseMatches([self.lesson.currentItem], timeout)
      .then(
        function resolved(pressed) {
          if (!self.playing) return;

          self.input.clearNotes();
          self.lesson.right(performance.now() - start, pressed);
          setTimeout(pick, 250);
        },
        function rejected(pressed) {
          if (!self.playing) return;

          self.input.clearNotes();
          self.lesson.wrong(performance.now() - start, pressed);
          setTimeout(wait, 250);
        }
      ).catch(function(error) {
        console.log(":(", error);
      });
  }
};

Controller.prototype.stop = function() {
  this.playing = false;
};
