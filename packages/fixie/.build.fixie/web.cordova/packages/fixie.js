(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/fixie/fixie.js                                                                                 //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
/*                                                                                                         // 1
 * Fixie.js                                                                                                // 2
 * by Ryhan Hassan                                                                                         // 3
 * ryhanh@me.com                                                                                           // 4
 *                                                                                                         // 5
 * Automagically adds filler content                                                                       // 6
 * whenever an element has class='fixie'.                                                                  // 7
 * Hope you find it useful :)                                                                              // 8
*/                                                                                                         // 9
fixie = (                                                                                                  // 10
    function () {                                                                                          // 11
                                                                                                           // 12
        var selector;                                                                                      // 13
        var imagePlaceHolder = 'http://placehold.it/${w}x${h}&text=${text}';                               // 14
        var docDefined = function () {                                                                     // 15
            return typeof document !== 'undefined';                                                        // 16
        };                                                                                                 // 17
                                                                                                           // 18
                                                                                                           // 19
        if (docDefined() && typeof document.getElementsByClassName !== 'function') {                       // 20
            document.getElementsByClassName = function (cl) {                                              // 21
                var retnode = [];                                                                          // 22
                var myclass = new RegExp('\\b' + cl + '\\b');                                              // 23
                var elem = this.getElementsByTagName('*');                                                 // 24
                for (var i = 0; i < elem.length; i++) {                                                    // 25
                    var classes = elem[i].className;                                                       // 26
                    if (myclass.test(classes)) {                                                           // 27
                        retnode.push(elem[i]);                                                             // 28
                    }                                                                                      // 29
                }                                                                                          // 30
                return retnode;                                                                            // 31
            };                                                                                             // 32
        }                                                                                                  // 33
                                                                                                           // 34
    /*                                                                                                     // 35
     * Spec                                                                                                // 36
     * Here are some functions you might find useful                                                       // 37
     *                                                                                                     // 38
     * fixie_handler(element)                                                                              // 39
     * fixie_handle_elements(elements)                                                                     // 40
     *                                                                                                     // 41
     * fixie_fetchWord();                                                                                  // 42
     * fixie_fetchPhrase();                                                                                // 43
     * fixie_fetchSentence();                                                                              // 44
     * fixie_fetchParagraph();                                                                             // 45
     * fixie_fetchParagraphs();                                                                            // 46
     *                                                                                                     // 47
     */                                                                                                    // 48
                                                                                                           // 49
                                                                                                           // 50
    /*                                                                                                     // 51
     * fixie_handler(element)                                                                              // 52
     *                                                                                                     // 53
     * Takes in an element and adds filler content.                                                        // 54
     * Returns false if tag is unrecognized.                                                               // 55
     */                                                                                                    // 56
     function fixie_handler(element) {                                                                     // 57
        if (!/^\s*$/.test(element.innerHTML)){                                                             // 58
            var childs = element.children;                                                                 // 59
            if(childs.length){                                                                             // 60
                for(var fixie_i = 0; fixie_i < childs.length; fixie_i++){                                  // 61
                    fixie_handler(childs[fixie_i]);                                                        // 62
                }                                                                                          // 63
            }                                                                                              // 64
            return;                                                                                        // 65
        }                                                                                                  // 66
        switch (element.nodeName.toLowerCase()) {                                                          // 67
            case 'b':                                                                                      // 68
            case 'em':                                                                                     // 69
            case 'strong':                                                                                 // 70
            case 'button':                                                                                 // 71
            case 'th':                                                                                     // 72
            case 'td':                                                                                     // 73
            case 'title':                                                                                  // 74
            case 'tr':                                                                                     // 75
            element.innerHTML = fixie_fetchWord();                                                         // 76
            break;                                                                                         // 77
                                                                                                           // 78
            case 'header':                                                                                 // 79
            case 'cite':                                                                                   // 80
            case 'caption':                                                                                // 81
            case 'mark':                                                                                   // 82
            case 'q':                                                                                      // 83
            case 's':                                                                                      // 84
            case 'u':                                                                                      // 85
            case 'small':                                                                                  // 86
            case 'span':                                                                                   // 87
            case 'code':                                                                                   // 88
            case 'pre':                                                                                    // 89
            case 'li':                                                                                     // 90
            case 'dt':                                                                                     // 91
            case 'h1':                                                                                     // 92
            case 'h2':                                                                                     // 93
            case 'h3':                                                                                     // 94
            case 'h4':                                                                                     // 95
            case 'h5':                                                                                     // 96
            case 'h6':                                                                                     // 97
            element.innerHTML = fixie_fetchPhrase();                                                       // 98
            break;                                                                                         // 99
                                                                                                           // 100
            case 'footer':                                                                                 // 101
            case 'aside':                                                                                  // 102
            case 'summary':                                                                                // 103
            case 'blockquote':                                                                             // 104
            case 'p':                                                                                      // 105
            element.innerHTML = fixie_fetchParagraph();                                                    // 106
            break;                                                                                         // 107
                                                                                                           // 108
            case 'article':                                                                                // 109
            case 'section':                                                                                // 110
            element.innerHTML = fixie_fetchParagraphs();                                                   // 111
            break;                                                                                         // 112
                                                                                                           // 113
            /* Special cases */                                                                            // 114
            case 'a':                                                                                      // 115
            element.href = 'http://ryhan.me/';                                                             // 116
            element.innerHTML = 'www.' + fixie_fetchWord() + fixie_capitalize(fixie_fetchWord()) + '.com'; // 117
            break;                                                                                         // 118
                                                                                                           // 119
            case 'img':                                                                                    // 120
            var src = element.getAttribute('src') || element.src;                                          // 121
            var temp = element.getAttribute('fixie-temp-img');                                             // 122
            if(src === '' || src === null || temp === true || temp === 'true'){                            // 123
                var width = element.getAttribute('width') || element.width || (element.width = 250);       // 124
                var height = element.getAttribute('height') || element.height || (element.height = 100);   // 125
                var title = element.getAttribute('title') || '';                                           // 126
                element.src = imagePlaceHolder.replace('${w}', width).replace('${h}', height).replace('${text}', title);
                element.setAttribute('fixie-temp-img', true);                                              // 128
            }                                                                                              // 129
            break;                                                                                         // 130
                                                                                                           // 131
            case 'ol':                                                                                     // 132
            case 'ul':                                                                                     // 133
            element.innerHTML = fixie_fetchList();                                                         // 134
            break;                                                                                         // 135
                                                                                                           // 136
            case 'dl':                                                                                     // 137
            element.innerHTML = fixie_fetchDefinitionList();                                               // 138
            break;                                                                                         // 139
                                                                                                           // 140
            case 'hr':                                                                                     // 141
            break;                                                                                         // 142
                                                                                                           // 143
            default:                                                                                       // 144
            element.innerHTML = fixie_fetchSentence();                                                     // 145
        }                                                                                                  // 146
    }                                                                                                      // 147
                                                                                                           // 148
    // Handle an array of elements                                                                         // 149
    function fixie_handle_elements(elements){                                                              // 150
        for (var i = 0; i < elements.length; i++) {                                                        // 151
            fixie_handler(elements[i]);                                                                    // 152
        }                                                                                                  // 153
    }                                                                                                      // 154
                                                                                                           // 155
                                                                                                           // 156
    // Begin generator                                                                                     // 157
    var fixie_wordlibrary = ['I', '8-bit', 'ethical', 'reprehenderit', 'delectus', 'non', 'latte', 'fixie', 'mollit', 'authentic', '1982', 'moon', 'helvetica', 'dreamcatcher', 'esse', 'vinyl', 'nulla', 'Carles', 'bushwick', 'bronson', 'clothesline', 'fin', 'frado', 'jug', 'kale', 'organic', 'local', 'fresh', 'tassel', 'liberal', 'art', 'the', 'of', 'bennie', 'chowder', 'daisy', 'gluten', 'hog', 'capitalism', 'is', 'vegan', 'ut', 'farm-to-table', 'etsy', 'incididunt', 'sunt', 'twee', 'yr', 'before', 'gentrify', 'whatever', 'wes', 'Anderson', 'chillwave', 'dubstep', 'sriracha', 'voluptate', 'pour-over', 'esse', 'trust-fund', 'Pinterest', 'Instagram', 'DSLR', 'vintage', 'dumpster', 'totally', 'selvage', 'gluten-free', 'brooklyn', 'placeat', 'delectus', 'sint', 'magna', 'brony', 'pony', 'party', 'beer', 'shot', 'narwhal', 'salvia', 'letterpress', 'art', 'party', 'street-art', 'seitan', 'anime', 'wayfarers', 'non-ethical', 'viral', 'iphone', 'anim', 'polaroid', 'gastropub', 'city', 'classy', 'original', 'brew'];
                                                                                                           // 159
    function fixie_capitalize(string) {                                                                    // 160
        return string.charAt(0).toUpperCase() + string.slice(1);                                           // 161
    }                                                                                                      // 162
                                                                                                           // 163
    function fixie_fetchWord() {                                                                           // 164
        return fixie_wordlibrary[constrain(0, fixie_wordlibrary.length - 1 )];                             // 165
    }                                                                                                      // 166
                                                                                                           // 167
    function constrain(min, max){                                                                          // 168
     return Math.round(Math.random() * (max - min) + min);                                                 // 169
 }                                                                                                         // 170
                                                                                                           // 171
 function fixie_fetch(min, max, func, join) {                                                              // 172
    join = join || ' ';                                                                                    // 173
    var fixie_length = constrain(min, max);                                                                // 174
    var result = [];                                                                                       // 175
    for (var fixie_i = 0; fixie_i < fixie_length; fixie_i++) {                                             // 176
        result.push(func());                                                                               // 177
    }                                                                                                      // 178
    return fixie_capitalize(result.join(join));                                                            // 179
}                                                                                                          // 180
                                                                                                           // 181
function fetch_suroundWithTag(min, max, func, tagName) {                                                   // 182
    var startTag = '<' + tagName + '>';                                                                    // 183
    var endTag = '</' + tagName + '>';                                                                     // 184
    return startTag + fixie_fetch(min, max, func, endTag + startTag) + endTag;                             // 185
}                                                                                                          // 186
                                                                                                           // 187
function fixie_fetchPhrase() {                                                                             // 188
    return fixie_fetch(3, 5, fixie_fetchWord);                                                             // 189
}                                                                                                          // 190
                                                                                                           // 191
function fixie_fetchSentence() {                                                                           // 192
    return fixie_fetch(4, 9, fixie_fetchWord) + '.';                                                       // 193
}                                                                                                          // 194
                                                                                                           // 195
function fixie_fetchParagraph() {                                                                          // 196
    return fixie_fetch(3, 7, fixie_fetchSentence);                                                         // 197
}                                                                                                          // 198
                                                                                                           // 199
function fixie_fetchParagraphs() {                                                                         // 200
    return fetch_suroundWithTag(3, 7, fixie_fetchParagraph, 'p');                                          // 201
}                                                                                                          // 202
                                                                                                           // 203
function fixie_fetchList() {                                                                               // 204
    return fetch_suroundWithTag(4, 8, fixie_fetchPhrase, 'li');                                            // 205
}                                                                                                          // 206
                                                                                                           // 207
function fixie_fetchDefinitionList() {                                                                     // 208
    var html = '';                                                                                         // 209
    for (var i = 0, l = constrain(3,5); i < l; i++) {                                                      // 210
        html += fetch_suroundWithTag(1, 1, fixie_fetchPhrase, 'dt') + fetch_suroundWithTag(1, 1, fixie_fetchPhrase, 'dd');
    }                                                                                                      // 212
    console.log(html)                                                                                      // 213
    return html;                                                                                           // 214
}                                                                                                          // 215
                                                                                                           // 216
                                                                                                           // 217
                                                                                                           // 218
// Handle all elements with class 'fixie'                                                                  // 219
if (docDefined()) {                                                                                        // 220
    fixie_handle_elements(document.getElementsByClassName('fixie'));                                       // 221
}                                                                                                          // 222
                                                                                                           // 223
// Handle elements which match give css selectors                                                          // 224
                                                                                                           // 225
function init_str(selector_str) {                                                                          // 226
    if (docDefined() && !document.querySelectorAll) {                                                      // 227
        return false;                                                                                      // 228
    }                                                                                                      // 229
    try {                                                                                                  // 230
        fixie_handle_elements(document.querySelectorAll(selector_str));                                    // 231
        return true;                                                                                       // 232
    }                                                                                                      // 233
    catch (err) {                                                                                          // 234
        return false;                                                                                      // 235
    }                                                                                                      // 236
}                                                                                                          // 237
                                                                                                           // 238
var def = function () { return ''; };                                                                      // 239
def = null;                                                                                                // 240
                                                                                                           // 241
return {                                                                                                   // 242
    /* returns true if successful, false otherwise */                                                      // 243
    'init': function() {                                                                                   // 244
        if (selector) {                                                                                    // 245
            init_str(selector);                                                                            // 246
        } else if (docDefined()) {                                                                         // 247
            fixie_handle_elements(document.getElementsByClassName('fixie'));                               // 248
        }                                                                                                  // 249
    },                                                                                                     // 250
    'setImagePlaceholder': function(pl) {                                                                  // 251
        imagePlaceHolder = pl;                                                                             // 252
        return this;                                                                                       // 253
    },                                                                                                     // 254
    'setSelector': function(sl){                                                                           // 255
        if (typeof sl === 'object') {                                                                      // 256
            selector = sl.join(',');                                                                       // 257
        } else if (sl){                                                                                    // 258
            selector = sl;                                                                                 // 259
        }                                                                                                  // 260
        return this;                                                                                       // 261
    },                                                                                                     // 262
    'fetchPhrase': def || fixie_fetchPhrase,                                                               // 263
    'fetchSentence': def || fixie_fetchSentence,                                                           // 264
    'fetchParagraph': def || fixie_fetchParagraph,                                                         // 265
    'fetchParagraphs': def || fixie_fetchParagraphs                                                        // 266
};                                                                                                         // 267
                                                                                                           // 268
})();                                                                                                      // 269
                                                                                                           // 270
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);
