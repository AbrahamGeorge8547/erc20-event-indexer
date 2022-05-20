// import os from 'os';
import connector from "./models/databaseConnector";
import Logger from "./logger";
import indexer from "./indexer";
const app = async () => {
  // console.log(process.argv[2], os.cpus())
  const address = process.argv[2];
  if (!address) {
    Logger.general("Token Address not found. Exiting ...");
  }
  await connector();
  await indexer(address);
};

app();
