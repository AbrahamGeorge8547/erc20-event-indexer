import { connect } from 'mongoose';
// import dotenv from 'dotenv';

const connectToDatabase = async () => {
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
};

export default connectToDatabase;
