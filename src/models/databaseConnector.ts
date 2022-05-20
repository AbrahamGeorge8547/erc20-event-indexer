import { connect } from 'mongoose';
import Logger from '../logger';
// import dotenv from 'dotenv';
const connectToDatabase = async () => {
  try {
    const uri = 'mongodb://localhost:27017/erc-20-tokens';
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 20, // Maintain up to 10 socket connections
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
    };
    await connect(uri, options);
    Logger.general('Connection established to db')
  } catch (error) {
    Logger.general(`Connection failed with error ${error}`);
    process.exit(1);
  }

};

export default connectToDatabase;
