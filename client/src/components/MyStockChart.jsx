import React from 'react'
const ReactHighstock = require('react-highcharts/ReactHighstock.src')
//var Highlight = require('react-highlight')

class MyStockChart extends React.Component {

  componentDidUpdate() {
		let chart = this.refs.chart.getChart();
		chart.reflow = () => {};
	}

  render(){
    return(
      <ReactHighstock config={this.props.config} ref="chart" />
    )
  }

}

export default MyStockChart