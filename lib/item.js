// App.item.collection = new Meteor.Collection('items');


if (Meteor.isClient) {
  App.component('item').expose({
    find: function(searchStr, limit) {
      if (!searchStr) {
        return [];
      }
      var opts = {
        sort: {
          rank: -1,
          wordLeft: 1
        }
      };
      if (limit !== -1) {
        opts.limit = limit || 30;
      }
      // var condition = searchStr ? buildCondition(searchStr) : {};
      var results = App.item.collection.find({
        searchString: searchStr
      },
        // condition,
        opts);
      return results;
    }
  });
}
