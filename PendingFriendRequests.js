import React from "react";
import * as friendsService from "./friends.service";
import * as usersService from "./users.service";
import WizardGrid from "./widgets/WidgetGrid";
import JarvisWidget from "./widgets/JarvisWidget";
import PageHeader from "./PageHeader";
import headerObject from "./../constants/page-header.js";
const { map } = require("p-iteration");


class PendingFriendRequests extends React.Component {
   constructor(props) {
      super(props);

      this.state = {
         requests: []
      };
      this.updateRequestList = this.updateRequestList.bind(this);
   }

   componentDidMount() {
      this.updateRequestList();
   }

   updateRequestList() {
      friendsService
         .getMyPendingRequests()
         .then(requests => {
            this.setState({ requests: requests.items });
            return requests.items;
         })
         .then(requests => {
            return map(requests, async request => {
               await usersService
                  .getById(request.requestorUserId)
                  .then(user => {
                     request.firstName = user.item.firstName;
                     return request;
                  });
               return request;
            });
         })
         .then(updatedRequests => {
            this.setState({ requests: updatedRequests });
         });
   }

   acceptRequest(id, e) {
      e.preventDefault();
      friendsService.acceptRequest(id).then(this.updateRequestList);
   }

   rejectRequest(id, e) {
      e.preventDefault();
      friendsService.rejectRequest(id).then(this.updateRequestList);
   }

   render() {
      const requests = [...this.state.requests];
      const requestList = requests.map(request => {
         return (
            <div
               key={request._id}
               style={{ margin: 4, verticalAlign: "middle" }}
               className="row"
            >
               <li>
                  <div
                     style={{ display: "inline-block", paddingTop: 9 }}
                     className="col-md-6 col-sm-6 col-xs-6"
                  >
                     <span className="font-md">
                        New request from:{" "}
                        <a
                           href={`http://localhost:3000/user-profile/${
                              request.requestorUserId
                           }`}
                        >
                           <strong>{request.firstName}</strong>
                        </a>{" "}
                     </span>
                  </div>
                  <div
                     className="col-md-6 col-sm-6 col-xs-6"
                     style={{ textAlign: "right" }}
                  >
                     <button
                        style={{ marginLeft: 7, marginRight: 7 }}
                        className="btn btn-success btn-sm"
                        onClick={this.acceptRequest.bind(this, request._id)}
                     >
                        Accept
                     </button>
                     <button
                        style={{ margin: 4 }}
                        className="btn btn-default btn-sm"
                        onClick={this.rejectRequest.bind(this, request._id)}
                     >
                        Reject
                     </button>
                  </div>
               </li>
            </div>
         );
      });

      return (
         <React.Fragment>
            <div id="ribbon">
               <span className="ribbon-button-assignment" />
               <ol className="breadcrumb">
                  <li>Home</li>
                  <li>Friend Requests</li>
               </ol>
            </div>
            <div id="content">
            <PageHeader
            pageHeaderName={headerObject.friendRequests.pageHeader}
            subtitle={headerObject.friendRequests.subTitle}
          />
               <WizardGrid>
                  <div className="row">
                     <div className="col-sm-8 col-md-8 col-lg-8">
                        <JarvisWidget
                           title={
                              <span>
                                 <i className="fa fa-group" /> Pending Friend
                                 Requests
                              </span>
                           }
                        >
                           {requestList.length < 1 ? (
                              "You have no pending friend requests."
                           ) : (
                              <ul
                                 style={{
                                    listStyleType: "none",
                                    paddingLeft: 10
                                 }}
                              >
                                 {requestList}
                              </ul>
                           )}
                        </JarvisWidget>
                     </div>
                  </div>
               </WizardGrid>
            </div>
         </React.Fragment>
      );
   }
}
export default PendingFriendRequests;
