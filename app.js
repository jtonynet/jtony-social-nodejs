var express = require('express');
var app = express();
var nodemailer = require('nodemailer');
var MemoryStore = require('connect').session.MemoryStore;
var mongoose = require('mongoose');

var config = {
	mail: require('./config/mail')
};

var Account = require('./models/Account')(config, mongoose, nodemailer);

var httpSchema = process.env.PORT ? 'https' : 'http';
var processPort = process.env.PORT ? process.env.PORT : 8080;

app.configure(function() {
	app.set('view engine', 'jade');
	app.use('/public', express.static(__dirname+'/public'));
	app.use(express.limit('1mb'));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session(
		{secret: 'SocialNet Secret key', store: new MemoryStore()}
	));
	mongoose.connect('mongodb://localhost/nodebackbone');
});

app.get('/', function(req, res) {
	res.render('index.jade', {layout: false})
});

app.post('/login', function(req, res) {
	console.log('login request');
	var email = req.param('email', null);
	var password = req.param('password', null);

	if(null == email || email.length < 1 || null == password || password.length < 1) {
		res.send(400);
		return;
	}

	Account.login(email, password, function(success) {
		if(!success){
			res.send(401);
			return;
		}

		console.log('Login was successful');
		res.send(200);
	});
});

app.post('/register', function(req, res) {
	var firstName = req.param('firstName', '');
	var lastName = req.param('lastName', '');
	var email = req.param('email', '');
	var password = req.param('password', '');

	if(null == email || null == password) {
		res.send(400);
		return;
	}

	Account.register(email, password, firstName, lastName);
	res.send(200);
});

app.get('/account/authenticated', function(req, res) {
	if(req.session.loggedIn) {
		res.send(200);
	} else {
		res.send(401);
	}
});

app.post('/forgotpassword', function(req, res) {
	var hostname = req.headers.host;
	var resetPasswordUrl = httpSchema+'//'+hostname+'/resetpassword';
	var email = req.param('email', null);
	if(null == email || email.length < 1){
		res.send(400);
		return;
	}

	Account.forgotpassword(email, resetPasswordUrl, function(success) {
		if(success){
			res.send(200);
		} else {
			//not found
			res.send(404);
		}
	});
});

app.get('/resetpassword', function(req, res) {
	var accountId = req.param('account', null);
	res.render('resetPassword.jade', {locals: {accountId:accountId}});
});

app.post('/resetpassword', function(req, res) {
	var accountId = req.param('accountId', null);
	var password = req.param('password', null);

	if(null != accountId && null != password ) {
		Account.changePassword(accountId, password);
	}

	res.render('resetPasswordSuccess.jade');
});

app.listen(processPort);
console.log('listening on port ' + processPort);