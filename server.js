var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;
app.use(express.static('public'));

app.set('view engine', 'ejs')
var getFreq = require('./frequency.js');

/* const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); */

 
async function getData(req,res){

	var result = await getFreq.getFreq(req.params['contractID'], req.params['startTime']) // get frequencies for all blocks after this start time
	//res.send(result)
  res.send(result)
}


app.get('/api/:contractID/:startTime', function (req, res) {
  getData(req,res)

})

app.listen(3000, function () {
  console.log('listening on port 3000')
})

/*
example params:   
var id = '0x8d12a197cb00d4747a1fe03395095ce2a5cc6819' // "etherdelta_2" https://etherscan.io/address/0x8d12a197cb00d4747a1fe03395095ce2a5cc6819
var start = 1514764800 // start time

*/