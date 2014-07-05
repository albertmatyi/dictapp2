var initial = function() {
	// return true to update version value, otherwise version number is not updated
	return true;
};

var downgrade = function() {
	return 'downgrade';
};

var fillWithDummyData = function() {
	console.log('Filling with fixieData');
	ItemsCollection.remove({});
	for (var i = 1000; i >= 0; i--) {
		var ttl = fixie.fetchPhrase();
		var desc = fixie.fetchParagraph();
		ItemsCollection.insert({
			title: ttl,
			description: desc,
			searchable: [ttl, desc].join(' ')
		});
	}
	return true;
};

var addAdminUser = function() {
	Accounts.createUser({
		username: 'admin',
		password: 'asdasd',
		profile: {
			role: 'admin'
		}
	});
	return true;
};

var clearDb = function () {
	ItemsCollection.remove({});
	return true;
};

var resetItemData = function() {
	console.log('Resetting fixie data');
	clearDb();
	for (var i = 1000; i >= 0; i--) {
		var ttlL = fixie.fetchPhrase();
		var ttlR = fixie.fetchPhrase();
		var descL = fixie.fetchParagraph();
		var descR = fixie.fetchParagraph();
		var data = {
			titleLeft: ttlL,
			descriptionLeft: descL,
			titleRight: ttlR,
			descriptionRight: descR,
			searchable: [ttlL, ttlR, descL, descR].join(' ')
		};
		ItemsCollection.insert(data);
	}
	return true;
};

var lowerCaseSearchData = function() {
	ItemsCollection.find({}).forEach(function(item) {
		var str = item.searchable.toLowerCase();
		ItemsCollection.update(item._id, {
			$set: {
				searchable: str
			}
		});
	});
	return true;
};

// =========================================================

var migrations = [
initial,
fillWithDummyData,
addAdminUser,
resetItemData,
lowerCaseSearchData,
clearDb
];

// =========================================================

var migrateDb = function() {
	var ver = App.property.PropertiesCollection.findOne({
		_id: 'dbversion'
	});
	if (typeof ver === 'undefined') {
		App.property.PropertiesCollection.insert({
			_id: 'dbversion',
			value: -1
		});
		ver = -1;
	} else {
		ver = ver.value;
	}
	ver = parseInt(ver);
	var migrated = false;
	for (var i = ver + 1; i < migrations.length; i++) {
		migrated = true;
		console.log('Migrating from version ' + (i - 1) + ' to ' + i);
		var ret = migrations[i](i);
		if (ret) {
			var tver = i;
			if (ret === 'downgrade') {
				tver -= 2;
				console.log('Downgrading to ' + tver);
			}
			App.property.PropertiesCollection.update({
				_id: 'dbversion'
			}, {
				$set: {
					value: tver
				}
			}, {
				multi: true
			});
		}
	}
	if (migrated) {
		console.log('Migration done. Db.ver: ', App.property.PropertiesCollection.findOne({
			_id: 'dbversion'
		}).value);
	}
};

Meteor.startup(migrateDb);