var searchFields = function(searchString, limit) {
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
	var words = App.search.getWordsFor(searchString);
	var res, results = App.item.collection.find(App.search.buildCondition('searchableWord', words), opts).fetch();
	// console.log('Searching in words ', opts.limit, 'found', results.length);
	opts.limit = limit - results.length;
	if (results.length < limit) {
		res = App.item.collection.find(App.search.buildCondition('searchablePhrase', words), opts).fetch();
		// console.log('Searching in phrase ', opts.limit, 'found', res.length);
		results = results.concat(res);
		if (results.length < limit) {
			opts.limit = limit - results.length;
			res = App.item.collection.find(App.search.buildCondition('searchableDescription', words), opts).fetch();
			// console.log('Searching in description ', opts.limit, 'found', res.length);
			results = results.concat(res);
			if (results.length < limit) {
				opts.limit = limit - results.length;
				res = App.item.collection.find(App.search.buildCondition('searchableExample', words), opts).fetch();
				// console.log('Searching in example ', opts.limit, 'found', res.length);
				results = results.concat(res);
			}
		}
	}
	var sub = this;
	// console.log('publishing', results.length, 'results');
	_.each(results, function(e, idx) {
		e.rank = idx;
		sub.added('items', e._id, e);
	});
	sub.ready();
};

App.component('search').expose({
	searchFields: searchFields
});
