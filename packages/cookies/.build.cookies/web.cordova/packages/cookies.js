(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/cookies/cookie.js                                                                                 //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
Cookie = {};                                                                                                  // 1
                                                                                                              // 2
Cookie._deps = {};                                                                                            // 3
Cookie._dep = new Deps.Dependency();                                                                          // 4
                                                                                                              // 5
                                                                                                              // 6
                                                                                                              // 7
Cookie.get = function(name) {                                                                                 // 8
  var _dep = Cookie._deps[name];                                                                              // 9
  if(!_dep) {                                                                                                 // 10
    Cookie._deps[name] = new Deps.Dependency();                                                               // 11
    _dep = Cookie._deps[name];                                                                                // 12
  }                                                                                                           // 13
  _dep.depend();                                                                                              // 14
                                                                                                              // 15
  var fullCookie = document.cookie;                                                                           // 16
                                                                                                              // 17
  var startIndex = fullCookie.indexOf(name + '=');                                                            // 18
  if (startIndex === -1) return null;    /* named cookie not found */                                         // 19
                                                                                                              // 20
  startIndex = fullCookie.indexOf('=', startIndex) + 1;                                                       // 21
  var endIndex = fullCookie.indexOf(';', startIndex);                                                         // 22
  if (endIndex === -1) endIndex = fullCookie.length;                                                          // 23
                                                                                                              // 24
  return unescape(fullCookie.substring(startIndex,endIndex));                                                 // 25
};                                                                                                            // 26
                                                                                                              // 27
                                                                                                              // 28
                                                                                                              // 29
Cookie.set = function(name, value, duration) {                                                                // 30
                                                                                                              // 31
  var expireTime = new Date().getTime();                                                                      // 32
  if(duration) {                                                                                              // 33
    if(duration.seconds) expireTime += duration.seconds * 1000;                                               // 34
    if(duration.minutes) expireTime += duration.minutes * 1000 * 60;                                          // 35
    if(duration.hours) expireTime += duration.hours * 1000 * 60 * 60;                                         // 36
    if(duration.days) expireTime += duration.days * 1000 * 60 * 60 * 24;                                      // 37
    if(duration.months) expireTime += duration.months * 1000 * 60 * 60 * 30;                                  // 38
    if(duration.years) expireTime += duration.years * 1000 * 60 * 60 * 24 * 366;                              // 39
    if(duration.clear) expireTime = 0;                                                                        // 40
  } else {                                                                                                    // 41
    expireTime += 366 * 24 * 60 * 60 * 1000;                                                                  // 42
  }                                                                                                           // 43
                                                                                                              // 44
  var str = '' + name + '=' + escape(value) + '; expires=' + new Date(expireTime).toUTCString() + '; path=/'; // 45
  document.cookie = str;                                                                                      // 46
                                                                                                              // 47
  var _dep = Cookie._deps[name];                                                                              // 48
  if(!_dep) {                                                                                                 // 49
    Cookie._deps[name] = new Deps.Dependency();                                                               // 50
    _dep = Cookie._deps[name];                                                                                // 51
  }                                                                                                           // 52
  _dep.changed();                                                                                             // 53
  Cookie._dep.changed();                                                                                      // 54
};                                                                                                            // 55
                                                                                                              // 56
                                                                                                              // 57
Cookie.list = function() {                                                                                    // 58
  Cookie._dep.depend();                                                                                       // 59
                                                                                                              // 60
  var str = document.cookie;                                                                                  // 61
  var arr = str.split(';');                                                                                   // 62
  var list = [];                                                                                              // 63
  for(var i in arr) {                                                                                         // 64
    var index = arr[i].indexOf('=');                                                                          // 65
    list.push(arr[i].substring(0, index).replace(/^ +/, '').replace(/ +$/, ''));                              // 66
  }                                                                                                           // 67
  return list;                                                                                                // 68
};                                                                                                            // 69
                                                                                                              // 70
                                                                                                              // 71
Cookie.clear = function(name) {                                                                               // 72
  Cookie.set(name, null, {clear: true});                                                                      // 73
};                                                                                                            // 74
                                                                                                              // 75
                                                                                                              // 76
                                                                                                              // 77
Cookie.clearAll = function() {                                                                                // 78
  var str = document.cookie;                                                                                  // 79
  var arr = str.split(';');                                                                                   // 80
  var list = [];                                                                                              // 81
  for(var i in arr) {                                                                                         // 82
    var index = arr[i].indexOf('=');                                                                          // 83
    list.push(arr[i].substring(0, index).replace(/^ +/, '').replace(/ +$/, ''));                              // 84
  }                                                                                                           // 85
                                                                                                              // 86
  for(var i in list) {                                                                                        // 87
    Cookie.clear(list[i]);                                                                                    // 88
  }                                                                                                           // 89
  Cookie._dep.changed();                                                                                      // 90
};                                                                                                            // 91
                                                                                                              // 92
                                                                                                              // 93
                                                                                                              // 94
                                                                                                              // 95
                                                                                                              // 96
                                                                                                              // 97
                                                                                                              // 98
                                                                                                              // 99
                                                                                                              // 100
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);
