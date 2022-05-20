import { ethers } from "ethers";
import { Btoken, Itoken } from "../interfaces/token.interface";
import tokenRepo from "../repository/token.repo";

import Logger from "../logger";
import { Bfailed } from "../interfaces/failed.interface";
import failedRepo from "../repository/failed.repo";

const logger = new Logger("TokenService");

const tokenService = {
  /**
   *
   * @param from start block of chain
   * @param to end block of chain
   * @param tokenAddress address of the token
   * @param contract contract instance
   * @description function to index the transfers
   */
  async indexer(
    from: number,
    to: number,
    tokenAddress: string,
    contract: ethers.Contract
  ) {
    logger.entry("Indexer");
    const BLOCK_SIZE = 50; // number of blocks per request
    const totalBlocks = to - from;
    const BATCH_SIZE = 20; // processing by batch
    const transferFilter = contract.filters.Transfer();

    let results: any = {};
    let indexedBlocks = 0;
    while (indexedBlocks < totalBlocks) {
      let promises = [];
      for (let j = 0; j < BATCH_SIZE; j++) {
        results[j] = { from: from, to: from+BLOCK_SIZE };
        promises.push(
          contract.queryFilter(transferFilter, from , from+BLOCK_SIZE)
        );
        from = from+BLOCK_SIZE+1;
        indexedBlocks += BLOCK_SIZE;
        logger.debug(`indexing from ${from} to ${from+BLOCK_SIZE}`);
      }
      const result = await Promise.allSettled(promises);
      logger.info(`****Completed ${(indexedBlocks / totalBlocks) * 100}****`);
      let events: Btoken[] = [];
      const failedEvents: Bfailed[] = [];
      result.map((ele, index) => {
        if (ele.status == "fulfilled") {
          if (ele.value.length) {
            const transferEvents = this.prepareData(ele.value);
            events.push(...transferEvents);
          }
        }else {
          failedEvents.push({fromBlock: from, toBlock: to, tokenAddress})
        }
      });
      logger.info(`Indexed ${indexedBlocks} blocks`);
      // setTimeout(() => {
      //   tokenRepo.insert(events, tokenAddress);
      // }, 0);
      //writing events that indexer failed to capture
      setTimeout(() => {
        failedRepo.bulkWrite(failedEvents);
      }, 0);
    }
    return;
  },
  /**
   *
   * @param data array of event object
   * @returns processed data
   * @description function to prepare data to be written into db
   */
  prepareData(data: Array<ethers.Event>): Btoken[] {
    const transferEvents = data.map((ele) => {
      logger.debug(
        `Captured transactionHash:${ele.transactionHash}|| blockNumber: ${ele.blockNumber} `
      );
      return {
        from: ele.args?.from,
        blockHash: ele.blockHash,
        blockNumber: ele.blockNumber,
        transactionHash: ele.transactionHash,
        transactionIndex: ele.transactionIndex,
        to: ele.args?.to,
        amount: ethers.BigNumber.from(ele.args?.amount).toString(),
      };
    });
    return transferEvents;
  },
  /**
   *
   * @param data event object
   * @param tokenAddress tokenaddress
   * @description function to prepare data and add event to the db
   */
  async addNewEvent(data: ethers.Event, tokenAddress: string) {
    tokenRepo.insert(
      [
        {
          from: data.args?.from,
          blockHash: data.blockHash,
          blockNumber: data.blockNumber,
          transactionHash: data.transactionHash,
          transactionIndex: data.transactionIndex,
          to: data.args?.to,
          amount: ethers.BigNumber.from(data.args?.amount).toString(),
        },
      ],
      tokenAddress
    );
  },
};

export default tokenService;
