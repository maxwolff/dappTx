const request = require('async-request'),
     	fs = require('fs'),
		{ Pool } = require('pg');
const network = 'mainnet';
let latestBlock = 0;

var env = {
  user: 'postgres',
  host: 'localhost',
  database: 'tx',
  password: null,
  port: 5432,
}

const getInfuraURL = ({ network, req }) => {
  const { method, params } = req;
  const paramsString = encodeURIComponent(JSON.stringify(params));
  const targetUrl = `https://api.infura.io/v1/jsonrpc/${network}/${method}?params=${paramsString}`;
  return targetUrl;
}

const get = async url => {
	try {
		result = await request(url);
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
	const target = getInfuraURL({network,req});
	console.log(target);
	const result = await get(target);
	return JSON.parse(result.body).result;
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

async function insert(data,pool){

	try {
		const text = 'INSERT INTO transactions(blob) VALUES($1) RETURNING *'
		const values = [data]
	 	const res = await pool.query(text, values)
	 	console.log('insert', res.rows[0])
	} catch(err) {
	  console.log(err.stack)
	}
}``

const getData = async blockNum => {
	let result = [];
	let block = await getBlockByNumber(blockNum);
	const transactions = block["transactions"];
	const timestamp = block["timestamp"];
	const pool = new Pool()
  	transactions.forEach(transaction => {
	    let info = transaction;
		info["timestamp"] = timestamp;
		info["blockNumber"] = blockNum;
		insert(info,pool); // inserts into postgres DB 
		result.push(info);
  	});
	return result;
}

// grab last X block data
const getUpdate = async range => {
	let result = [];
	latestBlock = await getBlockNumber('latest');
	for(let i = 0; j = range, i < j; i++) {
		let data = await getData(latestBlock - i);
		result.push(data);
	}
	return result;
}

const main = async() => {
	let back = 2;
	let update = await getUpdate(back);// # indices to go back, # block returned - 1
	const saveName = latestBlock + "back" + back + ".json";
	saveFile(saveName, update);
}

main()
