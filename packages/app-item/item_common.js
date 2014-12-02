App.component('item').expose({
	collection: new Meteor.Collection('items'),
	pathToRoot: function(id) {
		var items = [];
		var item = App.item.collection.findOne(id);
		while (item) {
			items.unshift(item);
			item = App.item.collection.findOne(item.parent);
		}

		return items;
	}
});
