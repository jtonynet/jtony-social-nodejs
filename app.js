var express = require('express');
var app = express();

app.configure(function(){
	app.set('view engine', 'jade');
	app.use('/public', express.static(__dirname+'/public'));
});

app.get('/', function(req, res) {
	res.render('index.jade', {layout: false})
});

var processPort = process.env.PORT ? process.env.PORT : 8080;

app.listen(processPort);
console.log('listening on port ' + processPort);