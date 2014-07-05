var setAlready = {};
var getString = function (str) {
	if (!str) {
		return str;
	}
	var lang = Session.get('i18n.lang') || 'en';
	var key = 'i18n.' + lang + '.' + str;
	var translation = App.property(key);
	if (!translation && !setAlready[str]) {
		setAlready[str] = true;
		// console.warn('Adding translation for: ' + key);
		App.property.set({
			title: 'Label for ' + str.replace(/\./gi, ' '),
			key: key, 
			default: str,
			removable: true
		});
	}
	return translation || str;
};

UI.registerHelper('translate', getString);

App.component('i18n').expose({
	getString: getString
});