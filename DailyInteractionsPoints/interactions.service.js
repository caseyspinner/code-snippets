const mongodb = require("../mongodb");
const conn = mongodb.connection;
const ObjectId = mongodb.ObjectId;
const moment = require("moment");

module.exports = {
  //...
  getTodaysInteractionPoints: getTodaysInteractionPoints,
 //...
};

//...

function getTodaysInteractionPoints(id, today, tomorrow) {
   return conn
      .db()
      .collection("interactions")
      .aggregate([
         {
            $match: {
               createDate: {
                  $gt: new Date(today),
                  $lt: new Date(tomorrow)
               },
               userId: {
                  $eq: id
               }
            }
         },
         {
            $group: {
               _id: null,
               totalPoints: {
                  $sum: "$challenge.points"
               }
            }
         },
         {
            $project: {
               totalPoints: 1
            }
         }
      ])
      .toArray()
      .then(interactions => {
         return interactions;
      });
}

//...
