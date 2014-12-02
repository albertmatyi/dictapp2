(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/milight/highlight.js                                                                                //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
/*                                                                                                              // 1
 * jQuery Highlight plugin                                                                                      // 2
 *                                                                                                              // 3
 * Based on highlight v3 by Johann Burkard                                                                      // 4
 * http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html // 5
 *                                                                                                              // 6
 * Code a little bit refactored and cleaned (in my humble opinion).                                             // 7
 * Most important changes:                                                                                      // 8
 *  - has an option to highlight only entire words (wordsOnly - false by default),                              // 9
 *  - has an option to be case sensitive (caseSensitive - false by default)                                     // 10
 *  - highlight element tag and class names can be specified in options                                         // 11
 *                                                                                                              // 12
 * Usage:                                                                                                       // 13
 *   // wrap every occurrance of text 'lorem' in content                                                        // 14
 *   // with <span class='highlight'> (default options)                                                         // 15
 *   $('#content').highlight('lorem');                                                                          // 16
 *                                                                                                              // 17
 *   // search for and highlight more terms at once                                                             // 18
 *   // so you can save some time on traversing DOM                                                             // 19
 *   $('#content').highlight(['lorem', 'ipsum']);                                                               // 20
 *   $('#content').highlight('lorem ipsum');                                                                    // 21
 *                                                                                                              // 22
 *   // search only for entire word 'lorem'                                                                     // 23
 *   $('#content').highlight('lorem', { wordsOnly: true });                                                     // 24
 *                                                                                                              // 25
 *   // don't ignore case during search of term 'lorem'                                                         // 26
 *   $('#content').highlight('lorem', { caseSensitive: true });                                                 // 27
 *                                                                                                              // 28
 *   // wrap every occurrance of term 'ipsum' in content                                                        // 29
 *   // with <em class='important'>                                                                             // 30
 *   $('#content').highlight('ipsum', { element: 'em', className: 'important' });                               // 31
 *                                                                                                              // 32
 *   // remove default highlight                                                                                // 33
 *   $('#content').unhighlight();                                                                               // 34
 *                                                                                                              // 35
 *   // remove custom highlight                                                                                 // 36
 *   $('#content').unhighlight({ element: 'em', className: 'important' });                                      // 37
 *                                                                                                              // 38
 *                                                                                                              // 39
 * Copyright (c) 2009 Bartek Szopka                                                                             // 40
 *                                                                                                              // 41
 * Licensed under MIT license.                                                                                  // 42
 *                                                                                                              // 43
 */                                                                                                             // 44
                                                                                                                // 45
jQuery.extend({                                                                                                 // 46
    highlight: function (node, re, nodeName, className, cb) {                                                   // 47
        if (node.nodeType === 3) {                                                                              // 48
            var match = node.data.match(re);                                                                    // 49
            if (match) {                                                                                        // 50
                if (cb) {                                                                                       // 51
                    cb.call(node);                                                                              // 52
                }                                                                                               // 53
                var highlight = document.createElement(nodeName || 'span');                                     // 54
                highlight.className = className || 'highlight';                                                 // 55
                var wordNode = node.splitText(match.index);                                                     // 56
                wordNode.splitText(match[0].length);                                                            // 57
                var wordClone = wordNode.cloneNode(true);                                                       // 58
                highlight.appendChild(wordClone);                                                               // 59
                wordNode.parentNode.replaceChild(highlight, wordNode);                                          // 60
                return 1; //skip added node in parent                                                           // 61
            }                                                                                                   // 62
        } else if ((node.nodeType === 1 && node.childNodes) && // only element nodes that have children         // 63
                !/(script|style)/i.test(node.tagName) && // ignore script and style nodes                       // 64
                !(node.tagName === nodeName.toUpperCase() && node.className === className)) { // skip if already highlighted
            for (var i = 0; i < node.childNodes.length; i++) {                                                  // 66
                i += jQuery.highlight(node.childNodes[i], re, nodeName, className, cb);                         // 67
            }                                                                                                   // 68
        }                                                                                                       // 69
        return 0;                                                                                               // 70
    }                                                                                                           // 71
});                                                                                                             // 72
                                                                                                                // 73
jQuery.fn.unhighlight = function (options) {                                                                    // 74
    var settings = { className: 'highlight', element: 'span' };                                                 // 75
    jQuery.extend(settings, options);                                                                           // 76
                                                                                                                // 77
    return this.find(settings.element + "." + settings.className).each(function () {                            // 78
        var parent = this.parentNode;                                                                           // 79
        parent.replaceChild(this.firstChild, this);                                                             // 80
        parent.normalize();                                                                                     // 81
    }).end();                                                                                                   // 82
};                                                                                                              // 83
                                                                                                                // 84
jQuery.fn.highlight = function (words, options) {                                                               // 85
    var settings = { className: 'highlight', element: 'span', caseSensitive: false, wordsOnly: false };         // 86
    jQuery.extend(settings, options);                                                                           // 87
                                                                                                                // 88
    if (words.constructor === String) {                                                                         // 89
        words = [words];                                                                                        // 90
    }                                                                                                           // 91
    words = jQuery.grep(words, function(word, i){                                                               // 92
      return word != '';                                                                                        // 93
    });                                                                                                         // 94
    words = jQuery.map(words, function(word, i) {                                                               // 95
      return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");                                                  // 96
    });                                                                                                         // 97
    if (words.length == 0) { return this; };                                                                    // 98
                                                                                                                // 99
    var flag = settings.caseSensitive ? "" : "i";                                                               // 100
    var pattern = "(" + words.join("|") + ")";                                                                  // 101
    if (settings.wordsOnly) {                                                                                   // 102
        pattern = "\\b" + pattern + "\\b";                                                                      // 103
    }                                                                                                           // 104
    var re = new RegExp(pattern, flag);                                                                         // 105
                                                                                                                // 106
    return this.each(function () {                                                                              // 107
        jQuery.highlight(this, re, settings.element, settings.className);                                       // 108
    });                                                                                                         // 109
};                                                                                                              // 110
                                                                                                                // 111
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/milight/helpers.js                                                                                  //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
                                                                                                                // 1
if (typeof Handlebars !== 'undefined' && typeof UI !== 'undefined' && typeof Spacebars !== 'undefined') {       // 2
                                                                                                                // 3
  UI.registerHelper('highlight', function () {                                                                  // 4
    var dependency = new Deps.Dependency(),                                                                     // 5
        keywords = '',                                                                                          // 6
        options = this;                                                                                         // 7
                                                                                                                // 8
    return UI.Component.extend({                                                                                // 9
      parented: function () {                                                                                   // 10
        var self = this;                                                                                        // 11
        self.highlight = Deps.autorun(function () {                                                             // 12
          $(self.firstNode)                                                                                     // 13
            .nextAll()                                                                                          // 14
            .unhighlight() // TODO: do we need this part?                                                       // 15
            .highlight(keywords);                                                                               // 16
                                                                                                                // 17
          dependency.depend();                                                                                  // 18
        });                                                                                                     // 19
      },                                                                                                        // 20
      render: function () {                                                                                     // 21
        var self = this;                                                                                        // 22
        return function () {                                                                                    // 23
          UI.toRawText(self.__content, self); // this triggers reactivity                                       // 24
          keywords = Spacebars.call(self.lookup('keywords'), options.keywords) || '';                           // 25
          dependency.changed();                                                                                 // 26
          return self.__content;                                                                                // 27
        };                                                                                                      // 28
      },                                                                                                        // 29
      destroyed: function () {                                                                                  // 30
        this.highlight.stop();                                                                                  // 31
      },                                                                                                        // 32
    });                                                                                                         // 33
  });                                                                                                           // 34
}                                                                                                               // 35
                                                                                                                // 36
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);
