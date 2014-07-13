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
	}
});


var buildCondition = function(fieldToSearch, str) {
	str = App.string.removeNonWordChars(str).toLowerCase();
	var words = _.map(str.split(/\s+/), App.string.replaceSpecialChars);
	var rex = _.map(words, function(word) {
		var obj = {};
		obj[fieldToSearch] = {
			$regex: '.*' + word + '.*'
		};
		return obj;
	});
	return {
		$and: rex
	};
};

if (Meteor.isClient) {
	App.component('item').expose({
		find: function(searchStr, limit) {
			if (!searchStr) {
				return [];
			}
			var opts = {
				sort: {
					order: 1
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
		if (!searchString) {
			return [];
		}
		var opts = {
			sort: {
				wordLeft: 1
			}
		};
		limit = limit || 30;
		opts.limit = limit;
		var res, results = ItemsCollection.find(buildCondition('searchableWord', searchString), opts).fetch();
		// console.log('Searching in words ', opts.limit, 'found', results.length);
		opts.limit = limit - results.length;
		if (results.length < limit) {
			res = ItemsCollection.find(buildCondition('searchablePhrase', searchString), opts).fetch();
			// console.log('Searching in phrase ', opts.limit, 'found', res.length);
			results = results.concat(res);
			if (results.length < limit) {
				opts.limit = limit - results.length;
				res = ItemsCollection.find(buildCondition('searchableDescription', searchString), opts).fetch();
				// console.log('Searching in description ', opts.limit, 'found', res.length);
				results = results.concat(res);
				if (results.length < limit) {
					opts.limit = limit - results.length;
					res = ItemsCollection.find(buildCondition('searchableExample', searchString), opts).fetch();
					// console.log('Searching in example ', opts.limit, 'found', res.length);
					results = results.concat(res);
				}
			}
		}
		var sub = this;
		// console.log('publishing', results.length, 'results');
		_.each(results, function(e, idx) {
			e.order = idx;
			sub.added('items', e._id, e);
		});
		sub.ready();
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