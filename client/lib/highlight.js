var enabled = false;
App.component('highlight').expose({
	enable: function () {
		var self = this;
		$('.results .item').each(function () {
			self.apply(this);
		});
		enabled = true;
	},
	apply: function (node) {
		$.highlight(node, App.search.getRegex(), 'span', 'milight');
	},
	enabled: function () {
		return App.search.getString().length > 2 && enabled;
	},
	disable: function () {
		$('.milight').each(function () {
			var $el = $(this);
			$el.replaceWith($el.html());
		});
		enabled = false;
	},
	toggle: function () {
		if (this.enabled()) {
			this.disable();
		} else {
			this.enable();
		}
	}
});