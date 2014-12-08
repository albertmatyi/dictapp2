(function () {

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
// packages/app-acl/acl_common.js                                            //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////
                                                                             //
var OVERRIDES = {};                                                          // 1
var OVERRIDES_REGEX = {};                                                    // 2
                                                                             // 3
var isAllowed = function(actionName) {                                       // 4
	var overridden;                                                             // 5
	var allowed = true;                                                         // 6
	console.log('allowed:', actionName);                                        // 7
	_.every(OVERRIDES, function(method, key) {                                  // 8
		var ok = true;                                                             // 9
		var re = OVERRIDES_REGEX[key];                                             // 10
		console.log('testing', actionName, 'with', key, ': ',re.test(actionName)); // 11
		if (re.test(actionName)) {                                                 // 12
			overridden = true;                                                        // 13
			var r = method();                                                         // 14
			if (r !== true) {                                                         // 15
				ok = false;                                                              // 16
				allowed = r;                                                             // 17
			}                                                                         // 18
		}                                                                          // 19
		return ok;                                                                 // 20
	});                                                                         // 21
                                                                             // 22
	// check if db overridden                                                   // 23
	if (!overridden) {                                                          // 24
		throw new Meteor.Error('Not implemented', 'No database based acl yet');    // 25
	}                                                                           // 26
	// execute override or return db value accordingly                          // 27
	return allowed;                                                             // 28
};                                                                           // 29
                                                                             // 30
App.component('acl').expose({                                                // 31
	registerAction: function(actionName) {                                      // 32
		actionName = '';                                                           // 33
		// save actionName to the database (on serverside)                         // 34
	},                                                                          // 35
	isAllowed: isAllowed,                                                       // 36
	ifAllowed: function(actionName, method, wrap) {                             // 37
		var f = function() {                                                       // 38
			var allowed = isAllowed(actionName);                                      // 39
			if (allowed === true) { // if allowed, execute method                     // 40
				return method.apply(this, arguments);                                    // 41
			} else { // otherwise throw error                                         // 42
				throw new Meteor.Error(allowed, 'Access denied: ' + allowed);            // 43
			}                                                                         // 44
		};                                                                         // 45
		if (!wrap) { // execute immediately                                        // 46
			return f.apply(this);                                                     // 47
		} else { // return method to be used                                       // 48
			return f;                                                                 // 49
		}                                                                          // 50
	},                                                                          // 51
	allow: function(actionMatcher, method) {                                    // 52
		OVERRIDES[actionMatcher] = method;                                         // 53
		OVERRIDES_REGEX[actionMatcher] = new RegExp(actionMatcher);                // 54
	}                                                                           // 55
});                                                                          // 56
                                                                             // 57
///////////////////////////////////////////////////////////////////////////////

}).call(this);
