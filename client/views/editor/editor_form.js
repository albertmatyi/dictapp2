var SHORT_CLASS = 'short col-sm-3';

var LEFT_FIELDS = {
	wordLeft: {
		'class': 'col-xs-12',
		placeholder: 'acţiun'
	},
	endingLeft: {
		'class': SHORT_CLASS,
		placeholder: 'e -i'
	},
	typeLeft: {
		'class': SHORT_CLASS,
		placeholder: 's fn'
	},
	senses: {
		type: 'array',
		fields: {
			phrase: {
				'class': 'col-xs-12',
				placeholder: 'Acţiune pauliană (acţiune revocatorie)'
			},
			description: {
				'class': 'col-xs-12',
				placeholder: 'Este acea acţiune prin care creditorul atacă actul de înstrăinare a bunului de către debitor, dacă acesta din urmă îşi are intenţia de a-l înşela sau de a ocoli pe creditor.'
			},
			example: {
				'class': 'col-xs-12',
				placeholder: '...'
			},
			removeSense: {
				type: 'button',
				btnType: 'link',
				events: {
					click: function(e) {
						$(e.currentTarget).parents('.array-element').remove();
					}
				}
			}
		}
	},
	addSense: {
		'class': 'col-xs-12',
		type: 'button',
		btnType: 'success',
		events: {
			click: function(e) {
				var data = {
					fields: this.parentContext.fields[3].fields,
					data: [{}]
				};
				var $nextEl = $(e.currentTarget).parent()[0];
				var comp = UI.renderWithData(Template.appEditorArrayWrapper, data);
				// var comp = UI.renderWithData(Template.aet, data);
				UI.insert(comp, $('.editor-left-side .row')[0],$nextEl);
			}
		}
	}
};
var SHORT_CLASS = 'short col-sm-3';

var RIGHT_FIELDS = {
	wordRight: {
		'class': 'col-xs-12',
		placeholder: 'cselekvés, tett'
	},
	alternatives: {
		type: 'array',
		fields: {
			category: {
				'class': SHORT_CLASS.replace('3', '4'),
				placeholder: 'fiz.'
			},
			meaning: {
				'class': SHORT_CLASS.replace('3', '4'),
				placeholder: 'vegyhatás'
			},
			removeAlternative: {
				type: 'button',
				btnType: 'link',
				// 'class': SHORT_CLASS,
				events: {
					click: function(e) {
						$(e.currentTarget).parents('.array-element').remove();
					}
				}
			}
		}
	},
	addAlternative: {
		'class': 'col-xs-12',
		type: 'button',
		btnType: 'success',
		events: {
			click: function(e) {
				var data = {
					fields: this.parentContext.fields[1].fields,
					data: [{}]
				};
				var $nextEl = $(e.currentTarget).parent()[0];
				var comp = UI.renderWithData(Template.appEditorArrayWrapper, data);
				// var comp = UI.renderWithData(Template.aet, data);
				UI.insert(comp, $('.editor-right-side .row')[0],$nextEl);
			}
		}
	},
	senses: {
		type: 'array',
		fields: {
			phrase: {
				'class': 'col-xs-12',
				placeholder: 'Acţiune pauliană (acţiune revocatorie)'
			},
			description: {
				'class': 'col-xs-12',
				placeholder: 'Este acea acţiune prin care creditorul atacă actul de înstrăinare a bunului de către debitor, dacă acesta din urmă îşi are intenţia de a-l înşela sau de a ocoli pe creditor.'
			},
			example: {
				'class': 'col-xs-12',
				placeholder: '...'
			},
			removeSense: {
				type: 'button',
				btnType: 'link',
				events: {
					click: function(e) {
						$(e.currentTarget).parents('.array-element').remove();
					}
				}
			}
		}
	},
	addSense: {
		'class': 'col-xs-12',
		type: 'button',
		btnType: 'success',
		events: {
			click: function(e) {
				var data = {
					fields: this.parentContext.fields[3].fields,
					data: [{}]
				};
				var $nextEl = $(e.currentTarget).parent()[0];
				var comp = UI.renderWithData(Template.appEditorArrayWrapper, data);
				// var comp = UI.renderWithData(Template.aet, data);
				UI.insert(comp, $('.editor-left-side .row')[0],$nextEl);
			}
		}
	}
};


var buildLeftFormData = function(data) {
	var fields = _.extend({}, LEFT_FIELDS);
	fields = App.editor.buildFieldArr(fields, data);
	return {
		fields: fields,
		data: data
	};
};

var buildRightFormData = function(data) {
	var fields = _.extend({}, RIGHT_FIELDS);
	fields = App.editor.buildFieldArr(fields, data);
	return {
		fields: fields,
		data: data
	};
};

App.editor.buildFormData = function(data) {
	var formData = {
		leftFormOptions: buildLeftFormData(data),
		rightFormOptions: buildRightFormData(data)
	};
	return formData;
};