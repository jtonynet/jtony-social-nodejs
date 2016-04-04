socket.on('disonnect', function() {
	sAccount.contacts.forEach(function(contact) {
		var eventName = 'event:' + contact.accountId;
		app.removeEventListener(eventName, handleConatctEvent);
		console.log('Unsubscribing from: ' + eventName);
	});
});