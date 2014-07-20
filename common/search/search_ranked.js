var score1 = function(text, words, value) {
	var score = 0;
	var idxs = _.map(words, function(word) {
		var idx = text.indexOf(word);
		score += value * (idx > -1);
		return idx;
	});
	idxs.sort(function(a, b) {
		return a - b;
	});
	// console.log(idxs);
	for (var i = idxs.length - 2; i >= 0; i--) {
		if (idxs[i] === -1) {
			break;
		}
		score += value / (idxs[i + 1] - idxs[i]);
	}
	return score;
};

var wordIndexes = function(text, word) {
	var idxs = text.indexesOf(word);
	var wordCount = 0,
		chr, j = 0;
	for (var i = 0; i < text.length && j < idxs.length; i++) {
		chr = text[i];
		if (/[^\w]/.test(chr)) {
			wordCount += 1;
		}
		if (i === idxs[j]) {
			idxs[j++] = wordCount;
		}
	}
	return idxs;
};

var score2 = function(text, words, value) {
	var rank = 0;
	var wordPtr = [];
	var matchMx = [];
	_.each(words, function(word) {
		var idxs = wordIndexes(text, word);
		if (idxs.length) {
			wordPtr.push(0);
			matchMx.push(idxs);
		}
	});
	var matchedWords = wordPtr.length,
		changed, curRank, toAdvance, min, max, minPtr, maxDist, j;
	do {
		changed = false;
		curRank = 0;

		min = 32767;
		max = -32768;
		minPtr = min;
		for (var i = wordPtr.length - 1; i >= 0; i--) {
			j = wordPtr[i];
			if (j < minPtr) {
				toAdvance = i;
				minPtr = j;
			}
			var idx = matchMx[i][j];
			min = Math.min(idx, min);
			max = Math.max(idx, max);
			changed = false;
		}
		if (isNaN(max) || isNaN(min)) {
			break;
		}
	} while (changed);
	maxDist = max - min + 1 - (matchedWords - 1);
	rank = value * 1 / maxDist * matchedWords / words.length;
	return rank;
};

var score = score2;

var rankItem = function(words, item) {
	item.rank = 0;
	item.wordRank = score(item.searchableWord, words, 64);
	item.rank += item.wordRank;
	item.phraseRank = score(item.searchablePhrase, words, 16);
	// item.rank += item.phraseRank;
	item.descriptionRank = score(item.searchableDescription, words, 12);
	// item.rank += item.descriptionRank;
	item.exampleRank = score(item.searchableExample, words, 4);
	// item.rank += item.exampleRank;
};

var query = function(words, opts) {
	var startTime = +new Date();
	var results = ItemsCollection.find(App.search.buildCondition('searchableAll', words), opts);
	console.log('\nQuery time: ', +new Date() - startTime, 'ms');
	return results;
};

var fetch = function(results) {
	var startTime = +new Date();
	results = results.fetch();
	console.log('Fetch time: ', +new Date() - startTime, 'ms (', results.length, ')');
	return results;
};

var rank = function(words, items) {
	var startTime = +new Date();
	_.each(items, function(item) {
		rankItem(words, item);
	});
	console.log('Rank time: ', +new Date() - startTime, 'ms');
};

var sort = function(items) {
	var startTime = +new Date();
	items.sort(function(a, b) {
		return b.rank - a.rank;
	});
	console.log('Sort time: ', +new Date() - startTime, 'ms');
};
var publish = function(subscription, items, limit) {
	var startTime = +new Date();
	// console.log('publishing', items.length, 'items');
	var prevRank = -1,
		diffIdx = 0;
	_.each(items, function(item) {
		if (prevRank !== item.rank) {
			diffIdx++;
			prevRank = item.rank;
		}
		if (limit) {
			subscription.added('items', item._id, item);
			limit--;
		}
	});
	subscription.ready();
	console.log('Publish time: ', +new Date() - startTime, 'ms');
};
var searchRanked = function(searchString, limit) {
	if (!searchString) {
		return [];
	}
	limit = limit || 30;
	var startTime = +new Date();
	var opts = {};
	// opts.fields = {
	// 	searchableWord: 1,
	// 	searchablePhrase: 1,
	// 	searchableDescription: 1,
	// 	searchableExample: 1
	// };
	// opts.limit = limit;
	var words = App.search.getWordsFor(searchString);
	console.log(+new Date() - startTime, 'ms');

	var items = query(words, opts);
	console.log(+new Date() - startTime, 'ms');

	items = fetch(items);
	console.log(+new Date() - startTime, 'ms');

	rank(words, items);
	console.log(+new Date() - startTime, 'ms');

	sort(items);
	console.log(+new Date() - startTime, 'ms');

	var subscription = this;
	publish(subscription, items, limit);

	console.log('Totaltime:', +new Date() - startTime, 'ms');
};

App.component('search').expose({
	searchRanked: searchRanked
});