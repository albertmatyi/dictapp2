(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/app-property/template.property.js                                                                //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
                                                                                                             // 1
Template.__checkName("appPropertyEditor");                                                                   // 2
Template["appPropertyEditor"] = new Template("Template.appPropertyEditor", (function() {                     // 3
  var view = this;                                                                                           // 4
  return HTML.FORM({                                                                                         // 5
    "class": "app-property-editor"                                                                           // 6
  }, "\n        ", Blaze.Each(function() {                                                                   // 7
    return Spacebars.call(view.lookup("props"));                                                             // 8
  }, function() {                                                                                            // 9
    return [ "\n        ", Spacebars.include(view.lookupTemplate("appPropertyEditorField")), "\n        " ]; // 10
  }), HTML.Raw('\n        <button type="submit" class="save btn btn-primary">\n        <span class="fa fa-save"></span>\n        Submit\n        </button>\n        <button type="submit" class="cancel btn btn-link">\n        <span class="fa fa-times"></span>\n        Cancel\n        </button>\n    '));
}));                                                                                                         // 12
                                                                                                             // 13
Template.__checkName("appPropertyEditorField");                                                              // 14
Template["appPropertyEditorField"] = new Template("Template.appPropertyEditorField", (function() {           // 15
  var view = this;                                                                                           // 16
  return HTML.DIV({                                                                                          // 17
    "class": "form-group"                                                                                    // 18
  }, "\n    ", HTML.LABEL({                                                                                  // 19
    "for": function() {                                                                                      // 20
      return Spacebars.mustache(view.lookup("_id"));                                                         // 21
    }                                                                                                        // 22
  }, Blaze.View(function() {                                                                                 // 23
    return Spacebars.mustache(view.lookup("title"));                                                         // 24
  })), "\n    ", HTML.SMALL(Blaze.View(function() {                                                          // 25
    return Spacebars.mustache(view.lookup("description"));                                                   // 26
  }), " ", HTML.CODE("default: ", Blaze.View(function() {                                                    // 27
    return Spacebars.mustache(view.lookup("default"));                                                       // 28
  }))), "\n    ", HTML.INPUT({                                                                               // 29
    type: "text",                                                                                            // 30
    "class": "form-control",                                                                                 // 31
    id: function() {                                                                                         // 32
      return Spacebars.mustache(view.lookup("_id"));                                                         // 33
    },                                                                                                       // 34
    placeholder: function() {                                                                                // 35
      return Spacebars.mustache(view.lookup("default"));                                                     // 36
    },                                                                                                       // 37
    value: function() {                                                                                      // 38
      return Spacebars.mustache(view.lookup("value"));                                                       // 39
    }                                                                                                        // 40
  }), "\n");                                                                                                 // 41
}));                                                                                                         // 42
                                                                                                             // 43
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/app-property/property_common.js                                                                  //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
App.property = function(k) {                                                                                 // 1
	var key = 'property.' + k;                                                                                  // 2
	var prop = App.property.PropertiesCollection.findOne(key);                                                  // 3
	var value;                                                                                                  // 4
	if (!prop) {                                                                                                // 5
		if (Meteor.isClient) {                                                                                     // 6
			value = Session.get(key);                                                                                 // 7
		} else {                                                                                                   // 8
			throw 'Cannot find App.property: ' + k;                                                                   // 9
		}                                                                                                          // 10
	}                                                                                                           // 11
	var postProcessor = App.property.postProcessors[key];                                                       // 12
	if (postProcessor && prop) {                                                                                // 13
		value = postProcessor(prop);                                                                               // 14
	} else if (prop) {                                                                                          // 15
		value = prop.value;                                                                                        // 16
	}                                                                                                           // 17
	return value;                                                                                               // 18
};                                                                                                           // 19
                                                                                                             // 20
var defaults = {                                                                                             // 21
	key: 'key',                                                                                                 // 22
	'default': 1,                                                                                               // 23
	title: '',                                                                                                  // 24
	description: '',                                                                                            // 25
	postProcessor: function(prop) {                                                                             // 26
		return prop.value;                                                                                         // 27
	},                                                                                                          // 28
	validate: function( /* prop */ ) {}                                                                         // 29
};                                                                                                           // 30
                                                                                                             // 31
var dummySubscription = {                                                                                    // 32
	ready: function() {                                                                                         // 33
		return false;                                                                                              // 34
	}                                                                                                           // 35
};                                                                                                           // 36
                                                                                                             // 37
App.component('property').expose({                                                                           // 38
	PropertiesCollection: new Meteor.Collection('properties'),                                                  // 39
	postProcessors: [],                                                                                         // 40
	validators: [],                                                                                             // 41
	authorized: function() {                                                                                    // 42
		return true;                                                                                               // 43
	},                                                                                                          // 44
	set: function(obj) {                                                                                        // 45
		obj = _.extend({}, defaults, obj);                                                                         // 46
		obj._id = 'property.' + obj.key;                                                                           // 47
		delete obj.key;                                                                                            // 48
		App.property.postProcessors[obj._id] = obj.postProcess;                                                    // 49
		App.property.validators[obj._id] = obj.validate;                                                           // 50
		var set = function() {                                                                                     // 51
			if (Meteor.isClient && !App.property.subscription.ready()) {                                              // 52
				setTimeout(set, 100);                                                                                    // 53
				return;                                                                                                  // 54
			}                                                                                                         // 55
			var prop = App.property.PropertiesCollection.findOne(obj._id);                                            // 56
			if (prop) {                                                                                               // 57
				// console.log('update');                                                                                // 58
				App.property.PropertiesCollection.update(obj._id, {                                                      // 59
					$set: _.omit(obj, 'key', '_id')                                                                         // 60
				});                                                                                                      // 61
			} else {                                                                                                  // 62
				// console.log('insert');                                                                                // 63
				obj.value = obj['default'];                                                                              // 64
				App.property.PropertiesCollection.insert(obj);                                                           // 65
			}                                                                                                         // 66
			// console.log(obj);                                                                                      // 67
		};                                                                                                         // 68
		set();                                                                                                     // 69
	},                                                                                                          // 70
	subscription: dummySubscription,                                                                            // 71
	initSubscription: function() {                                                                              // 72
		// console.warn('subscribing to properties');                                                              // 73
		App.property.subscription = Meteor.subscribe('properties');                                                // 74
	}                                                                                                           // 75
});                                                                                                          // 76
                                                                                                             // 77
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/app-property/property_client.js                                                                  //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
Template.appPropertyEditor.helpers({                                                                         // 1
	props: function() {                                                                                         // 2
		return App.property.PropertiesCollection.find({                                                            // 3
			_id: /property\..+/,                                                                                      // 4
			readOnly: {                                                                                               // 5
				$ne: true                                                                                                // 6
			}                                                                                                         // 7
		});                                                                                                        // 8
	}                                                                                                           // 9
});                                                                                                          // 10
Template.appPropertyEditor.events({                                                                          // 11
	'click .save.btn': function(e) {                                                                            // 12
		e.preventDefault();                                                                                        // 13
		var err = false;                                                                                           // 14
		$(e.currentTarget).parents('form').find('input').each(function() {                                         // 15
			var val = $(this).val();                                                                                  // 16
			var id = this.id;                                                                                         // 17
			var validate = App.property.validators[id];                                                               // 18
			if (validate) {                                                                                           // 19
				var prop = App.property.PropertiesCollection.findOne(id);                                                // 20
				prop.value = val;                                                                                        // 21
				try {                                                                                                    // 22
					validate(prop);                                                                                         // 23
				} catch (e) {                                                                                            // 24
					alert('Invalid value for ' + this.id + '\n' + e);                                                       // 25
					err = true;                                                                                             // 26
				}                                                                                                        // 27
			}                                                                                                         // 28
			App.property.PropertiesCollection.update(id, {                                                            // 29
				$set: {                                                                                                  // 30
					value: val                                                                                              // 31
				}                                                                                                        // 32
			});                                                                                                       // 33
		});                                                                                                        // 34
		if (!err && App.property.editFinished) {                                                                   // 35
			App.property.editFinished(true);                                                                          // 36
		}                                                                                                          // 37
	},                                                                                                          // 38
	'click .cancel.btn': function() {                                                                           // 39
		if (App.property.editFinished) {                                                                           // 40
			App.property.editFinished(false);                                                                         // 41
		}                                                                                                          // 42
	}                                                                                                           // 43
});                                                                                                          // 44
Meteor.startup(function() {                                                                                  // 45
	App.property.initSubscription();                                                                            // 46
});                                                                                                          // 47
Router.waitOn(function() {                                                                                   // 48
	return {                                                                                                    // 49
		ready: function() {                                                                                        // 50
			return App.property.subscription.ready();                                                                 // 51
		}                                                                                                          // 52
	};                                                                                                          // 53
});                                                                                                          // 54
                                                                                                             // 55
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);
