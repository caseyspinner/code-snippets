const apiPrefix = "/api/interactions";
const responses = require("../models/responses");
const interactionServices = require("../services/interaction.service");
const moment = require("moment");
const ObjectId = require("../mongodb").ObjectId;

module.exports = {
   //...
   getTodaysCompletedInteractions: getTodaysCompletedInteractions,
   //...
};

function getTodaysCompletedInteractions(req, res) {
   id = new ObjectId(req.auth.userId);
   let today = moment()
      .startOf("day")
      .format();
   let tomorrow = moment()
      .endOf("day")
      .format();

   interactionServices
      .getTodaysCompletedInteractions(id, today, tomorrow)
      .then(interactions => {
         const responseModel = new responses.ItemResponse();
         responseModel.items = interactions;
         res.json(responseModel);
      })
      .catch(err => {
         console.log(err);
         res.status(500).send(new responses.ErrorResponse(err));
      });
}
