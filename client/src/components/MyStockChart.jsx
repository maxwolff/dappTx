import React from 'react'
const ReactHighstock = require('react-highcharts/ReactHighstock.src')
//var Highlight = require('react-highlight')
let chartReflow = undefined

class MyStockChart extends React.Component {
  
  componentDidUpdate() {
      const chart = this.refs.chart ? this.refs.chart.getChart() : {}   //allow chart animation while preserving reflow
      chartReflow = chartReflow || chart.reflow
      chart.reflow = () => {}
      setTimeout(() => (chart.reflow = chartReflow))
  }

  showLoading() {   //expose loading state trigger function for imperative calls from parent component via ref
    const chart = this.refs.chart ? this.refs.chart.getChart() : {}
    chart.showLoading('<img src="chart-load.gif" height="48px"><br>Loading chart data...')
  }

  render(){
    return(
      <ReactHighstock config={this.props.config} ref="chart" />
    )
  }

}

export default MyStockChart