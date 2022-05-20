import { Document } from "mongoose";

export interface BReorg {
  blockNumber: number;
  blockHash: string;
  tokenAddress: string;
}

export interface IBReorg extends BReorg, Document {}
