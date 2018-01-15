let request = require('async-request')
const fs = require('fs');
const insert = require('./insert.js')

const network = 'mainnet'
var latestBlock = 0

function getInfuraURL({ network, req }) {
  const { method, params } = req
  const paramsString = encodeURIComponent(JSON.stringify(params))
  const targetUrl = `https://api.infura.io/v1/jsonrpc/${network}/${method}?params=${paramsString}`
  return targetUrl
} 

async function get(url){
	try {
		result = await request(url)
		return result
	} catch (e){
		throw e 
	}
}

async function getTxCount(blockNum){
	const req = {
		method: 'eth_getBlockTransactionCountByNumber',
		params: [blockNum]
	}
	const target = getInfuraURL({network,req})
	var result = await get(target)
	return JSON.parse(result.body).result 
}

async function getBlockNumber(blockNum){
	const req = {
		method: 'eth_blockNumber',
		params: [blockNum]
	}
	const target = getInfuraURL({network,req})
	var result = await get(target)
	return JSON.parse(result.body).result 
}

async function getBlockByNumber(number){
	var blockNum = '0x' + number.toString(16); // convert to hex
	const req = {
		method: 'eth_getBlockByNumber',
		params: [blockNum,true]
	}
	const target = getInfuraURL({network,req})
	console.log(target)
	var result = await get(target)
	return JSON.parse(result.body).result
}

async function getTxByBlockNumberAndIndex(blockNum, index){
	const req = {
		method: 'eth_getTransactionByBlockNumberAndIndex',
		params: [blockNum,index]
	}
	const target = getInfuraURL({network,req})
	var result = await get(target)
	return JSON.parse(result.body).result 
}

function saveFile (fileName,data){
	fs.writeFile(fileName, JSON.stringify(data,null), function(err){
		if(err){
			throw err;
		}
	});	
	console.log("printed to ", fileName)
}

async function getData(blockNum){
	var result = []
	var block = await(getBlockByNumber(blockNum))
	var transactions = block["transactions"]
	var timestamp = block["timestamp"]
	for (var i in transactions){
		var info = transactions[i]
		info["timestamp"] = timestamp
		info["blockNumber"] = blockNum
		insert(info) // inserts into postgres DB . from insert.js
		result.push(info)
	}
	return result
}
// save backlog function 
async function getUpdate(range){
	var result = []
	latestBlock = await getBlockNumber('latest')
	for(var i=0; j = range,i<j; i++){
		var data = await getData(latestBlock - i)
		result.push(data)
	}
	return result
}


async function main(){
	var back = 1
	var update = await getUpdate(back)// # indices to go back, # block returned - 1
	var saveName = latestBlock + "back" + back + ".json"  
	saveFile(saveName,update) 
}

main()






















