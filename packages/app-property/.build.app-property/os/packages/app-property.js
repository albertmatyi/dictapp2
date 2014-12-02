(function () {

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/app-property/property_common.js                          //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
App.property = function(k) {                                         // 1
	var key = 'property.' + k;                                          // 2
	var prop = App.property.PropertiesCollection.findOne(key);          // 3
	var value;                                                          // 4
	if (!prop) {                                                        // 5
		if (Meteor.isClient) {                                             // 6
			value = Session.get(key);                                         // 7
		} else {                                                           // 8
			throw 'Cannot find App.property: ' + k;                           // 9
		}                                                                  // 10
	}                                                                   // 11
	var postProcessor = App.property.postProcessors[key];               // 12
	if (postProcessor && prop) {                                        // 13
		value = postProcessor(prop);                                       // 14
	} else if (prop) {                                                  // 15
		value = prop.value;                                                // 16
	}                                                                   // 17
	return value;                                                       // 18
};                                                                   // 19
                                                                     // 20
var defaults = {                                                     // 21
	key: 'key',                                                         // 22
	'default': 1,                                                       // 23
	title: '',                                                          // 24
	description: '',                                                    // 25
	postProcessor: function(prop) {                                     // 26
		return prop.value;                                                 // 27
	},                                                                  // 28
	validate: function( /* prop */ ) {}                                 // 29
};                                                                   // 30
                                                                     // 31
var dummySubscription = {                                            // 32
	ready: function() {                                                 // 33
		return false;                                                      // 34
	}                                                                   // 35
};                                                                   // 36
                                                                     // 37
App.component('property').expose({                                   // 38
	PropertiesCollection: new Meteor.Collection('properties'),          // 39
	postProcessors: [],                                                 // 40
	validators: [],                                                     // 41
	authorized: function() {                                            // 42
		return true;                                                       // 43
	},                                                                  // 44
	set: function(obj) {                                                // 45
		obj = _.extend({}, defaults, obj);                                 // 46
		obj._id = 'property.' + obj.key;                                   // 47
		delete obj.key;                                                    // 48
		App.property.postProcessors[obj._id] = obj.postProcess;            // 49
		App.property.validators[obj._id] = obj.validate;                   // 50
		var set = function() {                                             // 51
			if (Meteor.isClient && !App.property.subscription.ready()) {      // 52
				setTimeout(set, 100);                                            // 53
				return;                                                          // 54
			}                                                                 // 55
			var prop = App.property.PropertiesCollection.findOne(obj._id);    // 56
			if (prop) {                                                       // 57
				// console.log('update');                                        // 58
				App.property.PropertiesCollection.update(obj._id, {              // 59
					$set: _.omit(obj, 'key', '_id')                                 // 60
				});                                                              // 61
			} else {                                                          // 62
				// console.log('insert');                                        // 63
				obj.value = obj['default'];                                      // 64
				App.property.PropertiesCollection.insert(obj);                   // 65
			}                                                                 // 66
			// console.log(obj);                                              // 67
		};                                                                 // 68
		set();                                                             // 69
	},                                                                  // 70
	subscription: dummySubscription,                                    // 71
	initSubscription: function() {                                      // 72
		// console.warn('subscribing to properties');                      // 73
		App.property.subscription = Meteor.subscribe('properties');        // 74
	}                                                                   // 75
});                                                                  // 76
                                                                     // 77
///////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/app-property/property_server.js                          //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
Meteor.publish('properties', function() {                            // 1
	console.log('publishing properties');                               // 2
	return App.property.PropertiesCollection.find({});                  // 3
});                                                                  // 4
                                                                     // 5
App.property.PropertiesCollection.allow({                            // 6
	insert: App.property.authorized,                                    // 7
	update: App.property.authorized,                                    // 8
	remove: App.property.authorized                                     // 9
});                                                                  // 10
                                                                     // 11
///////////////////////////////////////////////////////////////////////

}).call(this);
