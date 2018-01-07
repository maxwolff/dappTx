let request = require('async-request')
const fs = require('fs');

const network = 'mainnet'

var blocks= {
	from: 0,
	to: 'latest'
}

function getInfuraURL({ network, req }) {
  const { method, params } = req
  const paramsString = encodeURIComponent(JSON.stringify(params))
  const targetUrl = `https://api.infura.io/v1/jsonrpc/${network}/${method}?params=${paramsString}`
  return targetUrl
} 

async function get(url){
	try {
		result = await request(url);
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

async function main(){
	
	var num = await getBlockNumber('latest')
	var tx = await getTxCount(num)
	var data = []
	for (i = 0x0; i < tx; i ++){
		var index = '0x' + i.toString(16)
		blob = await getTxByBlockNumberAndIndex('latest',index)
		data.push(blob)

		console.log(index)
	}
	data = await data
	console.log(data.length)

	saveFile("tx.json",data)

}

main()


