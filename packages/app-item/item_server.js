Meteor.publish('items', function(parent) {
	// console.log('publishing items for ', parent);
	parent = parent || 0;
	// console.log('publishing', parent);
	return App.item.collection.find({
		// parent: parent
	});
});
Meteor.publish('item.pathToRoot', function(id) {
	console.log('publishing item.pathToRoot');
	var sub = this;
	var items = Meteor.call('item.pathToRoot', id);
	for (var i = 0; i < items.length; i++) {
		sub.added(items[i]);
	}
	sub.ready();
});
Meteor.publish('item', function(id) {
	console.log('publishing item');
	id = id || 0;
	return App.item.collection.find({
		_id: id
	});
});

var timestampIt = {
	'insert': function(userId, doc) {
		doc.updated = +new Date();
		return false;
	}
};

var allow = function() {
	return App.acl.isAllowed('item.manage') === true;
};

App.item.collection.deny(timestampIt);
App.item.collection.allow({
	insert: allow,
	update: allow,
	remove: allow
});

var saveNewItem = function(type, data) {
	var timestamp = +new Date();
	var day = moment(timestamp).format('YYYY/MM/DD');

	data = _.pick(data, App.data[type].fields);
	data.type = type;
	data.date = day;
	data.updated = timestamp;
	data.userId = Meteor.userId();

	var id = App.item.collection.insert(data);

	return {
		_id: id
	};
};

var updateItem = function(type, data) {
	var id = data._id;
	data = _.pick(data, App.data[type].fields);
	data = _.omit(data, '_id');
	App.item.collection.update(id, {
		$set: data
	});
	return {
		_id: id
	};
};

Meteor.methods({
	'item.save': function(type, data) {
		if (App.acl.isAllowed('item.manage') === true) {
			if (data._id) {
				return updateItem(type, data);
			} else {
				return saveNewItem(type, data);
			}
		}
		return {};
	},
	'item.remove': function(id) {
		if (App.acl.isAllowed('item.manage') === true) {
			return App.item.collection.remove(id);
		} else {
			console.log('not allowed');
		}
	},
	'item.reset': function() {
		if (App.acl.isAllowed('item.manage') === true) {
			App.item.collection.remove({});
		}
	},
	'item.pathToRoot': App.item.pathToRoot
});
