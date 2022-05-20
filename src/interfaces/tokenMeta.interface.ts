import { Document } from "mongoose";

export interface ItokenMeta extends Document {
  tokenName: string;
  symbol: string;
  decimal: number;
  tokenAddress: string;
  status: string;
  firstBlock: number;
}

export default ItokenMeta;
