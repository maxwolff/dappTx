const { Pool } = require('pg')

const env = {
  user: 'postgres',
  host: 'localhost',
  database: 'tx',
  password: null,
  port: 5432,
}

module.exports = getContractFrequency; 

const pool = new Pool(env)


//returns unique timestamps we have data for since a certain timestmap
async function getUniqueTimestamps(hexStart){ 
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
async function getTxCount(stamp){ 
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

async function getContractOccurence(stamp, contractID){ 
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
	var hexStart = '0x' + timeStart.toString(16);
	var hexEnd = '0x' + timeEnd.toString(16);
	var frequencies = [];
	var stamps = await getUniqueTimestamps(hexStart)
	for (i in stamps){
		var total = await getTxCount(stamps[i])
		var contractFreq = await getContractOccurence(stamps[i], contractID)
		var resultArr = {'timestamp': stamps[i],'totalTransactions':total, 'contractFreq': contractFreq}
		frequencies.push(resultArr)
	}
	return frequencies
}

async function main(){
	var id = '0x8d12a197cb00d4747a1fe03395095ce2a5cc6819' // etherdelta method 2?
	var start = 1514764800
	var end = 1515906166
	var result = await getContractFrequency(id, start, end)
	console.log(result)
}

main()

























