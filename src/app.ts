import os from 'os';
import connector from './models/databaseConnector';
import indexer from './indexer';


const app = async () => {
    // console.log(process.argv[2], os.cpus())
    await connector();
    await indexer('0x6B175474E89094C44Da98b954EedeAC495271d0F')
    
    
}


app();