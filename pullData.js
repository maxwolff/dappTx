const request = require('async-request'),
     	fs = require('fs'),
		{ Pool } = require('pg');
const network = 'mainnet';
var argv = require('minimist')(process.argv.slice(2));
const pool = new Pool()

const getInfuraURL = ({ network, req }) => {
  const { method, params } = req;
  const paramsString = encodeURIComponent(JSON.stringify(params));
  const targetUrl = `https://api.infura.io/v1/jsonrpc/${network}/${method}?params=${paramsString}`;
  return targetUrl;
}

const get = async url => {
	try {
		const result = await request(url);
		return result;
	} catch (e) {
		throw e;
	}
}

const getTxCount = async blockNum => {
	const req = {
		method: 'eth_getBlockTransactionCountByNumber',
		params: [blockNum]
	};
	const target = getInfuraURL({network,req});
	const result = await get(target);
	return JSON.parse(result.body).result;
}

const getBlockNumber = async blockNum => {
	const req = {
		method: 'eth_blockNumber',
		params: [blockNum]
	};
	const target = getInfuraURL({network,req});
	const result = await get(target);
	return JSON.parse(result.body).result;
}

async function getBlockByNumber(number) {
	const blockNum = '0x' + number.toString(16); // convert to hex
	const req = {
		method: 'eth_getBlockByNumber',
		params: [blockNum, true]
	};
	let target = getInfuraURL({network,req});
	console.log(target);
	let result = await get(target);
	let transactions = JSON.parse(result.body).result["transactions"]
	console.log("first result", transactions[0])
	return transactions;
}

const getTxByBlockNumberAndIndex = async (blockNum, index) => {
	const req = {
		method: 'eth_getTransactionByBlockNumberAndIndex',
		params: [blockNum,index]
	};
	const target = getInfuraURL({network,req});
	const result = await get(target);
	return JSON.parse(result.body).result;
}

const saveFile = (fileName, data) => {
	fs.writeFile(fileName, JSON.stringify(data,null), (err) => {
		if(err) {
			throw err;
		}
	});
	console.log("printed to ", fileName);
}

async function insert(data,pool){// inserts into postgres DB 

	try {
		const text = 'INSERT INTO transactions(blob) VALUES($1) RETURNING *'
		const values = [data]
	 	const res = await pool.query(text, values)
	 	//console.log('insert', res.rows[0])
	} catch(err) {
	  console.log(err.stack)
	}
}

const getData = async (blockNum) => {
	let result = [];
	const transactions = await getBlockByNumber(blockNum)
	console.log('gotBlock')
	const timestamp = transactions["timestamp"];
	//const pool = new Pool()
  	transactions.forEach(transaction => {
	    let info = transaction;
		info["timestamp"] = timestamp;
		info["blockNumber"] = blockNum;
		insert(info,pool); 
		result.push(info);
  	});
	return result;
}

// grab last X block data
const getHistoricalData = async (sampleRate,back,latestBlock) => {
	let result = [];
	for(let i = 0; i < back; i+=sampleRate) {
		console.log('req block number', latestBlock -i )
		let data = await getData(latestBlock - i);
	//	result.push(data);
	}
	//  return result
}


const main = async() => {
	let sampleRate =  argv["r"]; 
	let back = argv["b"]; 
	let poll = argv["p"];
	let latestBlock = await getBlockNumber('latest');
	latestBlock -= 5; // latest block isnt available, give INFURA a 5 block buffer
	if (poll){ // get 1 block, continuous polling
		let data = await getData(latestBlock);
	}
	else { // grab all historical data
		let update = await getHistoricalData(sampleRate,back,latestBlock);// # indices to go back, # block returned - 1
	}
	//const saveName = parseInt(latestBlock,16) + ".json";
	//saveFile(saveName, update);
}

main()



// go back PGUSER='postgres' PGDATABASE='tx' PGPORT=5432 node pullData.js -r 30 -b 400 (sample every 30th block for the last 400 blocks)
// for cronjob : PGUSER='postgres' PGDATABASE='tx' PGPORT=5432 node pullData.js -p




