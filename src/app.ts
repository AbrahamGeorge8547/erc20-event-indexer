// import os from 'os';
import connector from './models/databaseConnector';

import indexer from './indexer';
const app = async () => {
  // console.log(process.argv[2], os.cpus())
  await connector();
  await indexer('0xdAC17F958D2ee523a2206206994597C13D831ec7');
};

app();
