var PROPS = [];
var initial = function() {
	// return true to update version value, otherwise version number is not updated
	return true;
};

var downgrade = function() {
	return 'downgrade';
};

var fillWithDummyData = function() {
	console.log('Filling with fixieData');
	App.item.collection.remove({});
	for (var i = 1000; i >= 0; i--) {
		var ttl = fixie.fetchPhrase();
		var desc = fixie.fetchParagraph();
		App.item.collection.insert({
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

var clearDb = function() {
	App.item.collection.remove({});
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
		App.item.collection.insert(data);
	}
	return true;
};

var lowerCaseSearchData = function() {
	App.item.collection.find({}).forEach(function(item) {
		var str = item.searchable.toLowerCase();
		App.item.collection.update(item._id, {
			$set: {
				searchable: str
			}
		});
	});
	return true;
};
var PROB = {
	word: 0.02,
	phrase: 0.04,
	description: 0.8,
	example: 0.8
};
var getSense = function() {
	return {
		phraseRight: fixie.fetchPhrase() + (Math.random() < PROB.phrase ? 'RightMBF140AP' : ''),
		descriptionRight: fixie.fetchParagraph() + (Math.random() < PROB.description ? 'RightMBF140APD' : ''),
		exampleRight: fixie.fetchParagraph() + (Math.random() < PROB.example ? 'RightMBF140APDE' : ''),
		phraseLeft: fixie.fetchPhrase() + (Math.random() < PROB.phrase ? 'LeftMBF140AP' : ''),
		descriptionLeft: fixie.fetchParagraph() + (Math.random() < PROB.description ? 'LeftMBF140APD' : ''),
		exampleLeft: fixie.fetchParagraph() + (Math.random() < PROB.example ? 'LeftMBF140APDE' : '')
	};
};

var getAlternative = function() {
	return {
		meaning: fixie.fetchPhrase() + (Math.random() < PROB.word ? 'RightMBF140A' : '')
	};
};

var fillWithDummyData2 = function() {
	App.item.collection.remove({});
	for (var i = 1000; i >= 0; i--) {
		var data = {
			wordLeft: fixie.fetchPhrase() + (Math.random() < PROB.word ? 'LeftMBF140' : ''),
			wordRight: fixie.fetchPhrase() + (Math.random() < PROB.word ? 'RightMBF140' : ''),
			alternatives: [getAlternative(i), getAlternative(i), getAlternative(i), getAlternative(i)],
			senses: [getSense(i), getSense(i), getSense(i)]
		};
		// console.log(data);
		App.item.addSearchableDataTo(data);
		App.item.collection.insert(data);
	}
	console.log('added 1000 dummy data');
	return true;
};

var mergeData = function () {
	App.item.collection.find({}).forEach(function (item) {
		App.item.collection.update(item._id, {$set: {
			searchableAll: [item.searchableWord, item.searchablePhrase, item.searchableDescription, item.searchableExample].join(' ')
		}});
	});
	return true;
};

var setAppProps = function () {
	console.log('Setting default app labels');
	App.property.PropertiesCollection.remove({_id: /property\./});
	_.forEach(PROPS, function (prop) {
		App.property.PropertiesCollection.upsert(prop._id, prop);
	});
	return true;
};

var migrateAlternatives = function () {
	console.log('migrating alternatives');
	var n = 0;
	App.item.collection.find().forEach(function (item) {
		App.item.collection.update(item._id, {$set: {'rightAlternatives': item.alternatives, 'leftAlternatives':[]}, $unset: {alternatives: true}});
		n++;
	});
	console.log('migrated', n, 'alternatives');
	return true;
};


// =========================================================

var migrations = [
	initial,
	fillWithDummyData,
	addAdminUser,
	resetItemData,
	lowerCaseSearchData,
	clearDb,
	fillWithDummyData2,
	mergeData,
	setAppProps,
	migrateAlternatives,
	setAppProps
	// ,downgrade
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



PROPS = [{"_id":"property.i18n.en.header.search.button","default":"header.search.button","description":"","editable":true,"removable":true,"title":"Label for header search button","value":"Keres"},{"_id":"property.i18n.en.header.user.button","default":"header.user.button","description":"","editable":true,"removable":true,"title":"Label for header user button","value":"Felhasználók"},{"_id":"property.i18n.en.header.app-properties.button","default":"header.app-properties.button","description":"","editable":true,"removable":true,"title":"Label for header app-properties button","value":"Beállítások"},{"_id":"property.i18n.en.panel.app-properties.title","default":"panel.app-properties.title","description":"","removable":true,"title":"Label for panel app-properties title","value":"Beállítások módosítása"},{"_id":"property.i18n.en.confirm.delete","default":"confirm.delete","description":"","removable":true,"title":"Label for confirm delete","value":"Biztos a törlésben?"},{"_id":"property.i18n.en.Edit users","default":"Edit users","description":"","removable":true,"title":"Label for Edit users","value":"Felhasználó módosítás"},{"_id":"property.i18n.en.save.button","default":"save.button","description":"","removable":true,"title":"Label for save button","value":"Mentés"},{"_id":"property.i18n.en.cancel.button","default":"cancel.button","description":"","removable":true,"title":"Label for cancel button","value":"Mégsem"},{"_id":"property.search.timeout","default":800,"description":"Time in milliseconds after the last keypress when the app begins searching","editable":true,"title":"Search timeout","value":"1000"},{"_id":"property.i18n.en.header.new.title","default":"header.new.title","description":"","editable":true,"removable":true,"title":"Label for header new title","value":"Új bejegyzés"},{"_id":"property.i18n.en.about.title","default":"about.title","description":"","editable":true,"removable":true,"title":"Label for about title","value":"Impresszum"},{"_id":"property.i18n.en.button.save","default":"button.save","description":"","editable":true,"removable":true,"title":"Label for button save","value":"Mentés"},{"_id":"property.i18n.en.button.cancel","default":"button.cancel","description":"","editable":true,"removable":true,"title":"Label for button cancel","value":"Mégsem"},{"_id":"property.i18n.en.more.button","default":"more.button","description":"","editable":true,"removable":true,"title":"Label for more button","value":"Több"},{"_id":"property.i18n.en.Ex:","default":"Ex:","title":"Label for Ex:","description":"","removable":true,"value":"Pl:"},{"_id":"dbversion","value":8},{"_id":"property.i18n.en.wordLeft","default":"wordLeft","description":"","removable":true,"title":"Label for wordLeft","value":"Román kifejezés"},{"_id":"property.i18n.en.typeLeft","default":"typeLeft","description":"","removable":true,"title":"Label for typeLeft","value":"Típus"},{"_id":"property.i18n.en.editor.title","default":"editor.title","description":"","editable":true,"removable":true,"title":"Label for editor title","value":"Bejegyzés módosítása"},{"_id":"property.i18n.en.results.empty","default":"results.empty","description":"","editable":true,"removable":true,"title":"Label for results empty","value":"Nincs találat...."},{"_id":"property.i18n.en.item.new","default":"item.new","description":"","editable":true,"removable":true,"title":"Label for item new","value":"Új bejegyzés"},{"_id":"property.i18n.en.less.button","default":"less.button","description":"","editable":true,"removable":true,"title":"Label for less button","value":"Kevesebb"},{"_id":"property.i18n.en.edit.button","default":"edit.button","description":"","editable":true,"removable":true,"title":"Label for edit button","value":"Módosítás"},{"_id":"property.i18n.en.delete.button","default":"delete.button","description":"","editable":true,"removable":true,"title":"Label for delete button","value":"Törlés"},{"_id":"property.i18n.en.title.left","default":"title.left","description":"","editable":true,"removable":true,"title":"Label for title left","value":"Title RO"},{"_id":"property.i18n.en.title.right","default":"title.right","description":"","editable":true,"removable":true,"title":"Label for title right","value":"Title HU"},{"_id":"property.i18n.en.loading.text","default":"loading.text","description":"","editable":true,"removable":true,"title":"Label for loading text","value":"Betöltés..."},{"_id":"property.app.icon","default":"fa-graduation-cap","title":"Icon of the application","description":"Choose one of the icon names from http://fontawesome.io/icons/","editable":true,"value":"fa-graduation-cap"},{"_id":"property.i18n.en.header.expandAll","default":"header.expandAll","description":"","editable":true,"removable":true,"title":"Label for header expandAll","value":"Kinyit"},{"_id":"property.i18n.en.header.contractAll","default":"header.contractAll","description":"","editable":true,"removable":true,"title":"Label for header contractAll","value":"Bezár"},{"_id":"property.i18n.en.back.button","default":"back.button","description":"","editable":true,"removable":true,"title":"Label for back button","value":"Vissza"},{"_id":"property.i18n.en.app.title","default":"app.title","description":"","editable":true,"removable":true,"title":"Label for app title","value":" "},{"_id":"property.i18n.en.welcome.h2","default":"welcome.h2","description":"","editable":true,"removable":true,"title":"Label for welcome h2","value":"Román-magyar jogi szakszótár"},{"_id":"property.i18n.en.endingLeft","default":"endingLeft","description":"","removable":true,"title":"Label for endingLeft","value":"Végződés"},{"_id":"property.i18n.en.wordRight","default":"wordRight","description":"","removable":true,"title":"Label for wordRight","value":"Magyar kifejezés"},{"_id":"property.i18n.en.category","default":"category","description":"","removable":true,"title":"Label for category","value":"Kategória"},{"_id":"property.i18n.en.meaning","default":"meaning","description":"","removable":true,"title":"Label for meaning","value":"Jelentés"},{"_id":"property.i18n.en.removeAlternative","default":"removeAlternative","description":"","removable":true,"title":"Label for removeAlternative","value":"Törlés"},{"_id":"property.i18n.en.phraseLeft","default":"phraseLeft","description":"","removable":true,"title":"Label for phraseLeft","value":"Frázis"},{"_id":"property.i18n.en.phraseRight","default":"phraseRight","description":"","removable":true,"title":"Label for phraseRight","value":"Frázis"},{"_id":"property.i18n.en.descriptionLeft","default":"descriptionLeft","description":"","removable":true,"title":"Label for descriptionLeft","value":"Leírás"},{"_id":"property.i18n.en.descriptionRight","default":"descriptionRight","description":"","removable":true,"title":"Label for descriptionRight","value":"Leírás"},{"_id":"property.i18n.en.exampleLeft","default":"exampleLeft","description":"","removable":true,"title":"Label for exampleLeft","value":"Példa"},{"_id":"property.i18n.en.exampleRight","default":"exampleRight","description":"","removable":true,"title":"Label for exampleRight","value":"Példa"},{"_id":"property.i18n.en.removeSense","default":"removeSense","description":"","removable":true,"title":"Label for removeSense","value":"Törlés"},{"_id":"property.i18n.en.pageNotFound.text","default":"pageNotFound.text","description":"","removable":true,"title":"Label for pageNotFound text","value":"Oldal nem elérhető"},{"_id":"property.i18n.en.header.about","default":"header.about","description":"","removable":true,"title":"Label for header about","value":"Impresszum"},{"_id":"property.i18n.languages","default":"[\"en\"]","title":"App languages","description":"The languages to be used in the application. The first one is the default one","value":"[\"en\"]"},{"_id":"property.i18n.en.rightAlternatives","default":"rightAlternatives","description":"","removable":true,"title":"Label for alternatives","value":"Alternatívák"},{"_id":"property.i18n.en.leftAlternatives","default":"leftAlternatives","description":"","removable":true,"title":"Label for alternatives","value":"Alternatívák"},{"_id":"property.i18n.en.senses","default":"senses","description":"","removable":true,"title":"Label for senses","value":"Jelentések"},{"_id":"property.i18n.en.header.export.button","default":"header.export.button","description":"","removable":true,"title":"Label for header export button","value":"Export"},{"_id":"property.i18n.en.header.import.button","default":"header.import.button","description":"","removable":true,"title":"Label for header import button","value":"Import"},{"_id":"property.i18n.en.welcome.h1","default":"welcome.h1","description":"","editable":true,"removable":true,"title":"Label for welcome h1","value":"Sapientia Erdélyi Magyar Tudományegyetem"},{"_id":"property.notifications.destinationEmail","default":"albertmatyi@gmail.com, elod.pal@gmail.com","description":"The email address notifications are sent to","title":"Notification Destination Email","value":"albertmatyi@gmail.com, elod.pal@gmail.com"},{"_id":"property.i18n.en.header.bibliography","default":"header.bibliography","description":"","removable":true,"title":"Label for header bibliography","value":"Bibliográfia"},{"_id":"property.bibliography","default":"Bibliography...","title":"","description":"","readOnly":true,"value":"Bibliography..."},{"_id":"property.i18n.en.addLeftAlternative","default":"addAlternative","description":"","removable":true,"title":"Label for addLeftAlternative","value":"Alternatíva hozzáadása"},{"_id":"property.i18n.en.addRightAlternative","default":"addAlternative","description":"","removable":true,"title":"Label for addRightAlternative","value":"Alternatíva hozzáadása"},{"_id":"property.i18n.en.addSense","default":"addSense","description":"","removable":true,"title":"Label for addSense","value":"Jelentés hozzáadása"},{"_id":"property.i18n.en.bibliography.title","default":"bibliography.title","description":"","removable":true,"title":"Label for bibliography title","value":"Bibliográfia"},{"_id":"property.i18n.en.item.request","default":"item.request","description":"","removable":true,"title":"Label for item request","value":"Értelmezés kérvényezése"},{"_id":"property.i18n.en.highlight","default":"highlight","title":"Label for highlight","description":"","removable":true,"value":"Kiemelés"},{"_id":"property.about","default":"About the application...","description":"","editable":false,"readOnly":true,"title":"","value":"<div><b>Román-magyar jogi szakszótár</b></div><div><b><br></b></div><div><b>Felelős kiadó:&nbsp;</b></div><div>Sapientia Erdélyi Magyar Tudományegyetem,</div><div>Jogtudományi Intézet, Kolozsvár</div><b><div><b><br></b></div>Főszerkesztő:&nbsp;</b><div><br></div><div>Dr. Veress Emőd<div><br></div><div><b>Munkatársak:</b></div><div><br></div><div>Fegyveresi Zsolt</div><div>Dr. Fábián Gyula</div><div>Kádár Hunor</div><div>Kis Réka</div><div>Dr. Kokoly Zsolt</div><div>Lészai Orsolya</div><div>Dr. Nagy Csongor István</div><div>Dr. Nótári Tamás</div><div>Pál Előd</div><div>Székely János</div><div>Dr. Sztranyiczki Szilárd</div><div>Dr. Vallasek Magdolna</div><div>Dr. Varga Attila</div><div><br></div><div><b>Támogatók:</b></div><div><br></div><div>Sapientia Erdélyi Magyar Tudományegyetem</div><div>Dr. Lupán Ernő Alapítvány</div><div>Forum Iuris Egyesület</div></div>"}];

Meteor.startup(migrateDb);
