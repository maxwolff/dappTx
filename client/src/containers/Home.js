import React, { Component } from 'react';

import MyStockChart from '../components/MyStockChart.jsx';
import axios from 'axios';



class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      config: {}
    };
  }

  componentDidMount() {
    this.callApi()
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    axios.get('/api/0x8d12a197cb00d4747a1fe03395095ce2a5cc6819/0x5a6fc956/0x5A8F969F') // hard coded
  .then((response) => {
    var data = response.data
    var sampled = [];
    var contracts = []; 
    console.log('data',data)
    Object.keys(data).forEach( elem => {
      var dateTemp = new Date(elem)
      //sampled.push([Math.round(dateTemp.getTime()),data[elem]['sampledEthTx']])
      var epoch =Math.round(dateTemp.getTime())
      var perc = 1.0 * data[elem]['contractTx'] / data[elem]['sampledEthTx']
      contracts.push([epoch, perc])
    });
    this.setState({
      config: {
        title: {
          text: 'Etherdelta as % of Ethereum Transactions'
        },
        series: [
        {
          data: contracts, 
          name: 'percent',
           tooltip: {
                valueDecimals: 2
            }
        }
        ]
      }
    })
  }).catch(function (error) {
    console.log(error);
    });
  };


/*
var g = new Date()
g = g/1000
g.toString(16)
parse int or smtg 
*/


  render() {
    return (
      <MyStockChart config={this.state.config} />
    )
  }
}
export default Home;