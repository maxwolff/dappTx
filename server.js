var express = require('express')
var app = express()
app.use(express.static('public'));
app.set('view engine', 'ejs')
var getFreq = require('./frequency.js');

/* const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); */


async function getData(res){
	var id = '0x8d12a197cb00d4747a1fe03395095ce2a5cc6819' // etherdelta method 2?
	var start = 1514764800
	var end = 1515906166
	var result = await getFreq(id, start, end)
	console.log('here1,',result[0])
 	res.render('index', {weather: result, error: null});
	return result
}



app.get('/', function (req, res) {
	getData(res)
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
