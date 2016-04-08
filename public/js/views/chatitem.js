define(['SocialNetView', 'text!templates/chatitem.html'],
function(SocialNetView, chatItemTemplate) {
	var chatItemView = SocialNetView.extend({
		tagName: 'li',

		$el: $(this.el),

		events: {
			'click': 'startChatSession',
		},

		initialize: function(options) {
			console.log('iniciei chat item');

			this.model = options.model;
			var accountId = this.model.get('accountId');
			options.socketEvents.bind(
				'login:'+accountId,
				this.handleContactLogin,
				this
			);
			options.socketEvents.bind(
				'logout:'+accountId,
				this.handleContactLogout,
				this
			);
			options.socketEvents.bind(
				'socket:chat:start:'+accountId,
				this.startChatSession,
				this
			);
		},

		handleContactLogin: function() {
			console.log('chat item ficou ON');
			this.model.set('online', true),
			this.$el.find('.online_indicator').addClass('online');			
		},

		handleContactLogout: function() {
			this.model.set('online', false);
			$onlineIndicator = this.$el.find('.online_indicator');
			while ($onlineIndicator.hasClass('online')) {
				$onlineIndicator.removeClass('online');
			}
		},

		startChatSession: function() {
			console.log('chat session iniciada');
			console.log('--->');
			console.log(this.model);
			this.trigger('chat:start', this.model);
		},

		render: function() {
			console.log('renderiza chat item');
			this.$el.html(_.template(chatItemTemplate, {
				model: this.model.toJSON()
			}));

			if (this.model.get('online'))
				this.handleContactLogin();

			return this;
		}
	});

	return chatItemView
});