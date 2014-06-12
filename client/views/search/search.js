var BOTTOM_THRESHOLD = 100;

var bottomReached = function () {
	var val = $(document).height() -
	(window.innerHeight + window.scrollY);
	return val < BOTTOM_THRESHOLD;
};


Meteor.startup(function () {
	$(window).on('scroll', function () {
		if (bottomReached()) {
			var params = Router.current().params;
			var limit = App.items.find(params.keywords, -1).count() + 10;
			Meteor.subscribe('items', params.keywords, limit);
		}
	});
});

Template.searchItem.events({
	'click .item': function () {
		Session.set('editor.itemId', this._id);
	}
});
Template.searchItem.helpers({
	edit: function () {
		return Session.get('editor.itemId') === this._id;
	}
});