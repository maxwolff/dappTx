import React from 'react'
import EmptyMessage from '../components/EmptyMessage'
const ReactHighstock = require('react-highcharts/ReactHighstock.src')
//var Highlight = require('react-highlight')
let chartReflow = undefined

class StockChart extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.showLoading('No chart data')
    window.dispatchEvent(new Event('resize'))
  }
  
  componentDidUpdate() {
    const chart = this.refs.chart ? this.refs.chart.getChart() : {}   //allow chart animation while preserving reflow
    chartReflow = chartReflow || chart.reflow
    chart.reflow = () => {}
    setTimeout(() => (chart.reflow = chartReflow))
  }

  showLoading(message) {   //expose loading state trigger function for imperative calls from parent component via ref
    const chart = this.refs.chart ? this.refs.chart.getChart() : {}
    if(message)
      chart.showLoading(message)
    else
      chart.showLoading('<img src="chart-load.gif" height="48px"><br>Loading chart data...')
  }

  render() {
    return(
      <div className="chart-area">
        <header className="chart-header">
          <h1 className="chart-title">{this.props.title}</h1>
          <p className="chart-subtitle">{this.props.subtitle}</p>
        </header>
        <ReactHighstock config={this.props.config} ref="chart" />
      </div>
    )
  }

}

export default StockChart