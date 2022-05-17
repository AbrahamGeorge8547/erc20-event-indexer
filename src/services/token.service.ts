import { model } from 'mongoose';
import {Itoken} from '../interfaces/token.interface';
import tokenSchema from '../models/token.model';

const tokenService = {
    async create(tokenAddress: string, data: any) {
        const model = tokenSchema(tokenAddress);
        console.log("Token service")
        model.create(data);

    },

    async fetch(tokenAddress: string) {
        const model = tokenSchema(tokenAddress);
        const result = await model.find();
        console.log(result)
    }
};

export default tokenService;
