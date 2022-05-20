import { Schema, model } from "mongoose";
import { Ifailed } from "../interfaces/failed.interface";

const failedSchema = new Schema<Ifailed>({
  fromBlock: Number,
  toBlock: Number,
  tokenAddress: String,
});

const failedModel = model("failedRequests", failedSchema);
export default failedModel;
