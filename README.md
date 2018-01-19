# dappTx
Visualizes transaction volume of biggest ethereum smart contracts. Pulls data from 
Infura, puts it in a postgres DB, (eventually a chron job). Exposed via a webapp 
that queries the DB, formats it properly for the front-end, which displays graphs. 

# important files

* pullData.js: hits the Infura API for all the transactions in the latest block and saves them to a local postgres DB. 
* frequency.js: returns contract tx frequency by timestamp
* server.js: entry point for  

# get started
- npm install
- create DB with files in sql folder
- pullData.js
- server.js

# stubs
- chart.html, index.ejs, test.js

# next

- host DB on AWS, set up chron job to load data into DB
- build front end with chart.js. coinmarketcap.com for reference.

# future ideas
- scrape dapp contract names from etherscan?
- handle failed transactions. some blocks have tons https://etherscan.io/txs?block=4905182&p=1
- decentralized web stack? ipfs? 


inspirated by @owocki https://github.com/gitcoinco/skunkworks/issues/19#issuecomment-354695051