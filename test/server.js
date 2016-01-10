var express = require('express'),
app = express();


var morgan = require('morgan');
app.use(morgan('dev'));

var bodyParser = require('body-parser');
app.use(bodyParser.json(), bodyParser.urlencoded({
  extended: true
}));


var Bridge = require('../lib').default;

var bridge = new Bridge();

bridge.add('Routes');

app.use('/api/bridge', bridge.router);
app.use('/', function (req, res) {
  res.send('hi');
})

app.listen(3000, function (err) {
  console.log(err);
});
