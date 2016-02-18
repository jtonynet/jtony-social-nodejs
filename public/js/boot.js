require.config({
	paths: {
		jQuery: '/public/libs/jquery/dist/jquery.min',
		Underscore: '/public/libs/underscore/underscore-min',
		Backbone: '/public/libs/backbone/backbone-min',
		Bootstrap: '/public/libs/bootstrap/dist/js/bootstrap.min',
		text: '/public/libs/text/text',
		templates: '../templates'
	},

	shim: {
		'Backbone': ['Underscore', 'jQuery'],
		'SocialNet': ['Backbone']
	}
});

require(['SocialNet'], function(SocialNet) {
	SocialNet.initialize();
});