(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                 //
// packages/panels/template.panels.js                                                              //
//                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                   //
                                                                                                   // 1
Template.__checkName("appPanels");                                                                 // 2
Template["appPanels"] = new Template("Template.appPanels", (function() {                           // 3
  var view = this;                                                                                 // 4
  return Blaze.Each(function() {                                                                   // 5
    return Spacebars.call(view.lookup("panels"));                                                  // 6
  }, function() {                                                                                  // 7
    return [ "\n    ", Spacebars.include(view.lookupTemplate("appPanel")), "\n    " ];             // 8
  });                                                                                              // 9
}));                                                                                               // 10
                                                                                                   // 11
Template.__checkName("appPanel");                                                                  // 12
Template["appPanel"] = new Template("Template.appPanel", (function() {                             // 13
  var view = this;                                                                                 // 14
  return HTML.DIV({                                                                                // 15
    "class": function() {                                                                          // 16
      return [ "app-panel-wrapper ", Spacebars.mustache(view.lookup("offScreen")), " ", Spacebars.mustache(view.lookup("panelClass")) ];
    }                                                                                              // 18
  }, HTML.Raw('\n        <div class="overlay"></div>\n        '), HTML.DIV({                       // 19
    "class": "app-panel"                                                                           // 20
  }, "\n            ", Blaze.If(function() {                                                       // 21
    return Spacebars.call(view.lookup("title"));                                                   // 22
  }, function() {                                                                                  // 23
    return [ "\n            ", HTML.DIV({                                                          // 24
      "class": "header"                                                                            // 25
    }, "\n                ", Blaze.View(function() {                                               // 26
      return Spacebars.mustache(view.lookup("title"));                                             // 27
    }), "\n                ", HTML.A({                                                             // 28
      href: "",                                                                                    // 29
      "class": "close"                                                                             // 30
    }, "\n                    ", HTML.SPAN({                                                       // 31
      "class": "fa fa-times"                                                                       // 32
    }), "\n                "), "\n            "), "\n            " ];                              // 33
  }), "\n            ", HTML.DIV({                                                                 // 34
    "class": "body"                                                                                // 35
  }, "\n                ", Blaze._TemplateWith(function() {                                        // 36
    return Spacebars.call(view.lookup("contentData"));                                             // 37
  }, function() {                                                                                  // 38
    return Spacebars.include(view.lookupTemplate("content"));                                      // 39
  }), "\n            "), "\n            ", Blaze.If(function() {                                   // 40
    return Spacebars.call(view.lookup("footer"));                                                  // 41
  }, function() {                                                                                  // 42
    return [ "\n            ", HTML.DIV({                                                          // 43
      "class": "footer"                                                                            // 44
    }, "\n                ", Blaze.View(function() {                                               // 45
      return Spacebars.mustache(view.lookup("footer"));                                            // 46
    }), "\n            "), "\n            " ];                                                     // 47
  }), "\n        "), "\n    ");                                                                    // 48
}));                                                                                               // 49
                                                                                                   // 50
Template.__checkName("appPanelInvalid");                                                           // 51
Template["appPanelInvalid"] = new Template("Template.appPanelInvalid", (function() {               // 52
  var view = this;                                                                                 // 53
  return "Wrong or no template defined for the panel";                                             // 54
}));                                                                                               // 55
                                                                                                   // 56
/////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                 //
// packages/panels/panels.js                                                                       //
//                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                   //
var PanelCollection = new Meteor.Collection(null);                                                 // 1
var Panels = {};                                                                                   // 2
                                                                                                   // 3
var defaultOptions = {                                                                             // 4
    template: null, // the child template to be rendered                                           // 5
    data: {}, // the child template to be rendered                                                 // 6
    callback: function () {                                                                        // 7
        // console.log('closed panel');                                                            // 8
    },                                                                                             // 9
    offScreen: true, // marking if panel should be offScreen of the screen                         // 10
    _type: 'panels',                                                                               // 11
    container: undefined                                                                           // 12
};                                                                                                 // 13
Template.appPanel.rendered = function () {                                                         // 14
    var $cont = $(this.data.data.container);                                                       // 15
    if ($cont.length) {                                                                            // 16
        $cont.append(this.firstNode);                                                              // 17
    }                                                                                              // 18
};                                                                                                 // 19
Template.appPanels.helpers({                                                                       // 20
    panels: function () {                                                                          // 21
        return PanelCollection.find({                                                              // 22
            container: {                                                                           // 23
                $exists: false                                                                     // 24
            }                                                                                      // 25
        });                                                                                        // 26
    }                                                                                              // 27
});                                                                                                // 28
(function () {                                                                                     // 29
    var views = {};                                                                                // 30
    PanelCollection.find({                                                                         // 31
        container: {                                                                               // 32
            $exists: true                                                                          // 33
        }                                                                                          // 34
    }).observe({                                                                                   // 35
        added: function (panel) {                                                                  // 36
            var parent = $(panel.container)[0];                                                    // 37
            views[panel._id] = Blaze.renderWithData(Template.appPanel, Panels[panel._id], parent); // 38
        },                                                                                         // 39
        removed: function (panel) {                                                                // 40
            Blaze.remove(views[panel._id]);                                                        // 41
            delete views[panel._id]                                                                // 42
        }                                                                                          // 43
    });                                                                                            // 44
})();                                                                                              // 45
                                                                                                   // 46
var setupOptions = function (options) {                                                            // 47
    options = $.extend({}, defaultOptions, options);                                               // 48
    return options;                                                                                // 49
};                                                                                                 // 50
                                                                                                   // 51
Template.appPanel.helpers({                                                                        // 52
    offScreen: function () {                                                                       // 53
        var oc = PanelCollection.findOne(this._id).offScreen;                                      // 54
        // console.log('recalc', oc);                                                              // 55
        return oc ? 'off-screen' : '';                                                             // 56
    },                                                                                             // 57
    content: function () {                                                                         // 58
        var opts = Panels[this.parentContext._id];                                                 // 59
        return opts ? opts.template : Template.appPanelInvalid;                                    // 60
    },                                                                                             // 61
    contentData: function () {                                                                     // 62
        var opts = Panels[this._id];                                                               // 63
        return _.extend({                                                                          // 64
            parentContext: this                                                                    // 65
        }, opts ? opts.data : {});                                                                 // 66
    }                                                                                              // 67
});                                                                                                // 68
                                                                                                   // 69
var closePanel = function () {                                                                     // 70
    var self = this;                                                                               // 71
    var opts = Panels[self._id];                                                                   // 72
    PanelCollection.update(self._id, {                                                             // 73
        $set: {                                                                                    // 74
            offScreen: true                                                                        // 75
        }                                                                                          // 76
    });                                                                                            // 77
    setTimeout(function () {                                                                       // 78
        opts.callback();                                                                           // 79
        PanelCollection.remove(self._id);                                                          // 80
        delete Panels[self._id];                                                                   // 81
    }, 150);                                                                                       // 82
};                                                                                                 // 83
                                                                                                   // 84
Template.appPanel.events({                                                                         // 85
    'click .close': function (e) {                                                                 // 86
        e.preventDefault();                                                                        // 87
        closePanel.call(this);                                                                     // 88
    },                                                                                             // 89
    'click .overlay': function (e) {                                                               // 90
        if (!e.isDefaultPrevented()) {                                                             // 91
            e.preventDefault();                                                                    // 92
            closePanel.call(this);                                                                 // 93
        }                                                                                          // 94
    }                                                                                              // 95
});                                                                                                // 96
                                                                                                   // 97
Panel = function (options) {                                                                       // 98
    options = setupOptions(options);                                                               // 99
    var id = Random.id();                                                                          // 100
    options._id = id;                                                                              // 101
    Panels[id] = options;                                                                          // 102
    PanelCollection.insert(options);                                                               // 103
    this.close = function () {                                                                     // 104
        closePanel.call(PanelCollection.findOne(id));                                              // 105
    };                                                                                             // 106
    this.show = function () {                                                                      // 107
        PanelCollection.update(id, {                                                               // 108
            $set: {                                                                                // 109
                offScreen: false                                                                   // 110
            }                                                                                      // 111
        });                                                                                        // 112
    };                                                                                             // 113
};                                                                                                 // 114
                                                                                                   // 115
/////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);
