var express = require('express');
var events = require('events');

var app = express();
var eventEmitter = new events.EventEmitter();

app.set('view engine', 'jade');
app.set('view options', {layout: true});
app.set('views', __dirname + '/views');

function mainLoop() {
	console.log('Starting application');
	eventEmitter.emit('ApplicationStart');

	console.log('Running application');
	eventEmitter.emit('ApplicationRun');

	console.log('Stopping application');
	eventEmitter.emit('ApplicationStop');
}

function onApplicationStart() {
	console.log('Handling Application Start Event');
}

function onApplicationRun() {
	console.log('Handling Application Running Event');
}

function onApplicationStop() {
	console.log('Handling Application Stop Event');
}

mainLoop();

eventEmitter.on('ApplicationStart', onApplicationStart);
eventEmitter.on('ApplicationRun', onApplicationRun);
eventEmitter.on('ApplicationStop', onApplicationStop);

app.get('/stooges/:name?', function(req, res, next) {
	var name = req.params.name;

	switch (name ? name.toLowerCase() : '') {
		case 'larry':
		case 'curly':
		case 'moe':
			res.render('stooges', {stooge: name});
			break;

		default:
			next();	
	}
});

app.get('/stooges/*?', function(req, res) {
	res.render('stooges', {stooge: null});
});

app.get('/', function(req, res) {
	res.render('index');
});

//var processPort = process.env.PORT ? process.env.PORT : 3000;
var processPort = process.env.PORT ? process.env.PORT : 8080;

app.listen(processPort);
console.log('listening on port ' + processPort);