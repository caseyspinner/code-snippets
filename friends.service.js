const mongodb = require("../mongodb");
const conn = mongodb.connection;
const ObjectId = mongodb.ObjectId;

module.exports = {
   rejectRequest: rejectRequest,
   getMyPendingRequests: getMyPendingRequests,
   acceptRequest: acceptRequest,
   addToFriendsList: addToFriendsList
};

function rejectRequest(id) {
   return conn
      .db()
      .collection("friends")
      .deleteOne({ _id: new ObjectId(id) })
      .then(result => Promise.resolve());
}

function getMyPendingRequests(userId) {
   return conn
      .db()
      .collection("friends")
      .aggregate([
         {
            $match: {
               targetUserId: userId,
               status: "pending"
            }
         },
         {
            $project: {
               createDate: 0,
               updateDate: 0
            }
         }
      ])
      .toArray()
      .then(result => {
         return result;
      });
}

function acceptRequest(requestId) {
   return conn
      .db()
      .collection("friends")
      .findAndModify(
         { _id: new ObjectId(requestId) },
         [],
         { $set: { status: "accepted" } },
         { new: true }
      )
      .then(request => {
         return request.value;
      });
}

function addToFriendsList(targetUserId, requestorUserId) {
   return conn
      .db()
      .collection("users")
      .update(
         { _id: new ObjectId(targetUserId) },
         { $addToSet: { friends: { id: new ObjectId(requestorUserId) } } }
      )
      .then(result => Promise.resolve());
}
