define(['SocialNetView', 'text!templates/chatsession.html'],
function(SocialNetView, chatItemTemplate) {
	var chatItemView = SocialNetView.extend({
		tagName: 'div',

		className: 'chat_session',

		$el: $(this.el),

		events: {
			'submit form': 'sendChat',
		},

		initialize: function(options) {
			console.log('options');
			console.log(options);

			this.socketEvents = options.socketEvents;
			var accountId = this.model.get('accountId');
			this.socketEvents.on(
				'socket:chat:in:' + accountId,
				this.receiveChat,
				this
			);

			this.socketEvents.bind(
				'login:' + accountId,
				this.handleContactLogin,
				this
			);

			this.socketEvents.bind(
				'logout:' + accountId,
				this.handleContactLogout,
				this
			);
		},

		handleContactLogin: function() {
			this.$el.find('.online_indicator').addClass('online');
			this.model.set('online', true);
		},

		handleContactLogout: function() {
			this.model.set('online', false);
			$onlineIndicador = this.$el.find('.online_indicator');
			while( $onlineIndicador.hasClass('online') ) {
				$onlineIndicador.removeClass('online');
			}
		},

		receiveChat: function(data) {
			var chatLine = this.model.get('name').first + ': ' + data.text;
			this.$el.find('.chat_log').append($('<li>' + chatLine + '</li>'));
			console.log('Recebendo chat: '+chatLine);
		},

		sendChat: function() {
			var chatText = this.$el.find('input[name=chat]').val()
			var socketEvents = this.socketEvents;

			if ( chatText && /[^\s]+/.test(chatText) ) {
				console.log('entrei no if para: '+this.model.get('accountId'));
				var chatLine = 'Me: ' + chatText;
				this.$el.find('.chat_log').append($('<li>' + chatLine + '</li>'));

				socketEvents.trigger('socket:chat', {
					to: this.model.get('accountId'),
					text: chatText
				});
			}

			console.log('Enviando chat: '+chatLine);
			console.log(socketEvents);
			return false;
		},		

		render: function() {
			this.$el.html(_.template(chatItemTemplate, {
				model: this.model.toJSON()
			}));
			if (this.model.get('online') ){
				this.handleContactLogout;
			}

			return this;
		}
	});

	return chatItemView
});