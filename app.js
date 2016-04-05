var express			= require('express');
var http 			= require('http');
var nodemailer		= require('nodemailer');
var MemoryStore		= require('connect').session.MemoryStore;
var app				= express();
var dbPath			= process.env.MONGODB || 'mongodb://localhost/nodebackbone';
var fs				= require('fs');
var events 			= require('events');
var mongoose		= require('mongoose');

app.server 			= http.createServer(app);
app.sessionStore	= new MemoryStore();

var eventDispatcher = new events.EventEmitter();
app.addEventListener = function(eventName, callback) {
	eventDispatcher.on(eventName, callback);
};

app.removeEventListener = function(eventName, callback) {
	eventDispatcher.removeListener(eventName, callback);
};

app.triggerEvent = function(eventName, eventOptions) {
	eventDispatcher.emit(eventName, eventOptions);
};

var config = {
	mail: require('./config/mail')
};

var models = {
	Account: require('./models/Account')(app, config, mongoose, nodemailer)
};

app.configure(function() {
	app.sessionSecret = 'SocialNet Secret key';

	app.httpSchema = process.env.PORT ? 'https' : 'http';
	app.processPort = process.env.PORT ? process.env.PORT : 8083;

	app.set('view engine', 'jade');
	app.use('/public', express.static(__dirname+'/public'));
	app.use(express.limit('1mb'));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({
		secret: app.sessionSecret,
		key: 'express.sid',
		store: app.sessionStore
	}));

	mongoose.connect(dbPath, function onMongooseError(err){
		if (err) throw err;
	});
});

//import routes
fs.readdirSync('routes').forEach(function(file) {
	if(file[0] == '.') return;
	
	var routeName = file.substr(0, file.indexOf('.'));
	require('./routes/'+routeName)(app, models);
});

app.get('/', function(req, res) {
	res.render('index.jade')
});

app.post('/contacts/find', function(req, res) {
	var searchStr = req.param('searchStr', null);
	if(null == searchStr) {
		res.send(400);
		return;
	}

	models.Account.findByString(searchStr, function onSearchDone(err, accounts) {
		if(err || accounts.length == 0) {
			res.send(404);
		} else {
			res.send(accounts);
		}
	});
});

app.server.listen(app.processPort);
console.log('listening on port ' + app.processPort);