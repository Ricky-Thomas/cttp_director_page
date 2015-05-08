var express = require('express');
var app = express();

var exphbs  = require('express3-handlebars');
var requirejs = require('requirejs');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('views', __dirname+'/views');

app.get('/', function(req, res) {
  res.render('home');
});

app.use('/public', express.static('public'))

var port = Number(process.env.PORT || 5000);

app.listen(port);

requirejs.config({
    nodeRequire: require
});