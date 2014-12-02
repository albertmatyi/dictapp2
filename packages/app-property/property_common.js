App.property = function(k) {
	var key = 'property.' + k;
	var prop = App.property.PropertiesCollection.findOne(key);
	var value;
	if (!prop) {
		if (Meteor.isClient) {
			value = Session.get(key);
		} else {
			throw 'Cannot find App.property: ' + k;
		}
	}
	var postProcessor = App.property.postProcessors[key];
	if (postProcessor && prop) {
		value = postProcessor(prop);
	} else if (prop) {
		value = prop.value;
	}
	return value;
};

var defaults = {
	key: 'key',
	'default': 1,
	title: '',
	description: '',
	postProcessor: function(prop) {
		return prop.value;
	},
	validate: function( /* prop */ ) {}
};

var dummySubscription = {
	ready: function() {
		return false;
	}
};

App.component('property').expose({
	PropertiesCollection: new Meteor.Collection('properties'),
	postProcessors: [],
	validators: [],
	authorized: function() {
		return true;
	},
	set: function(obj) {
		obj = _.extend({}, defaults, obj);
		obj._id = 'property.' + obj.key;
		delete obj.key;
		App.property.postProcessors[obj._id] = obj.postProcess;
		App.property.validators[obj._id] = obj.validate;
		var set = function() {
			if (Meteor.isClient && !App.property.subscription.ready()) {
				setTimeout(set, 100);
				return;
			}
			var prop = App.property.PropertiesCollection.findOne(obj._id);
			if (prop) {
				// console.log('update');
				App.property.PropertiesCollection.update(obj._id, {
					$set: _.omit(obj, 'key', '_id')
				});
			} else {
				// console.log('insert');
				obj.value = obj['default'];
				App.property.PropertiesCollection.insert(obj);
			}
			// console.log(obj);
		};
		set();
	},
	subscription: dummySubscription,
	initSubscription: function() {
		// console.warn('subscribing to properties');
		App.property.subscription = Meteor.subscribe('properties');
	}
});
