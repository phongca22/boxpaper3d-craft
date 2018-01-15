function BoxDataFB(callback) {
    var BOX_ID = '-KuJCQO_Ag8-72jdwfTq';
    var USER_ID = "37vkas56JVemKQNDhEm8VLS0pZD3";
    var fb = firebase;
    var db = fb.database();

    var currentUserId = fb.auth().currentUser.uid;

    BoxDataFB.prototype.setList = function(data){
        var messageListRef = db.ref('users/' + USER_ID + '/collections/' + BOX_ID + '/messages');
        var newMessageRef = messageListRef.push();
        var userName = fb.auth().currentUser.displayName;
        if (currentUserId == USER_ID) {
            newMessageRef.set({
                content: data.message,
                userName: userName
            });
        } else {
            newMessageRef.set({
                content: data.message,
                userName: userName
            });
        }
    };

    var messsageRef = db.ref('users/' + USER_ID + '/collections/' + BOX_ID + '/messages');
    messsageRef.on('value', function (snapshot) {
        var value = snapshot.val();
        if (value && callback) {
            callback(snapshot.val());
        } else {
            callback([]);
        }
    });
}
