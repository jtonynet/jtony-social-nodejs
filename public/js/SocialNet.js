define(['router'], function(router) {
	var initialize = function() {
		checkLogin(runApplication);
	};

	var checkLogin = function(callback) {
		$.ajax("/account/authenticated", {
			method: "GET",
			sucess: function() {
				console.log('3- checkLogin TRUE');
				return callback(true);
			},
			error: function(data) {
				console.log('3- checkLogin FALSE');
				return callback(false);
			}
		});
	};

	var runApplication = function(authenticated) {
		console.log("4- authenticated: "+authenticated);
		if(!authenticated) {
			window.location.hash = 'login';
		} else {
			window.location.hash = 'index';
		}

		Backbone.history.start();
	};

	return {
		initialize: initialize
	};

});
