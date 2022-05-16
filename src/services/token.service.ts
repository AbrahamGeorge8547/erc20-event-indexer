import { model } from 'mongoose';
// import ItokenMeta from '../interfaces/tokenMeta.interface';
import tokenSchema from '../models/token.model';

const tokenService = {
  getCustomModel(tokenAddress: string) {
    const tokenModel = model(`${tokenAddress}`, tokenSchema);
    return tokenModel;
  },
};

export default tokenService;
