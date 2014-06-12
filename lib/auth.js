App.component('auth').expose({
	isAdmin: function (id) {
		return true;
		var user = id ? Meteor.users.findOne(id):Meteor.user();
		return user && user.profile.role === 'admin';
	},
	canEdit: function (id) {
		return true;
		var user = id ? Meteor.users.findOne(id):Meteor.user();
		return user && (user.profile.role === 'admin' || user.profile.role === 'editor');
	}
});