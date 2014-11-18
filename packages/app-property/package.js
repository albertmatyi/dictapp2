/* jshint camelcase: false */
Package.describe({
	version: '1.0.0',
	summary: 'Provides the application with a property store for App cfg values. + UI controls for editing them'
});

Package.on_use(function (api, where) {
	api.use(['app-component', 'random', 'standard-app-packages', 'minimongo', 'mongo-livedata', 'templating', 'underscore', 'iron:router'], 'client');
	api.use(['app-component', 'underscore'], 'server');
	api.add_files(['property.html', 'property_common.js', 'property_client.js'], 'client');
	api.add_files(['property_common.js', 'property_server.js'], 'server');
	if (api.export) {
		api.export('App');
	}
});
