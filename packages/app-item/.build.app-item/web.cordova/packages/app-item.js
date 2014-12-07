(function () {

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
// packages/app-item/item_common.js                                        //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////
                                                                           //
App.component('item').expose({                                             // 1
	collection: new Meteor.Collection('items'),                               // 2
	pathToRoot: function(id) {                                                // 3
		var items = [];                                                          // 4
		var item = App.item.collection.findOne(id);                              // 5
		while (item) {                                                           // 6
			items.unshift(item);                                                    // 7
			item = App.item.collection.findOne(item.parent);                        // 8
		}                                                                        // 9
                                                                           // 10
		return items;                                                            // 11
	}                                                                         // 12
});                                                                        // 13
                                                                           // 14
/////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
// packages/app-item/item_client.js                                        //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////
                                                                           //
var dummySubscription = {                                                  // 1
	ready: function() {                                                       // 2
		console.log('querying dummy subscription');                              // 3
		return false;                                                            // 4
	}                                                                         // 5
};                                                                         // 6
App.component('item').expose({                                             // 7
	subscription: dummySubscription,                                          // 8
	initSubscription: function() {                                            // 9
		App.item.subscription = Meteor.subscribe('items', 'component auto-sub'); // 10
	},                                                                        // 11
	save: function(itemData, defaultType) {                                   // 12
		var routeParams = Router.current().params;                               // 13
		var type = routeParams.type || defaultType;                              // 14
		var dataFields = [];                                                     // 15
		if (App.data[type] && App.data[type].fields) {                           // 16
			dataFields = App.data[type].fields;                                     // 17
		}                                                                        // 18
		itemData = _.pick(itemData, dataFields);                                 // 19
		itemData.parent = routeParams._id;                                       // 20
		Meteor.call('item.save', type, itemData, function(err) {                 // 21
			App.menu.show();                                                        // 22
			if (err) {                                                              // 23
				Alerts.add(err.message || err, 'danger');                              // 24
				return;                                                                // 25
			}                                                                       // 26
			Alerts.add('Successfully saved', 'success');                            // 27
		});                                                                      // 28
	},                                                                        // 29
	forPath: function() {                                                     // 30
		return App.item.collection.findOne(Router.current().params._id);         // 31
	},                                                                        // 32
	childrenForPath: function(cond, opts) {                                   // 33
		return App.item.collection.find(_.extend({                               // 34
			parent: Router.current().params._id                                     // 35
		}, cond), opts);                                                         // 36
	},                                                                        // 37
	siblings: function(item, findOptions) {                                   // 38
		var siblings = App.item.collection.find({                                // 39
			parent: item.parent,                                                    // 40
			_id: {                                                                  // 41
				$ne: item._id                                                          // 42
			}                                                                       // 43
		}, findOptions);                                                         // 44
                                                                           // 45
		return siblings;                                                         // 46
	},                                                                        // 47
	subscribe: function() {                                                   // 48
		return {                                                                 // 49
			ready: function() {                                                     // 50
				return App.item.subscription.ready();                                  // 51
			}                                                                       // 52
		};                                                                       // 53
	}                                                                         // 54
});                                                                        // 55
                                                                           // 56
Meteor.startup(function() {                                                // 57
	// App.item.initSubscription();                                           // 58
});                                                                        // 59
                                                                           // 60
/////////////////////////////////////////////////////////////////////////////

}).call(this);
