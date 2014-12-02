/* jshint camelcase: false */
Package.describe({
	version: '1.0.0',
	summary: 'A flexible editor panel for your data'
});

Package.on_use(function (api) {
	api.use(['app-component', 'app-i18n', 'less', 'minimongo', 'mongo-livedata', 'templating', 'less'], 'client');
	api.use(['app-component', 'app-i18n'], 'server');

	api.add_files(['editor.html', 'editor.js'], 'client');

	if (api.export) {
		api.export('App');
	}
});
