import ethers from "ethers";
import ItokenMeta from "../interfaces/tokenMeta.interface";
import tokenMetaRepo from "../repository/tokenMeta.repo";
import Logger from "../logger";
import { ETHER_SCAN_KEY } from "../config";

const logger = new Logger("tokenMetaService");

const tokenMetaService = {
  /**
   *
   * @param tokenAddress address of the token
   * @param contract Instance of contract
   * @returns first block number of the token
   * @description fetches metadata of the token and creates the db entry
   */
  async checkOrCreate(
    tokenAddress: string,
    contract: ethers.Contract
  ): Promise<number> {
    logger.entry("CheckOrCreate");
    logger.info("Checking if contract address already indexed");
    const check = await tokenMetaRepo.exists(tokenAddress);
    if (!check) {
      logger.info("Token not indexed");
      // fetches name, decimal, symbol and first block of the token
      const promises = [
        contract.name(),
        contract.decimals(),
        contract.symbol(),
        this.getFirstBlock(tokenAddress),
      ];
      const result = await Promise.allSettled(promises);
      let data: Partial<ItokenMeta> = {};
      data.status = "CREATED";
      data.tokenAddress = tokenAddress;
      if (result[0].status === "fulfilled") {
        data.tokenName = result[0].value;
      }
      if (result[1].status === "fulfilled") {
        console.log(result[1]);
        // data['decimal'] = ethers.BigNumber.from(result[1].value).toNumber();
      }
      if (result[2].status === "fulfilled") {
        data.symbol = result[2].value;
      }
      if (result[3].status === "fulfilled") {
        data.firstBlock = result[3].value;
        console.log(result[3].value);
      }
      logger.info(`Adding token: ${data.tokenName} to meta data`);
      await tokenMetaService.create(data);
    }
    const data = await tokenMetaRepo.findOne({ tokenAddress });
    logger.exit();
    return data?.firstBlock || 0;
  },

  /**
   *
   * @param data partial of type tokenMeta
   * @description creates a tokenMeta entry
   */
  create(data: Partial<ItokenMeta>) {
    return tokenMetaRepo.create(data);
  },

  /**
   *
   * @param tokenAddress address of token
   * @returns first block number of the token
   * @description function to get the first block of token in etherum chain
   */
  async getFirstBlock(tokenAddress: string): Promise<Number> {
    logger.entry("getFirstBlock");
    try {
      const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${tokenAddress}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${ETHER_SCAN_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      const firstBlock = parseInt(data.result[0].blockNumber);
      logger.exit();
      return firstBlock;
    } catch (error: any) {
      //TODO: handle rate limit of etherscan
      logger.error(error);
      logger.info(
        "Error while fetching firstblock, using default of 0 instead"
      );
      logger.exit();
      return 0;
    }
  },
};

export default tokenMetaService;
