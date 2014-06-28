var initial = function () {
	// return true to update version value, otherwise version number is not updated
	return true;
};

var downgrade = function () {
	return 'downgrade';
};

var fillWithDummyData = function () {
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

var addAdminUser = function () {
	Accounts.createUser({username: 'admin',
		password: 'asdasd',
		profile: {
			role: 'admin'
		}
	});
	return true;
};

var resetItemData = function () {
	console.log('Resetting fixie data');
	ItemsCollection.remove({});
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

// =========================================================

var migrations = [
initial,
fillWithDummyData,
addAdminUser,
resetItemData
];

// =========================================================

var migrateDb = function () {
	var ver = App.property.PropertiesCollection.findOne({_id: 'dbversion'});
	if(typeof ver === 'undefined') {
		App.property.PropertiesCollection.insert({_id: 'dbversion', value: -1});
		ver = -1;
	} else {
		ver = ver.value;
	}
	ver = parseInt(ver);
	for (var i = ver + 1; i < migrations.length; i++) {
		console.log('Migrating from version ' + (i-1) + ' to ' + i);
		var ret = migrations[i](i);
		if(ret) {
			var tver = i;
			if (ret === 'downgrade') {
				tver -= 2;
				console.log('Downgrading to ' + tver);
			}
			App.property.PropertiesCollection.update({_id: 'dbversion'}, {$set: {value: tver}}, {multi: true});
		}
	}
	console.log('Migration done. Db.ver: ', ver);
};

Meteor.startup(migrateDb);
