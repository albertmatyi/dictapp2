(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// packages/app-i18n/template.i18n.js                                                             //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
                                                                                                  // 1
Template.__checkName("i18nLanguageSelector");                                                     // 2
Template["i18nLanguageSelector"] = new Template("Template.i18nLanguageSelector", (function() {    // 3
  var view = this;                                                                                // 4
  return HTML.UL({                                                                                // 5
    "class": "i18n language-selector"                                                             // 6
  }, "\n		", Blaze.Each(function() {                                                              // 7
    return Spacebars.call(view.lookup("languages"));                                              // 8
  }, function() {                                                                                 // 9
    return [ "\n		", Spacebars.include(view.lookupTemplate("i18nLanguage")), "\n		" ];            // 10
  }), "\n	");                                                                                     // 11
}));                                                                                              // 12
                                                                                                  // 13
Template.__checkName("i18nLanguage");                                                             // 14
Template["i18nLanguage"] = new Template("Template.i18nLanguage", (function() {                    // 15
  var view = this;                                                                                // 16
  return HTML.LI({                                                                                // 17
    "class": function() {                                                                         // 18
      return [ "language ", Spacebars.mustache(view.lookup("selected")) ];                        // 19
    }                                                                                             // 20
  }, "\n		", HTML.A({                                                                             // 21
    href: "#"                                                                                     // 22
  }, Blaze.View(function() {                                                                      // 23
    return Spacebars.mustache(view.lookup("title"));                                              // 24
  })), "\n	");                                                                                    // 25
}));                                                                                              // 26
                                                                                                  // 27
////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// packages/app-i18n/i18n_ui.js                                                                   //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
Template.i18nLanguageSelector.helpers({                                                           // 1
	languages: function() {                                                                          // 2
		var langs = App.i18n.getLanguages();                                                            // 3
		var lang = App.i18n.getLanguage();                                                              // 4
		return _.map(langs, function(e, idx) {                                                          // 5
			return {                                                                                       // 6
				title: e,                                                                                     // 7
				selected: (lang ? lang === e : idx === 0) ? 'selected' : ''                                   // 8
			};                                                                                             // 9
		});                                                                                             // 10
	}                                                                                                // 11
});                                                                                               // 12
                                                                                                  // 13
Template.i18nLanguage.events({                                                                    // 14
	'click .language': function(e) {                                                                 // 15
		e.preventDefault();                                                                             // 16
                                                                                                  // 17
		var language = this.title;                                                                      // 18
		App.i18n.setLanguage(language);                                                                 // 19
	}                                                                                                // 20
});                                                                                               // 21
                                                                                                  // 22
Meteor.startup(function() {                                                                       // 23
	var cookieVal = Cookie.get('i18n.language');                                                     // 24
	if (cookieVal) {                                                                                 // 25
		Session.set('i18n.language', cookieVal);                                                        // 26
	}                                                                                                // 27
});                                                                                               // 28
                                                                                                  // 29
Template.registerHelper('translate', function() {                                                 // 30
	var args = Array.prototype.slice.call(arguments, 0, -1);                                         // 31
	return App.i18n.translate.apply(this, args);                                                     // 32
});                                                                                               // 33
                                                                                                  // 34
Template.registerHelper('translateField', function(fieldName) {                                   // 35
	return App.i18n.getTranslatedField(this, fieldName);                                             // 36
});                                                                                               // 37
                                                                                                  // 38
////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// packages/app-i18n/i18n_client.js                                                               //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
var getTranslationFor = function(key, language) {                                                 // 1
	var langDict = App.i18n.translations[language];                                                  // 2
	return langDict ? langDict[key] : null;                                                          // 3
};                                                                                                // 4
App.component('i18n').expose({                                                                    // 5
	translations: {},                                                                                // 6
	setLanguage: function (language) {                                                               // 7
		Cookie.set('i18n.language', language);                                                          // 8
		App.eventBus.emit('i18n.languageChange', language);                                             // 9
		Session.set('i18n.language', language);                                                         // 10
	},                                                                                               // 11
	isActive: function() {                                                                           // 12
		var langs = App.i18n.getLanguages();                                                            // 13
		return langs && langs.length > 1;                                                               // 14
	},                                                                                               // 15
	getLanguages: function() {                                                                       // 16
		return App.property('i18n.languages');                                                          // 17
	},                                                                                               // 18
	getDefaultLanguage: function() {                                                                 // 19
		var langs = App.i18n.getLanguages();                                                            // 20
		if (langs && langs.length) {                                                                    // 21
			return langs[0];                                                                               // 22
		}                                                                                               // 23
		return null;                                                                                    // 24
	},                                                                                               // 25
	getLanguage: function() {                                                                        // 26
		var defLang = App.i18n.getDefaultLanguage();                                                    // 27
		var language = Session.get('i18n.language') || defLang || 'de';                                 // 28
		return language;                                                                                // 29
	},                                                                                               // 30
	isDefaultLanguage: function() {                                                                  // 31
		var langs = App.i18n.getLanguages();                                                            // 32
		var lang = App.i18n.getLanguage();                                                              // 33
		return langs.indexOf(lang) === 0;                                                               // 34
	},                                                                                               // 35
	translate: function(key, defaultValue, language) {                                               // 36
		if (!key) {                                                                                     // 37
			console.warn('No key specified');                                                              // 38
		}                                                                                               // 39
		if (language) {                                                                                 // 40
			console.warn('Overriding context language');                                                   // 41
		} else {                                                                                        // 42
			language = App.i18n.getLanguage();                                                             // 43
		}                                                                                               // 44
                                                                                                  // 45
		var val = getTranslationFor(key, language);                                                     // 46
		if (!val) {                                                                                     // 47
			val = defaultValue || key;                                                                     // 48
		}                                                                                               // 49
		return val;                                                                                     // 50
	},                                                                                               // 51
	getTranslatedField: function(obj, fieldName) {                                                   // 52
		if (!obj) {                                                                                     // 53
			return null;                                                                                   // 54
		}                                                                                               // 55
		var lang = App.i18n.getLanguage();                                                              // 56
		if (App.i18n.isDefaultLanguage() || !obj.i18n || !obj.i18n[lang]) {                             // 57
			return obj[fieldName];                                                                         // 58
		} else {                                                                                        // 59
                                                                                                  // 60
			return obj.i18n[lang][fieldName];                                                              // 61
		}                                                                                               // 62
	}                                                                                                // 63
});                                                                                               // 64
                                                                                                  // 65
////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// packages/app-i18n/properties.js                                                                //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
App.property.set({                                                                                // 1
    key: 'i18n.languages',                                                                        // 2
    'default': '["en"]',                                                                          // 3
    title: 'App languages',                                                                       // 4
    description: 'The languages to be used in the application. The first one is the default one', // 5
    postProcess: function(prop) {                                                                 // 6
        return JSON.parse(prop.value);                                                            // 7
    },                                                                                            // 8
    validate: function(prop) {                                                                    // 9
        var arr = JSON.parse(prop.value);                                                         // 10
        if (!_.isArray(arr)) {                                                                    // 11
            throw 'Invalid language array provided';                                              // 12
        }                                                                                         // 13
    }                                                                                             // 14
});                                                                                               // 15
                                                                                                  // 16
////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);
