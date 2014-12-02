
var clean = function(str) {
  var cstr = App.string.replaceSpecialChars(str);
  cstr = cstr.replace(/<[^>]*>/gi, '');
  cstr = cstr.toLowerCase();
  return cstr;
};

App.component('item').expose({
  addSearchableDataTo: function(data) {
    var altStr = _.reduce(data.alternatives, function(memo, alt) {
      return memo + ' ' + alt.meaning;
    }, ' ');
    data.searchableWord = clean(data.wordLeft + ' ' + data.wordRight + ' ' + altStr);
    var senseSearchables = _.reduce(data.senses, function(memo, sense) {
      memo.searchablePhrase += ' ' + clean(sense.phraseLeft + ' ' + sense.phraseRight);
      memo.searchableDescription += ' ' + clean(sense.descriptionLeft + ' ' + sense.descriptionRight);
      memo.searchableExample += ' ' + clean(sense.exampleLeft + ' ' + sense.exampleRight);
      return memo;
    }, {
        searchablePhrase: '',
        searchableDescription: '',
        searchableExample: ''
      });
    _.extend(data, senseSearchables);
    data.searchableAll = [data.searchableWord, data.searchablePhrase, data.searchableDescription, data.searchableExample].join(' ');
  },
  saveItem: function(data, id) {
    App.item.addSearchableDataTo(data);
    // console.log(data);
    if (!id || id === -1) {
      return App.item.collection.insert(data);
    } else {
      App.item.collection.update(id, {
        $set: data
      });
      return id;
    }
  }
});

Meteor.publish('all-items', function() {
  return App.item.collection.find({});
});

Meteor.publish('searched-items', function(searchString, limit) {
  // App.search.searchFields.call(this, searchString, limit);
  return App.search.searchRanked.call(this, searchString, limit);
});
// Meteor.publish('item', function(id) {
//   return App.item.collection.find({
//     _id: id
//   });
// });
console.log(App.auth.canEdit);
App.item.collection.allow({
  insert: App.auth.canEdit,
  update: App.auth.canEdit,
  remove: App.auth.canEdit
});

Meteor.methods({
  saveItem: App.item.saveItem
});
