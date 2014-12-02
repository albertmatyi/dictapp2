(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                             //
// packages/emitter/emitter.client.js                                                          //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                               //
EventEmitter = function() {                                                                    // 1
                                                                                               // 2
  // Check that the user uses "new" keyword for api consistency                                // 3
  if (!(this instanceof EventEmitter)) {                                                       // 4
    throw new Error('EventEmitter missing "new" keyword');                                     // 5
  }                                                                                            // 6
                                                                                               // 7
  // Use the jQuery api                                                                        // 8
  var eventEmitter = $({});                                                                    // 9
                                                                                               // 10
  var fCatalog = {};                                                                           // 11
                                                                                               // 12
  // Limit scope by wrapping on and emit                                                       // 13
  var getWrappedCallback = function(callback) {                                                // 14
    var wrappedCallback = fCatalog[callback._emitterId];                                       // 15
    if (!wrappedCallback) {                                                                    // 16
      wrappedCallback = function() {                                                           // 17
        var args = Array.prototype.slice.call(arguments);                                      // 18
        var evt = args.shift();                                                                // 19
        callback.apply(evt, args);                                                             // 20
      };                                                                                       // 21
    }                                                                                          // 22
    return wrappedCallback;                                                                    // 23
  };                                                                                           // 24
                                                                                               // 25
  // put an id on the wrapper, so we can look it up later on `off` or reuse it on another `on` // 26
  var markCallback = function(callback) {                                                      // 27
    var id;                                                                                    // 28
    if (callback._emitterId) {                                                                 // 29
      id = callback._emitterId;                                                                // 30
    } else {                                                                                   // 31
      id = Math.random() + '';                                                                 // 32
      callback._emitterId = id;                                                                // 33
    }                                                                                          // 34
  };                                                                                           // 35
                                                                                               // 36
  var api = {                                                                                  // 37
    on: function eventEmitter_on(eventName, callback) {                                        // 38
      markCallback(callback);                                                                  // 39
      var wrappedCallback = getWrappedCallback(callback);                                      // 40
      fCatalog[callback._emitterId] = wrappedCallback;                                         // 41
      return eventEmitter.on(eventName, wrappedCallback);                                      // 42
    },                                                                                         // 43
    once: function eventEmitter_one(eventName, callback) {                                     // 44
      return eventEmitter.one(eventName, function() {                                          // 45
        var args = Array.prototype.slice.call(arguments);                                      // 46
        var evt = args.shift();                                                                // 47
        callback.apply(evt, args);                                                             // 48
      });                                                                                      // 49
    },                                                                                         // 50
    emit: function eventEmitter_emit() {                                                       // 51
      var args = Array.prototype.slice.call(arguments);                                        // 52
      var eventName = args.shift();                                                            // 53
      return eventEmitter.triggerHandler(eventName, args);                                     // 54
    },                                                                                         // 55
    off: function eventEmitter_off(eventName, handler) {                                       // 56
      if (typeof handler === 'function') {                                                     // 57
        var id = handler._emitterId;                                                           // 58
        var catF = fCatalog[id];                                                               // 59
        if (catF) {                                                                            // 60
          handler = catF;                                                                      // 61
        } else {                                                                               // 62
          console.warn('Function', handler, 'was not found to be removed');                    // 63
        }                                                                                      // 64
      }                                                                                        // 65
      return eventEmitter.off.apply(eventEmitter, [eventName, handler]);                       // 66
    },                                                                                         // 67
  };                                                                                           // 68
                                                                                               // 69
  // Add api helpers                                                                           // 70
  api.addListener = api.on;                                                                    // 71
  api.removeListener = api.off;                                                                // 72
  api.removeAllListeners = api.off;                                                            // 73
                                                                                               // 74
  // Add jquery like helpers                                                                   // 75
  api.one = api.once;                                                                          // 76
  api.trigger = api.emit;                                                                      // 77
                                                                                               // 78
  api._eventEmitter = eventEmitter;                                                            // 79
                                                                                               // 80
  return api;                                                                                  // 81
};                                                                                             // 82
                                                                                               // 83
/////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);
