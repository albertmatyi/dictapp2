var APP_URL = 'lex.sapientia.ro';

var options = {
  apiKey: 'key-dda9b756ccbbf539f75c0c1f1b71beaf',
  domain: 'sandbox3f5e890f18424d80a3e812f035848ced.mailgun.org'
};

App.property.set({
  key: 'notifications.destinationEmail',
  default: 'albertmatyi@gmail.com, elod.pal@gmail.com',
  title: 'Notification Destination Email',
  description: 'The email address notifications are sent to'
});

var NigerianPrinceGun = new Mailgun(options);

Meteor.methods({
  'sendNotification': function (word) {
    console.log('requested definition for:', word);
    NigerianPrinceGun.send({
     'to': App.property('notifications.destinationEmail'),
     'from': 'no-reply@lex.sapientia.ro',
     'html': '<html><head></head><body>The word: ":word" has been requested. <br/> Please go to <a href="http://'+APP_URL+'/search/:word">dictapp</a> and define it</body></html>'.replace(/:word/g, word),
     'text': 'The word: ":word" has been requested. \n Please go to http://'+APP_URL+'/search/:word and define it'.replace(/:word/g, word),
     'subject': 'The word: "'+ word + '" has been requested',
     'tags': ['word-request']
   });
  }
});
