import tokenMeta from '../models/meta.model';
import ItokenMeta from '../interfaces/tokenMeta.interface';
import { FilterQuery } from 'mongoose';
import Logger from '../logger';

const logger = new Logger('tokenMetaRepo')
const tokenMetaRepo = {
  create(data: Partial<ItokenMeta>) {
    tokenMeta.create({ ...data });
  },

  exists(tokenAddress: string) {
    return tokenMeta.exists({ tokenAddress });
  },

  findOne(data: FilterQuery<ItokenMeta>){
    return tokenMeta.findOne(data);
  },

  updateStatus(tokenAddress: string, status: string) {
    return tokenMeta.updateOne({tokenAddress}, {status})
  },
  async getAllTokens() {
    logger.entry('getAllTokens')
    return tokenMeta.find({});
  }
};

export default tokenMetaRepo;
