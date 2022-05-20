import { Schema, model } from "mongoose";
import { IBReorg } from "../interfaces/reorg.interface";

const reorgSchema = new Schema<IBReorg>({
  blockNumber: Number,
  blockHash: {unique: true, type: String},
  tokenAddress: String,
});

const reorgModel = model("reorg", reorgSchema);
export default reorgModel;
