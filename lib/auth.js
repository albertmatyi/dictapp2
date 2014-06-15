App.component('auth').expose({
	isAdmin: function (id) {
		id = _.isString(id) ? id:null;
		var user = id ? Meteor.users.findOne(id):Meteor.user();
		return user && user.profile.role === 'admin';
	},
	canEdit: function (id) {
		id = _.isString(id) ? id:null;
		var user = id ? Meteor.users.findOne(id):Meteor.user();
		return user && (user.profile.role === 'admin' || user.profile.role === 'editor');
	}
});

if (Meteor.isClient) {
	Handlebars.registerHelper('isAdmin', App.auth.isAdmin);
	Handlebars.registerHelper('canEdit', App.auth.canEdit);
	Accounts.ui.config({
		passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
	});
}