/* jshint camelcase: false */
Package.describe({
	version: '1.0.0',
	summary: 'It provides DB storage access and utility functions for generic items.'
});

Package.on_use(function (api, where) {
	api.use(['standard-app-packages', 'app-component', 'app-acl'], 'client');
	api.use(['app-component', 'app-acl'], 'server');

	api.add_files(['item_common.js', 'item_client.js'], 'client');
	api.add_files(['item_common.js', 'item_server.js'], 'server');

	if (api.export) {
		api.export('App');
	}
});
