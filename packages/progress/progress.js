var ProgressBarsCollection = new Meteor.Collection(null);

Template.progressBars.helpers({
	progressBars: function () {
		return ProgressBarsCollection.find();
	}
});

Template.progressBar.helpers({
	mainClass: function () {
		var cls = '';
		if (this.hidden) {
			cls += ' fade-out';
		}
		return cls;
	},
	progress: function () {
		return (this.untrackable ? 100:this.progress) + '%';
	}
});

Progress = function (untrackable) {
	var progressData = {
		untrackable: untrackable || false,
		progress: 0,
		hidden: true
	};

	var id;

	this.setProgress = function (progress) {
		ProgressBarsCollection.update(id, {$set: {progress: progress}});
	};

	this.show = function () {
		id = ProgressBarsCollection.insert(_.extend({_type: 'progress'}, progressData));
		setTimeout(function () {
			ProgressBarsCollection.update(id, {$set: {hidden: false}});
		}, 500);
	};

	this.remove = function () {
		ProgressBarsCollection.update(id, {$set: {hidden: true}});
		setTimeout(function () {
			ProgressBarsCollection.remove(id);
		}, 500);
	};
};
