const friendsService = require("../services/friends.service");
const userService = require("../services/users.service");

module.exports = {
  //...
  acceptRequest: acceptRequest
};

//...


function acceptRequest(requestId) {
  return friendsService.acceptRequest(requestId).then(request => {
    const promises = [
      new Promise((resolve, reject) => {
        friendsService
          .addToFriendsList(request.targetUserId, request.requestorUserId)
          .then(data => {
            resolve(data);
          });
      }),
      new Promise((resolve, reject) => {
        friendsService
          .addToFriendsList(request.requestorUserId, request.targetUserId)
          .then(data => {
            resolve(data);
          });
      })
    ];
    return Promise.all(promises).then(response => {
      Promise.resolve();
    });
  });
}
