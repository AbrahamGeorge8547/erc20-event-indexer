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
};

export default tokenRepo;
