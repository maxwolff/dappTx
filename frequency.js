const { Pool } = require('pg')
const fs = require('fs');


//returns unique timestamps we have data for since a certain timestmap
async function getUniqueTimestamps(hexStart,pool){ 
	var stamps = [];
	try {
		const stampQuery = "SELECT DISTINCT (blob ->> 'timestamp') AS time FROM transactions WHERE blob ->> 'timestamp' > '" + hexStart + "';"
	 	const res = await pool.query(stampQuery)
	 	for (i in res.rows){
	 		stamps.push(res.rows[i]['time'])
	 	}
	}catch(err) {
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

async function getContractFrequency(contractID,timeStart){
	var hexStart = '0x' + timeStart.toString(16);
	var frequencies = [];
	const pool = new Pool()
	var stamps = await getUniqueTimestamps(hexStart,pool)
	for (i in stamps){
		var total = await getTxCount(stamps[i],pool)
		var contractFreq = await getContractOccurence(stamps[i], contractID,pool)
		var resultArr = {'timestamp': stamps[i],'totalTransactions':total, 'contractFreq': contractFreq}
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


async function main(){
	var id = '0x8d12a197cb00d4747a1fe03395095ce2a5cc6819' //etherdelta_2 contract address https://etherscan.io/address/0x8d12a197cb00d4747a1fe03395095ce2a5cc6819
	var start = 1514764800 // start time 
	var result = await getContractFrequency(id, start)
	console.log(result)
	console.log('here')
	var fileName = "exampleFrequencies.json"
	saveFile(fileName, result)
}

main()

























