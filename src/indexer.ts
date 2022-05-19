import { ethers } from "ethers";

import tokenMetaService from "./services/meta.service";
import Logger from "./logger";
import ItokenMeta from "./interfaces/tokenMeta.interface";
import tokenService from "./services/token.service";
import listnerCreator from './listnerCreator'
import { INFURA_ID, ERC20_ABI } from "./constants";

const logger = new Logger("Indexer");
const indexer = async (tokenAddress: string) => {
  logger.info("Initilizing provider...");
  const provider = new ethers.providers.JsonRpcProvider(
    `https://mainnet.infura.io/v3/${INFURA_ID}`
  );
  const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

  const result = await Promise.allSettled([
    tokenMetaService.checkOrCreate(tokenAddress, contract),
    provider.getBlockNumber(),
  ]);
  if (result[0].status == "fulfilled" && result[1].status == "fulfilled") {
    const firstBlock = result[0].value;
    const lastBlock = result[1].value;
    await listnerCreator(tokenAddress)
    // listnerService.usdListner(contract)
    // await tokenService.indexer(firstBlock, lastBlock, tokenAddress, contract);
  }
};

export default indexer;
