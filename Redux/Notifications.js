import React from "react";
import * as notificationService from "../../services/notification.service";
import NotificationsForm from "./NotificationForm";
import WizardGrid from "../widgets/WidgetGrid";
import JarvisWidget from "../widgets/JarvisWidget";
import PageHeader from "../PageHeader";
import headerObject from "../../constants/page-header.js";
import { connect } from "react-redux";
import { addNotification } from "../../actions/notifications";

class Notifications extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         notifications: []
      };

      this.onCancel = this.onCancel.bind(this);
      this.onDelete = this.onDelete.bind(this);
      this.onSave = this.onSave.bind(this);
      this.onSelect = this.onSelect.bind(this);
   }

   componentDidMount() {
      notificationService.readAll().then(data => {
         this.setState({ notifications: data.items });
      });
   }

   onCancel() {
      this.setState({ formData: null });
   }

   onDelete() {
      const formData = this.state.formData;

      notificationService
         .del(formData._id)
         .then(() => {
            this.setState(prevState => {
               const updatedItems = prevState.notifications.filter(item => {
                  return item._id !== formData._id;
               });
               return { notifications: updatedItems };
            });

            this.onCancel();
         })
         .catch(err => console.log(err));
   }

   onSave(updatedFormData) {
      this.setState(prevState => {
         const existingItem = prevState.notifications.filter(item => {
            return item._id === updatedFormData._id;
         });

         let updatedItems = [];

         if (existingItem && existingItem.length > 0) {
            updatedItems = prevState.notifications.map(item => {
               return item._id === updatedFormData._id ? updatedFormData : item;
            });
         } else {
            updatedItems = prevState.notifications.concat(updatedFormData);
         }

         return {
            notifications: updatedItems,
            formData: null,
            errorMessage: null
         };
      });
   }

   onSelect(item, event) {
      event.preventDefault();
      this.setState({
         formData: item
      });
      this.props.onAddNotification(item);
   }

   render() {
      const notifications = this.state.notifications ? (
         this.state.notifications.map(notification => (
            <li
               key={notification._id}
               onClick={this.onSelect.bind(this, notification)}
            >
               {notification.message}
               {notification.preview}
            </li>
         ))
      ) : (
         <React.Fragment />
      );

      return (
         <React.Fragment>
            <div id="main" style={{ marginLeft: 0 }} role="main">
               <div id="ribbon">
                  <span className="ribbon-button-alignment">
                     <span
                        id="refresh"
                        className="btn btn-ribbon"
                        data-action="resetWidgets"
                        data-title="refresh"
                        rel="tooltip"
                        data-placement="bottom"
                        data-original-title="<i className='text-warning fa fa-warning'></i> Warning! This will reset all your widget settings."
                        data-html="true"
                     >
                        <i className="fa fa-refresh" />
                     </span>
                  </span>
                  <ol className="breadcrumb">
                     <li>Home</li>
                     <li>Notifications</li>
                  </ol>
               </div>
               <div id="content" style={{ paddingLeft: 13 }}>
                  <PageHeader
                     pageHeaderName={headerObject.notificationsCrud.pageHeader}
                     subtitle={headerObject.notificationsCrud.subTitle}
                  />
                  <WizardGrid>
                     <div className="row">
                        <div className="col-sm-6">
                           <JarvisWidget
                              title={
                                 <span>
                                    <i className="fa fa-bell-o" /> Notifications
                                    Form
                                 </span>
                              }
                           >
                              <NotificationsForm
                                 formData={this.state.formData}
                                 onSave={this.onSave}
                                 onDelete={this.onDelete}
                                 onCancel={this.onCancel}
                              />
                           </JarvisWidget>
                        </div>
                        <div className="col-sm-6">
                           <JarvisWidget
                              title={
                                 <span>
                                    <i className="fa fa-bell-o" /> Notifications
                                 </span>
                              }
                           >
                              <ul>{notifications}</ul>
                           </JarvisWidget>
                        </div>
                     </div>
                  </WizardGrid>
               </div>
            </div>
         </React.Fragment>
      );
   }
}

const mapDispatchToProps = dispatch => ({
   onAddNotification: notification => {
      dispatch(addNotification(notification));
   }
});

export default connect(null, mapDispatchToProps)(Notifications);
