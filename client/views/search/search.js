var BOTTOM_THRESHOLD = 100;
var timeout;

var _searchStringRegex;
var getRegexFor = function(str) {
	str = App.string.removeNonWordChars(str.trim());
	var re = ['(?:'];
	for (var i = 0; i < str.length; i++) {
		var c = str[i];
		if (/\s/.test(c)) {
			re.push(')|(?:');
			continue;
		}
		var mapping = App.string.charmapInv[c];
		if (mapping) {
			re.push('[');
			re.push(c);
			re.push(mapping.join(''));
			re.push(']');
		} else {
			re.push(c);
		}
	}
	re.push(')');
	return new RegExp(re.join(''), 'i');
};
var getSearhStringRegex = function() {
	// Session.get('search.regex');
	if (!_searchStringRegex) {
		var searchString = Session.get('search.string');
		_searchStringRegex = getRegexFor(searchString);
	}
	return _searchStringRegex;
};
var setSearhStringRegex = function(string) {
	// Session.set('search.regex', +new Date());
	_searchStringRegex = getRegexFor(string);
};

var bottomReached = function() {
	var val = $(document).height() -
		(window.innerHeight + window.scrollY);
	return val < BOTTOM_THRESHOLD;
};

Meteor.startup(function() {
	$(window).on('scroll', function() {
		if (bottomReached()) {
			var string = App.search.getString();
			var limit = App.item.find(string, -1).count() + 10;
			console.log(string, limit);
			Meteor.subscribe('items', string, limit);
		}
	});
});

Template.searchItem.rendered = function() {
	$.highlight(this.firstNode, getSearhStringRegex(), 'span', null);
};

Template.searchItem.helpers({
	openClass: function() {
		var cls = 'item col-xs-12';
		if (Session.get('search.expanded') || getSearhStringRegex().test(this.searchableAll.replace(this.searchableWord))) {
			cls += ' open';
		}
		return cls;
	}
});
Template.search.events({
	'click .add.btn': function() {
		App.editor.create();
	}
});
Template.searchItem.events({
	'click .more.btn': function(e) {
		$(e.currentTarget).parents('.item').addClass('open');
	},
	'click .less.btn': function(e) {
		$(e.currentTarget).parents('.item').removeClass('open');
	},
	'click .edit.btn': function() {
		App.editor.edit(this);
	},
	'click .delete.btn': function() {
		var self = this;
		bootbox.confirm(App.i18n.getString('confirm.delete'), function(result) {
			if (result) {
				ItemsCollection.remove(self._id);
			}
		});
	}
});

App.component('search').expose({
	getString: function() {
		return Session.get('search.string');
	},
	search: function(string, instant) {
		if (string === Session.get('search.string')) {
			return;
		}
		clearTimeout(timeout);
		if (!string) {
			Router.go('home');
		} else if (!instant) {
			timeout = setTimeout(function() {
				setSearhStringRegex(string);
				Router.go('search', {
					string: string
				});
			}, App.property('search.timeout'));
		} else {
			Router.go('search', {
				string: string
			});
		}
	},
	expandAll: function() {
		Session.set('search.expanded', true);
		$('.item').addClass('open');
	},
	contractAll: function() {
		Session.set('search.expanded', false);
		$('.item').removeClass('open');
	}
});