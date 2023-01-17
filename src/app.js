const app = require('./production/server');

require('./routes/routes')(app);

// starting the server
app.listen(app.get('port'), () =>  {
  console.log('server on port', app.get('port'));
});