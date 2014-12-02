var getBlobData = function(file) {
  if (file.srcElement) {
    return file.srcElement.result;
  } else {
    if (typeof file.target.result === 'string') {
      return file.target.result;
    }
    var binaryString = '',
      bytes = new Uint8Array(file.target.result),
      length = bytes.length;
    for (var i = 0; i < length; i++) {
      binaryString += String.fromCharCode(bytes[i]);
    }
    return binaryString;
  }
};

var insert = function(definitions) {
  Meteor.call('import', definitions, function(err, importedN) {
    Alerts.add('Imported ' + importedN + ' definitions.', 'success');
  });
};

var reader = new FileReader();
App.import = function(file) {
  bootbox.confirm('Are you sure you want to replace the current database with a backup?', function(result) {
    if (!result) {
      return;
    }
    var uploadChunk = function(blob) {
      var data = getBlobData(blob);
      var definitions = JSON.parse(data);
      // remove first dummy element
      definitions.shift();
      insert(definitions);
    };
    var blob = file;
    reader.onload = uploadChunk;
    reader.readAsText(blob);
  });
};