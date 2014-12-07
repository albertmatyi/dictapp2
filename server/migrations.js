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
	_.forEach(PROPS, function (prop) {
		App.property.PropertiesCollection.update(prop._id, {$set: {value: prop.value}});
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
	migrateAlternatives
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



PROPS = [{'_id':'property.i18n.en.app.title','default':'app.title','title':'Label for app title','description':'','removable':true,'value':'Dictapp'},{'_id':'property.i18n.en.header.expandAll','default':'header.expandAll','title':'Label for header expandAll','description':'','removable':true,'value':'Kinyit'},{'_id':'property.i18n.en.header.contractAll','default':'header.contractAll','title':'Label for header contractAll','description':'','removable':true,'value':'Bezár'},{'_id':'property.i18n.en.header.about','default':'header.about','title':'Label for header about','description':'','removable':true,'value':'Impresszum'},{'_id':'property.i18n.en.loading.text','default':'loading.text','title':'Label for loading text','description':'','removable':true,'value':'Betöltés...'},{'_id':'property.about','default':'About the application...','title':'','description':'','readOnly':true,'value':'<div><b>Román-magyar jogi szakszótár</b></div><div><b><br></b></div><div><b>Felelős kiadó:&nbsp;</b></div><div>Sapientia Erdélyi Magyar Tudományegyetem,</div><div>Jogtudományi Intézet, Kolozsvár</div><b><div><b><br></b></div>Főszerkesztő:&nbsp;</b><div><br></div><div>Dr. Veress Emőd<div><br></div><div><b>Munkatársak:</b></div><div><br></div><div>Fegyveresi Zsolt</div><div>Dr. Fábián Gyula</div><div>Kádár Hunor</div><div>Kis Réka</div><div>Dr. Kokoly Zsolt</div><div>Lészai Orsolya</div><div>Dr. Nagy Csongor István</div><div>Dr. Nótári Tamás</div><div>Pál Előd</div><div>Székely János</div><div>Dr. Sztranyiczki Szilárd</div><div>Dr. Vallasek Magdolna</div><div>Dr. Varga Attila</div><div><br></div><div><b>Támogatók:</b></div><div><br></div><div>Sapientia Erdélyi Magyar Tudományegyetem</div><div>Dr. Lupán Ernő Alapítvány</div><div>Forum Iuris Egyesület</div></div>'},{'_id':'property.app.icon','default':'fa-graduation-cap','title':'Icon of the application','description':'Choose one of the icon names from http://fontawesome.io/icons/','value':'fa-graduation-cap'},{'_id':'property.search.timeout','default':800,'title':'Search timeout','description':'Time in milliseconds after the last keypress when the app begins searching','value':'800'},{'_id':'property.i18n.languages','default':'["en"]','title':'App languages','description':'The languages to be used in the application. The first one is the default one','value':'["en"]'},{'_id':'property.bibliography','default':'Bibliography...','title':'','description':'','readOnly':true,'value':'Bibliography...'},{'_id':'property.i18n.en.header.bibliography','default':'header.bibliography','title':'Label for header bibliography','description':'','removable':true,'value':'Bibliográfia'},{'_id':'property.i18n.en.welcome.h1','default':'welcome.h1','title':'Label for welcome h1','description':'','removable':true,'value':'Sapientia Erdélyi Magyar Tudományegyetem'},{'_id':'property.i18n.en.welcome.h2','default':'welcome.h2','title':'Label for welcome h2','description':'','removable':true,'value':'Román-magyar jogi szakszótár'},{'_id':'property.i18n.en.results.empty','default':'results.empty','title':'Label for results empty','description':'','removable':true,'value':'Nincs találat....'},{'_id':'property.i18n.en.header.new.title','default':'header.new.title','title':'Label for header new title','description':'','removable':true,'value':'Új bejegyzés'},{'_id':'property.i18n.en.header.user.button','default':'header.user.button','title':'Label for header user button','description':'','removable':true,'value':'Felhasználók'},{'_id':'property.i18n.en.header.app-properties.button','default':'header.app-properties.button','title':'Label for header app-properties button','description':'','removable':true,'value':'Beállítások'},{'_id':'property.i18n.en.header.export.button','default':'header.export.button','title':'Label for header export button','description':'','removable':true,'value':'Export'},{'_id':'property.i18n.en.header.import.button','default':'header.import.button','title':'Label for header import button','description':'','removable':true,'value':'Import'},{'_id':'property.i18n.en.senses','default':'senses','title':'Label for senses','description':'','removable':true,'value':'Jelentések'},{'_id':'property.i18n.en.Edit users','default':'Edit users','title':'Label for Edit users','description':'','removable':true,'value':'Felhasználó módosítás'},{'_id':'property.i18n.en.pageNotFound.text','default':'pageNotFound.text','title':'Label for pageNotFound text','description':'','removable':true,'value':'Oldal nem elérhető'},{'_id':'property.i18n.en.item.new','default':'item.new','title':'Label for item new','description':'','removable':true,'value':'Új bejegyzés'},{'_id':'property.i18n.en.editor.title','default':'editor.title','title':'Label for editor title','description':'','removable':true,'value':'Bejegyzés módosítása'},{'_id':'property.i18n.en.wordLeft','default':'wordLeft','title':'Label for wordLeft','description':'','removable':true,'value':'Román kifejezés'},{'_id':'property.i18n.en.endingLeft','default':'endingLeft','title':'Label for endingLeft','description':'','removable':true,'value':'Végződés'},{'_id':'property.i18n.en.typeLeft','default':'typeLeft','title':'Label for typeLeft','description':'','removable':true,'value':'Típus'},{'_id':'property.i18n.en.wordRight','default':'wordRight','title':'Label for wordRight','description':'','removable':true,'value':'Magyar kifejezés'},{'_id':'property.i18n.en.alternatives','default':'alternatives','title':'Label for alternatives','description':'','removable':true,'value':'Alternatívák'},{'_id':'property.i18n.en.save.button','default':'save.button','title':'Label for save button','description':'','removable':true,'value':'Mentés'},{'_id':'property.i18n.en.cancel.button','default':'cancel.button','title':'Label for cancel button','description':'','removable':true,'value':'Mégsem'},{'_id':'property.i18n.en.phraseLeft','default':'phraseLeft','title':'Label for phraseLeft','description':'','removable':true,'value':'Frázis'},{'_id':'property.i18n.en.phraseRight','default':'phraseRight','title':'Label for phraseRight','description':'','removable':true,'value':'Frázis'},{'_id':'property.i18n.en.descriptionLeft','default':'descriptionLeft','title':'Label for descriptionLeft','description':'','removable':true,'value':'Leírás'},{'_id':'property.i18n.en.descriptionRight','default':'descriptionRight','title':'Label for descriptionRight','description':'','removable':true,'value':'Leírás'},{'_id':'property.i18n.en.exampleLeft','default':'exampleLeft','title':'Label for exampleLeft','description':'','removable':true,'value':'Példa'},{'_id':'property.i18n.en.exampleRight','default':'exampleRight','title':'Label for exampleRight','description':'','removable':true,'value':'Példa'},{'_id':'property.i18n.en.more.button','default':'more.button','title':'Label for more button','description':'','removable':true,'value':'Több'},{'_id':'property.i18n.en.less.button','default':'less.button','title':'Label for less button','description':'','removable':true,'value':'Kevesebb'},{'_id':'property.i18n.en.edit.button','default':'edit.button','title':'Label for edit button','description':'','removable':true,'value':'Módosítás'},{'_id':'property.i18n.en.delete.button','default':'delete.button','title':'Label for delete button','description':'','removable':true,'value':'Törlés'},{'_id':'property.i18n.en.bibliography.title','default':'bibliography.title','title':'Label for bibliography title','description':'','removable':true,'value':'Bibliográfia'},{'_id':'property.i18n.en.about.title','default':'about.title','title':'Label for about title','description':'','removable':true,'value':'Impresszum'},{'_id':'property.i18n.en.item.request','default':'item.request','title':'Label for item request','description':'','removable':true,'value':'Meghatározás kérelmezése'},{'_id':'property.i18n.en.panel.app-properties.title','default':'panel.app-properties.title','title':'Label for panel app-properties title','description':'','removable':true,'value':'Beállítások módosítása'},{'_id':'property.notifications.destinationEmail','default':'albertmatyi@gmail.com, elod.pal@gmail.com','description':'The email address notifications are sent to','title':'Notification Destination Email','value':'albertmatyi@gmail.com, elod.pal@gmail.com'}];

Meteor.startup(migrateDb);
