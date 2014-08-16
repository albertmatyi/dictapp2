ItemsCollection = new Meteor.Collection('items');


if (Meteor.isClient) {
	App.component('item').expose({
		find: function(searchStr, limit) {
			if (!searchStr) {
				return [];
			}
			var opts = {
				sort: {
					rank: -1
				}
			};
			if (limit !== -1) {
				opts.limit = limit || 30;
			}
			// var condition = searchStr ? buildCondition(searchStr) : {};
			var results = ItemsCollection.find({},
				// condition,
				opts);
			return results;
		}
	});
}