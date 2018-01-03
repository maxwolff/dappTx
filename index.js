var fs = require('fs');
const get = require('simple-get')

var logParams = {
	fromBlock: 396724,
	toBlock: 'latest', // 'latest' gets lates block
	address: '0xb1690C08E213a35Ed9bAb7B318DE14420FB57d8C', // cryptokitties contract address
	apikey: '' // get your own :) 
}
var logBaseUrl = 'https://api.etherscan.io/api?module=logs&action=getLogs' // docs: https://etherscan.io/apis#logs

const getLogsUrl = logBaseUrl + "&fromBlock=" + logParams.fromBlock + "&toBlock=" + logParams.toBlock + "&address=" + logParams.address + "&apikey=" + logParams.apikey
console.log(getLogsUrl) 

result = '';

get(getLogsUrl, function (err, res) {
	if (err){
		throw err
	} 
	console.log(res.statusCode) // 200
	
  //res.pipe(process.stdout) // `res` is a stream
 	res.on('data', (chunk) => {
		result += chunk;
	});
 	res.on('end', () => {
 		console.log("end")
 		data = JSON.parse(result);
 		console.log("example blob:",data.result[0])
 		saveFile(JSON.stringify(data))
	});
});


function saveFile (data){
	fs.writeFile("kittiesTx.json", data, function(err){
		if(err){
			throw err;
		}
	});	
	console.log("done")
}

