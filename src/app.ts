// import os from 'os';
import connector from './models/databaseConnector';

import indexer from './indexer';
const app = async () => {
  // console.log(process.argv[2], os.cpus())
  await connector();
  await indexer('0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce');
};

app();
