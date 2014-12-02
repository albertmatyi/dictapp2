var OVERRIDES = {};
var OVERRIDES_REGEX = {};

var isAllowed = function(actionName) {
	var overridden;
	var allowed = true;
	_.every(OVERRIDES, function(method, key) {
		var ok = true;
		var re = OVERRIDES_REGEX[key];
		// console.log('testing', actionName, 'with', key, ': ',re.test(actionName));
		if (re.test(actionName)) {
			overridden = true;
			var r = method();
			if (r !== true) {
				ok = false;
				allowed = r;
			}
		}
		return ok;
	});

	// check if db overridden
	if (!overridden) {
		throw new Meteor.Error('Not implemented', 'No database based acl yet');
	}
	// execute override or return db value accordingly
	return allowed;
};

App.component('acl').expose({
	registerAction: function(actionName) {
		actionName = '';
		// save actionName to the database (on serverside)
	},
	isAllowed: isAllowed,
	ifAllowed: function(actionName, method, wrap) {
		var f = function() {
			var allowed = isAllowed(actionName);
			if (allowed === true) { // if allowed, execute method
				return method.apply(this, arguments);
			} else { // otherwise throw error
				throw new Meteor.Error(allowed, 'Access denied: ' + allowed);
			}
		};
		if (!wrap) { // execute immediately
			return f.apply(this);
		} else { // return method to be used
			return f;
		}
	},
	allow: function(actionMatcher, method) {
		OVERRIDES[actionMatcher] = method;
		OVERRIDES_REGEX[actionMatcher] = new RegExp(actionMatcher);
	}
});
