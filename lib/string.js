const charmap = {
	// Hungarian chars
	'Á': 'A',
	'á': 'a',
	'É': 'E',
	'é': 'e',
	'Í': 'I',
	'í': 'i',
	'Ó': 'O',
	'ó': 'o',
	'Ö': 'O',
	'ö': 'o',
	'Ő': 'O',
	'ő': 'o',
	'Ú': 'U',
	'ú': 'u',
	'Ü': 'U',
	'ü': 'u',
	'Ű': 'U',
	'ű': 'u',
	// Romanian chars (+ wrongly written t, & s,)
	'Ă': 'A',
	'ă': 'a',
	'Â': 'A',
	'â': 'a',
	'Î': 'I',
	'î': 'i',
	'Ș': 'S',
	'ș': 's',
	'Ş': 'S',
	'ş': 's',
	'Ț': 'T',
	'ț': 't',
	'Ţ': 'T',
	'ţ': 't'
};

var charmapInv = _.reduce(charmap, function(invMap, val, key) {
	if (!invMap[val]) {
		invMap[val] = [key];
	} else {
		invMap[val].push(key);
	}
	return invMap;
}, {});

const specialCharsString = _.map(charmap, function(v, k) {
	return k;
}).join('');
const nonWordRegExp = new RegExp('[^\\w_\\- ' + specialCharsString + ']', 'gi');

App.component('string').expose({
	charmap: charmap,
	charmapInv: charmapInv,
	replaceSpecialChars: function(str) {
		if (!str) {
			return '';
		}
		str = str.split('');
		_.each(str, function(c, i) {
			if (charmap[c]) {
				str[i] = charmap[c];
			}
		});
		return str.join('');
	},
	capitalize: function(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	},
	removeNonWordChars: function(str, replaceWithEmptyStr) {
		return str.replace(nonWordRegExp, replaceWithEmptyStr ? '' : ' ').trim();
	}
});

String.prototype.indexesOf = function _indexesOf(str) {
	var idx = -1;
	var idxs = [];
	while (true) {
		idx = this.indexOf(str, idx + 1);
		if (idx === -1) {
			break;
		} else {
			idxs.push(idx);
		}
	}
	return idxs;
};