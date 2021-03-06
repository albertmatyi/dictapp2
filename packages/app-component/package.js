/* jshint camelcase: false */
Package.describe({
	version: '1.0.0',
	summary: 'Provides App global variable and `component` method  to expose methods using dotnotation'
});

Package.on_use(function (api, where) {
	api.use(['underscore'], 'client');
	api.use(['underscore'], 'server');
	api.add_files(['app-component.js'], 'client');
	api.add_files(['app-component.js'], 'server');

	if (api.export) {
		api.export('App');
		api.export('_App');
	}
});
