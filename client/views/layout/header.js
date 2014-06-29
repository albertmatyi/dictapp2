App.property.set({
	key: 'app.icon',
	default: 'fa-graduation-cap',
	title: 'Icon of the application',
	description: 'Choose one of the icon names from http://fontawesome.io/icons/'
});

var clear = function () {
	$('.search-field').val('').focus();
	search(true);
};

var search = function (instant) {
	var string = $('.search-field').val().trim();
	App.search.search(string, instant);
};

Template.header.events({
	'keyup .search-field': function (ev) {
		if (ev.keyCode === 27) { // ESC
			clear();
		} else if (ev.keyCode === 13) { // ENTER
			search(true);
		} else {
			search();
		}
	},
	'click .go.btn': function () {
		search();
	},
	'click .clear.btn': function () {
		clear();
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
	},
	'click .help.btn': function (e) {
		e.preventDefault();
		App.about.show();
	}
});

Template.header.helpers({
	searchString: function () {
		return App.search.getString();
	},
	appIcon: function () {
		return App.property('app.icon');
	}
});

Template.header.rendered = function () {
	$(this.find('.search-field')).focus();
};