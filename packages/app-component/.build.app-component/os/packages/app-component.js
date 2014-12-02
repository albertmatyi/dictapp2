(function () {

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/app-component/app-component.js                           //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
App = {};                                                            // 1
_App = {};                                                           // 2
                                                                     // 3
var component = function(name) {                                     // 4
	var parts = name.split(/\./);                                       // 5
	var pkg = this;                                                     // 6
	_.each(parts, function(part) {                                      // 7
		if (typeof pkg[part] === 'undefined') {                            // 8
			pkg[part] = {};                                                   // 9
		}                                                                  // 10
		pkg = pkg[part];                                                   // 11
	});                                                                 // 12
	return {                                                            // 13
		expose: function(methods) {                                        // 14
			_.extend(pkg, methods);                                           // 15
			return pkg;                                                       // 16
		}                                                                  // 17
	};                                                                  // 18
};                                                                   // 19
                                                                     // 20
var module = function(name) {                                        // 21
	return this.component('modules.' + name);                           // 22
};                                                                   // 23
                                                                     // 24
App.component = component;                                           // 25
_App.component = component;                                          // 26
                                                                     // 27
App.module = module;                                                 // 28
_App.module = module;                                                // 29
                                                                     // 30
App.strf = function(strOrFunc) {                                     // 31
	if (typeof strOrFunc !== 'undefined') {                             // 32
		if (_.isFunction(strOrFunc)) {                                     // 33
			var args = Array.prototype.slice.call(arguments, 1);              // 34
			return strOrFunc.apply(null, args);                               // 35
		} else {                                                           // 36
			return strOrFunc.toString();                                      // 37
		}                                                                  // 38
	}                                                                   // 39
	return '';                                                          // 40
};                                                                   // 41
App.component('helpers').expose({                                    // 42
	capitalize: function(str) {                                         // 43
		return str.charAt(0).toUpperCase() + str.slice(1);                 // 44
	}                                                                   // 45
});                                                                  // 46
                                                                     // 47
///////////////////////////////////////////////////////////////////////

}).call(this);
