Router.configure({
	layoutTemplate: 'layout',
	notFoundTemplate: 'notFound',
	loadingTemplate: 'loading',
	waitOn: function () {
		return Meteor.subscribe('properties');
	}
});

Router.map(function () {
	this.route('home', {
		path: '/',
		before: function () {
			Session.set('search.string', '');
		},
		data: function () {
			return {
				page: 'home'
			};
		},
		after: function () {
			GAnalytics.pageview();
		}
	});
	this.route('search', {
		path: '/search/:string',
		waitOn: function () {
			return [Meteor.subscribe('properties'), Meteor.subscribe('items', this.params.string)];
		},
		before: function () {
			var self = this;
			Session.set('search.string', self.params.string);
		},
		data: function () {
			return {
				page: 'search',
				results: App.items.find(this.params.string, -1)
			};
		},
		after: function () {
			GAnalytics.pageview();
		}
	});
});