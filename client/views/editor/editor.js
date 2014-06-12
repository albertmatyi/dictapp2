Template.editor.rendered = function () {
	var $editorLhs = $(this.find('#editor-lhs'));
	var $editorRhs = $(this.find('#editor-rhs'));
	$editorLhs.wysiwyg();
	$editorRhs.wysiwyg();
};

Template.editor.events({
	'click .save.btn': function () {
		var title = $('.title.editor-textarea').html();
		var description = $('.description.editor-textarea').html();
		var id = Session.get('editor.itemId');
		var data = {title: title, description: description};
		console.log(data);
		ItemsCollection.update(id, {$set: data});
		Session.set('editor.itemId', undefined);
	},
	'click .cancel.btn': function () {
		Session.set('editor.itemId', undefined);
	}
});