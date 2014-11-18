Meteor.publish('properties', function() {
	console.log('publishing properties');
	return App.property.PropertiesCollection.find({});
});

App.property.PropertiesCollection.allow({
	insert: App.property.authorized,
	update: App.property.authorized,
	remove: App.property.authorized
});
