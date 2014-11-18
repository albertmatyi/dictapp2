Template.i18nLanguageSelector.helpers({
	languages: function() {
		var langs = App.i18n.getLanguages();
		var lang = App.i18n.getLanguage();
		return _.map(langs, function(e, idx) {
			return {
				title: e,
				selected: (lang ? lang === e : idx === 0) ? 'selected' : ''
			};
		});
	}
});

Template.i18nLanguage.events({
	'click .language': function(e) {
		e.preventDefault();

		var language = this.title;
		App.i18n.setLanguage(language);
	}
});

Meteor.startup(function() {
	var cookieVal = Cookie.get('i18n.language');
	if (cookieVal) {
		Session.set('i18n.language', cookieVal);
	}
});

Template.registerHelper('translate', function() {
	var args = Array.prototype.slice.call(arguments, 0, -1);
	return App.i18n.translate.apply(this, args);
});

Template.registerHelper('translateField', function(fieldName) {
	return App.i18n.getTranslatedField(this, fieldName);
});
