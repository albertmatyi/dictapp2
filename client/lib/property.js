Meteor.startup(function () {
	App.property.authorized = App.auth.isAdmin;
});

var panel;

App.property.editFinished = function () {
	panel.close();
};

App.component('property').expose({
	edit: function () {
		panel = new Panel({
			title: App.i18n.getString('panel.app-properties.title'),
			template: Template.appPropertyEditor
		});
		panel.show();
	}
});
