// Micro event emitter
function Emitter() {
  this.events = {};
}

Emitter.prototype.on = function(event, callback) {
  this.events[event] = this.events[event] || [];
  this.events[event].push(callback);
  return this;
};

Emitter.prototype.off = function(event, callback) {
  this.events[event] = this.events[event] || [];
  if (event in this.events) {
    this.events[event].splice(this.events[event].indexOf(callback), 1);
  }
  return this;
};

Emitter.prototype.once = function(event, callback) {
  this.events[event] = this.events[event] || [];
  // Not the most efficent way with the new function but the simplest to
  // implement.
  this.events[event].push(function() {
    this.off(event, callback);
    callback.apply(this, arguments);
  });
  return this;
};

Emitter.prototype.trigger = function(event /* ...args */) {
  if (event in this.events) {
    for (var i = 0, len = this.events[event].length; i < len; i++) {
      this.events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
    }
  }
  return this;
};
