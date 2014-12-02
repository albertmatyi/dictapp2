// function equals(a, b) {
//   return !!(EJSON.stringify(a) === EJSON.stringify(b));
// }

Tinytest.add('emitter - test environment', function(test) {
  test.isTrue(typeof EventEmitter !== 'undefined', 'test environment not initialized EventEmitter');
});


Tinytest.addAsync('emitter - test basic event', function(test, completed) {
  var emitter = new EventEmitter();

  emitter.on('test', function(foo, bar) {
    test.equal(foo, 'foo', 'foo is not foo');
    test.equal(bar, 'bar', 'bar is not bar');

    completed();
  });

  emitter.emit('test', 'foo', 'bar');
});

Tinytest.addAsync('emitter - test event namespace', function(test, completed) {
  var emitterA = new EventEmitter();
  var emitterB = new EventEmitter();

  emitterA.on('test', function() {
    test.fail('We never emitted a "test" event to emitterA');
    completed();
  });

  emitterB.emit('test', 'We have no listeners on B yet');

  emitterB.on('test', function() {
    test.ok('We never emitted a "test" event to emitterA');
    completed();
  });

  emitterB.emit('test', 'Hello B');

});
if (Meteor.isClient) {
  Tinytest.addAsync('emitter - test off', function(test, completed) {
    var emitter = new EventEmitter();
    var f = function() {};
    var handlers;
    emitter.on('test', f);
    handlers = $._data(emitter._eventEmitter[0]).events;
    test.equal(handlers.test.length, 1, 'A handler should be present on the jQuery element');

    emitter.on('test', f);
    handlers = $._data(emitter._eventEmitter[0]).events;
    test.equal(handlers.test.length, 2, 'Two handlers should be present on the jQuery element');

    emitter.off('test', f);
    handlers = $._data(emitter._eventEmitter[0]).events;
    test.isUndefined(handlers, 'No handlers should be present on the jQuery element');

    emitter.on('test', f);
    emitter.on('test', f);
    emitter.on('test', function () {});
    emitter.off('test', f);
    handlers = $._data(emitter._eventEmitter[0]).events;
    test.equal(handlers.test.length, 1, 'Only one handler should be present on the jQuery element');


    completed();
  });
}


//Test API:
//test.isFalse(v, msg)
//test.isTrue(v, msg)
//test.equal(actual, expected, message, not)
//test.length(obj, len)
//test.include(s, v)
//test.isNaN(v, msg)
//test.isUndefined(v, msg)
//test.isNotNull
//test.isNull
//test.throws(func)
//test.instanceOf(obj, klass)
//test.notEqual(actual, expected, message)
//test.runId()
//test.exception(exception)
//test.expect_fail()
//test.ok(doc)
//test.fail(doc)
