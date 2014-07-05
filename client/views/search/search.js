var BOTTOM_THRESHOLD = 100;
var timeout;

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

Template.searchItem.rendered = function () {
	var $el = $(this.firstNode);
	var str = Session.get('search.string');
	_.each(str.split(' '), function (word) {
		$el.highlight(word);
	});
};

Template.searchItem.helpers({
	titleLeftAlignment: function () {
		return App.property('item.title.left.align');
	},
	titleRightAlignment: function () {
		return App.property('item.title.right.align');
	},
	openClass: function () {
		return Session.get('search.expanded') ? 'open':'';
	}
});
Template.search.events({
	'click .add.btn': function () {
		App.editor.create();
	}
});
Template.searchItem.events({
	'click .more.btn': function (e) {
		$(e.currentTarget).parents('.item').addClass('open');
	},
	'click .less.btn': function (e) {
		$(e.currentTarget).parents('.item').removeClass('open');
	},
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
	},
	expandAll: function () {
		Session.set('search.expanded', true);
		$('.item').addClass('open');
	},
	contractAll: function () {
		Session.set('search.expanded', false);
		$('.item').removeClass('open');
	}
});
