const request = require('async-request');

const get = async url => {
  try {
    return await request(url);
  } catch (e) {
    throw e;
  }
};

var exampleURL = "https://shrouded-journey-22394.herokuapp.com/api/0x8d12a197cb00d4747a1fe03395095ce2a5cc6819/0x59bcb6cb/0x59c19f03"

const main = async() => {
	var resultJSON = await get(exampleURL)
	var result = {};
	var body = JSON.parse(resultJSON.body)
	body.forEach(function(elem){
		var unixTimestamp = parseInt(elem['timestamp'])
		var date = new Date(unixTimestamp*1000);
		var dayYear = date.toLocaleString().split(' ')[0];
		if (result[dayYear]){
			result[dayYear]['totalEthTx'] += parseInt(elem.totalEthTx)
			result[dayYear]['contractTx'] += parseInt(elem.contractTx)
		}else{ 
			result[dayYear] = {'totalEthTx': parseInt(elem.totalEthTx), 'contractTx': parseInt(elem.contractTx)}
		}
	})
	console.log(result)
}

main()


