

/* const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); */
//let default_server_port = 8000 // react is 8000
let express = require('express'),
  app = express(),
  port = process.env.PORT || 5000; // heroku is 5000
app.use(express.static('public'));
require('dotenv').config()


let query = require('./frequency.js');


 
async function getData(req,res){
	var result = await query.getFreq(req.params['contractID'], req.params['startTime'],req.params['endTime']) 
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

app.listen(port, function () {
  console.log(`Listening on ${port}`)
})

