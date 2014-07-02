ItemsCollection = new Meteor.Collection('items');

var buildCondition = function (str) {
	str = App.string.removeNonWordChars(str).toLowerCase();
	var words = _.map(str.split(/\s+/), App.string.replaceSpecialChars);
	var rex = _.map(words, function (word) {
		return {searchable: {$regex: '.*' + word + '.*'}};
	});
	return {$and: rex};
};

App.component('items').expose({
	find: function (searchStr, limit) {
		if (!searchStr) {
			return [];
		}
		var opts = {sort: {titleLeft: 1}};
		if (limit !== -1) {
			opts.limit = limit || 30;
		}
		var condition = searchStr ? buildCondition(searchStr):{};
		var results = ItemsCollection.find(
			condition,
			opts);
		return results;
	}
});


if (Meteor.isServer) {
	Meteor.publish('items', function (searchString, limit) {
		return App.items.find(searchString, limit);
	});
	Meteor.publish('item', function (id) {
		return ItemsCollection.find({_id: id});
	});
	ItemsCollection.allow({
		insert: App.auth.canEdit,
		update: App.auth.canEdit,
		remove: App.auth.canEdit
	});
}