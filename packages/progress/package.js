/* jshint camelcase: false */
Package.describe({
	version: '1.0.0',
	summary: 'A tool to dynamically create progress bars'
});

Package.on_use(function (api, where) {
	api.use(['minimongo', 'mongo-livedata', 'less', 'handlebars', 'templating'], 'client');

	api.add_files(['progress.html', 'progress.js'], 'client');

	if (api.export) {
		api.export('Progress');
	}
});
