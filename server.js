const express = require('express');
const app = express();
// const morgan = require('morgan');
const bodyParser = require('body-parser');
const config = require('config');
const router = require('./app/router');
const port = config.port;
const databaseInitializer = require('./app/initializers/Database');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/*', limit: '5mb'}));

app.use(function(req, res, next) {
  var allowedOrigins = [ 'http://localhost:4200', 'http://52.89.98.67', 'http://localhost', 'http://arthurras.ddns.net' ];
  var origin = req.headers.origin;

  if (allowedOrigins.indexOf(origin) > -1){
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  next();
});

app.use('/api/v1', router);
const httpServer = require('http').Server(app);

databaseInitializer.init((err) => {
  if (!err) {
    return httpServer.listen(port, function(){
      console.log('Enterprise launched at ' + port);
    });
  }

  return console.log(err.reason);
});
