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

var editorData = {
	// itemId: {
	// fields: fields,
	// data: data
	// }
};

var extractSearchableStr = function (data) {
	var SKIP = ['endingLeft', 'typeLeft', 'category'];
	var str = [];
	var f = function (obj) {
		_.each(obj, function (v, k) {
			if (_.isString(v) && SKIP.indexOf(k) === -1) {
				str.push(v);
			} else if (_.isArray(v)) {
				_.each(v, f);
			} else if (_.isObject(v)) {
				f(v);
			}
		});
	};
	f(data);
	return clean(str.join(' '));
};

Template.editor.events({
	'click .save.btn': function() {
		var id = Session.get('editor.itemId');
		var ed = editorData[id];
		var ldata = App.editor.collectData(ed.fields.leftWordFormData.fields, $('.editor-left-word'));
		var rdata = App.editor.collectData(ed.fields.rightWordFormData.fields, $('.editor-right-word'));
		var sensesData = App.editor.collectData(ed.fields.sensesFormData.fields, $('.editor-senses'));
		var data = _.extend({}, ldata, rdata, sensesData);
		delete editorData[id];
		data.searchable = extractSearchableStr(data);
		if (id === -1) {
			ItemsCollection.insert(data);
		} else {
			ItemsCollection.update(id, {$set: data});
		}
		closeEditor();
	},
	'click .cancel.btn': function() {
		var id = Session.get('editor.itemId');
		delete editorData[id];
		closeEditor();
	}
});

Template.editor.helpers({
	data: function() {
		var id = Session.get('editor.itemId');
		var data = id === -1 ? {} : ItemsCollection.findOne(id);
		if (data) {
			var fd = App.editor.buildFormData(data);
			editorData[id] = {
				fields: fd,
				data: data
			};
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
	// override defult
	edit: function(item) {
		edit(item._id);
	},
	create: function() {
		edit(-1);
	}
});