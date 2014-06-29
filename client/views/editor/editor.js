Template.wysiwygTextarea.rendered = function () {
	$(this.firstNode).wysiwyg({toolbarSelector: this.data.toolbarSelector});
};

var closeEditor = function () {
	Session.set('editor.itemId', undefined);
	$('body').removeClass('no-scroll');
};

var clean = function (str) {
	var cstr = App.string.replaceSpecialChars(str);
	cstr = cstr.replace(/<[^>]*>/gi, '');
	// console.log(cstr);
	return cstr;
};

Template.editor.events({
	'click .save.btn': function () {
		var titleL =  $('#title-left').val();
		var titleR =  $('#title-right').val();
		var descriptionL = $('.description-left.editor-textarea').html();
		var descriptionR = $('.description-right.editor-textarea').html();
		var id = Session.get('editor.itemId');
		var data = {
			titleLeft: titleL,
			titleRight: titleR,
			descriptionLeft: descriptionL,
			descriptionRight: descriptionR,
			searchable: clean(titleL + ' ' + titleR + ' ' + descriptionL + ' ' + descriptionR)};
		if (id === -1) {
			ItemsCollection.insert(data);
		} else {
			ItemsCollection.update(id, {$set: data});
		}
		closeEditor();
	},
	'click .cancel.btn': function () {
		closeEditor();
	}
});

Template.editor.helpers({
	active: function () {
		return Session.get('editor.itemId') === this._id;
	}, 
	data: function () {
		var id = Session.get('editor.itemId');
		return id === -1 || ItemsCollection.findOne(id);
	}
});

var edit = function (id) {
	Session.set('editor.itemId', id);
	$('body').addClass('no-scroll');
};

App.component('editor').expose({
	edit: function (item) {
		edit(item._id);
	},
	create: function () {
		edit(-1);
	}
});