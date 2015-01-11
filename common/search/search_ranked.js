var wordIndexes = function(text, word) {
  var charIdxs = text.indexesOf(word);
  var idxs = [];
  var wordCount = 0, chr, j = 0;
  for (var i = 0; i < text.length && j < charIdxs.length; i++) {
    chr = text[i];
    if (/[^\w]/.test(chr)) {
      wordCount += 1;
    }
    if (i === charIdxs[j]) {
      idxs.push({
        wordIdx: wordCount,
        charIdx: i
      });
    }
  }
  return idxs;
};

var MATCH_PARTIAL = 1, MATCH_END = 1.2, MATCH_START =  1.4, MATCH_FULL = 1.7;
var getMatchTypePercent = function (text, words, idxs) {
  var perc = MATCH_PARTIAL;
  for (var i = 0; i < words.length; i++) {
    var wperc = MATCH_PARTIAL;
    var sidx = idxs[i].charIdx-1;
    if (sidx < 0 || /[^\w]/.test(text[sidx])) {
      wperc = MATCH_START;
    }
    var eidx = idxs[i].charIdx + words[i].length;
    if (eidx >= text.length || /[^\w]/.test(text[eidx])) {
      wperc = wperc === MATCH_PARTIAL ? MATCH_END:MATCH_FULL;
    }
    perc *= wperc;
  }
  return perc;
};
/**
 * Iterates over a matrix and provides the callback a set of numbers,
 * where each number comes from a column and the algorithm that combines
 * the numbers from the rows functions as an alg that merges 2..n sorted 
 * arrays into one sorted array. (we always advance one index on the row,
 * where we had the smallest value)
*/
var iterateOrderedCols = function (mx, cb, stopAtUndef) {
  var change = true; 
  var ptrs = mx.map(function () {return 0;});
  var mxToPtrValArr = function (el, idx) {
    var i = ptrs[idx];
    return i < el.length ? el[i]:0; 
  };
  while(change) {
    change = false;
    var minVal = 32768;
    var advIdx = 0;
    for (var i = 0; i < ptrs.length; i++) {
      if (stopAtUndef && typeof mx[i][ptrs[i]] === 'undefined') {
        change = false;
        break;
      } else if (mx[i][ptrs[i]].wordIdx < minVal) {
        advIdx = i;
        minVal = mx[advIdx][ptrs[advIdx]].wordIdx;
        change = true;
      }
    }
    if (change) {
      if (cb) {
        cb(mx.map(mxToPtrValArr), ptrs, mx);
      }
      ptrs[advIdx]++;
    }
  }
};
/**
 * Returns a matrix structure, where
 *   * each word that was found in the text has a corresponding row,
 *   * each row contains as many match elements as many times the word was matched
 *   * a match element contains `word` & `chr` fields representing word & character indices
 *   * a row also has a `word` property that shows the matched word
 */
var getMatchMatrix = function (text, words)  {
  var matchMx = [];
  _.each(words, function(word) {
    var idxs = wordIndexes(text, word);
    if (idxs.length) {
      idxs.word = word;
      matchMx.push(idxs);
    }
  });
  return matchMx;
};

var score = function(text, words, value) {
  var rank = 0;
  var matchMx = getMatchMatrix(text, words);
  if (!matchMx.length) {
    return rank;
  }
  var matchedWords = matchMx.map(function (idxs){return idxs.word;});
  var minDist = 32768, minDistIdxs;
  iterateOrderedCols(matchMx, function (wordIdxs) {
    console.log('colit', wordIdxs);
    var tmpIdxs = wordIdxs.map(function (idxs) {return idxs.wordIdx;});
    tmpIdxs.sort();
    console.log(tmpIdxs);
    var dist = tmpIdxs[tmpIdxs.length - 1] - tmpIdxs[0] - matchedWords.length + 1;
    if (dist < minDist) {
      minDist = dist;
      minDistIdxs = wordIdxs;
    }
  }, true);
  
  var wordPercent = matchedWords.length / words.length;
  var distPercent = 1 / (minDist + 1);
  var matchTypePercent = getMatchTypePercent(text, matchedWords, minDistIdxs);
  console.log('dist:', minDist, 'words', matchedWords.length, 'matchType', matchTypePercent);
  rank = value *  distPercent * wordPercent * matchTypePercent;
  return rank;
};

var rankItem = function(words, item) {
  item.rank = 0;
  item.wordRank = score(item.searchableWord, words, 64);
  item.rank += item.wordRank;
  item.phraseRank = score(item.searchablePhrase, words, 16);
  item.rank += item.phraseRank;
  item.descriptionRank = score(item.searchableDescription, words, 12);
  item.rank += item.descriptionRank;
  item.exampleRank = score(item.searchableExample, words, 4);
  item.rank += item.exampleRank;
};

var query = function(words, opts) {
  // var startTime = +new Date();
  var results = App.item.collection.find(
    App.search.buildCondition('searchableAll', words), 
    opts);
  // console.log('\nQuery time: ', +new Date() - startTime, 'ms');
  return results;
};

var fetch = function(results) {
  // var startTime = +new Date();
  results = results.fetch();
  // console.log('Fetch time: ', +new Date() - startTime, 'ms (', results.length, ')');
  return results;
};

var rank = function(words, items) {
  // var startTime = +new Date();
  _.each(items, function(item) {
    rankItem(words, item);
  });
  // console.log('Rank time: ', +new Date() - startTime, 'ms');
};

var sort = function(items) {
  // var startTime = +new Date();
  items.sort(function(a, b) {
    return b.rank - a.rank;
  });
  // console.log('Sort time: ', +new Date() - startTime, 'ms');
};

var observe = function (cursor, subscription, searchString) {
  var handle = cursor.observeChanges({
    added: function (id, fields) {

      fields['flag-' + searchString] = true;
      console.log('OBS: added ','items', id);
      subscription.added('items', id, fields);
    },
    changed: function (id, fields) {
      fields['flag-' + searchString] = true;
      console.log('OBS: changed ','items', id);
      subscription.changed('items', id, fields);
    },
    removed: function (id) {
      console.log('OBS: rmd ');
      subscription.removed('items', id);
    }
  });
  subscription.onStop(function () {
    // console.log('OBS stoppped', searchString);
    handle.stop();
  });
};

var publish = function(subscription, cursor, items, limit, searchString) {
  // var startTime = +new Date();
  // console.log('publishing', searchString);
  var prevRank = -1,
  diffIdx = 0;
  observe(cursor, subscription, searchString, limit);
  _.each(items, function(item) {
    if (prevRank !== item.rank) {
      diffIdx++;
      prevRank = item.rank;
    }
    if (limit) {
      item['flag-' + searchString] = true;
      subscription.added('items', item._id, item);
      // subscription.changed('items', item._id, {searchString: searchString});
      // console.log('changed ss:"',item.searchString, '"in lw: ', item.wordLeft);
      limit--;
    }
  });
  subscription.ready();
  // console.log('Publish time: ', +new Date() - startTime, 'ms');
};

var searchRanked = function(searchString, limit) {
  if (!searchString) {
    return [];
  }
  limit = limit || 30;
  // var startTime = +new Date();
  var opts = {};
  // opts.fields = {
  // 	searchableWord: 1,
  // 	searchablePhrase: 1,
  // 	searchableDescription: 1,
  // 	searchableExample: 1
  // };
  // opts.limit = limit;
  var words = App.search.getWordsFor(searchString);
  // console.log(+new Date() - startTime, 'ms');

  var cursor = query(words, opts);

  // console.log(+new Date() - startTime, 'ms');

  var items = fetch(cursor);
  // console.log(+new Date() - startTime, 'ms');

  rank(words, items);
  // console.log(+new Date() - startTime, 'ms');

  sort(items);
  // console.log(+new Date() - startTime, 'ms');
  // return [];
  var subscription = this;
  publish(subscription, cursor, items, limit, searchString);

  // console.log('Totaltime:', +new Date() - startTime, 'ms');
};

App.component('search').expose({
  searchRanked: searchRanked
});
