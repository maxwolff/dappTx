import React, { Component } from 'react'
import MyStockChart from '../components/MyStockChart.jsx'
import NameForm from '../components/NameForm.js'
import axios from 'axios'

class Home extends Component {
  constructor(props) {
    super(props)

    this.contractConfig = {   //init config for contract usage chart
      chart: {
        borderColor: '#e6e6e8',
        borderWidth: 1,
        borderRadius: 2,
        spacing: [16,16,16,16]
      },
      colors: ['#54A0FF', '#1DD1A1', '#FECA57', '#FF6B6B', '#FF9FF3', '#5F27CD', '#48DBFB', '#00D2D3'],
      loading: {
        showDuration: 500,
        labelStyle: {
          fontFamily: 'IBM Plex Mono, sans-serif',
          fontWeight: 400,
          color: '#0080ff'
        }
      },
      rangeSelector: {
        buttonTheme: {
          fill: '#f6f6f8',
          style: {
            fontFamily: 'IBM Plex Mono, sans-serif',
            color: '#383840'
          },
          states: {
            hover: {
              fill: '#0080ff',
              style: {
                color: 'white'
              }
            },
            select: {
              fill: '#54A0FF',
              r: 1,
              style: {
                color: 'white'
              }
            }
          }
        },
        inputStyle: {
          fontFamily: 'IBM Plex Mono, sans-serif',
          color: '#383840'
        },
        inputBoxBorderColor: '#e6e6e8',
        labelStyle: {
          fontFamily: 'IBM Plex Mono, sans-serif',
          color: '#383840'
        }
      },
      scrollbar: {
        barBackgroundColor: '#f6f6f8',
        barBorderColor: 'e6e6e8',
        buttonArrowColor: '#383840',
        buttonBackgroundColor: '#f6f6f8',
        buttonBorderColor: '#e6e6e8',
        trackBackgroundColor: '#e6e6e8',
        trackBorderColor: '#e6e6e8'
      },
      series: [
      {
        data: [], 
        name: 'Volume',
        tooltip: {
              valueDecimals: 2,
              valueSuffix: '%'
          }
      }],
      tooltip: {xDateFormat: '%Y-%m-%d'},
      xAxis: {
        labels: {
          style: {
            fontFamily: 'IBM Plex Mono, sans-serif',
            color: '#383840'
          }
        },
        lineColor: 'white'
      },
      yAxis: {
        labels: {
          style: {
            fontFamily: 'IBM Plex Mono, sans-serif',
            color: '#383840'
          }
        }
      }
    }

    this.fnConfig = Object.assign({}, this.contractConfig)    //copy init config for function usage chart

    this.state = {
      address: '',
      contractConfig: this.contractConfig,
      fnConfig: this.fnConfig
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

      let result = []   //consolidate function data in result array for chart config
      for (var i in funcResultArr){
        result.push({
          data: funcResultArr[i],
          name: i, 
          showInNavigator: true
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

