import { ethers } from 'ethers';
import tokenMetaRepo from './repository/tokenMeta.repo';
import Logger from './logger';
import ItokenMeta from './interfaces/tokenMeta.interface';
import tokenService from './services/token.service';
import {INFURA_ID, ERC20_ABI} from './constants'; 

const indexer = async (tokenAddress: string) => {
  const logger = new Logger('Indexer');

  const provider = new ethers.providers.JsonRpcProvider(`https://mainnet.infura.io/v3/${INFURA_ID}`);


  logger.info('Testing');
  const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  const block = await provider.getBlockNumber();
  const check = await tokenMetaRepo.exists(tokenAddress);
  if (!check) {
    const promises = [contract.name(), contract.decimals(), contract.symbol()]
    const result = await Promise.allSettled(promises);
    let data:Partial<ItokenMeta> = {}
    data.status = "CREATED";
    data.tokenAddress = tokenAddress;
    if(result[0].status === 'fulfilled') {
      data['name'] = result[0].value;
    }
    if(result[1].status === 'fulfilled') {
      data['decimal'] = ethers.BigNumber.from(result[1].value).toNumber();
    }
    if(result[2].status === 'fulfilled') {
      data['symbol'] = result[2].value;
    }

    await tokenMetaRepo.create(data);
  }
  const transferFilter = contract.filters.Transfer();
  await tokenService.fetch(tokenAddress);
  // const transferDetails = await contract.queryFilter(transferFilter, block - 100, block);
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
