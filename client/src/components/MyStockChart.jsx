import React from 'react'
const ReactHighstock = require('react-highcharts/ReactHighstock.src')
//var Highlight = require('react-highlight')
let chartReflow = undefined

class MyStockChart extends React.Component {

  componentDidUpdate() {
		const chart = this.refs.chart ? this.refs.chart.getChart() : {}
    chartReflow = chartReflow || chart.reflow
    chart.reflow = () => {}
    setTimeout(() => (chart.reflow = chartReflow))
	}

  render(){
    return(
      <ReactHighstock config={this.props.config} ref="chart" />
    )
  }

}

export default MyStockChart