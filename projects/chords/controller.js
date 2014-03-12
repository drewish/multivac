function Controller(input, output) {
  this.input = input;
  this.output = output;
  this.lesson = new ChordLesson();
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
    self.lesson.next();
    wait();
  }

  function wait() {
    var timeout = 5000;

    if (!self.playing) return;

    self.input.promiseMatches(self.lesson.currentItem.midi, timeout)
      .then(
        function(pressed) {
          self.lesson.right(pressed);
          return self.input.promiseNoNotes().then(pick);
        },
        function(pressed) {
          self.lesson.wrong(pressed);
          return self.input.promiseNoNotes().then(wait);
        }
      );
  }
};

Controller.prototype.stop = function() {
  this.playing = false;
};
