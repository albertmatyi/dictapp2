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
					click: function(e, dataCtxt) {
						var self = this;
						self.writeData($('.editor-modal'), function(data) {
							console.log(this, arguments);
							// data.senses.splice(dataCtxt.idx, 1);
							// self.refresh();
						});
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
			click: function() {
				var self = this;
				self.writeData($('.editor-wrapper'), function(data) {
					// data.senses.push({});
					// self.refresh();
				});
			}
		}
	}
};

//     'options': null,                        // object with k-v pairs or simple [] (data provider for select/radio/checkbox)
//     'label': 'Field label',                 // defaults to capitalized field name,
//     'default': null,                        // default value when no value object is provided
//     'post': function (v) { return v; },     // method executed after data retrieval
//     'render': function () { return true; }  // method executed to check if field has to be rendered



var buildLeftFormData = function(data) {
	var fields = _.extend({}, LEFT_FIELDS);
	fields = App.editor.buildFieldArr(fields, data);
	return {
		fields: fields,
		data: data
	};
};

var buildRightFormData = function(data) {
	// buildLeftFormData(data);
	data = 3;
	return {};

};

App.editor.buildFormData = function(data) {
	var formData = {
		leftFormOptions: buildLeftFormData(data),
		rightFormOptions: buildRightFormData(data)
	};
	return formData;
};