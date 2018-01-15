(function () {
	'use strict';

	angular.module(APP_CONF.module)
		.controller('CollaborationController', CollaborationController);

	CollaborationController.$inject = ['$scope', '$http', '$timeout'];

	function CollaborationController($scope, $http, $timeout) {
		var myAuth = null;
		var myData = null;
		var myMessage = null;
		var boxViewer = null;
		var self = this;
        var shapeTimer = null;
		self.body = {
			width: 100,
			height: 67,
			depth: 100,
			material: "box-material/basic-03.jpg"
		};

		self.lid = {
			open: true,
			height: 10,
			material: "box-material/basic-05.jpg"
		}

		self.materials = [{
			url: "box-material/basic-02.jpg"
		}, {
			url: "box-material/basic-03.jpg"
		}, {
			url: "box-material/basic-04.jpg"
		}, {
			url: "box-material/basic-05.jpg"
		}];

		self.dimensions = [{
			key: "width",
			name: "Width"
		}, {
			key: "height",
			name: "Height"
		}, {
			key: "depth",
			name: "Depth"
		}];

		self.signInGoogle = function () {
			myAuth.google.signIn();
		};

		self.signInFacebook = function () {
			myAuth.facebook.signIn();
		};

		self.signInWidthCredential = function () {
			myAuth.facebook.signInWidthCredential();
		};

		self.signOut = function () {
			myAuth.signout();
		};

		self.add = function () {
			myData.setList({
				message: angular.copy(self.message)
			});

			self.message = "";
		};

		self.updateBodySize = function () {
			boxViewer.updateBodySize(self.body);
		};

		self.updateBodyMaterial = function(key) {
			var obj = {};
			obj[key] = self.body[key];
			boxViewer.updateBodyMaterial(obj);
		};

		self.updateLidMaterial = function(key) {
			var obj = {};
			obj[key] = self.lid[key];
			boxViewer.updateLidMaterial(obj);
		};

		self.updateLidSize = function () {
			boxViewer.updateLidSize(self.lid);
		};

        self.selectShape = function(s) {
            self.currentShape = s;
        };

		self.updateBodyShape = function() {
			if (shapeTimer) {
				$timeout.cancel($timeout);
			}

			shapeTimer = $timeout(function(){
				boxViewer.updateBodyShape(self.currentShape);
			}, 500);
		};

		self.postMessage = function() {
			$http.post("https://fcm.googleapis.com/fcm/send", {
				notification: {
					body: self.message
				},
				to: myMessage.getToken()
			}, {
				headers: {
					Authorization: "key=" + myAuth.getServerKey(),
					"Content-Type": "application/json"
				}
			}).then(function(){
				self.message = "";
			}, function(data){
				AlertUtil.error("Cannot post message");
			});
		};

		self.signInWithCredential = function(ev) {
			PanelUtil.show(function(mdPanelRef){
				$scope.mdPanelRef = mdPanelRef;
				var thiz = this;
				this.submit = function(){
					myAuth.email.signUp(thiz.email, thiz.pass, function(error){
						AlertUtil.error(error.message);
						if (!$scope.$$phase) {
							$scope.$apply();
						}
					});
				};

				this.signIn = function(){
					myAuth.email.signIn(thiz.email, thiz.pass, function(error){
						AlertUtil.error(error.message);
						if (!$scope.$$phase) {
							$scope.$apply();
						}
					});
				};
			}, {
				templateUrl: getResourceUrl("component/authen/login.dialog.html"),
			}, ev);
		};

		function initDatabase(user) {
			if (!user) return;
			initBoxViewer();
			myData = new BoxDataFB(function (data) {
				self.messages = data;
				if (!$scope.$$phase) {
					$scope.$apply();
				}
			});
		}

		function initMessage() {
			myMessage = new BoxMessageFB();
			myMessage.listener(function(data){
				AlertUtil.success(data.body);
				if (!$scope.$$phase) {
					$scope.$apply();
				}
			});
		}

		function initFirebase() {
			myAuth = new BoxAuthenFB(function (user) {
				self.user = user;
				initDatabase(user);
				initMessage();
				if (self.user) {
					if ($scope.mdPanelRef) {
						$scope.mdPanelRef.close();
						$scope.mdPanelRef = null;
					}
				}

				$scope.$apply();
			});
		}

		function initBoxViewer() {
			setTimeout(function () {
				boxViewer = new Box3DViewer(document.getElementById("boxWrapper"));
				boxViewer.updateBodySize(self.body);
				boxViewer.addListener("shape", function(data){
					self.body.shapes = data;
                    if (!self.currentShape) {
                        self.currentShape = self.body.shapes[0];
                    }
				});
			}, 500);
		}

		function initListener() {
			// $scope.$watch("self.body.color", function(data){
			// 	if (!boxViewer) return;
			// 	var obj = {color: data};
			// 	boxViewer.updateBodyMaterial(obj);
			// }, true);
			//
			// $scope.$watch("self.lid.color", function(data){
			// 	if (!boxViewer) return;
			// 	var obj = {color: data};
			// 	boxViewer.updateLidMaterial(obj);
			// }, true);
		}

		function init() {
			initFirebase();
			initListener()
		}

		init();
	}
})();
