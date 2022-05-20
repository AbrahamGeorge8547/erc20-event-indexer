import { Btoken } from "../interfaces/token.interface";
import tokenSchema from "../models/token.model";
import Logger from "../logger";
const logger = new Logger("TokenRepository");
const tokenRepo = {
    /**
     * 
     * @param docs array of events to be written
     * @param tokenAddress address of the token
     * @description upserts the transaction data into db.
     */
  async insert(docs: Btoken[], tokenAddress: string) {
    logger.entry("Insert");
    try {
      logger.info(`Inserting ${docs.length} documents`);
      const model = tokenSchema(tokenAddress);
      //bulkwrite docs to db
      await model.bulkWrite(
        docs.map((doc) => ({
          updateOne: {
            filter: { transactionHash: doc.transactionHash },
            update: doc,
            upsert: true,
          },
        }))
      );
      logger.exit();
    } catch (error: any) {
      logger.error(error);
    }
  },

  async deleteBlock(blockHash: string, tokenAddress: string) {
    const model = tokenSchema(tokenAddress);
    return model.deleteMany({tokenAddress, blockHash})
  },
/**
 * 
 * @param tokenAddress address of the token
 * @param userAddress address of the user
 * @returns all from transation
 */
  async getFromTransactions(tokenAddress: string, userAddress: string) {
    const model = tokenSchema(tokenAddress);
    return model.find({from: userAddress})
  },
/**
 * 
 * @param tokenAddress address of the token
 * @param userAddress address of the user
 * @returns all to transactions
 */
  async getToTransactions(tokenAddress: string, userAddress: string) {
    const model = tokenSchema(tokenAddress);
    return model.find({to: userAddress})
  }
};

export default tokenRepo;
