var BOTTOM_THRESHOLD = 100;

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
	search: function (string) {
		if (string === Session.get('search.string')) {
			return;
		}
		if (!string) {
			Router.go('home');
		} else {
			Router.go('search', {string: string});
		}
	}
});

Router.unload(function () {
	$masonry =null;
}, {only: ['search']});