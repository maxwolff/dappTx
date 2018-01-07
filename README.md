# dappTx
App Annie for Dapps. Track transaction volume of biggest projects.

inspiration from @owocki https://github.com/gitcoinco/skunkworks/issues/19#issuecomment-354695051

createFile.js hits the Infura API for all the transactions in the latest block, and saves them to tx.json
index.js investigates tx.json, and finds how many of them belong to EtherDelta

# next

- validate data correctness, seems that some responses were lost
- build out index.js to counting Dapp transactions. scrape Dapp contract names from etherscan?
- save to db, set up automatic periodic polling 
- build front end 
