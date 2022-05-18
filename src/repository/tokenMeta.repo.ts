import tokenMeta from '../models/meta.model';
import ItokenMeta from '../interfaces/tokenMeta.interface';
import { FilterQuery } from 'mongoose';

const tokenMetaRepo = {
  create(data: Partial<ItokenMeta>) {
    tokenMeta.create({ ...data });
  },

  exists(tokenAddress: string) {
    return tokenMeta.exists({ tokenAddress });
  },

  findOne(data: FilterQuery<ItokenMeta>){
    return tokenMeta.findOne(data);
  }
};

export default tokenMetaRepo;
