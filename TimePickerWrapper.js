import React from "react";
import TimePicker from "react-times";
import * as timeFormat from "../helpers/time";
var moment = require("moment");

class TimePickerWrapper extends React.Component {
   constructor(props) {
      super(props);
      const { focused, showTimezone, timezone } = props;

      let hour = this.props.value ? this.props.value.substring(0, 2) : "12";
      let minute = this.props.value ? this.props.value.substring(2, 4) : "00";

      if (parseInt(hour) >= 12) {
         let meridiem = "PM";
      } else {
         let meridiem = "AM";
      }

      this.state = {
         hour,
         minute,
         meridiem: this.meridiem,
         focused,
         timezone,
         showTimezone
      };

      this.onFocusChange = this.onFocusChange.bind(this);
      this.onHourChange = this.onHourChange.bind(this);
      this.onMeridiemChange = this.onMeridiemChange.bind(this);
      this.onMinuteChange = this.onMinuteChange.bind(this);
      this.registerTime = this.registerTime.bind(this);
      this.handleFocusedChange = this.handleFocusedChange.bind(this);
      this.setTime = this.setTime.bind(this);
   }

   componentDidMount() {
      this.setTime(this.state.hour, this.state.minute);
   }

   onHourChange(hour) {
      debugger;
      this.setState({ hour });
   }

   onMinuteChange(minute) {
      this.setState({ minute });
   }

   componentWillReceiveProps(nextProps) {
      debugger;
      if (nextProps.value !== `${this.state.hour}${this.state.minute}`) {
         const hour = nextProps.value.substring(0, 2);
         const minute = nextProps.value.substring(2, 4);
         const time = `${hour}:${minute}`;
         this.onHourChange(hour);
         this.onMinuteChange(minute);
         this.registerTime(time);
         this.setTime(hour, minute);
      }
   }

   registerTime(time) {
      const [hour, minute] = time.split(":");
      this.setState({ hour, minute }, () => this.setTime(hour, minute));
   }

   onMeridiemChange(meridiem) {
      this.setState({ meridiem }, () =>
         this.setTime(this.state.hour, this.state.minute)
      );
   }

   setTime(hour, minute) {
      var formattedTime = moment(
         `${hour}:${minute} ${this.state.meridiem}`,
         "h:mm A"
      );
      formattedTime = timeFormat.timePartToString(formattedTime);
      let inputName = this.props.name;
      let event = {
         target: {
            name: inputName,
            value: `${formattedTime}`
         }
      };
      this.props.setTime(event);
      this.setState({ hour, minute });
   }

   onFocusChange(focused) {
      this.setState({ focused });
   }

   handleFocusedChange() {
      const { focused } = this.state;
      this.setState({ focused: !focused });
   }

   get basicTrigger() {
      const { hour, minute } = this.state;
      return (
         <div
            onClick={this.handleFocusedChange}
            className="time_picker_trigger"
         >
            <div>
               Click to open panel<br />
               {hour}:{minute}
            </div>
         </div>
      );
   }

   get customTrigger() {
      return (
         <div
            onClick={this.handleFocusedChange}
            className="time_picker_trigger"
         />
      );
   }

   get trigger() {
      const { customTriggerId } = this.props;
      const triggers = {
         0: <div />,
         1: this.basicTrigger,
         2: this.customTrigger
      };
      return triggers[customTriggerId];
   }

   render() {
      const { hour, minute, focused, meridiem, timezone } = this.state;

      return (
         <div className="time_picker_wrapper">
            <TimePicker
               {...this.props}
               focused={focused}
               meridiem={meridiem}
               timezone={timezone}
               trigger={this.trigger}
               onFocusChange={this.onFocusChange}
               onHourChange={this.onHourChange}
               onMeridiemChange={this.onMeridiemChange}
               onMinuteChange={this.onMinuteChange}
               onTimeChange={this.registerTime}
               time={hour && minute ? `${hour}:${minute}` : null}
            />
         </div>
      );
   }
}

TimePickerWrapper.defaultProps = {
   customTriggerId: null,
   defaultTime: null,
   focused: false,
   meridiem: null,
   showTimezone: false
};

export default TimePickerWrapper;
