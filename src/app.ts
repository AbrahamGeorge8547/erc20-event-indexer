// import os from 'os';
import connector from './models/databaseConnector';
import indexer from './indexer';

const app = async () => {
  // console.log(process.argv[2], os.cpus())
  await connector();
  await indexer('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48');
};

app();
