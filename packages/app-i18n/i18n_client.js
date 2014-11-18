var getTranslationFor = function(key, language) {
	var langDict = App.i18n.translations[language];
	return langDict ? langDict[key] : null;
};
App.component('i18n').expose({
	translations: {},
	setLanguage: function (language) {
		Cookie.set('i18n.language', language);
		App.eventBus.emit('i18n.languageChange', language);
		Session.set('i18n.language', language);
	},
	isActive: function() {
		var langs = App.i18n.getLanguages();
		return langs && langs.length > 1;
	},
	getLanguages: function() {
		return App.property('i18n.languages');
	},
	getDefaultLanguage: function() {
		var langs = App.i18n.getLanguages();
		if (langs && langs.length) {
			return langs[0];
		}
		return null;
	},
	getLanguage: function() {
		var defLang = App.i18n.getDefaultLanguage();
		var language = Session.get('i18n.language') || defLang || 'de';
		return language;
	},
	isDefaultLanguage: function() {
		var langs = App.i18n.getLanguages();
		var lang = App.i18n.getLanguage();
		return langs.indexOf(lang) === 0;
	},
	translate: function(key, defaultValue, language) {
		if (!key) {
			console.warn('No key specified');
		}
		if (language) {
			console.warn('Overriding context language');
		} else {
			language = App.i18n.getLanguage();
		}

		var val = getTranslationFor(key, language);
		if (!val) {
			val = defaultValue || key;
		}
		return val;
	},
	getTranslatedField: function(obj, fieldName) {
		if (!obj) {
			return null;
		}
		var lang = App.i18n.getLanguage();
		if (App.i18n.isDefaultLanguage() || !obj.i18n || !obj.i18n[lang]) {
			return obj[fieldName];
		} else {

			return obj.i18n[lang][fieldName];
		}
	}
});
