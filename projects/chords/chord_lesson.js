function ChordLesson() {

}

ChordLesson.prototype = new Lesson();

ChordLesson.prototype.setOptions = function(options) {
  options = options || {'octave': 3};

  this.sequence = ['C', 'F', 'G7'].map(function(name) {
    return new Chord(name, options.octave);
  });

  // make the first two notes active
  this.scores = [];
  this.add();
  this.add();
};

ChordLesson.prototype.label = function(item) {
  return item.toString();
};

