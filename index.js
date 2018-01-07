var fs = require('fs');
var golem =   '0xa74476443119a942de498590fe1f2454d7d4ac0d'
var kitties = '0x06012c8cf97bead5deae237070f9587f8e7a266d'
var etherdelta =   '0x8d12a197cb00d4747a1fe03395095ce2a5cc6819'

function readData(fileName){
	var contents = fs.readFileSync(fileName, 'utf8')
	return JSON.parse(contents)
}

async function main(){
	data = await readData('tx.json')
	var etherDelta = 0
	//var golem = 0
	data.forEach(function(entry){
		if (entry && entry.to == golem){
			console.log("golem!",entry)
			golem += 1
		}
		if (entry && entry.to == kitties){
			//console.log("kittehz!",entry)
		}
		if (entry && entry.to == etherdelta){
			console.log("delta!",entry)
			etherDelta +=1
		}
	});
	var etherDeltaPerc = (etherDelta/(data.length)).toLocaleString("en", {style: "percent", minimumFractionDigits: 3})
	//var golemPerc = (golem/(data.length)).toLocaleString("en", {style: "percent", minimumFractionDigits: 3})

	console.log(etherDeltaPerc, "of the last blocks transactions are from EtherDelta")
	//console.log(golemPerc, "of the last blocks transactions are from Golem")

}

main()



// to scrape: contract names
//https://etherscan.io/address/0x8d12a197cb00d4747a1fe03395095ce2a5cc6819
//*[@id="ContentPlaceHolder1_divSummary"]/div[1]/table/thead/tr/th/font
// #ContentPlaceHolder1_divSummary > div:nth-child(1) > table > thead > tr > th > font
// <font color="gray" title="NameTag">etherdelta_2</font>
//<font color="gray" title="NameTag">etherdelta_2</font>