define(['SocialNetView', 'views/chatsession', 'views/chatitem','text!templates/chat.html'],
function(SocialNetView, ChatSessionView, ChatItemView, chatItemTemplate) {
	var chatView = SocialNetView.extend({
		el: $('#chat'),

		chatSessions: {},

		initialize: function(options) {
			this.socketEvents = options.socketEvents;
			this.collection.on('reset', this.renderCollection, this);
		},

		render: function() {
			this.$el.html(chatItemTemplate);
		},

		startChatSession: function() {
			var accountId = model.get('accountId');
			if( !this.chatSessions[accountId]) {
				var chatSessionView = new ChatSessionView({
					model: model,
					socketEvents: this.socketEvents
				});
			}
		},

		renderCollection: function() {
			var that = this;
			$('.chat_list').empty();
			collection.each(function(contact) {
				var chatItemView = new ChatItemView({
					socketEvents: that.socketEvents,
					model: contact
				});
				chatItemView.bind('chat:start', that.startChatSession, that);
				var statusHtml = (chatItemView).render().el;
				$(statusHtml).appendTo('.chat_list');
			});
		}

	});

	return chatView
});