module.exports = function(config, mongoose, nodemailer) {
	var crypto = require('crypto');

	var Status = new mongoose.Schema({
		name: {
			first: {type: String},
			last: {type: String}
		},
		status: {type: String}
	});

	var AccountSchema = new mongoose.Schema({
		email: {type: String, unique: true},
		password: {type: String},
		name: {
			first: {type: String},
			last: {type: String}
		},
		birthday: {
			day: {type: Number, min: 1, max: 31, rquired: false},
			month: {type: Number, min: 1, max: 12, rquired: false},
			year: {type: Number}
		},
		photoUrl: {type: String},
		biography: {type: String},
		status: [Status], //My own update
		activity: [Status], //My own update and friends
	});

	var Account = mongoose.model('Account', AccountSchema);

	var registerCallback = function (err) {
		if(err) {
			return console.log(err);
		};

		return console.log('Account was created');
	};

	var changePassword = function(accountId, newPassword) {
		var shaSum = crypto.createHash('sha256');
		shaSum.update(newPassword);
		var hashedPassword = shaSum.diggest('hex');

		Account.update(
			{_id:accountId}, 
			{$set: {password: hashedPassword}},
			{upsert: false},
			function changePasswordCallback() {
				console.log('Change password done for account ' + accountId);
			}
		);
	};

	var forgotPassword = function(email, resetPassword, callback) {
		var user = Account.findOne({email: email}, function(err, doc) {
			if(err) {
				//Endereco de email nao eh valido
				callback(false);
			} else {
				var smtpTransport = nodemailer.createTransport('SMTP', config.mail);
				resetPasswordUrl += '?account='+doc._id;

				smtpTransport.sendMail({
						from: 'thisapp@example.com',
						to: doc.email,
						subject: 'SocialNet password Request',
						text: 'Click here to reset your password: ' + resetPasswordUrl
				}, function forgotPasswordResult(err) {
					if(err) {
						callback(false);
					} else {
						callback(true);
					}
				});
			}
		});
	};

	var login = function(email, password, callback) {
		var shaSum = crypto.createHash('sha256');
		shaSum.update(password);
		Account.findOne({email: email, password: shaSum.diggest('hex')}, function(err, doc){
			callback(doc);
		});
	};

	var findById = function(accountId) {
		Account.findOne({_id: accountId}, function(err, doc) {
			callback(doc);
		});
	};

	var register = function(email, password, firstName, lastName) {
		var shaSum = crypto.createHash('sha256');
		shaSum.update(password);

		console.log('Registering '+email);
		var user = new Account({
			email: email,
			name: {
				first: firstName,
				last: lastName
			},
			password: shaSum.diggest('hex')
		});
		user.save(registerCallback);
		console.log('Save command was sent');
	}

	return {
		findById: findById,
		register: register,
		forgotPassword: forgotPassword,
		changePassword: changePassword,
		login: login,
		Account: Account		
	}
}