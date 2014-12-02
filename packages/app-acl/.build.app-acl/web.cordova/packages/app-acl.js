(function () {

//////////////////////////////////////////////////////////////////////////////////
//                                                                              //
// packages/app-acl/acl_common.js                                               //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////
                                                                                //
var OVERRIDES = {};                                                             // 1
var OVERRIDES_REGEX = {};                                                       // 2
                                                                                // 3
var isAllowed = function(actionName) {                                          // 4
	var overridden;                                                                // 5
	var allowed = true;                                                            // 6
	_.every(OVERRIDES, function(method, key) {                                     // 7
		var ok = true;                                                                // 8
		var re = OVERRIDES_REGEX[key];                                                // 9
		// console.log('testing', actionName, 'with', key, ': ',re.test(actionName)); // 10
		if (re.test(actionName)) {                                                    // 11
			overridden = true;                                                           // 12
			var r = method();                                                            // 13
			if (r !== true) {                                                            // 14
				ok = false;                                                                 // 15
				allowed = r;                                                                // 16
			}                                                                            // 17
		}                                                                             // 18
		return ok;                                                                    // 19
	});                                                                            // 20
                                                                                // 21
	// check if db overridden                                                      // 22
	if (!overridden) {                                                             // 23
		throw new Meteor.Error('Not implemented', 'No database based acl yet');       // 24
	}                                                                              // 25
	// execute override or return db value accordingly                             // 26
	return allowed;                                                                // 27
};                                                                              // 28
                                                                                // 29
App.component('acl').expose({                                                   // 30
	registerAction: function(actionName) {                                         // 31
		actionName = '';                                                              // 32
		// save actionName to the database (on serverside)                            // 33
	},                                                                             // 34
	isAllowed: isAllowed,                                                          // 35
	ifAllowed: function(actionName, method, wrap) {                                // 36
		var f = function() {                                                          // 37
			var allowed = isAllowed(actionName);                                         // 38
			if (allowed === true) { // if allowed, execute method                        // 39
				return method.apply(this, arguments);                                       // 40
			} else { // otherwise throw error                                            // 41
				throw new Meteor.Error(allowed, 'Access denied: ' + allowed);               // 42
			}                                                                            // 43
		};                                                                            // 44
		if (!wrap) { // execute immediately                                           // 45
			return f.apply(this);                                                        // 46
		} else { // return method to be used                                          // 47
			return f;                                                                    // 48
		}                                                                             // 49
	},                                                                             // 50
	allow: function(actionMatcher, method) {                                       // 51
		OVERRIDES[actionMatcher] = method;                                            // 52
		OVERRIDES_REGEX[actionMatcher] = new RegExp(actionMatcher);                   // 53
	}                                                                              // 54
});                                                                             // 55
                                                                                // 56
//////////////////////////////////////////////////////////////////////////////////

}).call(this);
