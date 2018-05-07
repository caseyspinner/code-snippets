const apiPrefix = "/api/interactions";
const responses = require("../models/responses");
const interactionServices = require("../services/interaction.service");
const moment = require("moment");
const ObjectId = require("../mongodb").ObjectId;

module.exports = {
   //...
   getTodaysInteractionPoints: getTodaysInteractionPoints
   //...
};

//...

function getTodaysInteractionPoints(req, res) {
   id = new ObjectId(req.auth.userId);
   let today = moment()
      .startOf("day")
      .format();
   let tomorrow = moment()
      .endOf("day")
      .format();
   interactionServices
      .getTodaysInteractionPoints(id, today, tomorrow)
      .then(points => {
         const responseModel = new responses.ItemResponse();
         if (points.length < 1) {
            responseModel.item = 0;
         } else {
            responseModel.item = points[0].totalPoints;
         }
         res.json(responseModel);
      })
      .catch(err => {
         console.log(err);
         res.status(500).send(new responses.ErrorResponse(err));
      });
}

//...
