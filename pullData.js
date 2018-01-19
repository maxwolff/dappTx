const request = require('async-request'),
      insert = require('./insert.js'),
      fs = require('fs');

const network = 'mainnet';
let latestBlock = 0;

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

const getBlockByNumber = async number => {
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

const getData = async blockNum => {
	let result = [];
	let block = await(getBlockByNumber(blockNum));
	const transactions = block["transactions"];
	const timestamp = block["timestamp"];

  transactions.forEach(transaction => {
    let info = transaction;
		info["timestamp"] = timestamp;
		info["blockNumber"] = blockNum;
		insert(info); // inserts into postgres DB . from insert.js
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
