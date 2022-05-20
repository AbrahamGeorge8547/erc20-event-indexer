import { BReorg } from "../interfaces/reorg.interface";
import reorgModel from "../models/reorg.model";
import Logger from "../logger";

const logger = new Logger("ReorgRepo");

const reorgRepo = {
  async create(data: BReorg) {
    logger.entry("create");
    try {
        await reorgModel.create(data);
    } catch (error) {
        return;
    }
   
  },

  async find(tokenAddress: string) {
    logger.entry("find");
    return reorgModel.find({ tokenAddress }).sort({ blockNumber: "asc" });
  },

  async delete(tokenAddress: string, blockHash: string) {
    logger.entry("delete");
    return reorgModel.findOneAndDelete({ tokenAddress, blockHash });
  },

  async exists(data: Partial<BReorg>) {
    logger.entry("exists");
    return reorgModel.exists(data);
  },
};

export default reorgRepo;
