import React, { Component } from 'react';

import MyStockChart from '../components/MyStockChart.jsx';
import axios from 'axios';



class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config1: {},
      config2: {}
    };
  }

  componentDidMount() {
    this.callApi()
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    axios.get('/api/0x06012c8cf97BEaD5deAe237070F9587f8E7A266d/0x5A1340E0/0x5A8F969F') // hard coded
  .then((response) => {
    var data = response.data
    //var sampled = [];
    var contracts = []; 
    var funcList = []; 
    var funcResultArr = [];
    Object.keys(data).forEach( elem => {
      var dateTemp = new Date(elem)
      //sampled.push([Math.round(dateTemp.getTime()),data[elem]['sampledEthTx']])
      var epoch = Math.round(dateTemp.getTime())
      var perc = 100.0 * data[elem]['contractTx'] / data[elem]['sampledEthTx'] 
      contracts.push([epoch, perc])

      var elemFuncs = data[elem].functions
      Object.keys(elemFuncs).forEach( func => {
        if (!(funcList.includes(func))){
          funcList.push(func)
          funcResultArr[func] = [];
        }else{
          funcResultArr[func].push([epoch,data[elem].functions[func]])
        }
      });
    });
    this.setState({
      config1: {
        title: {
          text: 'Contract usage as % of Sampled Ethereum Transactions'
        },
        series: [
        {
          data: contracts, 
          name: '%',
           tooltip: {
                valueDecimals: 2,
                xDateFormat: '%Y-%m-%d'
            }


        }]
      }
    });
    var result = []
    for (var i in funcResultArr){
      result.push({
        data: funcResultArr[i],
        name: i, 
        tooltip:{ xDateFormat: '%Y-%m-%d'}
      })
    }
    this.setState({
      config2: {
        title: {
          text: 'Contract Function Call Usage'
        },
        series: result
      }
    })
    console.log(this.state)
  }).catch(function (error) {
    console.log(error);
    });
  };

  render() {
    return (
    <div>
      <MyStockChart config={this.state.config1} />,
      <MyStockChart config={this.state.config2} />
    </div>
    )
  }
}
export default Home;

