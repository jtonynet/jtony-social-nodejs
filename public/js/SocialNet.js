define(['router'], function(router) {
	var initialize = function() {
		checkLogin(runApplication);
	};

	var checkLogin = function() {
		$.ajax("/account/authenticated", {
			method: "GET",
			sucess: function() {
				return callback(true);
			},
			error: function() {
				return callback(false);
			}
		});
	};

	var runApplication = function(authenticated) {
		if(!authenticated) {
			Window.location.hash = 'login';
		} else {
			Window.location.hash = 'index';
		}
		Backbone.history.start();
	};

	return {
		initialize: initialize
	};

});
