(function () {

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/app-item/item_common.js                                  //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
App.component('item').expose({                                       // 1
	collection: new Meteor.Collection('items'),                         // 2
	pathToRoot: function(id) {                                          // 3
		var items = [];                                                    // 4
		var item = App.item.collection.findOne(id);                        // 5
		while (item) {                                                     // 6
			items.unshift(item);                                              // 7
			item = App.item.collection.findOne(item.parent);                  // 8
		}                                                                  // 9
                                                                     // 10
		return items;                                                      // 11
	}                                                                   // 12
});                                                                  // 13
                                                                     // 14
///////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/app-item/item_server.js                                  //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
Meteor.publish('items', function(parent) {                           // 1
	// console.log('publishing items for ', parent);                    // 2
	parent = parent || 0;                                               // 3
	// console.log('publishing', parent);                               // 4
	return App.item.collection.find({                                   // 5
		// parent: parent                                                  // 6
	});                                                                 // 7
});                                                                  // 8
Meteor.publish('item.pathToRoot', function(id) {                     // 9
	console.log('publishing item.pathToRoot');                          // 10
	var sub = this;                                                     // 11
	var items = Meteor.call('item.pathToRoot', id);                     // 12
	for (var i = 0; i < items.length; i++) {                            // 13
		sub.added(items[i]);                                               // 14
	}                                                                   // 15
	sub.ready();                                                        // 16
});                                                                  // 17
Meteor.publish('item', function(id) {                                // 18
	console.log('publishing item');                                     // 19
	id = id || 0;                                                       // 20
	return App.item.collection.find({                                   // 21
		_id: id                                                            // 22
	});                                                                 // 23
});                                                                  // 24
                                                                     // 25
var timestampIt = {                                                  // 26
	'insert': function(userId, doc) {                                   // 27
		doc.updated = +new Date();                                         // 28
		return false;                                                      // 29
	}                                                                   // 30
};                                                                   // 31
                                                                     // 32
var allow = function() {                                             // 33
	return App.acl.isAllowed('item.manage') === true;                   // 34
};                                                                   // 35
                                                                     // 36
App.item.collection.deny(timestampIt);                               // 37
App.item.collection.allow({                                          // 38
	insert: allow,                                                      // 39
	update: allow,                                                      // 40
	remove: allow                                                       // 41
});                                                                  // 42
                                                                     // 43
var saveNewItem = function(type, data) {                             // 44
	var timestamp = +new Date();                                        // 45
	var day = moment(timestamp).format('YYYY/MM/DD');                   // 46
                                                                     // 47
	data = _.pick(data, App.data[type].fields);                         // 48
	data.type = type;                                                   // 49
	data.date = day;                                                    // 50
	data.updated = timestamp;                                           // 51
	data.userId = Meteor.userId();                                      // 52
                                                                     // 53
	var id = App.item.collection.insert(data);                          // 54
                                                                     // 55
	return {                                                            // 56
		_id: id                                                            // 57
	};                                                                  // 58
};                                                                   // 59
                                                                     // 60
var updateItem = function(type, data) {                              // 61
	var id = data._id;                                                  // 62
	data = _.pick(data, App.data[type].fields);                         // 63
	data = _.omit(data, '_id');                                         // 64
	App.item.collection.update(id, {                                    // 65
		$set: data                                                         // 66
	});                                                                 // 67
	return {                                                            // 68
		_id: id                                                            // 69
	};                                                                  // 70
};                                                                   // 71
                                                                     // 72
Meteor.methods({                                                     // 73
	'item.save': function(type, data) {                                 // 74
		if (App.acl.isAllowed('item.manage') === true) {                   // 75
			if (data._id) {                                                   // 76
				return updateItem(type, data);                                   // 77
			} else {                                                          // 78
				return saveNewItem(type, data);                                  // 79
			}                                                                 // 80
		}                                                                  // 81
		return {};                                                         // 82
	},                                                                  // 83
	'item.remove': function(id) {                                       // 84
		if (App.acl.isAllowed('item.manage') === true) {                   // 85
			return App.item.collection.remove(id);                            // 86
		} else {                                                           // 87
			console.log('not allowed');                                       // 88
		}                                                                  // 89
	},                                                                  // 90
	'item.reset': function() {                                          // 91
		if (App.acl.isAllowed('item.manage') === true) {                   // 92
			App.item.collection.remove({});                                   // 93
		}                                                                  // 94
	},                                                                  // 95
	'item.pathToRoot': App.item.pathToRoot                              // 96
});                                                                  // 97
                                                                     // 98
///////////////////////////////////////////////////////////////////////

}).call(this);
