const { Pool } = require('pg')
const fs = require('fs')
const abiDecoder = require('abi-decoder')

let util = require('./util.js')

const timestampToDate = timestamp => {
	var decimalTimestamp = parseInt(timestamp)
	var dateObj = new Date(decimalTimestamp*1000)
	var formattedDate = dateObj.toLocaleString().split(' ')[0]
	return formattedDate
}

const getAbiDecoder = async contractID => {
    var url = 'http://api.etherscan.io/api?module=contract&action=getabi&address=' + contractID
    var data = await util.get(url)
    var body = JSON.parse(data.body)
    if (body.message == 'OK'){
	    var contractABI = (JSON.parse(body.result))
	    abiDecoder.addABI(contractABI)
	    return abiDecoder
    }else{
    	return false
    }
}

const getTxNum = async (hexStart,hexEnd,pool) => {
	var countMap = {}
	try{
	    const text =  "SELECT blob ->> 'timestamp' AS timestamp, COUNT(blob ->> 'timestamp') AS count FROM transactions WHERE blob ->> 'timestamp' > $1 AND blob ->>  'timestamp' < $2 GROUP BY blob ->> 'timestamp'"
	    const values = [hexStart, hexEnd]
	    const res = await pool.query(text,values)
	 	for (i in res.rows){
	 		var data = res.rows[i]
	 		countMap[data['timestamp']] = data['count']
	 	}
	 	return countMap
	}catch(err) {
	  console.log(err.stack)
	}
}


const getContractMatches = async (hexStart,hexEnd,contractID,pool) => {
	var arr = []
	try{
	    const text =  "SELECT blob ->> 'timestamp' AS timestamp, json_agg(blob ->> 'input') AS input, COUNT(blob ->> 'timestamp') AS count FROM transactions WHERE blob ->> 'timestamp' > $1 AND blob ->> 'timestamp' < $2 AND blob ->> 'to' = $3 GROUP BY blob ->> 'timestamp'"
	    const values = [hexStart, hexEnd, contractID]
	    const res = await pool.query(text,values)
	 	for (i in res.rows){
	 		var data = res.rows[i]
	 		arr.push(data)
	 	}
	 	return arr
	}catch(err) {
	  console.log(err.stack)
	}
}


const decodeInput = (inputArr, decoder) => {
	let functionFreq = {}
	inputArr.forEach( input => {
		try{
		
			let method = abiDecoder.decodeMethod(input)
			if (method.name){
				functionFreq[method.name] = 1 + (functionFreq[method.name] || 0)
			}	
		}catch(err){
			console.log('(nonfatal) error! no input / abi match',err.stack)
		}
	})
	return functionFreq
}

// format 
// matches : {timestamp: '0x0424d4jf', input: [0x04k5jedf,0x0dj5323], count: 4}
// ethTx : {timestamp: '0x0424d4jf', count: 200}

const countFunctions = async (contractID, matches, ethTx) => {
	let results = {}
	const decoder = await getAbiDecoder(contractID)
	matches.forEach(async match => {
		let sampleDate = timestampToDate(match['timestamp'])
		let funcs = decodeInput(match['input'], decoder)
		if (results[sampleDate]){
			let curr = results[sampleDate]
			curr['sampledEthTx'] = parseInt(ethTx[match['timestamp']]) + curr['sampledEthTx']
			curr['contractTx'] = parseInt(match['count'])+ parseInt(curr['contractTx'])
			curr['functions'] = util.sumObjectsByKey(funcs, curr['functions'])
		}else{
			results[sampleDate]= {}
			let curr = results[sampleDate]
			curr['sampledEthTx'] = parseInt(ethTx[match['timestamp']])
			curr['contractTx'] = parseInt(match['count'])
			curr['functions'] = funcs
		}
	})
	return results
}

const main = async (contractID,timeStart, timeEnd) => {
	console.log(contractID,timeStart,timeEnd)
	contractID = contractID.toLowerCase()
	const pool = new Pool()
	let ethTx = await getTxNum(timeStart, timeEnd,pool)
	let matches = await getContractMatches(timeStart, timeEnd, contractID,pool)
	let result = await countFunctions(contractID, matches, ethTx)
	return result
}


module.exports.main = main

// http://localhost:5000/api/0x8d12a197cb00d4747a1fe03395095ce2a5cc6819/0x59bcb6cb/0x59d19f03
// http://localhost:5000/api/0x8d12a197cb00d4747a1fe03395095ce2a5cc6819/0x5a6fc956/0x5a7e7918

// https://shrouded-journey-22394.herokuapp.com/api/0x8d12a197cb00d4747a1fe03395095ce2a5cc6819/0x59bcb6cb/0x59c19f04

// main('0x8d12a197cb00d4747a1fe03395095ce2a5cc6819', '0x5a6fc956','0x5a7e7918') local db query 























