var dummySubscription = {
	ready: function() {
		console.log('querying dummy subscription');
		return false;
	}
};
App.component('item').expose({
	subscription: dummySubscription,
	initSubscription: function() {
		App.item.subscription = Meteor.subscribe('items', 'component auto-sub');
	},
	save: function(itemData, defaultType) {
		var routeParams = Router.current().params;
		var type = routeParams.type || defaultType;
		var dataFields = [];
		if (App.data[type] && App.data[type].fields) {
			dataFields = App.data[type].fields;
		}
		itemData = _.pick(itemData, dataFields);
		itemData.parent = routeParams._id;
		Meteor.call('item.save', type, itemData, function(err) {
			App.menu.show();
			if (err) {
				Alerts.add(err.message || err, 'danger');
				return;
			}
			Alerts.add('Successfully saved', 'success');
		});
	},
	forPath: function() {
		return App.item.collection.findOne(Router.current().params._id);
	},
	childrenForPath: function(cond, opts) {
		return App.item.collection.find(_.extend({
			parent: Router.current().params._id
		}, cond), opts);
	},
	siblings: function(item, findOptions) {
		var siblings = App.item.collection.find({
			parent: item.parent,
			_id: {
				$ne: item._id
			}
		}, findOptions);

		return siblings;
	},
	subscribe: function() {
		return {
			ready: function() {
				return App.item.subscription.ready();
			}
		};
	}
});

Meteor.startup(function() {
	// App.item.initSubscription();
});
