function Controller(input, output) {
  this.input = input;
  this.output = output;
  this.lesson = new ChordLesson();
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
    var start = performance.now();
    var timeout = 5000;

    if (!self.playing) return;

    self.input.promiseMatches(self.lesson.currentItem.midi, timeout)
      .then(
        function(pressed) {
          self.lesson.right(performance.now() - start, pressed);
          return self.input.promiseNoNotes().then(pick);
        },
        function(pressed) {
          self.lesson.wrong(performance.now() - start, pressed);
          return self.input.promiseNoNotes().then(wait);
        }
      );
  }
};

Controller.prototype.stop = function() {
  this.playing = false;
};
