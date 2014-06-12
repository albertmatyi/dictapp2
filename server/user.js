Meteor.publish('users', function () {
	if (this.userId && App.auth.isAdmin(this.userId)) {
		return Meteor.users.find();
	}
	return [];
});
var adminAndOtherUser = function (userId, doc) {
	return App.auth.isAdmin(userId) && userId !== doc._id;
};
Meteor.users.allow({
	remove: adminAndOtherUser,
	update: adminAndOtherUser
});
Meteor.users.deny({
	update: function (userId, doc) {
		return !adminAndOtherUser(userId, doc);
	}
});
