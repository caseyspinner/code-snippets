import React from "react";

import { connect } from "react-redux";

import NotificationsList from "../../components/notifications/NotificationsList";
import { deleteNotification } from "../../actions/notifications";

class NotificationsHistoryList extends React.Component {
   constructor(props) {
      super(props);
      this.deleteNotification = this.deleteNotification.bind(this);
   }

   deleteNotification(id) {
      const that = this;
      return () => {
         that.props.deleteNotification(id);
      };
   }

   render() {
      return (
         <div className="content">
            <div className="row">
               <div className="col col-sm-3">
                  <h5>ID</h5>
               </div>
               <div className="col col-sm-3">
                  <h5>Type</h5>
               </div>
               <div className="col col-sm-3">
                  <h5>Message</h5>
               </div>
               <div className="col col-sm-3">
                  <h5>Action</h5>
               </div>
            </div>
            {
               <NotificationsList
                  deleteNotification={this.deleteNotification}
                  notifications={this.props.notifications}
               />
            }
         </div>
      );
   }
}

const mapStateToProps = state => ({
   notifications: state.notifications
});

const mapDispatchToProps = dispatch => ({
   deleteNotification: id => dispatch(deleteNotification(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(
   NotificationsHistoryList
);
