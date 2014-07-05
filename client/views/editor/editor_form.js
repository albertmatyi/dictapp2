var SHORT_CLASS = 'short col-sm-3';

var LEFT_FIELDS = {
	wordLeft: {
		'class': 'col-xs-12',
		placeholder: 'acţiun',
		label: App.i18n.getString
	},
	endingLeft: {
		'class': SHORT_CLASS,
		placeholder: 'e -i',
		label: App.i18n.getString
	},
	typeLeft: {
		'class': SHORT_CLASS,
		placeholder: 's fn',
		label: App.i18n.getString
	},
};

var RIGHT_FIELDS = {
	wordRight: {
		'class': 'col-xs-12',
		placeholder: 'cselekvés, tett',
		label: App.i18n.getString
	},
	alternatives: {
		type: 'array',
		labelClass: 'col-xs-12',
		fields: {
			category: {
				'class': SHORT_CLASS.replace('3', '4'),
				placeholder: 'fiz.',
				label: App.i18n.getString
			},
			meaning: {
				'class': SHORT_CLASS.replace('3', '4'),
				placeholder: 'vegyhatás',
				label: App.i18n.getString
			},
			removeAlternative: {
				type: 'button',
				btnType: 'link',
				// 'class': SHORT_CLASS,
				label: App.i18n.getString,
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
		label: App.i18n.getString,
		events: {
			click: function() {
				var data = {
					fields: this.parentContext.fields[1].fields,
					data: [{}]
				};
				var comp = UI.renderWithData(Template.appEditorArrayWrapper, data);
				UI.insert(comp, $('.array-wrapper.alternatives')[0]);
			}
		}
	}
};

var SENSES_FIELDS = {
	senses: {
		type: 'array',
		labelClass: 'col-xs-12',
		fields: {
			phraseLeft: {
				'class': 'col-xs-12 col-sm-6',
				placeholder: 'Acţiune pauliană (acţiune revocatorie)',
				label: App.i18n.getString
			},
			phraseRight: {
				'class': 'col-xs-12 col-sm-6',
				placeholder: 'Frazis',
				label: App.i18n.getString
			},
			descriptionLeft: {
				'class': 'col-xs-12 col-sm-6',
				placeholder: 'Este acea acţiune prin care creditorul atacă actul de înstrăinare a bunului de către debitor, dacă acesta din urmă îşi are intenţia de a-l înşela sau de a ocoli pe creditor.',
				type: 'textarea',
				label: App.i18n.getString
			},
			descriptionRight: {
				'class': 'col-xs-12 col-sm-6',
				placeholder: 'Leiras',
				type: 'textarea',
				label: App.i18n.getString
			},
			descriptionClearAfter: {
				type: 'placeholder',
				class: 'clearer'
			},
			exampleLeft: {
				'class': 'col-xs-12 col-sm-6',
				placeholder: 'Exemplu',
				type: 'textarea',
				label: App.i18n.getString
			},
			exampleRight: {
				'class': 'col-xs-12 col-sm-6',
				placeholder: 'Pelda',
				type: 'textarea',
				label: App.i18n.getString
			},
			removeSense: {
				type: 'button',
				btnType: 'link',
				label: App.i18n.getString,
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
		label: App.i18n.getString,
		events: {
			click: function() {
				var data = {
					fields: this.parentContext.fields[0].fields,
					data: [{}]
				};
				var comp = UI.renderWithData(Template.appEditorArrayWrapper, data);
				UI.insert(comp, $('.array-wrapper.senses')[0]);
			}
		}
	}
};


var buildFormData = function(FIELDS, data) {
	var fields = _.extend({}, FIELDS);
	fields = App.editor.buildFieldArr(fields, data);
	return {
		fields: fields,
		data: data
	};
};

App.editor.buildFormData = function(data) {
	var formData = {
		leftWordFormData: buildFormData(LEFT_FIELDS, data),
		rightWordFormData: buildFormData(RIGHT_FIELDS, data),
		sensesFormData: buildFormData(SENSES_FIELDS, data)
	};
	return formData;
};