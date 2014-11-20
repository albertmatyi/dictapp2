App.property.set({
  key: 'app.icon',
  default: 'fa-graduation-cap',
  title: 'Icon of the application',
  description: 'Choose one of the icon names from http://fontawesome.io/icons/'
});


var search = function(instant) {
  var string = $('.search-field').val().trim();
  App.search.search(string, instant);
};

var clear = function() {
  $('.search-field').val('').focus();
  search(true);
};

Template.header.events({
  'keyup .search-field': function(ev) {
    if (ev.keyCode === 27) { // ESC
      clear();
    } else if (ev.keyCode === 13) { // ENTER
      search(true);
    } else {
      search();
    }
  },
  'click .go.btn': function() {
    search();
  },
  'click .clear.btn': function() {
    clear();
  },
  'click .users': function(e) {
    e.preventDefault();
    App.users.show();
  },
  'click .app-properties': function(e) {
    e.preventDefault();
    App.property.edit();
  },
  'click .add.btn': function(e) {
    e.preventDefault();
    App.editor.create();
  },
  'click .expand-all.btn': function(e) {
    e.preventDefault();
    App.search.expandAll();
  },
  'click .contract-all.btn': function(e) {
    e.preventDefault();
    App.search.contractAll();
  },
  'click .about.btn': function(e) {
    e.preventDefault();
    App.about.show();
  },
  'click .bibliography.btn': function(e) {
    e.preventDefault();
    App.bibliography.show();
  },
  'click .import input': function(e) {
    e.stopPropagation();
  },
  'click .export': function(e) {
    e.preventDefault();
    window.open(window.location.origin + '/export');
  },
  'change .import input': function(e) {
    App.import(e.currentTarget.files[0]);
  }
});

Template.header.helpers({
  searchString: function() {
    return App.search.getString();
  },
  appIcon: function() {
    return App.property('app.icon');
  },
  loginFlag: function() {
    return Meteor.user() || Session.get('loginFlag');
  }
});
