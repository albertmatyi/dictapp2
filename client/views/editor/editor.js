var closeEditor = function() {
	Session.set('editor.itemId', undefined);
	$('body').removeClass('no-scroll');
};

var clean = function(str) {
	var cstr = App.string.replaceSpecialChars(str);
	cstr = cstr.replace(/<[^>]*>/gi, '');
	cstr = cstr.toLowerCase();
	return cstr;
};

Template.editor.events({
	'click .save.btn': function() {
		throw 'NE';
		// closeEditor();
	},
	'click .cancel.btn': function() {
		closeEditor();
	}
});

Template.editor.helpers({
	data: function() {
		var id = Session.get('editor.itemId');
		var data = id === -1 ? {} : ItemsCollection.findOne(id);
		data = {
			senses: [{
				phrase: 'phrase',
				description: 'description',
				example: 'example'
			},{
				phrase: 'phrase2',
				description: 'description2',
				example: 'example2'
			}]
		};
		if (data) {
			var fd = App.editor.buildFormData(data);
			return fd;
		}
		return null;
	}
});

var edit = function(id) {
	Session.set('editor.itemId', id);
	$('body').addClass('no-scroll');
};

App.component('editor').expose({
	edit: function(item) {
		edit(item._id);
	},
	create: function() {
		edit(-1);
	}
});