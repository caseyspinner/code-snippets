import React from "react";
import ReactHighcharts from "react-highcharts";
import CountUp from "react-countup";
import ReactFitText from "react-fittext";

class DailyInteractionsPointsGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      config: {
        chart: {
          type: "pie",
          height: "100%",
          marginTop: 32
        },
        title: {
          text: "Daily Point Goal",
          widthAdjust: -42,
          style: {
            "font-family": "Open Sans",
            "font-size": "22px",
            "font-weight": 300
          }
        },
        credits: { enabled: false },
        plotOptions: {
          pie: {
            allowPointSelect: false,
            cursor: null,
            innerSize: "60%",
            dataLabels: {
              enabled: false
            },
            enableMouseTracking: false,
            startAngle: 270
          }
        },
        series: [
          {
            name: "Points Series",
            dataLabels: {
              enabled: false
            },
            data: [
              {
                name: "Points",
                y: this.props.pointCount
              },
              {
                name: "Total",
                y: 100 - this.props.pointCount,
                color: "#eee"
              }
            ]
          }
        ]
      }
    };
  }

  componentDidMount() {
    let chart = this.refs.chart.getChart();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pointCount !== this.state.config.series[0].data[0].y) {
      var configCopy = { ...this.state.config };
      configCopy.series[0].data[0].y = nextProps.pointCount;
      configCopy.series[0].data[1].y = 100 - nextProps.pointCount;
      this.setState({ config: configCopy });
    }
  }

  render() {
    return (
      <div
        id="chartContainer"
        style={{
          position: "relative",
          textAlign: "center",
          marginRight: 15
        }}
      >
        <ReactFitText compressor={0.8} minFontSize={30} maxFontSize={72}>
          <div
            id="counterParent"
            style={{
              zIndex: 10,
              textAlign: "center",
              position: "absolute",
              top: "44%",
              left: "1%",
              fontWeight: 700,
              height: "100%",
              width: "100%",
              color: "#48778a"
            }}
          >
            <CountUp
              start={0}
              end={this.state.config.series[0].data[0].y}
              duration={1}
            />%
          </div>
        </ReactFitText>
        <div
          id="chartParent"
          style={{
            position: "relative",
            margin: 0,
            height: "220",
            width: "220",
            textAlign: "center"
          }}
        >
          <ReactHighcharts config={this.state.config} ref="chart" />
        </div>
      </div>
    );
  }
}
export default DailyInteractionsPointsGraph;
