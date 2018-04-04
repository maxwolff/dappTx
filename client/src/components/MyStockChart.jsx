import React from 'react'
const ReactHighstock = require('react-highcharts/ReactHighstock.src')
//var Highlight = require('react-highlight')

class MyStockChart extends React.Component {

  render(){
    return(
      <ReactHighstock config={this.props.config} />
    )
  }

}

export default MyStockChart