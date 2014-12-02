App.component('auth').expose({
	isAdmin: function (id) {
		id = _.isString(id) ? id:null;
		var user = id ? Meteor.users.findOne(id):Meteor.user();
		return user && user.profile.role === 'admin';
	},
	canEdit: function (id) {
		id = _.isString(id) ? id:null;
		var user = id ? Meteor.users.findOne(id):Meteor.user();
		var canEdit = user && (user.profile.role === 'admin' || user.profile.role === 'editor');
		return canEdit;
	}
});

if (Meteor.isClient) {
	UI.registerHelper('isAdmin', App.auth.isAdmin);
	UI.registerHelper('canEdit', App.auth.canEdit);
	Accounts.ui.config({
		passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
	});
}