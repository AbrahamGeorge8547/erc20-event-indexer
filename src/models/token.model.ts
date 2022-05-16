import { Schema, model } from 'mongoose';
import { Itoken } from '../interfaces/token.interface';

const tokenSchema = new Schema<Itoken>({
  blockNumber: Number,
  blockHash: String,
  transactionIndex: String,
  transactionHash: String,
  from: String,
  to: String,
  amount: String,
});

const getCustomModel = (tokenAddress: string) => {
  const tokenModel = model(`${tokenAddress}`, tokenSchema);
  return tokenModel;
};
export default getCustomModel;
