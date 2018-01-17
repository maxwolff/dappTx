# dappTx
App Annie for Dapps. Track transaction volume of biggest projects.

inspiration from @owocki https://github.com/gitcoinco/skunkworks/issues/19#issuecomment-354695051

* createFile.js hits the Infura API for all the transactions in the latest block, and saves them to tx.json
* frequency.js returns contract tx frequency by timestamp

# next

- host DB, set up automatic periodic polling 
- build front end (trouble with chart.js)
- scrape dapp contract names from etherscan?
- handle failed transactions? some blocks have tons  https://etherscan.io/txs?block=4905182&p=1
