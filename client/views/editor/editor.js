var closeEditor = function() {
  Session.set('editor.itemId', undefined);
  $('body').removeClass('no-scroll');
};

var editorData = {
  // itemId: {
  // fields: fields,
  // data: data
  // }
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
    Meteor.call('saveItem', data, id, function(err) {
      if (!err) {
        closeEditor();
      } else {
        Alerts.add(err.message || err, 'danger');
      }
    });
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
    var data = id === -1 ? {} : App.item.collection.findOne(id);
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
  },
  insert: function(data) {}
});
