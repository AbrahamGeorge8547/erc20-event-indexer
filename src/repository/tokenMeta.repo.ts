import tokenMeta from '../models/meta.model';
import ItokenMeta from '../interfaces/tokenMeta.interface';

const tokenMetaRepo = {
  create(data: Partial<ItokenMeta>) {
    tokenMeta.create({ ...data, _id: data.tokenAddress });
  },

  exists(tokenAddress: string) {
    return tokenMeta.exists({ tokenAddress });
  },
};

export default tokenMetaRepo;
