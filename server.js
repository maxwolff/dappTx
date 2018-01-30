
var express = require('express'),
  app = express()
  //port = process.env.PORT || 3000;
const PORT = process.env.PORT || 5000 //react is 8000

app.use(express.static('public'));

app.set('view engine', 'ejs')
var query = require('./frequency.js');

/* const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); */


 
async function getData(req,res){
	var result = await query.getFreq(req.params['contractID'], req.params['startTime']) // get frequencies for all blocks after this start time
	//res.send(result)
  res.send(result)
}


app.get('/api/:contractID/:startTime', function (req, res) {
  getData(req,res)
})

app.get('/', function (req, res) {
  res.send("hi")
})

app.get('/api', function (req, res) {
  res.send("'/api/:contractID/:startTime'")//test fucntion
})

app.listen(PORT, function () {
  console.log(`Listening on ${ PORT }`)
})

