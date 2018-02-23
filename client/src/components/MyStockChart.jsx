import React from 'react'
const ReactHighstock = require('react-highcharts/ReactHighstock.src');
//var Highlight = require('react-highlight');

const MyStockChart = (props) => <ReactHighstock
  config = {props.config}

/>
export default MyStockChart;


