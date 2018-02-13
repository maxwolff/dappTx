const { Pool } = require('pg')
const fs = require('fs');
const abiDecoder = require('abi-decoder');
const request = require('async-request');

let util = require('./util.js');

async function get(url) {
  try {
    return await request(url);
  } catch (e) {
    throw e;
  }
};


const timestampToDate = (timestamp) => {
	var decimalTimestamp = parseInt(timestamp)
	var dateObj = new Date(decimalTimestamp*1000);
	var formattedDate = dateObj.toLocaleString().split(' ')[0];
	return formattedDate
}

//returns unique timestamps we have data for since a certain timestmap
async function getUniqueTimestamps(hexStart,hexEnd,pool){ 
	var stamps = [];
	try {
		const stampQuery = "SELECT DISTINCT (blob ->> 'timestamp') AS time FROM transactions WHERE blob ->> 'timestamp' > '" + hexStart + "'AND blob ->>  'timestamp' < '" + hexEnd + "';"
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

const getAbiDecoder = async (contractID) => {
    var url = 'http://api.etherscan.io/api?module=contract&action=getabi&address=' + contractID
    var data = await get(url)
    var body = JSON.parse(data.body)
    if (body.message == 'OK'){
	    var contractABI = (JSON.parse(body.result));
	    abiDecoder.addABI(contractABI);
	    return abiDecoder
    }else{
    	return false
    }
}

const decodeInput = async (abiDecoder, input) => {
    return abiDecoder.decodeMethod(input);
}

const getContractTransactions = async (stamp, contractID,pool) => { 
	var arr = [];
	try {
		const inputQuery = "SELECT * FROM transactions WHERE blob ->> 'to' = '" + contractID + "' AND blob ->> 'timestamp' = '" + stamp + "';"
		//blob ->> 'timestamp' = '" + stamp + "' AND 
	 	const res = await pool.query(inputQuery)
	 	for (i in res.rows){
	 		var data = res.rows[i]['blob']
	 		arr.push(data)
	 	}
	 	return arr;
	}catch(err) {
	  console.log(err.stack)
	  return false 
	}
}


const getContractFrequencyByStamp = async (contractID,timeStart, timeEnd) => { // entry point
	var contractID = contractID.toLowerCase()
	var abiDecoder = await getAbiDecoder(contractID)
	const pool = new Pool()
	var stamps = await getUniqueTimestamps(timeStart, timeEnd,pool)
	var result = []; 
	for (i in stamps){ // iterates over timestamps in our time constraint
		var stamp = stamps[i]
		var date = await timestampToDate(stamp)
		var total = await getTxCount(stamp,pool); 
		var transactions = await getContractTransactions(stamp, contractID,pool) // get all transactions with our contract
		var functionFreq = {};
		try{
				transactions.forEach(tx => {
					var method = abiDecoder.decodeMethod(tx['input'])
					if (method.name){
						functionFreq[method.name] = 1 + (functionFreq[method.name] || 0);
					}	
				});
				var contractTxCount = transactions.length
			var resultObj = {}
			resultObj = {'timestamp': stamp, 'date':date, 'sampledEthTx': parseInt(total), 'contractTx': contractTxCount, 'functions': functionFreq}
			result.push(resultObj)
			console.log('added', stamp)
		}catch(err){
			console.log(err.stack)	
		}
	}
	return result
}

const splitDays = async (samples) =>{
	var results = {}
	//console.log(samples)
	samples.forEach(sample =>{
		var sampleDate = sample['date']
		if (results[sampleDate]){
			var curr = results[sampleDate]
			curr['sampledEthTx'] = sample['sampledEthTx'] + curr['sampledEthTx']
			curr['contractTx'] = sample['contractTx'] + curr['contractTx']
			curr['functions'] = util.sumObjectsByKey(sample['functions'], curr['functions'])

		}else{
			results[sampleDate]= {};
			var curr = results[sampleDate]
			curr['sampledEthTx'] = sample['sampledEthTx']
			curr['contractTx'] = sample['contractTx']
			curr['functions'] = sample['functions']
		}
	});
	return results
}
const main = async (contractID,timeStart, timeEnd) =>{
	const frequencies = await getContractFrequencyByStamp(contractID,timeStart,timeEnd)
	var result = await splitDays(frequencies)
	//console.log(result)
	return result
}

//main( '0x8d12a197cb00d4747a1fe03395095ce2a5cc6819', '0x5a6fc956','0x5a7e7918')
			   


// http://localhost:5000/api/0x8d12a197cb00d4747a1fe03395095ce2a5cc6819/0x59bcb6cb/0x59d19f03
// http://localhost:5000/api/0x8d12a197cb00d4747a1fe03395095ce2a5cc6819/0x5a6fc956/0x5a7e7918


module.exports.main = main;





















