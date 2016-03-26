require.config({
	paths: {
		jQuery: '/public/libs/jquery/jquery',
		Underscore: '/public/libs/underscore/underscore',
		Backbone: '/public/libs/backbone/backbone',
		Sockets: '/socket.io/socket.io',
		models: 'models',
		Bootstrap: '/public/libs/bootstrap/dist/js/bootstrap.min',
		text: '/public/libs/text/text',
		templates: '../templates',

		SocialNetView: '/public/js/SocialNetView'
	},

	shim: {
		'Backbone': ['Underscore', 'jQuery'],
		'SocialNet': ['Backbone']
	}
});


require(['SocialNet'], function(SocialNet) {
	SocialNet.initialize();
});