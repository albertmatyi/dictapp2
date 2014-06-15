var postProcessors = {};
var validators = {};
PropertiesCollection = new Meteor.Collection('properties');
var subscription;

App.property = function (k) {
	var key = 'property.' + k;
	// console.log(key);
	var prop = PropertiesCollection.findOne(key);
	// console.log(prop);
	var value;
	if (!prop) {
		if (Meteor.isClient) {
			value = Session.get(key);
		} else {
			throw 'Cannot find App.property: ' + k;
		}
	}
	var postProcessor = postProcessors[key];
	if (postProcessor) {
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
	postProcessor: function (prop) {
		console.log(prop);
		return prop.value;
	},
	validate: function (/* prop */) {}
};

App.component('property').expose({
	PropertiesCollection: PropertiesCollection,
	authorized: function () {
		return true;
	},
	set: function (obj) {
		obj = _.extend({}, defaults, obj);
		obj._id = 'property.' + obj.key;
		delete obj.key;
		postProcessors[obj._id] = obj.postProcess;
		validators[obj._id] = obj.validate;
		var set = function () {
			if (Meteor.isClient && !subscription.ready()) {
				setTimeout(set, 100);
				return;
			}
			var prop = PropertiesCollection.findOne(obj._id);
			if (prop) {
				// console.log('update');
				PropertiesCollection.update(obj._id, {$set: _.omit(obj, 'key', '_id')});
			} else {
				// console.log('insert');
				obj.value = obj['default'];
				PropertiesCollection.insert(obj);
			}
			// console.log(obj);
		};
		set();
	}
});

if (Meteor.isServer) {
	Meteor.publish('properties', function () {
	return PropertiesCollection.find({_id: {$regex: /property\..*/}});
});

	PropertiesCollection.allow({
		insert: App.property.authorized,
		update: App.property.authorized,
		remove: App.property.authorized
	});
} else if (Meteor.isClient) {
	Template.appPropertyEditor.helpers({
		props: function () {
			return PropertiesCollection.find();
		}
	});
	Template.appPropertyEditorField.events({
		'click .delete.btn': function () {
			var self = this;
			bootbox.confirm(App.i18n.getString('confirm.delete'), function (result) {
				if (result) {
					PropertiesCollection.remove(self._id);
				}
			});
		}
	});
	Template.appPropertyEditorField.helpers({
		title: function () {
			return this.title || this._id.replace(/property|\./gi, ' ');
		}
	});
	Template.appPropertyEditor.events({
		'click .save.btn': function (e) {
			e.preventDefault();
			var err = false;
			$(e.currentTarget).parents('form').find('input').each(function () {
				var val = $(this).val();
				var id = this.id;
				var validate = validators[id];
				if (validate) {
					var prop = PropertiesCollection.findOne(id);
					prop.value = val;
					try {
						validate(prop);
					} catch (e) {
						alert('Invalid value for ' + this.id + '\n' + e);
						err = true;
					}
				}
				PropertiesCollection.update(id, {$set: {value: val}});
			});
			if (!err && App.property.editFinished) {
				App.property.editFinished(true);
			}
		},
		'click .cancel.btn': function () {
			if (App.property.editFinished) {
				App.property.editFinished(false);
			}
		}
	});
	Deps.autorun(function () {
		subscription = Meteor.subscribe('properties');
	});
}

