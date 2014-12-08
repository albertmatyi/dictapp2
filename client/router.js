Meteor.startup(function() {
	// Router.onBeforeAction('loading');
	Router.configure({
		layoutTemplate: 'layout',
		notFoundTemplate: 'notFound',
		loadingTemplate: 'loading',
		waitOn: function() {
			return Meteor.subscribe('properties');
		},
		trackPageView: true
	});

	Router.map(function() {
		this.route('home', {
			path: '/',
			onBeforeAction: function() {
				Session.set('search.string', '');
				this.next();
			},
			data: function() {
				return {
					page: 'home'
				};
			},
			onAfterAction: function() {
			}
		});
		this.route('search', {
			path: '/search/:string',
			waitOn: function() {
				return [Meteor.subscribe('properties'), Meteor.subscribe('searched-items', this.params.string)];
			},
			onBeforeAction: function() {
				var self = this;
				Session.set('search.string', self.params.string);
				this.next();
			},
			data: function() {
				return {
					page: 'search',
					results: App.item.find(this.params.string, -1)
				};
			},
			onAfterAction: function() {
				$('.search-field').focus();
			}
		});
		this.route('item', {
			path: '/item/:_id',
			template: 'itemWrapper',
			waitOn: function() {
				return [Meteor.subscribe('properties'), Meteor.subscribe('item', this.params._id)];
			},
			data: function() {
				return {
					page: 'item',
					item: App.item.collection.findOne(this.params._id)
				};
			},
			onAfterAction: function () {
			}
		});
		this.route('login', {
			onBeforeAction: function() {
				Session.set('loginFlag', +new Date());
				this.redirect('/');
			}
		});
	});
});
