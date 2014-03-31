function Lesson() {
  this.currentItem = null;
  this.overallError = 40;
}

Lesson.prototype.add = function() {
console.log("adding!", this.sequence);
  if (this.sequence.length === 0) {
    // TODO Finished?
    console.log("nothign left");
    return null;
  }

  var next = this.sequence.shift();
  next.score = 255;
  this.scores.push(next);

  return next;
};

Lesson.prototype.grade = function(right) {
  var num = 0;
  var good = 0;
  var bad = 255;

  var told = right ? good : bad;

  function weight(oldVal, newVal) {
    var percent = 0.125;
    return Math.round((1.0 - percent) * oldVal + percent * newVal);
  }

  this.overallError = weight(this.overallError, told);
  this.currentItem.score = weight(this.currentItem.score, told);
  if (this.overallError < 0.30 * bad) {
    if (this.overallError < 0.10 * bad) {
      this.currentItem.score = weight(this.currentItem.score, told);  /* twice */
    }

    var readyToAdd = this.scores.every(function(item) {
      return item.score <= 0.40 * bad;
    });

    if (readyToAdd) {
      this.add();
    }
  }
};

Lesson.prototype.next = function() {
  var messages = this.scores.map(function(item) {
    return {name: this.description(item), score: item.score};
  }, this);
  messages.push({name: 'overall', score: this.overallError});
  this.display.updateScores(messages);

  // Sum up all the error rates...
  var sum = this.scores.reduce(function(sum, item) {
    return sum + item.score + 1;
  }, 0);
  // ...then find a random number between 0 and the sum...
  sum = Math.floor(Math.random() * 255 * this.scores.length) % sum;
  // ...subtract each error rate from the sum until it goes negative and then
  // use that number. Bigger error rates will be more likely to trigger it.
  var i = -1;
  var l = this.scores.length;
  while (sum >= 0) {
    i = i + 1 % l;
    sum = sum - this.scores[i].score - 1;
  }
  this.currentItem = this.scores[i];

  // First time they see a note show them the label.
  var label = null;
  if (!this.currentItem.introduced) {
    this.currentItem.introduced = true;
    label = "New: " + this.label(this.currentItem);
  }

  this.display.show(this.stave, this.currentItem, label);

  return this.currentItem;
};

Lesson.prototype.right = function(duration) {
  // TODO: Probably should remove this.
  this.display.right(this.currentItem);

  this.grade(this.currentItem.missed === 0);
  this.currentItem.missed = 0;

  this.display.show(this.stave, null);
};

// picked may be null for timeouts
Lesson.prototype.wrong = function(duration, picked) {
  var label = null;

  // TODO: Probably should remove this.
  this.display.wrong(picked, this.currentItem, this.currentItem.missed);

  // Keep track of how many times they've gotten it wrong.
  this.currentItem.missed = (this.currentItem.missed || 0) + 1;

  // If they didn't guess or tried more than twice, give a hint.
  if (picked === null || this.currentItem.missed > 2) {
    label = "Hint " + this.label(this.currentItem);
  }
  else if (picked) {
    label = "✖";
  }

  this.display.show(this.stave, this.currentItem, label);
};
