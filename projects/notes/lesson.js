function Lesson(display, options) {
  options = options || {'octave': 3};

  this.display = display;

  // offset of 0 is a C scale, 1 C#, etc
  function majorScale(octave, offset) {
    var n = octave * 12 + (offset || 0);
    return [n, n+2, n+4, n+5, n+7, n+9, n+11, n+12];
  }

  this.notes = majorScale(parseInt(options.octave, 10), 0);
  this.sequence = this.notes.slice(0);

  // make the first two notes active
  this.scores = {};
  this.add();
  this.add();

  this.currentItem = null;
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

Lesson.prototype.random = function(items, last) {
  last = last || items[0];
  // Pick randomly from the items.
  var index;
  // Don't give them the same note two times in a row.
  do {
    index = Math.floor(Math.random() * items.length);
  } while (last == items[index]);
  return items[index];
};

Lesson.prototype.next = function() {
  var label = null;

  // Use the score to determine how many copies of the note to put into the hat
  // higher scores should be drawn more frequently.
  var hat = [];
//  var message = '';
  _.forOwn(this.scores, function(score, n) {
//    message += '<li>' + (new Note(n).toString()) + ' (' + score + ')</li>';
    for (var i = 0; i < score; i++) { hat.push(n); }
  });
//  $('#scores').html(message);

  this.currentItem = this.random(hat, (this.currentItem || this.notes[0]).number);

  // First time they see a note show them the label.
  if (!this.currentItem.introduced) {
    this.currentItem.introduced = true;
    label = "New: " + this.currentItem.letter() + this.currentItem.accidental();
  }

  this.display.show([this.currentItem], label);

  return this.currentItem;
};

Lesson.prototype.right = function() {
  // TODO: Probably should remove this.
  this.display.right(this.currentItem);
  this.display.show([]);


  // Decrease the score
  if (this.scores[this.currentItem.number] > 1) {
    this.adjust(this.currentItem.number, -1);
  }

  // If they're doing well introduce a new score
  var biggestScore = _.values(this.scores).sort().reverse()[0];
console.log("biggest score", biggestScore);
  if(biggestScore < 3 ) {
    this.add();
  }
};

// picked may be null for timeouts
Lesson.prototype.wrong = function(picked) {
  // Keep track of how many times they've gotten it wrong.
  this.currentItem.missed = (this.currentItem.missed || 0) + 1;

  // Tell them if they miss it more than twice.
  if (this.currentItem.missed > 2) {
    var label = "Try: " + this.currentItem.letter() + this.currentItem.accidental();
    this.display.show([this.currentItem], label);
  }
  else {
    this.display.show([this.currentItem], "✖");
  }


  // TODO: Probably should remove this.
  this.display.wrong(picked, this.currentItem, this.currentItem.missed);

  // When they guess wrong increase the score of both notes.
  this.adjust(this.currentItem.toString(), +1);
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
