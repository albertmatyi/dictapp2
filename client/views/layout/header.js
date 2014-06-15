
var clear = function () {
	$('.search-box input').val('').focus();
	Router.go('home');
};

var search = function () {
	var string = $('.search-field').val().trim();
	App.search.search(string);
};

Template.header.events({
	'keyup .search-field': function (ev) {
		if (ev.keyCode === 27) { // ESC
			clear();
		} else if (ev.keyCode === 13) { // ENTER
			search();
		}
	},
	'click .go.btn': function () {
		search();
	},
	'click .users': function (e) {
		e.preventDefault();
		App.users.show();
	},
	'click .app-properties': function (e) {
		e.preventDefault();
		App.property.edit();
	},
	'click .add.btn': function (e) {
		e.preventDefault();
		App.editor.create();
	}
});

Template.header.helpers({
	searchString: function () {
		return App.search.getString();
	}
});

Template.header.rendered = function () {
	$(this.find('.search-field')).focus();
};