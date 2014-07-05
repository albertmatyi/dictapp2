Template.item.helpers({
	separatorLeft: function () {
		return (this.endingLeft || this.typeLeft) && this.wordLeft ? '|':'';
	}
});
Template.sense.helpers({
	separatorLeft: function () {
		console.log(this.phraseLeft, this.descriptionLeft);
		return this.phraseLeft && this.descriptionLeft ? ':':'';
	},
	separatorRight: function () {
		return this.phraseRight && this.descriptionRight ? ':':'';
	}
});

Template.item.events({
	'click .back.btn': function() {
		history.go(-1);
	},
	'click .edit.btn': function() {
		App.editor.edit(this);
	},
	'click .delete.btn': function() {
		var self = this;
		bootbox.confirm(App.i18n.getString('confirm.delete'), function(result) {
			if (result) {
				ItemsCollection.remove(self._id);
				if (document.referrer && document.referrer.indexOf(window.location.host) !== -1) {
					history.go(-1);
				}
			}
		});
	}
});