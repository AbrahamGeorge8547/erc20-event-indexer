import { Document } from 'mongoose';

export interface Itoken extends Document {
    blockNumber: Number;
    blockHash: String;
    transactionIndex: Number;
    transactionHash: String;
    from: String;
    to: String;
    amount: String;
}
