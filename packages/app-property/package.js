Package.describe({
	summary: 'Provides the application with a property store for App cfg values. + UI controls for editing them'
});

Package.on_use(function (api, where) {
	api.use(['random', 'standard-app-packages', 'minimongo', 'mongo-livedata', 'templating', 'app-component'], 'client');
	api.use(['app-component'], 'server');
	api.add_files(['property.html', 'property.js'], 'client');
	api.add_files(['property.js'], 'server');
});
