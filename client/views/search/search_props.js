App.property.set({
	key: 'search.timeout',
	default: 800,
	title: 'Search timeout',
	description: 'Time in milliseconds after the last keypress when the app begins searching',
	postProcess: function (prop) {
		return parseInt(prop.value, 10);
	}
});
App.property.set({
	key: 'item.title.left.align',
	default: 'left',
	title: 'Item left title alignment',
	description: 'How to align the title. Possible values are: "left", "center", "right", "justify"'
});
App.property.set({
	key: 'item.title.right.align',
	default: 'left',
	title: 'Item right title alignment',
	description: 'How to align the title. Possible values are: "left", "center", "right", "justify"'
});
