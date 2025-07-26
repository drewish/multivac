function Lesson() {
}

Lesson.prototype.setup = function() {
  this.scores = [];
  this.currentItem = null;
  this.overallError = 0.4;
};

Lesson.prototype.add = function(readyToLevelUp) {
  if (!this.levels.length) {
    return;
  }

  if (readyToLevelUp && !this.levels[0].length) {
    this.levels.shift();
  }

  if (!this.levels.length) {
    return;
  }

  var next = this.levels[0].shift();
  if (next) {
    next.score = 1.0;
    this.scores.push(next);
  }

  return next;
};

Lesson.prototype.grade = function(right) {
  var told = right ? 0.0 : 1.0;

  function weight(oldVal, newVal) {
    var percent = 0.125;
    return (1.0 - percent) * oldVal + percent * newVal;
  }

  this.overallError = weight(this.overallError, told);
  this.currentItem.score = weight(this.currentItem.score, told);
  if (this.overallError < 0.30) {
    // TODO: Figure out if this makes sense. The original algorithm had this
    // double weighting when your error is low.
    if (this.overallError < 0.10) {
      this.currentItem.score = weight(this.currentItem.score, told);
    }

    if (right) {
      var readyToAdd = this.scores.every(function(item) {
        return item.score <= 0.40;
      });
      if (readyToAdd) {
        var readyToLevelUp = this.scores.every(function(item) {
          return item.score <= 0.30;
        });
        this.add(readyToLevelUp);
      }
    }
  }

  this.displayScores();
};

Lesson.prototype.displayScores = function() {
  var messages = this.scores.map(function(item) {
    return {
      name: this.description(item),
      percent: item.score * 100,
    };
  }, this);
  messages.push({name: 'overall', score: this.overallError, percent: this.overallError * 100});
  this.display.updateScores(messages);
};

Lesson.prototype.next = function() {
  // Sum up all the error rates...
  var sum = this.scores.reduce(function(sum, item) {
    return sum + item.score;
  }, 0);
  // ...then find a random number between 0 and the sum...
  sum *= Math.random();
  // ...subtract each error rate from the sum until it goes negative and then
  // use that number. Bigger error rates will be more likely to trigger it.
  var i = -1;
  var l = this.scores.length;
  while (sum >= 0) {
    i = i + 1 % l;
    sum = sum - this.scores[i].score;
  }
  this.currentItem = this.scores[i];

  // First time they see a note show them the label.
  var label = null;
  if (!this.currentItem.introduced) {
    this.currentItem.introduced = true;
    label = "New: " + this.label(this.currentItem);
  }

  this.currentItem.missed = 0;
  this.display.show(this.stave, this.currentItem, label);

  return this.currentItem;
};

Lesson.prototype.right = function(duration) {
  // TODO: Probably should remove this.
  this.display.right(this.currentItem);

  this.grade(true);

  this.display.show(this.stave, null);
};

// picked may be null for timeouts
Lesson.prototype.wrong = function(duration, picked) {
  var label = null;

  // Keep track of how many times they've gotten it wrong.
  this.currentItem.missed += 1;

  // TODO: Probably should remove this.
  this.display.wrong(picked, this.currentItem, this.currentItem.missed);

  this.grade(false);

  // If they didn't guess or tried more than twice, give a hint.
  if (picked === null || this.currentItem.missed > 2) {
    label = "Try " + this.label(this.currentItem);
  }
  else if (picked) {
    label = "✖";
  }

  this.display.show(this.stave, this.currentItem, label);
};
