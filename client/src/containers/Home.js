import React, { Component } from 'react'
import MyStockChart from '../components/MyStockChart.jsx'
import NameForm from '../components/NameForm.js'
import axios from 'axios'

class Home extends Component {
  constructor(props) {
    super(props)

    this.contractConfig = {   //init config for contract usage chart
      loading: {
        showDuration: 500
      },
      title: {
        text: 'Contract Txns (Pct. of Sampled Ethereum Txns)'
      },
      series: [
      {
        data: [], 
        name: 'Volume',
        tooltip: {
              valueDecimals: 2,
              valueSuffix: '%',
              xDateFormat: '%Y-%m-%d'
          }
      }]
    }

    this.fnConfig = {   //init config for function usage chart
      loading: {
        showDuration: 500
      },
      title: {
        text: 'Contract Function Calls'
      },
      series: []
    }
    
    this.state = {
      address: '',
      contractConfig: {},
      fnConfig: {}
    }

    this.contractChart = React.createRef()    //chart component refs for imperative loading animations
    this.fnChart = React.createRef()
  }

  callApi = async (newAddress) => {
    const url = '/api/' + newAddress + '/0x5A1340E0/0x5A8F969F'  //'/api/0x06012c8cf97BEaD5deAe237070F9587f8E7A266d/0x5A1340E0/0x5A8F969F'
    console.log(url)
    
    axios.get(url).then((response) => {   //call API with URL to get data; init arrays for data
      let data = response.data
      //var sampled = []
      let contracts = [] 
      let funcList = [] 
      let funcResultArr = []

      Object.keys(data).forEach( elem => {  //manipulate contract data and push to contracts array
        const dateTemp = new Date(elem)
        //sampled.push([Math.round(dateTemp.getTime()),data[elem]['sampledEthTx']])
        const epoch = Math.round(dateTemp.getTime())
        const perc = 100.0 * data[elem]['contractTx'] / data[elem]['sampledEthTx']
        contracts.push([epoch, perc])

        const elemFuncs = data[elem].functions   //manipulate function data and push to function arrays
        Object.keys(elemFuncs).forEach( func => {
          if (!(funcList.includes(func))){
            funcList.push(func)
            funcResultArr[func] = []
          } else{
            funcResultArr[func].push([epoch,data[elem].functions[func]])
          }
        })
      })

      var result = []   //consolidate function data in result array for chart config
      for (var i in funcResultArr){
        result.push({
          data: funcResultArr[i],
          name: i, 
          tooltip:{ xDateFormat: '%Y-%m-%d'}
        })
      }

      this.contractConfig.series[0].data = contracts   //update chart configs with fetched data
      this.fnConfig.series = result

      this.setState({   //set state with new chart configs and address
        address: newAddress,
        contractConfig: this.contractConfig,
        fnConfig: this.fnConfig
      })

    }).catch(function (error) {
      console.log(error)
    })
  }

  renderAddress = (newAddress) => {
    this.contractChart.current ? this.contractChart.current.showLoading() : {}    //trigger loading states before rerender
    this.fnChart.current ? this.fnChart.current.showLoading() : {}

    this.callApi(newAddress)   //get chart data for a new address
  }

  render() {
    return (
    <div>
      <NameForm addressCallback = {this.renderAddress}/>
      <MyStockChart class="chart contract-chart" ref={this.contractChart} config={this.state.contractConfig} isLoading={this.state.isLoading} />
      <MyStockChart class="chart function-chart" ref={this.fnChart} config={this.state.fnConfig} isLoading={this.state.isLoading} /> 
    </div>
    )
  }
}
export default Home

