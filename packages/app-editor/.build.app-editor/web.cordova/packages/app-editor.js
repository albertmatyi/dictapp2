(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/app-editor/template.editor.js                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       // 1
Template.__checkName("appEditors");                                                                                    // 2
Template["appEditors"] = new Template("Template.appEditors", (function() {                                             // 3
  var view = this;                                                                                                     // 4
  return Blaze.Each(function() {                                                                                       // 5
    return Spacebars.call(view.lookup("editors"));                                                                     // 6
  }, function() {                                                                                                      // 7
    return [ "\n    ", Spacebars.include(view.lookupTemplate("appEditor")), "\n    " ];                                // 8
  });                                                                                                                  // 9
}));                                                                                                                   // 10
                                                                                                                       // 11
Template.__checkName("appEditor");                                                                                     // 12
Template["appEditor"] = new Template("Template.appEditor", (function() {                                               // 13
  var view = this;                                                                                                     // 14
  return HTML.DIV({                                                                                                    // 15
    "class": "editor-wrapper init"                                                                                     // 16
  }, "\n        ", HTML.FORM({                                                                                         // 17
    "class": "editor"                                                                                                  // 18
  }, "\n            ", HTML.Raw('<div class="header"></div>'), "\n            ", HTML.DIV({                            // 19
    "class": "body"                                                                                                    // 20
  }, "\n                ", Spacebars.include(view.lookupTemplate("appEditorForm")), "\n            "), "\n            ", HTML.DIV({
    "class": "footer"                                                                                                  // 22
  }, "\n                ", HTML.BUTTON({                                                                               // 23
    type: "submit",                                                                                                    // 24
    "class": "btn btn-primary save"                                                                                    // 25
  }, "\n                    ", HTML.Raw('<span class="fa fa-save"></span>'), "\n                    ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("translate"), "editor.save", "Save");                                        // 27
  }), "\n                "), "\n                ", HTML.BUTTON({                                                       // 28
    type: "button",                                                                                                    // 29
    "class": "btn btn-link discard"                                                                                    // 30
  }, "\n                    ", HTML.Raw('<span class="fa fa-times"></span>'), "\n                    ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("translate"), "editor.discard", "Discard");                                  // 32
  }), "\n                "), "\n            "), "\n        "), "\n    ");                                              // 33
}));                                                                                                                   // 34
                                                                                                                       // 35
Template.__checkName("appEditorForm");                                                                                 // 36
Template["appEditorForm"] = new Template("Template.appEditorForm", (function() {                                       // 37
  var view = this;                                                                                                     // 38
  return [ Blaze.If(function() {                                                                                       // 39
    return Spacebars.call(view.lookup("i18nEnabled"));                                                                 // 40
  }, function() {                                                                                                      // 41
    return [ "\n    ", Spacebars.include(view.lookupTemplate("appEditorI18nForm")), "\n    " ];                        // 42
  }), "\n    ", Blaze.Each(function() {                                                                                // 43
    return Spacebars.call(view.lookup("fields"));                                                                      // 44
  }, function() {                                                                                                      // 45
    return [ "\n    ", HTML.DIV({                                                                                      // 46
      "class": function() {                                                                                            // 47
        return [ "app-editor-form-group form-group ", Spacebars.mustache(view.lookup("class")), " ", Spacebars.mustache(view.lookup("name")) ];
      }                                                                                                                // 49
    }, "\n        ", Blaze._TemplateWith(function() {                                                                  // 50
      return {                                                                                                         // 51
        currentContext: Spacebars.call(view.lookup(".")),                                                              // 52
        parentContext: Spacebars.call(view.lookup(".."))                                                               // 53
      };                                                                                                               // 54
    }, function() {                                                                                                    // 55
      return Spacebars.include(view.lookupTemplate("field"));                                                          // 56
    }), "\n    "), "\n    " ];                                                                                         // 57
  }) ];                                                                                                                // 58
}));                                                                                                                   // 59
                                                                                                                       // 60
Template.__checkName("appEditorI18nForm");                                                                             // 61
Template["appEditorI18nForm"] = new Template("Template.appEditorI18nForm", (function() {                               // 62
  var view = this;                                                                                                     // 63
  return [ HTML.UL({                                                                                                   // 64
    "class": "language-tab nav nav-tabs",                                                                              // 65
    role: "tablist"                                                                                                    // 66
  }, "\n        ", Blaze.Each(function() {                                                                             // 67
    return Spacebars.call(view.lookup("languages"));                                                                   // 68
  }, function() {                                                                                                      // 69
    return [ "\n        ", HTML.LI({                                                                                   // 70
      "class": function() {                                                                                            // 71
        return Spacebars.mustache(view.lookup("active"));                                                              // 72
      }                                                                                                                // 73
    }, "\n            ", HTML.A({                                                                                      // 74
      href: function() {                                                                                               // 75
        return [ "#", Spacebars.mustache(view.lookup("panelId"), view.lookup(".."), view.lookup("title")) ];           // 76
      },                                                                                                               // 77
      role: "tab",                                                                                                     // 78
      "data-toggle": "tab"                                                                                             // 79
    }, Blaze.View(function() {                                                                                         // 80
      return Spacebars.mustache(view.lookup("title"));                                                                 // 81
    })), "\n        "), "\n        " ];                                                                                // 82
  }), "\n    "), "\n    ", HTML.DIV({                                                                                  // 83
    "class": "tab-content"                                                                                             // 84
  }, "\n        ", Blaze.Each(function() {                                                                             // 85
    return Spacebars.call(view.lookup("languages"));                                                                   // 86
  }, function() {                                                                                                      // 87
    return [ "\n        ", HTML.DIV({                                                                                  // 88
      "class": function() {                                                                                            // 89
        return [ "tab-pane i18n-editor-tab ", Spacebars.mustache(view.lookup("active")) ];                             // 90
      },                                                                                                               // 91
      id: function() {                                                                                                 // 92
        return Spacebars.mustache(view.lookup("panelId"), view.lookup(".."), view.lookup("title"));                    // 93
      }                                                                                                                // 94
    }, "\n            ", Blaze.Each(function() {                                                                       // 95
      return Spacebars.dataMustache(view.lookup("i18nFields"), view.lookup(".."), view.lookup("title"));               // 96
    }, function() {                                                                                                    // 97
      return [ "\n            ", HTML.DIV({                                                                            // 98
        "class": "form-group"                                                                                          // 99
      }, "\n                ", Blaze._TemplateWith(function() {                                                        // 100
        return {                                                                                                       // 101
          currentContext: Spacebars.call(view.lookup(".")),                                                            // 102
          parentContext: Spacebars.call(view.lookup("..."))                                                            // 103
        };                                                                                                             // 104
      }, function() {                                                                                                  // 105
        return Spacebars.include(view.lookupTemplate("field"));                                                        // 106
      }), "\n            "), "\n            " ];                                                                       // 107
    }), "\n        "), "\n        " ];                                                                                 // 108
  }), "\n    ") ];                                                                                                     // 109
}));                                                                                                                   // 110
                                                                                                                       // 111
Template.__checkName("appEditorArrayWrapper");                                                                         // 112
Template["appEditorArrayWrapper"] = new Template("Template.appEditorArrayWrapper", (function() {                       // 113
  var view = this;                                                                                                     // 114
  return Spacebars.With(function() {                                                                                   // 115
    return Spacebars.call(view.lookup("data"));                                                                        // 116
  }, function() {                                                                                                      // 117
    return [ "\n    ", Spacebars.include(view.lookupTemplate("appEditorArray")), "\n    " ];                           // 118
  });                                                                                                                  // 119
}));                                                                                                                   // 120
                                                                                                                       // 121
Template.__checkName("appEditorArray");                                                                                // 122
Template["appEditorArray"] = new Template("Template.appEditorArray", (function() {                                     // 123
  var view = this;                                                                                                     // 124
  return HTML.DIV({                                                                                                    // 125
    "class": function() {                                                                                              // 126
      return [ "array-wrapper ", Spacebars.mustache(view.lookup("name")), " ", Spacebars.mustache(view.lookup("class")) ];
    }                                                                                                                  // 128
  }, "\n        ", HTML.LABEL({                                                                                        // 129
    "class": function() {                                                                                              // 130
      return Spacebars.mustache(view.lookup("labelClass"));                                                            // 131
    }                                                                                                                  // 132
  }, Blaze.View(function() {                                                                                           // 133
    return Spacebars.mustache(view.lookup("translate"), view.lookup("label"));                                         // 134
  }), "\n            ", HTML.SMALL(Blaze.View(function() {                                                             // 135
    return Spacebars.mustache(view.lookup("hint"));                                                                    // 136
  })), "\n        "), "\n        ", Blaze.Each(function() {                                                            // 137
    return Spacebars.call(view.lookup("data"));                                                                        // 138
  }, function() {                                                                                                      // 139
    return [ "\n        ", HTML.DIV({                                                                                  // 140
      "class": "array-element"                                                                                         // 141
    }, "\n            ", Blaze.Each(function() {                                                                       // 142
      return Spacebars.call(Spacebars.dot(view.lookup(".."), "fields"));                                               // 143
    }, function() {                                                                                                    // 144
      return [ "\n            ", Spacebars.With(function() {                                                           // 145
        return Spacebars.dataMustache(view.lookup("mergedContext"), view.lookup(".."));                                // 146
      }, function() {                                                                                                  // 147
        return [ "\n            ", HTML.DIV({                                                                          // 148
          "class": function() {                                                                                        // 149
            return [ "app-editor-form-group form-group ", Spacebars.mustache(view.lookup("class")), " ", Spacebars.mustache(view.lookup("name")) ];
          }                                                                                                            // 151
        }, "\n                ", Blaze._TemplateWith(function() {                                                      // 152
          return {                                                                                                     // 153
            currentContext: Spacebars.call(view.lookup(".")),                                                          // 154
            parentContext: Spacebars.call(view.lookup("...."))                                                         // 155
          };                                                                                                           // 156
        }, function() {                                                                                                // 157
          return Spacebars.include(view.lookupTemplate("field"));                                                      // 158
        }), "\n            "), "\n            " ];                                                                     // 159
      }), "\n            " ];                                                                                          // 160
    }), "\n        "), "\n        " ];                                                                                 // 161
  }), "\n    ");                                                                                                       // 162
}));                                                                                                                   // 163
                                                                                                                       // 164
Template.__checkName("aet");                                                                                           // 165
Template["aet"] = new Template("Template.aet", (function() {                                                           // 166
  var view = this;                                                                                                     // 167
  return Blaze.Each(function() {                                                                                       // 168
    return Spacebars.call(view.lookup("data"));                                                                        // 169
  }, function() {                                                                                                      // 170
    return [ "\n    ", HTML.LABEL("Name: ", Blaze.View(function() {                                                    // 171
      return Spacebars.mustache(view.lookup("name"));                                                                  // 172
    })), "\n    " ];                                                                                                   // 173
  });                                                                                                                  // 174
}));                                                                                                                   // 175
                                                                                                                       // 176
Template.__checkName("appEditorText");                                                                                 // 177
Template["appEditorText"] = new Template("Template.appEditorText", (function() {                                       // 178
  var view = this;                                                                                                     // 179
  return [ HTML.LABEL({                                                                                                // 180
    "for": function() {                                                                                                // 181
      return [ "editor-", Spacebars.mustache(view.lookup("name")) ];                                                   // 182
    }                                                                                                                  // 183
  }, Blaze.View(function() {                                                                                           // 184
    return Spacebars.mustache(view.lookup("translate"), view.lookup("label"));                                         // 185
  }), "\n        ", HTML.SMALL(Blaze.View(function() {                                                                 // 186
    return Spacebars.mustache(view.lookup("hint"));                                                                    // 187
  })), "\n    "), "\n    ", HTML.INPUT({                                                                               // 188
    type: "text",                                                                                                      // 189
    name: function() {                                                                                                 // 190
      return Spacebars.mustache(view.lookup("name"));                                                                  // 191
    },                                                                                                                 // 192
    id: function() {                                                                                                   // 193
      return [ "editor-", Spacebars.mustache(view.lookup("name")) ];                                                   // 194
    },                                                                                                                 // 195
    "class": function() {                                                                                              // 196
      return [ "form-control ", Spacebars.mustache(view.lookup("name")) ];                                             // 197
    },                                                                                                                 // 198
    value: function() {                                                                                                // 199
      return Spacebars.mustache(view.lookup("value"));                                                                 // 200
    },                                                                                                                 // 201
    placeholder: function() {                                                                                          // 202
      return Spacebars.mustache(view.lookup("placeholder"));                                                           // 203
    }                                                                                                                  // 204
  }) ];                                                                                                                // 205
}));                                                                                                                   // 206
                                                                                                                       // 207
Template.__checkName("appEditorTextarea");                                                                             // 208
Template["appEditorTextarea"] = new Template("Template.appEditorTextarea", (function() {                               // 209
  var view = this;                                                                                                     // 210
  return [ HTML.LABEL({                                                                                                // 211
    "for": function() {                                                                                                // 212
      return [ "editor-", Spacebars.mustache(view.lookup("name")) ];                                                   // 213
    }                                                                                                                  // 214
  }, Blaze.View(function() {                                                                                           // 215
    return Spacebars.mustache(view.lookup("translate"), view.lookup("label"));                                         // 216
  }), "\n        ", HTML.SMALL(Blaze.View(function() {                                                                 // 217
    return Spacebars.mustache(view.lookup("hint"));                                                                    // 218
  })), "\n    "), "\n    ", HTML.TEXTAREA({                                                                            // 219
    name: function() {                                                                                                 // 220
      return Spacebars.mustache(view.lookup("name"));                                                                  // 221
    },                                                                                                                 // 222
    id: function() {                                                                                                   // 223
      return [ "editor-", Spacebars.mustache(view.lookup("name")) ];                                                   // 224
    },                                                                                                                 // 225
    "class": function() {                                                                                              // 226
      return [ "form-control ", Spacebars.mustache(view.lookup("name")) ];                                             // 227
    },                                                                                                                 // 228
    value: function() {                                                                                                // 229
      return Spacebars.mustache(view.lookup("value"));                                                                 // 230
    }                                                                                                                  // 231
  }) ];                                                                                                                // 232
}));                                                                                                                   // 233
                                                                                                                       // 234
Template.__checkName("appEditorFile");                                                                                 // 235
Template["appEditorFile"] = new Template("Template.appEditorFile", (function() {                                       // 236
  var view = this;                                                                                                     // 237
  return [ HTML.LABEL({                                                                                                // 238
    "for": function() {                                                                                                // 239
      return [ "editor-", Spacebars.mustache(view.lookup("name")) ];                                                   // 240
    }                                                                                                                  // 241
  }, Blaze.View(function() {                                                                                           // 242
    return Spacebars.mustache(view.lookup("translate"), view.lookup("label"));                                         // 243
  }), "\n        ", HTML.SMALL(Blaze.View(function() {                                                                 // 244
    return Spacebars.mustache(view.lookup("hint"));                                                                    // 245
  })), "\n    "), "\n    ", HTML.INPUT({                                                                               // 246
    type: "file",                                                                                                      // 247
    name: function() {                                                                                                 // 248
      return Spacebars.mustache(view.lookup("name"));                                                                  // 249
    },                                                                                                                 // 250
    id: function() {                                                                                                   // 251
      return [ "editor-", Spacebars.mustache(view.lookup("name")) ];                                                   // 252
    },                                                                                                                 // 253
    "class": function() {                                                                                              // 254
      return [ "form-control ", Spacebars.mustache(view.lookup("name")) ];                                             // 255
    },                                                                                                                 // 256
    value: ""                                                                                                          // 257
  }) ];                                                                                                                // 258
}));                                                                                                                   // 259
                                                                                                                       // 260
Template.__checkName("appEditorHidden");                                                                               // 261
Template["appEditorHidden"] = new Template("Template.appEditorHidden", (function() {                                   // 262
  var view = this;                                                                                                     // 263
  return HTML.INPUT({                                                                                                  // 264
    type: "hidden",                                                                                                    // 265
    name: function() {                                                                                                 // 266
      return Spacebars.mustache(view.lookup("name"));                                                                  // 267
    },                                                                                                                 // 268
    id: function() {                                                                                                   // 269
      return [ "editor-", Spacebars.mustache(view.lookup("name")) ];                                                   // 270
    },                                                                                                                 // 271
    "class": function() {                                                                                              // 272
      return [ "form-control ", Spacebars.mustache(view.lookup("name")) ];                                             // 273
    },                                                                                                                 // 274
    value: function() {                                                                                                // 275
      return Spacebars.mustache(view.lookup("value"));                                                                 // 276
    }                                                                                                                  // 277
  });                                                                                                                  // 278
}));                                                                                                                   // 279
                                                                                                                       // 280
Template.__checkName("appEditorPlaceholder");                                                                          // 281
Template["appEditorPlaceholder"] = new Template("Template.appEditorPlaceholder", (function() {                         // 282
  var view = this;                                                                                                     // 283
  return HTML.DIV({                                                                                                    // 284
    "class": function() {                                                                                              // 285
      return [ Spacebars.mustache(view.lookup("class")), " ", Spacebars.mustache(view.lookup("name")) ];               // 286
    }                                                                                                                  // 287
  });                                                                                                                  // 288
}));                                                                                                                   // 289
                                                                                                                       // 290
Template.__checkName("appEditorCheckbox");                                                                             // 291
Template["appEditorCheckbox"] = new Template("Template.appEditorCheckbox", (function() {                               // 292
  var view = this;                                                                                                     // 293
  return HTML.LABEL({                                                                                                  // 294
    "for": function() {                                                                                                // 295
      return [ "editor-", Spacebars.mustache(view.lookup("name")) ];                                                   // 296
    }                                                                                                                  // 297
  }, "\n        ", HTML.INPUT(HTML.Attrs({                                                                             // 298
    type: "checkbox",                                                                                                  // 299
    "class": function() {                                                                                              // 300
      return Spacebars.mustache(view.lookup("name"));                                                                  // 301
    },                                                                                                                 // 302
    name: function() {                                                                                                 // 303
      return Spacebars.mustache(view.lookup("name"));                                                                  // 304
    },                                                                                                                 // 305
    id: function() {                                                                                                   // 306
      return [ "editor-", Spacebars.mustache(view.lookup("name")) ];                                                   // 307
    }                                                                                                                  // 308
  }, function() {                                                                                                      // 309
    return Spacebars.attrMustache(view.lookup("checked"));                                                             // 310
  })), "\n        ", Blaze.View(function() {                                                                           // 311
    return Spacebars.mustache(view.lookup("translate"), view.lookup("label"));                                         // 312
  }), "\n        ", HTML.SMALL(Blaze.View(function() {                                                                 // 313
    return Spacebars.mustache(view.lookup("hint"));                                                                    // 314
  })), "\n    ");                                                                                                      // 315
}));                                                                                                                   // 316
                                                                                                                       // 317
Template.__checkName("appEditorSelect");                                                                               // 318
Template["appEditorSelect"] = new Template("Template.appEditorSelect", (function() {                                   // 319
  var view = this;                                                                                                     // 320
  return [ HTML.LABEL({                                                                                                // 321
    "for": function() {                                                                                                // 322
      return [ "editor-", Spacebars.mustache(view.lookup("name")) ];                                                   // 323
    }                                                                                                                  // 324
  }, Blaze.View(function() {                                                                                           // 325
    return Spacebars.mustache(view.lookup("translate"), view.lookup("label"));                                         // 326
  }), "\n        ", HTML.SMALL(Blaze.View(function() {                                                                 // 327
    return Spacebars.mustache(view.lookup("hint"));                                                                    // 328
  })), "\n    "), "\n    ", HTML.SELECT({                                                                              // 329
    name: function() {                                                                                                 // 330
      return Spacebars.mustache(view.lookup("name"));                                                                  // 331
    },                                                                                                                 // 332
    id: function() {                                                                                                   // 333
      return [ "editor-", Spacebars.mustache(view.lookup("name")) ];                                                   // 334
    },                                                                                                                 // 335
    "class": function() {                                                                                              // 336
      return [ "form-control ", Spacebars.mustache(view.lookup("name")) ];                                             // 337
    }                                                                                                                  // 338
  }, "\n        ", Blaze.Each(function() {                                                                             // 339
    return Spacebars.call(view.lookup("options"));                                                                     // 340
  }, function() {                                                                                                      // 341
    return [ "\n        ", HTML.OPTION(HTML.Attrs({                                                                    // 342
      value: function() {                                                                                              // 343
        return Spacebars.mustache(view.lookup("value"));                                                               // 344
      }                                                                                                                // 345
    }, function() {                                                                                                    // 346
      return Spacebars.attrMustache(view.lookup("selected"));                                                          // 347
    }), Blaze.View(function() {                                                                                        // 348
      return Spacebars.mustache(view.lookup("name"));                                                                  // 349
    })), "\n        " ];                                                                                               // 350
  }), "\n    ") ];                                                                                                     // 351
}));                                                                                                                   // 352
                                                                                                                       // 353
Template.__checkName("appEditorButton");                                                                               // 354
Template["appEditorButton"] = new Template("Template.appEditorButton", (function() {                                   // 355
  var view = this;                                                                                                     // 356
  return HTML.BUTTON({                                                                                                 // 357
    "class": function() {                                                                                              // 358
      return [ "btn btn-", Spacebars.mustache(view.lookup("btnType")), " ", Spacebars.mustache(view.lookup("name")) ]; // 359
    }                                                                                                                  // 360
  }, "\n    ", Spacebars.With(function() {                                                                             // 361
    return Spacebars.call(view.lookup("icon"));                                                                        // 362
  }, function() {                                                                                                      // 363
    return [ "\n    ", HTML.SPAN({                                                                                     // 364
      "class": function() {                                                                                            // 365
        return [ "fa fa-", Spacebars.mustache(view.lookup(".")) ];                                                     // 366
      }                                                                                                                // 367
    }), "\n    " ];                                                                                                    // 368
  }), "\n    ", Blaze.View(function() {                                                                                // 369
    return Spacebars.mustache(view.lookup("translate"), view.lookup("label"));                                         // 370
  }), "\n    ");                                                                                                       // 371
}));                                                                                                                   // 372
                                                                                                                       // 373
Template.__checkName("appEditorSeparator");                                                                            // 374
Template["appEditorSeparator"] = new Template("Template.appEditorSeparator", (function() {                             // 375
  var view = this;                                                                                                     // 376
  return HTML.Raw("<hr>");                                                                                             // 377
}));                                                                                                                   // 378
                                                                                                                       // 379
Template.__checkName("appEditorInvalid");                                                                              // 380
Template["appEditorInvalid"] = new Template("Template.appEditorInvalid", (function() {                                 // 381
  var view = this;                                                                                                     // 382
  return [ "Invalid template for ", Blaze.View(function() {                                                            // 383
    return Spacebars.mustache(view.lookup("type"));                                                                    // 384
  }) ];                                                                                                                // 385
}));                                                                                                                   // 386
                                                                                                                       // 387
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/app-editor/editor.js                                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var EditorCollection = new Meteor.Collection(null);                                                                    // 1
                                                                                                                       // 2
var capitalize = function(str) {                                                                                       // 3
    return str[0].toUpperCase() + str.slice(1);                                                                        // 4
};                                                                                                                     // 5
                                                                                                                       // 6
var defaultFieldOptions = {                                                                                            // 7
    'name': 'fieldName', // defauls to field key                                                                       // 8
    'type': 'text', // textarea, select, radio, checkbox. Default: 'text'                                              // 9
    'options': null, // object with k-v pairs or simple [] (data provider for select/radio/checkbox)                   // 10
    'label': 'Field label', // defaults to capitalized field name,                                                     // 11
    'default': null, // default value when no value object is provided                                                 // 12
    'post': function(v) {                                                                                              // 13
        return v;                                                                                                      // 14
    }, // method executed after data retrieval                                                                         // 15
    'render': function() {                                                                                             // 16
        return true;                                                                                                   // 17
    } // method executed to check if field has to be rendered                                                          // 18
};                                                                                                                     // 19
                                                                                                                       // 20
var logobj = function(obj) {                                                                                           // 21
    if (typeof console !== 'undefined') {                                                                              // 22
        console.log(obj);                                                                                              // 23
    }                                                                                                                  // 24
};                                                                                                                     // 25
                                                                                                                       // 26
var defaultOptions = {                                                                                                 // 27
    'fields': { // should be overwritten when using, this is a sample cfg                                              // 28
        'fieldName0': defaultFieldOptions                                                                              // 29
        /* ... */                                                                                                      // 30
    },                                                                                                                 // 31
    'data': {}, // some object to populate the fields                                                                  // 32
    'save': logobj, // callback for when save is pressed                                                               // 33
    'discard': logobj, // callback for when cancel / close is pressed                                                  // 34
    '_type': 'editor'                                                                                                  // 35
};                                                                                                                     // 36
                                                                                                                       // 37
Template.appEditors.helpers({                                                                                          // 38
    editors: function() {                                                                                              // 39
        return EditorCollection.find();                                                                                // 40
    }                                                                                                                  // 41
});                                                                                                                    // 42
                                                                                                                       // 43
// converts ['a','b','c'] =to=> {'a':'a', 'b':'b', 'c':'c'}                                                            // 44
var remapOptions = function(e, key) {                                                                                  // 45
    return {                                                                                                           // 46
        value: typeof key === 'number' ? e : key,                                                                      // 47
        name: e                                                                                                        // 48
    };                                                                                                                 // 49
};                                                                                                                     // 50
                                                                                                                       // 51
var rebuildField = function(field, fieldName, data) {                                                                  // 52
    data = data || {};                                                                                                 // 53
    field['default'] = _.isFunction(field['default']) ? field['default']() : field['default'];                         // 54
    var calcdOpts = {                                                                                                  // 55
        name: fieldName,                                                                                               // 56
        label: capitalize(fieldName),                                                                                  // 57
        value: _.isUndefined(data[fieldName]) ? field['default'] : data[fieldName]                                     // 58
    };                                                                                                                 // 59
    if (typeof field === 'object') {                                                                                   // 60
        field = $.extend({}, defaultFieldOptions, calcdOpts, field);                                                   // 61
        field.label = App.strf(field.label) || fieldName;                                                              // 62
        field.options = _.map(field.options, remapOptions);                                                            // 63
    } else {                                                                                                           // 64
        field = $.extend({}, defaultFieldOptions, calcdOpts);                                                          // 65
    }                                                                                                                  // 66
    return field;                                                                                                      // 67
};                                                                                                                     // 68
                                                                                                                       // 69
var buildFieldArr; // because of jshint                                                                                // 70
                                                                                                                       // 71
var rebuildArrayField = function(field, fieldName, data) {                                                             // 72
    field = _.extend({}, field);                                                                                       // 73
    field.fields = buildFieldArr(field.fields);                                                                        // 74
    field.name = field.name || fieldName;                                                                              // 75
    field.post = field.post || defaultFieldOptions.post;                                                               // 76
    field.label = App.strf(field.label) || fieldName;                                                                  // 77
    field.data = _.map(data[fieldName], function(el, idx) {                                                            // 78
        el.idx = idx;                                                                                                  // 79
        return el;                                                                                                     // 80
    });                                                                                                                // 81
    return field;                                                                                                      // 82
};                                                                                                                     // 83
                                                                                                                       // 84
buildFieldArr = function(fields, data) {                                                                               // 85
    var fieldArr = [];                                                                                                 // 86
    data = data || {};                                                                                                 // 87
    for (var fieldName in fields) {                                                                                    // 88
        if (fields.hasOwnProperty(fieldName)) {                                                                        // 89
            var field = fields[fieldName];                                                                             // 90
            if (field.type === 'array') {                                                                              // 91
                field = rebuildArrayField(field, fieldName, data);                                                     // 92
            } else {                                                                                                   // 93
                field = rebuildField(field, fieldName, data);                                                          // 94
            }                                                                                                          // 95
            fieldArr.push(field);                                                                                      // 96
        }                                                                                                              // 97
    }                                                                                                                  // 98
    return fieldArr;                                                                                                   // 99
};                                                                                                                     // 100
                                                                                                                       // 101
var setupI18nOptions = function(options) {                                                                             // 102
    options.i18nEnabled = true;                                                                                        // 103
    var langs = App.i18n.getLanguages();                                                                               // 104
    options.languages = _.map(langs, function(e) {                                                                     // 105
        return {                                                                                                       // 106
            title: e                                                                                                   // 107
        };                                                                                                             // 108
    });                                                                                                                // 109
    options.i18nFields = {};                                                                                           // 110
    var defaultLanguage = App.i18n.getDefaultLanguage();                                                               // 111
    _.each(langs, function(lang) {                                                                                     // 112
        var data = options.data;                                                                                       // 113
        if (defaultLanguage !== lang) {                                                                                // 114
            data = options.data.i18n ? options.data.i18n[lang] : {};                                                   // 115
        }                                                                                                              // 116
        var fields = buildFieldArr(options.fields.i18n, data);                                                         // 117
        if (defaultLanguage !== lang) {                                                                                // 118
            _.each(fields, function(field) {                                                                           // 119
                field.name = field.name + '-' + lang;                                                                  // 120
            });                                                                                                        // 121
        }                                                                                                              // 122
        options.i18nFields[lang] = fields;                                                                             // 123
    });                                                                                                                // 124
                                                                                                                       // 125
    options.fields = $.extend({}, options.fields);                                                                     // 126
    delete options.fields.i18n;                                                                                        // 127
};                                                                                                                     // 128
                                                                                                                       // 129
var setupOptions = function(options) {                                                                                 // 130
    options = $.extend({}, defaultOptions, options);                                                                   // 131
    if (options.fields.i18n) {                                                                                         // 132
        if (App.i18n.isActive()) {                                                                                     // 133
            setupI18nOptions(options);                                                                                 // 134
        } else {                                                                                                       // 135
            options.fields = _.extend({}, options.fields.i18n, options.fields);                                        // 136
            delete options.fields.i18n;                                                                                // 137
        }                                                                                                              // 138
    }                                                                                                                  // 139
    var fieldArr = buildFieldArr(options.fields, options.data);                                                        // 140
    options.fields = fieldArr;                                                                                         // 141
    return options;                                                                                                    // 142
};                                                                                                                     // 143
                                                                                                                       // 144
var fieldRendered = function() {                                                                                       // 145
    var self = this;                                                                                                   // 146
                                                                                                                       // 147
    _.each(self.data.events, function(handler, eventName) {                                                            // 148
        $(self.find('.' + self.data.name)).on(eventName, function(e) {                                                 // 149
            handler.call(self.data, e);                                                                                // 150
        });                                                                                                            // 151
    });                                                                                                                // 152
};                                                                                                                     // 153
                                                                                                                       // 154
var fieldHelper = function() {                                                                                         // 155
    _.extend(this, this.currentContext);                                                                               // 156
    delete this.currentContext;                                                                                        // 157
    // console.log(this);                                                                                              // 158
    var tplt;                                                                                                          // 159
    var templateName = ('appEditor' + capitalize(this.type));                                                          // 160
    if (Template[templateName]) {                                                                                      // 161
        tplt = Template[templateName];                                                                                 // 162
    } else {                                                                                                           // 163
        tplt = Template.appEditorInvalid;                                                                              // 164
    }                                                                                                                  // 165
    tplt.rendered = tplt.rendered || fieldRendered;                                                                    // 166
    return tplt;                                                                                                       // 167
};                                                                                                                     // 168
Template.appEditorForm.helpers({                                                                                       // 169
    field: fieldHelper                                                                                                 // 170
});                                                                                                                    // 171
Template.appEditorArray.helpers({                                                                                      // 172
    field: fieldHelper,                                                                                                // 173
    mergedContext: function(data) {                                                                                    // 174
        // console.log(this, data);                                                                                    // 175
        this.value = _.isUndefined(data[this.name]) ? this['default'] : data[this.name];                               // 176
        this.idx = data.idx;                                                                                           // 177
        return this;                                                                                                   // 178
    }                                                                                                                  // 179
});                                                                                                                    // 180
                                                                                                                       // 181
Template.appEditorI18nForm.helpers({                                                                                   // 182
    field: fieldHelper,                                                                                                // 183
    active: function() {                                                                                               // 184
        return this.title === App.i18n.getDefaultLanguage() ? 'active' : '';                                           // 185
    },                                                                                                                 // 186
    i18nFields: function(options, language) {                                                                          // 187
        return options.i18nFields[language];                                                                           // 188
    },                                                                                                                 // 189
    panelId: function(options, language) {                                                                             // 190
        return 'editor_' + options._id + '_' + language;                                                               // 191
    }                                                                                                                  // 192
});                                                                                                                    // 193
                                                                                                                       // 194
Template.appEditorSelect.selected = function(selection) {                                                              // 195
    return this.value === selection ? 'selected="selected"' : '';                                                      // 196
};                                                                                                                     // 197
                                                                                                                       // 198
Template.appEditorCheckbox.checked = function() {                                                                      // 199
    return this.value ? {                                                                                              // 200
        checked: 'checked'                                                                                             // 201
    } : '';                                                                                                            // 202
};                                                                                                                     // 203
                                                                                                                       // 204
var $fieldForName = function(name, $ctx) {                                                                             // 205
    var selector = '.' + name.replace(/\./gi, '\\.');                                                                  // 206
    selector += ':not(div)';                                                                                           // 207
    var $el = $(selector, $ctx);                                                                                       // 208
    return $el;                                                                                                        // 209
};                                                                                                                     // 210
                                                                                                                       // 211
var collectData; // because jshint                                                                                     // 212
                                                                                                                       // 213
var collectArrayData = function(field, $ctx) {                                                                         // 214
    var data = [];                                                                                                     // 215
    $ctx = $ctx.find('.array-wrapper.' + field.name);                                                                  // 216
    $ctx.find('.array-element').each(function() {                                                                      // 217
        var $lctxt = $(this);                                                                                          // 218
        var elData = collectData(field.fields, $lctxt);                                                                // 219
        data.push(elData);                                                                                             // 220
    });                                                                                                                // 221
    // collectData(field.fields, $ctx.find('array-wrapper ' + field.name));                                            // 222
    return data;                                                                                                       // 223
};                                                                                                                     // 224
                                                                                                                       // 225
collectData = function(fields, $ctx, i18nSuffixToRemove) {                                                             // 226
    var data = {};                                                                                                     // 227
    for (var i = 0; i < fields.length; i++) {                                                                          // 228
        var field = fields[i];                                                                                         // 229
        var val;                                                                                                       // 230
        switch (field.type) {                                                                                          // 231
            case 'file':                                                                                               // 232
                var files = $fieldForName(field.name)[0].files;                                                        // 233
                val = files.length > 0 ? files[0] : null;                                                              // 234
                break;                                                                                                 // 235
            case 'checkbox':                                                                                           // 236
                val = $fieldForName(field.name, $ctx).prop('checked');                                                 // 237
                break;                                                                                                 // 238
            case 'array':                                                                                              // 239
                val = collectArrayData(field, $ctx);                                                                   // 240
                break;                                                                                                 // 241
            case 'button':                                                                                             // 242
                continue;                                                                                              // 243
            default:                                                                                                   // 244
                val = $fieldForName(field.name, $ctx).val();                                                           // 245
                break;                                                                                                 // 246
        }                                                                                                              // 247
        var fieldName = field.name;                                                                                    // 248
        if (i18nSuffixToRemove) {                                                                                      // 249
            fieldName = fieldName.replace(new RegExp(i18nSuffixToRemove + '$'), '');                                   // 250
        }                                                                                                              // 251
        data[fieldName] = field.post(val);                                                                             // 252
    }                                                                                                                  // 253
    return data;                                                                                                       // 254
};                                                                                                                     // 255
                                                                                                                       // 256
var collectI18nData = function(collectedData, options, $ctx) {                                                         // 257
    if (!App.i18n.isActive()) {                                                                                        // 258
        return;                                                                                                        // 259
    }                                                                                                                  // 260
    var data = {};                                                                                                     // 261
    var langs = App.i18n.getLanguages();                                                                               // 262
    var defaultLanguage = App.i18n.getDefaultLanguage();                                                               // 263
    _.each(langs, function(lang) {                                                                                     // 264
        var dt;                                                                                                        // 265
        if (lang === defaultLanguage) {                                                                                // 266
            dt = collectData(options.i18nFields[lang], $ctx);                                                          // 267
            _.extend(collectedData, dt);                                                                               // 268
        } else {                                                                                                       // 269
            dt = collectData(options.i18nFields[lang], $ctx, '-' + lang);                                              // 270
            data[lang] = dt;                                                                                           // 271
        }                                                                                                              // 272
    });                                                                                                                // 273
    return data;                                                                                                       // 274
};                                                                                                                     // 275
                                                                                                                       // 276
var hideAnd = function(actionName, options, $ctx) {                                                                    // 277
    var collectedData = collectData(options.fields, $ctx);                                                             // 278
    collectedData.i18n = collectI18nData(collectedData, options, $ctx);                                                // 279
    options[actionName](collectedData, options.data);                                                                  // 280
    $ctx.addClass('init');                                                                                             // 281
    setTimeout(function() {                                                                                            // 282
        EditorCollection.remove(options._id);                                                                          // 283
    }, 500);                                                                                                           // 284
};                                                                                                                     // 285
                                                                                                                       // 286
Template.appEditor.events({                                                                                            // 287
    'submit form': function(e) {                                                                                       // 288
        e.preventDefault();                                                                                            // 289
        var $ctx = $(e.currentTarget).parents('.editor-wrapper');                                                      // 290
        hideAnd('save', this, $ctx);                                                                                   // 291
    },                                                                                                                 // 292
    'click .discard': function(e) {                                                                                    // 293
        e.preventDefault();                                                                                            // 294
        var $ctx = $(e.currentTarget).parents('.editor-wrapper');                                                      // 295
        hideAnd('discard', this, $ctx);                                                                                // 296
    }                                                                                                                  // 297
});                                                                                                                    // 298
                                                                                                                       // 299
Template.appEditor.rendered = function() {                                                                             // 300
    var $el = $(this.firstNode);                                                                                       // 301
    setTimeout(function() {                                                                                            // 302
        $el.removeClass('init');                                                                                       // 303
    });                                                                                                                // 304
};                                                                                                                     // 305
                                                                                                                       // 306
App.component('editor').expose({                                                                                       // 307
    edit: function(options) {                                                                                          // 308
        options = setupOptions(options);                                                                               // 309
        EditorCollection.insert(options);                                                                              // 310
    },                                                                                                                 // 311
    buildFieldArr: buildFieldArr,                                                                                      // 312
    collectData: collectData                                                                                           // 313
});                                                                                                                    // 314
                                                                                                                       // 315
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);
