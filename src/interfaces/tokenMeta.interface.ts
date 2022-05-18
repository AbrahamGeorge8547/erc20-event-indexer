import { Document } from 'mongoose';

export interface ItokenMeta extends Document {
   tokenName: String;
   symbol: String;
   decimal: Number;
   tokenAddress: String;
   status: String;
   firstBlock: Number;
}

export default ItokenMeta;
