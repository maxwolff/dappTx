import React from 'react'
import {findDOMNode} from 'react-dom'
import EmptyMessage from './EmptyMessage'
import ReactHighstock from 'react-highcharts/ReactHighstock'

let chartReflow = undefined

class StockChart extends React.Component {

  componentDidMount() {
    this.showLoading(' ')
    window.dispatchEvent(new Event('resize'))   //fix rendering bugs
    const chart = findDOMNode(this).querySelector('.chart-container')
    chart.style.height = chart.offsetHeight + 'px'
  }
  
  componentDidUpdate() {
    if (!this.props.isLoading){
      const chart = this.refs.chart ? this.refs.chart.getChart() : {}   //allow chart animation while preserving reflow
      chartReflow = chartReflow || chart.reflow
      chart.reflow = () => {}
      setTimeout(() => (chart.reflow = chartReflow))
    }
    else {
      this.showLoading()
    }
  }

  showLoading(message) {   //expose loading state trigger function for imperative calls from parent component via ref
    const chart = this.refs.chart ? this.refs.chart.getChart() : {}
    if(message)
      chart.showLoading(message)
    else
      chart.showLoading('<div class="loading-message"><img src="chart-load.gif" height="48px"><p>Loading chart data...</p></div>')
  }

  hideLoading() {
    const chart = this.refs.chart ? this.refs.chart.getChart() : {}
    chart.hideLoading()
  }

  render() {
    return(
      <div className="chart-area">
        <header className="chart-header">
          <h1 className="chart-title">{this.props.title}</h1>
          <p className="chart-subtitle">{this.props.subtitle}</p>
        </header>
        <div className="chart-container">
          <EmptyMessage isEmpty={this.props.isEmpty} loadExample={this.props.loadExample} />
          <ReactHighstock config={this.props.config} ref="chart" />
        </div>
      </div>
    )
  }

}

export default StockChart