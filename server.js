require('dotenv').config()
let express = require('express'),
  app = express()
const PORT = process.env.PORT || 5000
app.use(express.static('public'));

let query = require('./frequency.js');

async function getData(req,res){
	var result = await query.getFreq(req.params['contractID'], req.params['startTime'],req.params['endTime']) 
  res.send(result)
}

app.get('/api/:contractID/:startTime/:endTime', function (req, res) {
  getData(req,res)
})

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')//test fucntion
})

app.listen(PORT, function () {
  console.log(`Listening on ${PORT}`)
})

