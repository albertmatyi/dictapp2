App.property.set({
    key: 'i18n.languages',
    'default': '["en"]',
    title: 'App languages',
    description: 'The languages to be used in the application. The first one is the default one',
    postProcess: function(prop) {
        return JSON.parse(prop.value);
    },
    validate: function(prop) {
        var arr = JSON.parse(prop.value);
        if (!_.isArray(arr)) {
            throw 'Invalid language array provided';
        }
    }
});
