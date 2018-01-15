var BoxAuthenFB = function (callback) {
	var fb = firebase;
	var pendingCredential = null;
	var provider = {};
	var config = {
		apiKey: "AIzaSyDa-ze_65ozwE0HZOAWWbemoozlHXfhK1k",
		authDomain: "cool-box-2a8b7.firebaseapp.com",
		databaseURL: "https://cool-box-2a8b7.firebaseio.com",
		projectId: "cool-box-2a8b7",
		storageBucket: "https://cool-box-2a8b7.firebaseio.com/",
		messagingSenderId: "619430236261",
		serverKey: "AAAAkDjrUGU:APA91bFb73qaRDFFPzTwgf1H2mwsLKd-_HN10JJ5Hg9QyYuiyZUFPJxQWKi_ki-Cd82NVS9vWfdZlPw3ZHveK_7jxrklHl3U3R_wt2Q7JKWUYRGgW5lR8rmokl2bpzrXl4kNMEyaW-vI"
	};

	fb.initializeApp(config);

	function init() {
		provider.Google = new fb.auth.GoogleAuthProvider();
		provider.Facebook = new fb.auth.FacebookAuthProvider();
		fb.auth().onAuthStateChanged(function (user) {
			if (user) {
				if (callback) {
					callback(fb.auth().currentUser);
				}
			} else {
				if (callback) callback(null);
			}
		});
	}

	BoxAuthenFB.prototype.google = {
		signIn: function () {
			fb.auth().signInWithPopup(provider.Google).then(function (result) {
				console.log(result)
			}).catch(function (error) {
				console.log(error)
			});
		}
	};

	BoxAuthenFB.prototype.facebook = {
		signIn: function () {
			fb.auth().signInWithPopup(provider.Facebook).then(function (result) {
				console.log(result)
			}).catch(function (error) {
				console.log(error)
				if (error.code !== 'auth/account-exists-with-different-credential') return;
				pendingCredential = error.credential;
				fb.auth().fetchProvidersForEmail(error.email).then(function (providers) {
					if (providers[0] === 'password') return;
				});
			});
		},
		signInWidthCredential: function() {
			fb.auth().signInWithPopup(provider.Google).then(function (result) {
				console.log(result)
				fb.auth().currentUser.linkWithCredential(pendingCredential).then(function () {
					console.log("ok")
				});
			});
		}
	};

	BoxAuthenFB.prototype.email = {
		signUp: function(email, password, callback){
			firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
				callback(error);
			});
		},
		signIn: function(email, password, callback){
			firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
				callback(error);
			});
		}
	};

	BoxAuthenFB.prototype.signout = function() {
		firebase.auth().signOut().then(function () {
		}).catch(function (error) {
			console.log(error)
		});
	};

	BoxAuthenFB.prototype.getServerKey = function() {
		return config.serverKey;
	};

	init();
};
