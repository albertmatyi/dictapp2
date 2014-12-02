App.property.set({
	key: 'search.timeout',
	default: 800,
	title: 'Search timeout',
	description: 'Time in milliseconds after the last keypress when the app begins searching',
	postProcess: function (prop) {
		return parseInt(prop.value, 10);
	}
});