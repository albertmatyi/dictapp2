Router.configure({
	layoutTemplate: 'layout',
	notFoundTemplate: 'notFound',
	loadingTemplate: 'loading',
	waitOn: function () {
		return Meteor.subscribe('properties');
	},
	fastRender: true
});

Router.map(function () {
	this.route('home', {
		path: '/',
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
		path: '/search/:keywords',
		waitOn: function () {
			return Meteor.subscribe('items', this.params.keywords);
		},
		data: function () {
			return {
				page: 'search',
				results: App.items.find(this.params.keywords, -1)
			};
		},
		after: function () {
			GAnalytics.pageview();
		}
	});
});