/* jshint camelcase: false */
Package.describe({
	summary: [
	'A component that lets you easily create panels',
	'To use the styles, please include packages/panels/panels.import.less'
	].join('\n')
});

Package.on_use(function (api) {
	api.use(['random', 'minimongo', 'mongo-livedata', 'templating'], 'client');

	api.add_files(['panels.html', 'panels.js'], 'client');

	if (api.export) {
		api.export('Panel');
	}
});
