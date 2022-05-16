import { model, Schema } from 'mongoose';
import { ItokenMeta } from '../interfaces/tokenMeta.interface';

const tokenMetaSchema = new Schema<ItokenMeta>({
  name: String,
  symbol: String,
  decimal: Number,
  tokenAddress: { type: String, unique: true },
  status: String,
});

const tokenModel = model('tokenMeta', tokenMetaSchema);

export default tokenModel;
