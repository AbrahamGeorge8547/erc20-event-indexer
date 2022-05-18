import ethers from "ethers";
import ItokenMeta from "../interfaces/tokenMeta.interface";
import tokenMetaRepo from "../repository/tokenMeta.repo";
import Logger from "../logger";
import { ETHER_SCAN_KEY } from "../config";

const logger = new Logger("tokenMetaService");

const tokenMetaService = {
  async checkOrCreate(tokenAddress: string, contract: ethers.Contract) {
    logger.entry("CheckOrCreate");
    logger.info("Checking if contract address already indexed");
    const check = await tokenMetaRepo.exists(tokenAddress);
    let firstBlock = "";
    if (!check) {
      logger.info("Token not indexed");
      console.log(await contract.decimals());
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
        firstBlock = result[3].value;
      }
      logger.info(`Adding token: ${data.tokenName} to meta data`);
      await tokenMetaService.create(data);
    }
    logger.exit()
  },
  create(data: Partial<ItokenMeta>) {
    return tokenMetaRepo.create(data);
  },

  async getFirstBlock(tokenAddress: string): Promise<Number> {
    logger.entry('getFirstBlock');
    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${tokenAddress}\
    &startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${ETHER_SCAN_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    logger.exit();
    return parseInt(data.result[0].blockNumber);
  },
};

export default tokenMetaService;
