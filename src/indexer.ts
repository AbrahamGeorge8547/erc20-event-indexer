import { ethers } from "ethers";

import tokenMetaService from "./services/meta.service";
import Logger from "./logger";
import tokenService from "./services/token.service";
import listenerCreator from './listenerCreator'
import {  ERC20_ABI } from "./constants";
import { INFURA_ID } from "./config";

const indexer = async (tokenAddress: string) => {
  Logger.general("Initilizing provider...");
  const provider = new ethers.providers.JsonRpcProvider(
    `https://mainnet.infura.io/v3/${INFURA_ID}`
  );
  const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  const tokenMetaData = await tokenMetaService.findToken(tokenAddress);

  if(!tokenMetaData) {  
    const firstBlock = await tokenMetaService.createTokenMetadata(tokenAddress, contract);
    // create listner for the address
    await listenerCreator(tokenAddress);
    const lastBlock = await provider.getBlockNumber();
    setTimeout(() => {
      tokenMetaService.updateStatus(tokenAddress, "INDEXING")
    })
    await tokenService.indexer(firstBlock, lastBlock, tokenAddress, contract);
    await tokenMetaService.updateStatus(tokenAddress, "LISTENING")
  }else {
    Logger.general("Indexer or listner already running")
  }
  process.exit(0);
};

export default indexer;
