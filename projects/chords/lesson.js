function Lesson(display, options) {
  options = options || {'octave': 3};

  this.display = display;

  // offset of 0 is a C scale, 1 C#, etc
  function majorScale(octave, offset) {
    var n = octave * 12 + (offset || 0);
    return [n, n+2, n+4, n+5, n+7, n+9, n+11, n+12];
  }

  this.notes = majorScale(parseInt(options.octave, 10), 0);
  this.intro = this.notes.slice(0);
  this.sequence = this.notes.slice(0);

  // make the first two notes active
  this.scores = {};
  this.add();
  this.add();

  this.lastNote = null;
}

Lesson.prototype.add = function() {


console.log("adding!", this.sequence);
  if (this.sequence.length > 0) {
    this.scores[this.sequence.shift()] = 3;
    // Bump all the remaining notes up
    _.forOwn(this.scores, function(v, i, a) {
      a[i] += 1;
    });
  }
};

Lesson.prototype.random = function(notes, last) {
  last = last || notes[0];
  // Pick randomly from the notes.
  var index;
  // Don't give them the same note two times in a row.
  do {
    index = Math.floor(Math.random() * notes.length);
  } while (last == notes[index]);
  return notes[index];
};

Lesson.prototype.next = function() {
  var label = null;

  if (this.intro.length) {
    this.lastNote = new Note(this.intro.shift());
    label = this.lastNote.letter() + this.lastNote.accidental();
  }
  else {
    // Use the score to determine how many copies of the note to put into the hat
    // higher scores should be drawn more frequently.
    var hat = [];
    var message = '';
    _.forOwn(this.scores, function(score, n) {
      message += '<li>' + (new Note(n).toString()) + ' (' + score + ')</li>';
      for (var i = 0; i < score; i++) { hat.push(n); }
    });
    $('#scores').html(message);

    this.lastNote = new Note(this.random(hat, this.lastNote.number));
    this.display.show([this.lastNote]);
  }

  this.display.show([this.lastNote], label);

  return this.lastNote;
};

Lesson.prototype.right = function() {
  this.display.right(this.lastNote);

  if (this.intro.length) { return; }

  // Decrease the score
  if (this.scores[this.lastNote.number] > 1) {
    this.adjust(this.lastNote.number, -1);
  }

  // If they're doing well introduce a new score
  var biggestScore = _.values(this.scores).sort().reverse()[0];
console.log("biggest score", biggestScore);
  if(biggestScore < 3 ) {
    this.add();
  }
};

Lesson.prototype.wrong = function(picked) {
  this.display.wrong(picked, this.lastNote);

  if (this.intro.length) { return; }

  // When they guess wrong increase the score of both notes.
  this.adjust(this.lastNote.toString(), +1);
  this.adjust(picked, +1);
};

Lesson.prototype.adjust = function(note, adjustment) {
console.log('adjust', note, adjustment);
  if (note in this.scores) {
    this.scores[note] = Math.min(Math.max(this.scores[note] + adjustment, 0), 12);
  }
};



/*

// This is the range of my keyboard
var low = 36;
var hight = 96;

function octaves(low, high) {
  var n = [];
  for (var i = low; i <= high; i += 12) {
    n.push(i);
  }
  return n;
}

// Loop through the sequence from the beginning.
function pickNext(sequence) {
  var n = sequence.shift();
  sequence.push(n);
  return n;
}

function sequenceUpDown(notes) {
  var copy = notes.slice(0).sort();
  return copy.concat(copy.slice(0).reverse());
}
*/
