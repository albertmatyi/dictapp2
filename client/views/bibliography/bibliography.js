var panel;

App.property.set({
	key: 'bibliography',
	default: 'Bibliography...',
	readOnly: true
});

Template.bibliography.helpers({
	bibliography: function () {
		return App.property('bibliography');
	}
});

Template.bibliography.rendered = function () {
	$('#editor-bibliography').wysiwyg({
		toolbarSelector: '#toolbar-bibliography'
	});
};

Template.bibliography.events({
	'click .save.btn': function () {
		var val = $('#editor-bibliography').html();
		App.property.PropertiesCollection.update('property.bibliography', {$set: {value: val}});
		panel.close();
	},
	'click .cancel.btn': function () {
		panel.close();
	}
});

App.component('bibliography').expose({
	show: function () {
		panel = new Panel({
			title: App.i18n.getString('bibliography.title'),
			template: Template.bibliography
		});
	}
});
