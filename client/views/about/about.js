var panel;

App.property.set({
	key: 'about',
	default: 'About the application...',
	readOnly: true
});

Template.about.helpers({
	about: function () {
		return App.property('about');
	}
});

Template.about.rendered = function () {
	$('#editor-about').wysiwyg({
		toolbarSelector: '#toolbar-about'
	});
};

Template.about.events({
	'click .save.btn': function () {
		var val = $('#editor-about').html();
		App.property.PropertiesCollection.update('property.about', {$set: {value: val}});
		panel.close();
	},
	'click .cancel.btn': function () {
		panel.close();
	}
});

App.component('about').expose({
	show: function () {
		panel = new Panel({
			title: App.i18n.getString('about.title'),
			template: Template.about
		});
		panel.show();
	}
});
