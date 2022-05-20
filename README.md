# erc20-event-indexer
A simple erc20 event indexer

## Usage
`yarn build ` build the application

`pm2 start` to start the listeners

`node dist/app.js tokenAddress` to start indexing 

`node dist/querytool.js userAddress` to fetch the transactions indexed