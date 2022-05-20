import { Document } from "mongoose";

export interface Bfailed  {
  fromBlock: number,
  toBlock: number,
  tokenAddress: string
}

export interface Ifailed extends Bfailed, Document {}
