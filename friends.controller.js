const responses = require("../models/responses");
const friendsService = require("../services/friends.service");
const friendsManager = require("../managers/friends.manager");
const websocket = require("../websocket");

module.exports = {
    //..
   rejectRequest: rejectRequest,
   getMyPendingRequests: getMyPendingRequests,
   acceptRequest: acceptRequest
};

//...

function getMyPendingRequests(req, res) {
   let userId = req.auth.userId;
   friendsService
      .getMyPendingRequests(userId)
      .then(requests => {
         const responseModel = new responses.ItemResponse();
         responseModel.items = requests;
         res.status(201).json(responseModel);
      })
      .catch(err => {
         console.log(err);
         res.status(500).send(new responses.ErrorResponse(err));
      });
}

function rejectRequest(req, res) {
   friendsService
      .rejectRequest(req.params.id)
      .then(() => {
         const responseModel = new responses.SuccessResponse();
         res.status(200).json(responseModel);
      })
      .catch(err => {
         console.log(err);
         res.status(500).send(new responses.ErrorResponse(err));
      });
}

function acceptRequest(req, res) {
   friendsManager
      .acceptRequest(req.params.id)
      .then(() => {
         const responseModel = new responses.SuccessResponse();
         res.status(200).json(responseModel);
      })
      .catch(err => {
         console.log(err);
         res.status(500).send(new responses.ErrorResponse(err));
      });
}
