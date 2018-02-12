const abiDecoder = require('abi-decoder');
const request = require('async-request');

const get = async url => {
  try {
    return await request(url);
  } catch (e) {
    throw e;
  }
};

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


var contractID = '0x8d12a197cb00d4747a1fe03395095ce2a5cc6819'
const input = "0x278b8c0e000000000000000000000000e25bcec5d3801ce3a794079bf94adf1b8ccd802d00000000000000000000000000000000000000000000008cf23f909c0fa0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001df337ccfd1d200000000000000000000000000000000000000000000000000000000000004c032900000000000000000000000000000000000000000000000000000000c68ebf69000000000000000000000000000000000000000000000000000000000000001beb4757272b8eb0a965b4b36bad0dfda30d73085dc7027c6685c053eaa8f04cb302690ae6ad2671d0d12088b91519f2240505e5ce4aede8b98ffeb3727aac1409";

var input2 = '0x2e1a7d4d00000000000000000000000000000000000000000000000025513f40c9068000'
const main = async () =>{
	var decoder = await (getAbiDecoder(contractID))
	console.log(decoder)

	var g = decoder.decodeMethod(input2)
	console.log(g['name'])
}
main()

        

/*

0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359
0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359
0x8d12A197cB00D4747a1fe03395095ce2A5CC6819

const testData = "0x9e281a9800000000000000000000000026d5bd2dfeda983ecd6c39899e69dae6431dffbb00000000000000000000000000000000000000000000000000000000000026f1";
const decodedData = abiDecoder.decodeMethod(testData);

console.log(decodedData)


https://etherscan.io/apis#contracts 
*/