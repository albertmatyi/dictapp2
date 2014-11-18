Meteor.methods({
  import: function(definitions) {
    App.item.collection.find({}).forEach(function(item) {
      App.item.collection.remove(item._id);
    });
    var idx = 0;
    _.each(definitions, function(definition) {
      idx += App.item.saveItem(definition, undefined) ? 1 : 0;
    });
    return idx;
  }
});
