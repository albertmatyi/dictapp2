Meteor.methods({
  import: function(definitions) {
    ItemsCollection.find({}).forEach(function(item) {
      ItemsCollection.remove(item._id);
    });
    var idx = 0;
    _.each(definitions, function(definition) {
      idx += App.item.saveItem(definition, undefined) ? 1 : 0;
    });
    return idx;
  }
});