var BOTTOM_THRESHOLD = 100;
var timeout;

App.property.set({
	key: 'search.timeout',
	default: 800,
	title: 'Search timeout',
	description: 'Time in milliseconds after the last keypress when the app begins searching',
	postProcess: function (prop) {
		return parseInt(prop.value, 10);
	}
});

var bottomReached = function () {
	var val = $(document).height() -
	(window.innerHeight + window.scrollY);
	return val < BOTTOM_THRESHOLD;
};

Meteor.startup(function () {
	$(window).on('scroll', function () {
		if (bottomReached()) {
			var string = App.search.getString();
			var limit = App.items.find(string, -1).count() + 10;
			Meteor.subscribe('items', string, limit);
		}
	});
});
Template.search.events({
	'click .add.btn': function () {
		App.editor.create();
	}
});
Template.searchItem.events({
	'click .edit.btn': function () {
		App.editor.edit(this);
	},
	'click .delete.btn': function () {
		var self = this;
		bootbox.confirm(App.i18n.getString('confirm.delete'), function (result) {
			if (result) {
				ItemsCollection.remove(self._id);
			}
		});
	}
});
var $masonry;
Template.search.rendered = function () {
	if (!$masonry) {
		$masonry = $(this.find('.results'));
		$masonry.masonry({
			itemSelector: '.item-wrapper'
		});
	} else {
		$masonry.masonry('reload');
	}
};

App.component('search').expose({
	getString: function () {
		return Session.get('search.string');
	},
	search: function (string, instant) {
		if (string === Session.get('search.string')) {
			return;
		}
		clearTimeout(timeout);
		if (!string) {
			Router.go('home');
		} else if (!instant) {
			timeout = setTimeout(function() {
				Router.go('search', {string: string});
			}, App.property('search.timeout'));
		} else {
			Router.go('search', {string: string});
		}
	}
});

Router.unload(function () {
	$masonry =null;
}, {only: ['search']});