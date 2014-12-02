var getWordsFor = function(searchString) {
	searchString = App.string.removeNonWordChars(searchString);
	searchString = App.string.replaceSpecialChars(searchString);
	searchString = searchString.toLowerCase();
	var words = searchString.split(/\s+/);
	return words;
};

var buildCondition = function(fieldToSearch, words) {
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

App.component('search').expose({
	getWordsFor: getWordsFor,
	buildCondition: buildCondition
});