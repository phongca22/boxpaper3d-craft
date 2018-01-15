function BoxMessageFB() {
	var thiz = this;
	var listener = null;
	var token = null;
	const messaging = firebase.messaging();
	messaging.requestPermission()
	.then(function () {
		console.log('Notification permission granted.');
		getToken();
	})
	.catch(function (err) {
		console.log('Unable to get permission to notify.', err);
	});

	messaging.onTokenRefresh(function () {
		messaging.getToken()
		.then(function (refreshedToken) {
			console.log('Token refreshed.');
			// Indicate that the new Instance ID token has not yet been sent to the
			// app server.
			// setTokenSentToServer(false);
			// Send Instance ID token to app server.
			// sendTokenToServer(refreshedToken);
			// ...
		})
		.catch(function (err) {
			console.log('Unable to retrieve refreshed token ', err);
			// showToken('Unable to retrieve refreshed token ', err);
		});
	});

	messaging.onMessage(function(payload) {
		console.log("Message received. ", payload);
		if (listener) listener(payload.notification);
	});

	function getToken() {
		messaging.getToken()
		.then(function (currentToken) {
			if (currentToken) {
				token = currentToken;
				// sendTokenToServer(currentToken);
				// updateUIForPushEnabled(currentToken);
			} else {
				// Show permission request.
				console.log('No Instance ID token available. Request permission to generate one.');
				// Show permission UI.
				// updateUIForPushPermissionRequired();
				// setTokenSentToServer(false);
			}
		})
		.catch(function (err) {
			console.log('An error occurred while retrieving token. ', err);
			// showToken('Error retrieving Instance ID token. ', err);
			// setTokenSentToServer(false);
		});
	}

	BoxMessageFB.prototype.listener = function(callback){
		listener = callback;
	};

	BoxMessageFB.prototype.getToken = function(callback){
		return token;
	};
}
