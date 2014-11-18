var EditorCollection = new Meteor.Collection(null);

var capitalize = function(str) {
    return str[0].toUpperCase() + str.slice(1);
};

var defaultFieldOptions = {
    'name': 'fieldName', // defauls to field key
    'type': 'text', // textarea, select, radio, checkbox. Default: 'text'
    'options': null, // object with k-v pairs or simple [] (data provider for select/radio/checkbox)
    'label': 'Field label', // defaults to capitalized field name,
    'default': null, // default value when no value object is provided
    'post': function(v) {
        return v;
    }, // method executed after data retrieval
    'render': function() {
        return true;
    } // method executed to check if field has to be rendered
};

var logobj = function(obj) {
    if (typeof console !== 'undefined') {
        console.log(obj);
    }
};

var defaultOptions = {
    'fields': { // should be overwritten when using, this is a sample cfg
        'fieldName0': defaultFieldOptions
        /* ... */
    },
    'data': {}, // some object to populate the fields
    'save': logobj, // callback for when save is pressed
    'discard': logobj, // callback for when cancel / close is pressed
    '_type': 'editor'
};

Template.appEditors.helpers({
    editors: function() {
        return EditorCollection.find();
    }
});

// converts ['a','b','c'] =to=> {'a':'a', 'b':'b', 'c':'c'}
var remapOptions = function(e, key) {
    return {
        value: typeof key === 'number' ? e : key,
        name: e
    };
};

var rebuildField = function(field, fieldName, data) {
    data = data || {};
    field['default'] = _.isFunction(field['default']) ? field['default']() : field['default'];
    var calcdOpts = {
        name: fieldName,
        label: capitalize(fieldName),
        value: _.isUndefined(data[fieldName]) ? field['default'] : data[fieldName]
    };
    if (typeof field === 'object') {
        field = $.extend({}, defaultFieldOptions, calcdOpts, field);
        field.label = App.strf(field.label) || fieldName;
        field.options = _.map(field.options, remapOptions);
    } else {
        field = $.extend({}, defaultFieldOptions, calcdOpts);
    }
    return field;
};

var buildFieldArr; // because of jshint

var rebuildArrayField = function(field, fieldName, data) {
    field = _.extend({}, field);
    field.fields = buildFieldArr(field.fields);
    field.name = field.name || fieldName;
    field.post = field.post || defaultFieldOptions.post;
    field.label = App.strf(field.label) || fieldName;
    field.data = _.map(data[fieldName], function(el, idx) {
        el.idx = idx;
        return el;
    });
    return field;
};

buildFieldArr = function(fields, data) {
    var fieldArr = [];
    data = data || {};
    for (var fieldName in fields) {
        if (fields.hasOwnProperty(fieldName)) {
            var field = fields[fieldName];
            if (field.type === 'array') {
                field = rebuildArrayField(field, fieldName, data);
            } else {
                field = rebuildField(field, fieldName, data);
            }
            fieldArr.push(field);
        }
    }
    return fieldArr;
};

var setupI18nOptions = function(options) {
    options.i18nEnabled = true;
    var langs = App.i18n.getLanguages();
    options.languages = _.map(langs, function(e) {
        return {
            title: e
        };
    });
    options.i18nFields = {};
    var defaultLanguage = App.i18n.getDefaultLanguage();
    _.each(langs, function(lang) {
        var data = options.data;
        if (defaultLanguage !== lang) {
            data = options.data.i18n ? options.data.i18n[lang] : {};
        }
        var fields = buildFieldArr(options.fields.i18n, data);
        if (defaultLanguage !== lang) {
            _.each(fields, function(field) {
                field.name = field.name + '-' + lang;
            });
        }
        options.i18nFields[lang] = fields;
    });

    options.fields = $.extend({}, options.fields);
    delete options.fields.i18n;
};

var setupOptions = function(options) {
    options = $.extend({}, defaultOptions, options);
    if (options.fields.i18n) {
        if (App.i18n.isActive()) {
            setupI18nOptions(options);
        } else {
            options.fields = _.extend({}, options.fields.i18n, options.fields);
            delete options.fields.i18n;
        }
    }
    var fieldArr = buildFieldArr(options.fields, options.data);
    options.fields = fieldArr;
    return options;
};

var fieldRendered = function() {
    var self = this;

    _.each(self.data.events, function(handler, eventName) {
        $(self.find('.' + self.data.name)).on(eventName, function(e) {
            handler.call(self.data, e);
        });
    });
};

var fieldHelper = function() {
    _.extend(this, this.currentContext);
    delete this.currentContext;
    // console.log(this);
    var tplt;
    var templateName = ('appEditor' + capitalize(this.type));
    if (Template[templateName]) {
        tplt = Template[templateName];
    } else {
        tplt = Template.appEditorInvalid;
    }
    tplt.rendered = tplt.rendered || fieldRendered;
    return tplt;
};
Template.appEditorForm.helpers({
    field: fieldHelper
});
Template.appEditorArray.helpers({
    field: fieldHelper,
    mergedContext: function(data) {
        // console.log(this, data);
        this.value = _.isUndefined(data[this.name]) ? this['default'] : data[this.name];
        this.idx = data.idx;
        return this;
    }
});

Template.appEditorI18nForm.helpers({
    field: fieldHelper,
    active: function() {
        return this.title === App.i18n.getDefaultLanguage() ? 'active' : '';
    },
    i18nFields: function(options, language) {
        return options.i18nFields[language];
    },
    panelId: function(options, language) {
        return 'editor_' + options._id + '_' + language;
    }
});

Template.appEditorSelect.selected = function(selection) {
    return this.value === selection ? 'selected="selected"' : '';
};

Template.appEditorCheckbox.checked = function() {
    return this.value ? {
        checked: 'checked'
    } : '';
};

var $fieldForName = function(name, $ctx) {
    var selector = '.' + name.replace(/\./gi, '\\.');
    selector += ':not(div)';
    var $el = $(selector, $ctx);
    return $el;
};

var collectData; // because jshint

var collectArrayData = function(field, $ctx) {
    var data = [];
    $ctx = $ctx.find('.array-wrapper.' + field.name);
    $ctx.find('.array-element').each(function() {
        var $lctxt = $(this);
        var elData = collectData(field.fields, $lctxt);
        data.push(elData);
    });
    // collectData(field.fields, $ctx.find('array-wrapper ' + field.name));
    return data;
};

collectData = function(fields, $ctx, i18nSuffixToRemove) {
    var data = {};
    for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        var val;
        switch (field.type) {
            case 'file':
                var files = $fieldForName(field.name)[0].files;
                val = files.length > 0 ? files[0] : null;
                break;
            case 'checkbox':
                val = $fieldForName(field.name, $ctx).prop('checked');
                break;
            case 'array':
                val = collectArrayData(field, $ctx);
                break;
            case 'button':
                continue;
            default:
                val = $fieldForName(field.name, $ctx).val();
                break;
        }
        var fieldName = field.name;
        if (i18nSuffixToRemove) {
            fieldName = fieldName.replace(new RegExp(i18nSuffixToRemove + '$'), '');
        }
        data[fieldName] = field.post(val);
    }
    return data;
};

var collectI18nData = function(collectedData, options, $ctx) {
    if (!App.i18n.isActive()) {
        return;
    }
    var data = {};
    var langs = App.i18n.getLanguages();
    var defaultLanguage = App.i18n.getDefaultLanguage();
    _.each(langs, function(lang) {
        var dt;
        if (lang === defaultLanguage) {
            dt = collectData(options.i18nFields[lang], $ctx);
            _.extend(collectedData, dt);
        } else {
            dt = collectData(options.i18nFields[lang], $ctx, '-' + lang);
            data[lang] = dt;
        }
    });
    return data;
};

var hideAnd = function(actionName, options, $ctx) {
    var collectedData = collectData(options.fields, $ctx);
    collectedData.i18n = collectI18nData(collectedData, options, $ctx);
    options[actionName](collectedData, options.data);
    $ctx.addClass('init');
    setTimeout(function() {
        EditorCollection.remove(options._id);
    }, 500);
};

Template.appEditor.events({
    'submit form': function(e) {
        e.preventDefault();
        var $ctx = $(e.currentTarget).parents('.editor-wrapper');
        hideAnd('save', this, $ctx);
    },
    'click .discard': function(e) {
        e.preventDefault();
        var $ctx = $(e.currentTarget).parents('.editor-wrapper');
        hideAnd('discard', this, $ctx);
    }
});

Template.appEditor.rendered = function() {
    var $el = $(this.firstNode);
    setTimeout(function() {
        $el.removeClass('init');
    });
};

App.component('editor').expose({
    edit: function(options) {
        options = setupOptions(options);
        EditorCollection.insert(options);
    },
    buildFieldArr: buildFieldArr,
    collectData: collectData
});
