import { ethers } from 'ethers';
import tokenMetaService from './services/meta.service';
import Logger from './logger';
import ItokenMeta from './interfaces/tokenMeta.interface';
import tokenService from './services/token.service';
import {INFURA_ID, ERC20_ABI } from './constants'; 
const logger = new Logger('Indexer');
const indexer = async (tokenAddress: string) => {
  logger.info("Initilizing provider...");
  const provider = new ethers.providers.JsonRpcProvider(`https://mainnet.infura.io/v3/${INFURA_ID}`);
  const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  const block = await provider.getBlockNumber();
  const transferFilter = contract.filters.Transfer();
  const firstBlock = await tokenMetaService.checkOrCreate(tokenAddress, contract);
  console.log(firstBlock);
  await tokenService.fetch(tokenAddress);
  // const transferDetails = await contract.queryFilter(transferFilter, 50000, 100000);
  // console.log(transferDetails)
  // console.log('******************************************8',transferDetails)
  // for (let i=0; i<transferDetails.length; i++) {
  //   const from = transferDetails[i].args?.from;
  //   const to =  transferDetails[i].args?.to;
  //   const amount = ethers.BigNumber.from(transferDetails[i].args?.amount).toString();
  //   tokenService.create(tokenAddress, {from, to, amount, blockHash: transferDetails[i].blockHash, blockNumber: transferDetails[i].blockNumber, transactionHash: transferDetails[i].transactionHash, transactionIndex: transferDetails[i].transactionIndex})
  //   console.log(transferDetails[i])
   
  //   // k.from = transferDetails[i].from
  //   console.log(transferDetails[i].args?.amount)
  // }
};

export default indexer;
