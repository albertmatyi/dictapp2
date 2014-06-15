return;
var wrappedFind = Meteor.Collection.prototype.find;

var blacklistIds = {};

var blacklisted = function (id, collectionName, fields, before) {
	fields = fields || {};
	before = before || {};
	var bld =  false;
	bld = bld || typeof fields.seen !== 'undefined';
	bld = bld || fields._type === 'editor';
	bld = bld || fields._type === 'progress';
	bld = bld || fields._type === 'panels';
	var bidd = blacklistIds[id];
	if (bld && !bidd) {
		blacklistIds[id] = {collection: collectionName || fields._type};
		setTimeout(function() {
			delete blacklistIds[id];
		}, 30 * 1000);
	}
	bld = bld || bidd !== undefined;
	return bld;
};

Meteor.Collection.prototype.find = function () {
	var cursor = wrappedFind.apply(this, arguments);
	var collectionName = this._name;

	cursor.observeChanges({
		added: function (id, fields) {
			if (!blacklisted(id, collectionName, fields)) {
				console.log(collectionName, 'added', id, fields);
			}
		},

		changed: function (id, fields) {
			if (!blacklisted(id, collectionName, fields)) {
				console.log(collectionName, 'changed', id, fields);
			}
		},

		movedBefore: function (id, before) {
			if (!blacklisted(id, collectionName, undefined, before)) {
				console.log(collectionName, 'movedBefore', id, before);
			}
		},

		removed: function (id) {
			if (!blacklisted(id, collectionName)) {
				console.log(collectionName, 'removed', id);
			}
		}
	});

	return cursor;
};
