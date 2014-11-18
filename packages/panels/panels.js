var PanelCollection = new Meteor.Collection(null);
var Panels = {};

var defaultOptions = {
    template: null, // the child template to be rendered
    data: {}, // the child template to be rendered
    callback: function () {
        console.log('closed panel');
    },
    offScreen: true, // marking if panel should be offScreen of the screen
    _type: 'panels',
    container: undefined
};
Template.appPanel.rendered = function () {
    var $cont = $(this.data.data.container);
    if ($cont.length) {
        $cont.append(this.firstNode);
    }
};
Template.appPanels.helpers({
    panels: function () {
        return PanelCollection.find({
            container: {
                $exists: false
            }
        });
    }
});
(function () {
    var views = {};
    PanelCollection.find({
        container: {
            $exists: true
        }
    }).observe({
        added: function (panel) {
            var parent = $(panel.container)[0];
            views[panel._id] = Blaze.renderWithData(Template.appPanel, Panels[panel._id], parent);
        },
        removed: function (panel) {
            Blaze.remove(views[panel._id]);
            delete views[panel._id]
        }
    });
})();

var setupOptions = function (options) {
    options = $.extend({}, defaultOptions, options);
    return options;
};

Template.appPanel.helpers({
    offScreen: function () {
        return PanelCollection.findOne(this._id).offScreen ? 'off-screen' : '';
    },
    content: function () {
        var opts = Panels[this.parentContext._id];
        return opts ? opts.template : Template.appPanelInvalid;
    },
    contentData: function () {
        var opts = Panels[this._id];
        return _.extend({
            parentContext: this
        }, opts ? opts.data : {});
    }
});

var closePanel = function () {
    var self = this;
    var opts = Panels[self._id];
    PanelCollection.update(self._id, {
        $set: {
            offScreen: true
        }
    });
    setTimeout(function () {
        opts.callback();
        PanelCollection.remove(self._id);
        delete Panels[self._id];
    }, 150);
};

Template.appPanel.events({
    'click .close': function (e) {
        e.preventDefault();
        closePanel.call(this);
    },
    'click .overlay': function (e) {
        if (!e.isDefaultPrevented()) {
            e.preventDefault();
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
    this.show = function () {
        PanelCollection.update(id, {
            $set: {
                offScreen: false
            }
        });
    };
};
