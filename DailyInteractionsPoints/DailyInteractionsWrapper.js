import React from "react";
import DailyInteractionsPointsGraph from "./DailyInteractionsPointsGraph";
import * as interactionsService from "../services/interaction.service";

class DailyInteractionsWrapper extends React.Component {
   constructor(props) {
      super(props);

      this.state = {
         todaysPoints: null
      };
      this.updateGraph = this.updateGraph.bind(this)
   }

   componentDidMount() {
       this.updateGraph()
   }

   updateGraph() {
      interactionsService.getTodaysInteractionPoints().then(points => {
         if (points.item > 100) {
            points.item = 100;
         }
         this.setState(prevState => ({
            ...prevState,
            todaysPoints: points.item
         }));
      });
   }

   render() {
      return (
         <DailyInteractionsPointsGraph pointCount={this.state.todaysPoints} />
      );
   }
}
export default DailyInteractionsWrapper;
