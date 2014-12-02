Template.appPropertyEditor.helpers({
	props: function() {
		return App.property.PropertiesCollection.find({
			_id: /property\..+/,
			readOnly: {
				$ne: true
			}
		});
	}
});
Template.appPropertyEditor.events({
	'click .save.btn': function(e) {
		e.preventDefault();
		var err = false;
		$(e.currentTarget).parents('form').find('input').each(function() {
			var val = $(this).val();
			var id = this.id;
			var validate = App.property.validators[id];
			if (validate) {
				var prop = App.property.PropertiesCollection.findOne(id);
				prop.value = val;
				try {
					validate(prop);
				} catch (e) {
					alert('Invalid value for ' + this.id + '\n' + e);
					err = true;
				}
			}
			App.property.PropertiesCollection.update(id, {
				$set: {
					value: val
				}
			});
		});
		if (!err && App.property.editFinished) {
			App.property.editFinished(true);
		}
	},
	'click .cancel.btn': function() {
		if (App.property.editFinished) {
			App.property.editFinished(false);
		}
	}
});
Meteor.startup(function() {
	App.property.initSubscription();
});
Router.waitOn(function() {
	return {
		ready: function() {
			return App.property.subscription.ready();
		}
	};
});
