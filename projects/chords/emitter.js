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
  // Yeah, sticking this variable on the callback is tacky but it beats
  // sticking it into a hash and then having to find the callback in the array.
  callback.only_once = true;
  this.events[event].push(callback);
  return this;
};

Emitter.prototype.trigger = function(event /* ...args */) {
  if (!(event in this.events)) {
    return;
  }

  var self = this;
  // There will probably be trouble if one of the callback changes the args.
  var args = Array.prototype.slice.call(arguments, 1);

  // Make a copy of the callbacks then remove any one time callbacks, we
  // don't want them called twice if another callback causes the event to
  // fire again.
  var callbacks = this.events[event].slice(0);
  this.events[event] = this.events[event].filter(function(callback) {
    return !callback.only_once;
  });
  callbacks.forEach(function(callback) {
    callback.apply(self, args);
  });

  return this;
};
