// import os from 'os';
import connector from './models/databaseConnector';

import indexer from './indexer';
const app = async () => {
  // console.log(process.argv[2], os.cpus())
  await connector();
  await indexer('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48');
};

app();
