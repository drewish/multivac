// Micro event emitter
function Emitter() {
  this.events = {};
}

Emitter.prototype.on = function(event, callback) {
  this.events[event] = this.events[event] || [];

  this.events[event].push({func: callback, once: false});

  return this;
};

Emitter.prototype.once = function(event, callback) {
  this.events[event] = this.events[event] || [];

  this.events[event].push({func: callback, once: true});

  return this;
};

Emitter.prototype.off = function(event, callback) {
  if (event in this.events === false) {
    return this;
  }

  this.events[event] = this.events[event].filter(function(o) {
    return o.func !== callback;
  });

  return this;
};

Emitter.prototype.trigger = function(event /* ...args */) {
  if (event in this.events === false) {
    return this;
  }

  // Make a copy of the callbacks then remove any one time callbacks, we
  // don't want them called twice if another callback causes the event to
  // fire again.
  var callbacks = this.events[event].slice(0);
  this.events[event] = this.events[event].filter(function(o) {
    return o.once === false;
  });

  // There will probably be trouble if one of the callback changes the args,
  // but this avoids a var so the anonymous function can see it.
  var args = Array.prototype.slice.call(arguments, 1);
  callbacks.forEach(function(o) { o.func.apply(this, args); }, this);

  return this;
};
