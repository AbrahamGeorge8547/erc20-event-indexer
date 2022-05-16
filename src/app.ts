// import os from 'os';
import connector from './models/databaseConnector';
import indexer from './indexer';

const app = async () => {
  // console.log(process.argv[2], os.cpus())
  await connector();
  await indexer('0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0');
};

app();
