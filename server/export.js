Router.map(function() {
  this.route('export', {
    where: 'server',
    path: 'export',
    action: function() {
      var response = this.response;
      var headers = {
        'Content-Disposition': 'Attachment;filename=backup_' + moment().format('YYYYMMDD_HHMMss') + '.json',
        'Content-Type': 'text/json',
      };

      response.writeHead(200, headers);
      response.write('[{}');
      ItemsCollection.find({}).forEach(function(item) {
        response.write(',' + JSON.stringify(_.omit(item, '_id', 'searchableAll', 'searchableWord', 'searchablePhrase', 'searchableDescription', 'searchableExample')));
      });
      response.write(']');
      response.end();
    }
  });
});