import React, { Component } from 'react';

import MyStockChart from '../components/MyStockChart.jsx';
import NameForm from '../components/NameForm.js';
import axios from 'axios';



class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config1: {},
      config2: {}, 
      address: "0x06012c8cf97BEaD5deAe237070F9587f8E7A266d"
    };
  }

  componentDidMount() {
    this.callApi()
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const url = '/api/' + this.state.address + '/0x5A1340E0/0x5A8F969F';  //'/api/0x06012c8cf97BEaD5deAe237070F9587f8E7A266d/0x5A1340E0/0x5A8F969F'
    //console.log(url)

    axios.get(url).then((response) => {   //call API with URL to get data | init arrays for data
      let data = response.data
      //var sampled = [];
      let contracts = []; 
      let funcList = []; 
      let funcResultArr = [];

      Object.keys(data).forEach( elem => {  //manipulate contract data and push to contracts array
        const dateTemp = new Date(elem);
        //sampled.push([Math.round(dateTemp.getTime()),data[elem]['sampledEthTx']])
        const epoch = Math.round(dateTemp.getTime());
        const perc = 100.0 * data[elem]['contractTx'] / data[elem]['sampledEthTx']; 
        contracts.push([epoch, perc]);

        const elemFuncs = data[elem].functions;   //manipulate function list and usage data and push to function list and usage arrays
        Object.keys(elemFuncs).forEach( func => {
          if (!(funcList.includes(func))){
            funcList.push(func)
            funcResultArr[func] = [];
          }else{
            funcResultArr[func].push([epoch,data[elem].functions[func]])
          }
        });
      });

      this.setState({   //doing too much-async causing render issues? manipulate config data, THEN call setState
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

      var result = []   //manipulate function usage array for chart config
      for (var i in funcResultArr){
        result.push({
          data: funcResultArr[i],
          name: i, 
          tooltip:{ xDateFormat: '%Y-%m-%d'}
        });
      }

      this.setState({   //state should probably be set after API is called, data is manipulated, and configs are ready
        config2: {
          title: {
            text: 'Contract Function Call Usage'
          },
          series: result
        }
      });

      //console.log(this.state);
    }).catch(function (error) {
      console.log(error);
    });
  };

  renderAddress = (submitData) => {   //change Tx address in container state, call API, should change state independently of API call
    this.setState({address: submitData});
    this.callApi();
  } 

  render() {
    return (
    <div>
      <NameForm addressCallback = {this.renderAddress}/>
      <MyStockChart config={this.state.config1} />
      <MyStockChart config={this.state.config2} /> 
    </div>
    )
  }
}
export default Home;

