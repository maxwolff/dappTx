require('dotenv').config()
let argv = require('minimist')(process.argv.slice(2))

let util = require('./util.js')

const fs = require('fs'),
  {Pool} = require('pg'),
  pool = new Pool(),
  network = 'mainnet'


const getInfuraURL = ({network, req}) => {
    const {method, params} = req
    const paramsString = encodeURIComponent(JSON.stringify(params))
    return `https://api.infura.io/v1/jsonrpc/${network}/${method}?params=${paramsString}`
}

const getBlockNumber = async blockNum => {
  const req = {
    method: 'eth_blockNumber',
    params: [blockNum]
  }
  const target = getInfuraURL({network, req})
  const result = await util.get(target)
  return JSON.parse(result.body).result
}

const getBlockByNumber = async number => {
  const blockNum = '0x' + number.toString(16) // convert to hex
  const req = {
    method: 'eth_getBlockByNumber',
    params: [blockNum, true]
  }

  let target = getInfuraURL({network, req})
  console.log(target)
  let result = await util.get(target)
  return JSON.parse(result.body).result
}

const saveFile = (fileName, data) => {
  fs.writeFile(fileName, JSON.stringify(data, null), err => {
    if (err) {
      throw err
    }
  })
  console.log("printed to ", fileName)
}

const insert = async data => {   // inserts into postgres DB
  try {
    const text = 'INSERT INTO transactions(blob) VALUES($1) RETURNING *'
    const values = [data]
    const res = await pool.query(text, values)
    // console.log('insert', res.rows[0])
  } catch (err) {
    console.log(err.stack)
  }
}

const getData = async blockNum => {
	const block = await getBlockByNumber(blockNum)
	const timestamp = block["timestamp"]
	const transactions = block["transactions"]
    transactions.forEach(transaction => {
        let info = transaction
        info["timestamp"] = timestamp
        info["blockNumber"] = blockNum
        console.log(info)
        insert(info)
        console.log("inserted tx from blockNum: ", blockNum)
    })
}

// grab last X blocks data
const getHistoricalData = async (sampleRate,back,latestBlock) => {
	for(let i = 0; i < back; i+=sampleRate) {
		getData(latestBlock - i)
	}
}

const main = async() => {
	let sampleRate =  argv["r"] 
	let back = argv["b"] 
	let poll = argv["p"]
	let latestBlock = await getBlockNumber('latest')
	latestBlock -= 5    // latest block isnt available, give INFURA a 5 block buffer
	if (poll){    // get 1 block, continuous polling
		getData(latestBlock)
	}
	else {    // grab all historical data
		getHistoricalData(sampleRate,back,latestBlock)    // # indices to go back, # block returned - 1
	}
}

main()





