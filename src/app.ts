// import os from 'os';
import connector from './models/databaseConnector';
import indexer from './indexer';

const app = async () => {
  // console.log(process.argv[2], os.cpus())
  await connector();
  await indexer('0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0');
};

app();
