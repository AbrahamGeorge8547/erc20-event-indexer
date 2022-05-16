import ItokenMeta from '../interfaces/tokenMeta.interface';
import tokenMetaRepo from '../repository/tokenMeta.repo';

const tokenMetaService = {
  check(tokenAddress: string) {
    return tokenMetaRepo.exists(tokenAddress);
  },
  create(data: Partial<ItokenMeta>) {
    return tokenMetaRepo.create(data);
  },
};

export default tokenMetaService;
