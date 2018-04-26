import React, { Component } from 'react'
import MyStockChart from '../components/MyStockChart.jsx'
import ChartConfig from '../components/ChartConfig.js'
import NameForm from '../components/NameForm.js'
import axios from 'axios'
import {cloneDeep} from 'lodash'

class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      address: '',
      volConfig: cloneDeep(ChartConfig),
      fnConfig: cloneDeep(ChartConfig)
    }

    this.volChart = React.createRef()    //chart component refs for imperative loading animations
    this.fnChart = React.createRef()
  }

  callApi = async (newAddress) => {
    const url = '/api/' + newAddress + '/0x5A1340E0/0x5A8F969F'
    console.log(url)
    
    axios.get(url).then((response) => {   //call API with URL to get data
      const data = response.data

      const volSeries = Object.keys(data).map(elem => {   //map contract data for chart series config
        const date = Math.round(new Date(elem).getTime())
        const pct = 100.0 * data[elem]['contractTx'] / data[elem]['sampledEthTx']
        return [date, pct]
      })

      const fnSeries = Object.keys(data).reduce((series, elem) => {   //reduce function data for chart series config
        const date = Math.round(new Date(elem).getTime())
        Object.keys(data[elem].functions).map((func) => {
          const index = series.findIndex(series => series['name'] === func)
          if(index < 0) {
            series.push({
              data: [[date, data[elem].functions[func]]],
              name: func,
              showInNavigator: true
            })
          }
          else {
            series[index].data.push([date, data[elem].functions[func]])
          } 
        })
        return series
      }, [])

      const newVolConfig = cloneDeep(this.state.volConfig)    //create new chart configs with fetched data
      newVolConfig.series[0].data = volSeries
      const newFnConfig = cloneDeep(this.state.fnConfig)
      newFnConfig.series = fnSeries

      this.setState({   //set state with new chart configs and address
        address: newAddress,
        volConfig: newVolConfig,
        fnConfig: newFnConfig
      })

    }).catch(function (error) {
      console.log(error)
    })
  }

  renderAddress = (newAddress) => {
    this.volChart.current ? this.volChart.current.showLoading() : {}    //trigger loading states before rerender
    this.fnChart.current ? this.fnChart.current.showLoading() : {}

    this.callApi(newAddress)   //get chart data for a new address
  }

  render() {
    return (
    <div>
      <NameForm addressCallback = {this.renderAddress}/>
      <MyStockChart class="chart contract-chart" ref={this.volChart} config={this.state.volConfig} />
      <MyStockChart class="chart function-chart" ref={this.fnChart} config={this.state.fnConfig} /> 
    </div>
    )
  }
}
export default Home