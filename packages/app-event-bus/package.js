/* jshint camelcase: false */
Package.describe({
	version: '1.0.0',
	summary: 'It provides the application a generic eventing system.'
});

Package.on_use(function (api, where) {
	api.use(['app-component', 'emitter'], 'client');
	api.use(['app-component', 'emitter'], 'server');

	api.add_files(['event_bus_common.js'], 'client');
	api.add_files(['event_bus_common.js'], 'server');

	if (api.export) {
		api.export('App');
		api.export('EventEmitter');
	}
});
