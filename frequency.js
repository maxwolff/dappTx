const { Pool } = require('pg')
const fs = require('fs');

module.exports.getFreq = getContractFrequency;

//returns unique timestamps we have data for since a certain timestmap
async function getUniqueTimestamps(hexStart,hexEnd,pool){ 
	var stamps = [];
	try {
		const stampQuery = "SELECT DISTINCT (blob ->> 'timestamp') AS time FROM transactions WHERE blob ->> 'timestamp' > '" + hexStart + "'AND blob ->>  'timestamp' < '" + hexEnd + "';"
	 	console.log(stampQuery)
	 	const res = await pool.query(stampQuery)
	 	for (i in res.rows){
	 		stamps.push(res.rows[i]['time'])
	 	}
	}catch(err){
	  console.log(err.stack)
	}
	return stamps
}

//return tx count at a given timestamp
async function getTxCount(stamp,pool){ 
	var totalCount;
	try {
		const countQuery = "SELECT COUNT (blob) FROM transactions WHERE blob ->> 'timestamp' = '" + stamp + "';"
	 	const res = await pool.query(countQuery)
	 	totalCount = res.rows[0]["count"]
	}catch(err) {
	  console.log(err.stack)
	}
	return totalCount
}

async function getContractOccurence(stamp, contractID,pool){ 
	var contractOccurence;
	try {
		const occurenceQuery = "SELECT COUNT (blob) FROM transactions WHERE blob ->> 'to' = '" + contractID + "' AND blob ->> 'timestamp' = '" + stamp + "';"
		//blob ->> 'timestamp' = '" + stamp + "' AND 
	 	const res = await pool.query(occurenceQuery)
	 	contractOccurence = res.rows[0]["count"]
	}catch(err) {
	  console.log(err.stack)
	}
	return contractOccurence
}

async function getContractFrequency(contractID,timeStart, timeEnd){
	var frequencies = [];
	const pool = new Pool()
	var stamps = await getUniqueTimestamps(timeStart, timeEnd,pool)
	for (i in stamps){
		var total = await getTxCount(stamps[i],pool)
		var contractFreq = await getContractOccurence(stamps[i], contractID,pool)
		var resultArr = {'timestamp': stamps[i],'totalEthTx':total, 'contractTx': contractFreq}
		frequencies.push(resultArr)
	}
	return frequencies
}


const saveFile = (fileName, data) => { // duplicated func from pull data, got to clean this up and throw it in a util.js
	fs.writeFile(fileName, JSON.stringify(data,null), (err) => {
		if(err) {
			throw err;
		}
	});
	console.log("printed to ", fileName);
}























