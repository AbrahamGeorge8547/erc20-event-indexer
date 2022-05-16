import { Document } from 'mongoose';

export interface ItokenMeta extends Document {
   name: String;
   symbol: String;
   decimal: Number;
   tokenAddress: String;
   status: String;
}

export default ItokenMeta;
