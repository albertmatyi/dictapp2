EventEmitter = function() {

  // Check that the user uses "new" keyword for api consistency
  if (!(this instanceof EventEmitter)) {
    throw new Error('EventEmitter missing "new" keyword');
  }

  // Use the jQuery api
  var eventEmitter = $({});

  var fCatalog = {};

  // Limit scope by wrapping on and emit
  var getWrappedCallback = function(callback) {
    var wrappedCallback = fCatalog[callback._emitterId];
    if (!wrappedCallback) {
      wrappedCallback = function() {
        var args = Array.prototype.slice.call(arguments);
        var evt = args.shift();
        callback.apply(evt, args);
      };
    }
    return wrappedCallback;
  };

  // put an id on the wrapper, so we can look it up later on `off` or reuse it on another `on`
  var markCallback = function(callback) {
    var id;
    if (callback._emitterId) {
      id = callback._emitterId;
    } else {
      id = Math.random() + '';
      callback._emitterId = id;
    }
  };

  var api = {
    on: function eventEmitter_on(eventName, callback) {
      markCallback(callback);
      var wrappedCallback = getWrappedCallback(callback);
      fCatalog[callback._emitterId] = wrappedCallback;
      return eventEmitter.on(eventName, wrappedCallback);
    },
    once: function eventEmitter_one(eventName, callback) {
      return eventEmitter.one(eventName, function() {
        var args = Array.prototype.slice.call(arguments);
        var evt = args.shift();
        callback.apply(evt, args);
      });
    },
    emit: function eventEmitter_emit() {
      var args = Array.prototype.slice.call(arguments);
      var eventName = args.shift();
      return eventEmitter.triggerHandler(eventName, args);
    },
    off: function eventEmitter_off(eventName, handler) {
      if (typeof handler === 'function') {
        var id = handler._emitterId;
        var catF = fCatalog[id];
        if (catF) {
          handler = catF;
        } else {
          console.warn('Function', handler, 'was not found to be removed');
        }
      }
      return eventEmitter.off.apply(eventEmitter, [eventName, handler]);
    },
  };

  // Add api helpers
  api.addListener = api.on;
  api.removeListener = api.off;
  api.removeAllListeners = api.off;

  // Add jquery like helpers
  api.one = api.once;
  api.trigger = api.emit;

  api._eventEmitter = eventEmitter;

  return api;
};
