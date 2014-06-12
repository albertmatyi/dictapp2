App.property.set({
	key: 'search.timeout',	
	default: 500,
	postProcess: function (prop) {
		return parseInt(prop.value, 10);
	}
});
var timeout;

var clear = function () {
	$('.search-box input').val('').focus();
	Router.go('home');
};

Template.header.events({
	'keyup .search-field': function (ev) {
		if (ev.keyCode === 27) { // ESC
			clear();
		} else {
			var string = $(ev.currentTarget).val().trim();
			clearTimeout(timeout);
			if (string === Router.current().params.keywords) {
				return;
			}
			var msec = App.property('search.timeout');
			if (!string) {
				Router.go('home');
			} else {
				timeout = setTimeout(function () {
					Router.go('search', {keywords: string});
				}, msec);
			}
		}
	}
});

Template.header.rendered = function () {
	$(this.find('.search-field'))
	.val(Router.current().params.keywords)
	.focus();
	console.log('header rendered');
};