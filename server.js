require('dotenv').config()
let express = require('express'),
  app = express()
const PORT = process.env.PORT || 5000
app.use(express.static('public'));

let freq = require('./frequency.js');

async function getData(req,res){
  var result = await freq.main(req.params['contractID'], req.params['startTime'],req.params['endTime']) 
  res.send(result)
}

app.get('/api/:contractID/:startTime/:endTime', function (req, res) {
  getData(req,res)
})

app.get('/api', function (req, res) {
  res.sendFile(__dirname + '/index.html')
});

app.get('/test', function(req,res){
	res.send('test')
})

app.listen(PORT, function () {
  console.log(`Listening on ${PORT}`)
})

