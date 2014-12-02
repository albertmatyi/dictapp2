App = {};
_App = {};

var component = function(name) {
	var parts = name.split(/\./);
	var pkg = this;
	_.each(parts, function(part) {
		if (typeof pkg[part] === 'undefined') {
			pkg[part] = {};
		}
		pkg = pkg[part];
	});
	return {
		expose: function(methods) {
			_.extend(pkg, methods);
			return pkg;
		}
	};
};

var module = function(name) {
	return this.component('modules.' + name);
};

App.component = component;
_App.component = component;

App.module = module;
_App.module = module;

App.strf = function(strOrFunc) {
	if (typeof strOrFunc !== 'undefined') {
		if (_.isFunction(strOrFunc)) {
			var args = Array.prototype.slice.call(arguments, 1);
			return strOrFunc.apply(null, args);
		} else {
			return strOrFunc.toString();
		}
	}
	return '';
};
App.component('helpers').expose({
	capitalize: function(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
});
