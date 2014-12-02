/* jshint camelcase: false */
Package.describe({
	version: '1.0.0',
	summary: 'Adds access control functionality to your app.'
});

Package.on_use(function (api, where) {
	api.use(['app-component', 'underscore'], 'client');
	api.use(['app-component', 'underscore'], 'server');

	api.add_files(['acl_common.js'], 'client');
	api.add_files(['acl_common.js'], 'server');

	if (api.export) {
		api.export('App');
	}
});
