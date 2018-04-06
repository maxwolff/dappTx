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
      plotOptions: {
        series: {
          animation: {
            duration: 0
          }
        }
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
      plotOptions: {
        series: {
          animation: {
            duration: 0
          }
        }
      },
      series: []
    }

    this.contractAnim = this.contractConfig.plotOptions.series.animation    //shorthands for chart animation properties
    this.fnAnim = this.fnConfig.plotOptions.series.animation
    
    this.state = {
      address: '',
      contractConfig: {},
      fnConfig: {},
      isLoading: false
    }
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

      this.contractAnim.duration = this.fnAnim.duration = 1000    //enable chart animation before update

      this.setState({   //update charts with new data and exit loading state
        contractConfig: this.contractConfig,
        fnConfig: this.fnConfig,
        isLoading: false
      })

    }).catch(function (error) {
      console.log(error)
    })
  }

  renderAddress = (newAddress) => {
    this.contractAnim.duration = this.fnAnim.duration = 0   //disable chart animation before entering loading state
    this.setState({   //enter loading state
      contractConfig: this.contractConfig,
      fnConfig: this.fnConfig,
      isLoading: true
    })
    this.callApi(newAddress)   //get chart data for a new address
  }

  render() {
    return (
    <div>
      <NameForm addressCallback = {this.renderAddress}/>
      <MyStockChart class="chart contract-chart" config={this.state.contractConfig} isLoading={this.state.isLoading} />
      <MyStockChart class="chart function-chart" config={this.state.fnConfig} isLoading={this.state.isLoading} /> 
    </div>
    )
  }
}
export default Home

