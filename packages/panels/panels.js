var PanelCollection = new Meteor.Collection(null);
var Panels = {};

var defaultOptions = {
    template: null, // the child template to be rendered
    data: {}, // the child template to be rendered
    callback: function () { console.log('closed panel'); },
    outside: true, // marking if panel should be outside of the screen
    _type: 'panels'
};

Template.panels.helpers({
    panels: function () {
        return PanelCollection.find();
    }
});

var setupOptions = function (options) {
    options = $.extend({}, defaultOptions, options);
    return options;
};

Template.panel.helpers({
    outside: function () {
        return this.outside ? 'outside':'';
    },
    content: function () {
        var opts = Panels[this.parentContext._id];
        return opts ? opts.template:Template.panelInvalid;
    },
    contentData: function () {
        var opts = Panels[this._id];
        return _.extend({parentContext: this}, opts ? opts.data:{});
    }
});

var closePanel = function () {
    var self = this;
    var opts = Panels[self._id];
    PanelCollection.update(self._id, {$set: {outside: true}});
    setTimeout(function () {
        opts.callback();
        delete Panels[self._id];
        PanelCollection.remove(self._id);
    }, 500);
};

Template.panel.events({
    'click .close': closePanel,
    'click .panel': function (e) {
        e.stopPropagation();
        e.preventDefault();
    },
    'click .panel-wrapper': function (e) {
        if (!e.isDefaultPrevented()) {
            closePanel.call(this);
        }
    }
});

Panel = function (options) {
    options = setupOptions(options);
    var id = Random.id();
    options._id = id;
    Panels[id] = options;
    PanelCollection.insert(options);
    this.close = function () {
        closePanel.call(PanelCollection.findOne(id));
    };
    setTimeout(function () {
        PanelCollection.update(id, {$set: {outside: false}});
    });
};
