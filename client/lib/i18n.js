var getString = function (str) {
	var lang = Session.get('i18n.lang') || 'en';
	var key = 'i18n.' + lang + '.' + str;
	var translation = App.property(key);
	if (!translation) {
		console.warn('Adding translation for: ' + key);
		App.property.set({
			title: str.replace(/\./gi, ' '),
			key: key, 
			default: str
		});
	}
	return translation || str;
};

Handlebars.registerHelper('i18n', getString);

App.component('i18n').expose({
	getString: getString
});