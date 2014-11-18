/* jshint camelcase: false */
Package.describe({
	version: '1.0.0',
	summary: 'Adds i18n support to the app'
});

Package.on_use(function(api) {
	api.use(['app-component', 'app-property', 'app-acl', 'app-event-bus', 'templating', 'cookies', 'session'], 'client');
	api.use(['app-component', 'app-property', 'app-acl'], 'server');

	api.add_files(['i18n.html', 'i18n_ui.js', 'i18n_client.js', 'properties.js'], 'client');
	api.add_files(['acl_actions.js', 'i18n_server.js', 'properties.js'], 'server');

	if (api.export) {
		api.export('App');
	}
});
