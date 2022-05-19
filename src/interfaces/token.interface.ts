import { Document } from "mongoose";

export interface Btoken {
  blockNumber: number;
  blockHash: string;
  transactionIndex: number;
  transactionHash: string;
  from: string;
  to: string;
  amount: string;
}

export interface Itoken extends Btoken, Document {}
