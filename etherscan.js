var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider());
var version = web3.version.api;

const request = require('async-request');

const get = async url => {
  try {
    return await request(url);
  } catch (e) {
    throw e;
  }
};

const main = async() => {
    var url = 'http://api.etherscan.io/api?module=contract&action=getabi&address=0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359'
    var data = await get(url)
    var contractABI = "";
    contractABI = JSON.parse(data.body).result;
    console.log(contractABI);
}
main()
          
          