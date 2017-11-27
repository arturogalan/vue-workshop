const express = require('express');
const bodyParser = require('body-parser');
const bunyan = require('bunyan');
const history = require('connect-history-api-fallback');
const favicon = require('serve-favicon');

// Logging everything
const logfilePath = __dirname + "/pwa-admin.log";
const loggerOpts = {
  name: 'PWS example app',
  serializers: {
    req: bunyan.stdSerializers.req,
    res: bunyan.stdSerializers.res,
    err: bunyan.stdSerializers.err
  },
  streams: [{
    stream: process.stdout,
    level: 'info'
  }, {
    type: 'rotating-file',
    path: logfilePath,
    period: '1d',
    count: 3,
    level: 'info'
  }]
};
const logger = require('bunyan')(loggerOpts);

process.on('SIGHUP', function () {
  logger.reopenFileStreams();
});

const app = express();

app.use(history());
//Request logger

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Attaching app locals and utils to request
app.use(function (req, res, next) {
  // Uncomment the next two lines to allow external API.
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Expose-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization');
  res.set('Access-Control-Allow-Methods', 'HEAD, OPTIONS, GET, POST, DELETE, PUT, PATCH');


  res.set('X-Powered-By', 'Lightning-bolt');

  logger.info({req: req, res: res});
  req.logger = logger;

  next();
});

app.use(express.static('dist'));
app.use(favicon(__dirname + '/static/favicon.ico'));

module.exports = app;


let server = null;

    server = app.listen(process.env.PORT || 8080, function(){
      logger.info('PWA is listening at ' + server.address().port + '/');
    })
