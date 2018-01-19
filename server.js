var express = require('express')
var app = express()
app.use(express.static('public'));
app.set('view engine', 'ejs')
var getFreq = require('./frequency.js');

/* const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); */

 
async function getData(res){
	var id = '0x8d12a197cb00d4747a1fe03395095ce2a5cc6819' // "etherdelta_2" https://etherscan.io/address/0x8d12a197cb00d4747a1fe03395095ce2a5cc6819
	var start = 1514764800 // start time
	var result = await getFreq(id, start) // get frequencies for all blocks after this start time
 	res.render('index', {data: result, error: null});
	return result
}

/* example return data : 
[ { timestamp: '0x5a626c7e',
    totalTransactions: '189',
    contractFreq: '6' },
  { timestamp: '0x5a626c83',
    totalTransactions: '195',
    contractFreq: '19' } ] */ 

app.get('/', function (req, res) {
	getData(res)
})

app.listen(3000, function () {
  console.log('listening on port 3000')
})
