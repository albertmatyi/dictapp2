ItemsCollection = new Meteor.Collection('items');

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
	}
});

if (Meteor.isClient) {
	App.component('item').expose({
		find: function(searchStr, limit) {
			if (!searchStr) {
				return [];
			}
			var opts = {
				sort: {
					rank: -1
				}
			};
			if (limit !== -1) {
				opts.limit = limit || 30;
			}
			// var condition = searchStr ? buildCondition(searchStr) : {};
			var results = ItemsCollection.find({},
				// condition,
				opts);
			return results;
		}
	});
} else if (Meteor.isServer) {
	Meteor.publish('items', function(searchString, limit) {
		 // App.search.searchFields.call(this, searchString, limit);
		return App.search.searchRanked.call(this, searchString, limit);
	});
	Meteor.publish('item', function(id) {
		return ItemsCollection.find({
			_id: id
		});
	});
	ItemsCollection.allow({
		insert: App.auth.canEdit,
		update: App.auth.canEdit,
		remove: App.auth.canEdit
	});
}