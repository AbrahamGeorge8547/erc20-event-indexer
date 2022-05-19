import { ethers } from "ethers";
import { Btoken, Itoken } from "../interfaces/token.interface";
import tokenRepo from "../repository/token.repo";

import Logger from "../logger";

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
    for (let i = 0; i < totalBlocks / BATCH_SIZE; i++) {
      let promises = [];
      for (let j = 0; j < BATCH_SIZE; j++) {
        results[j] = { from: to - BLOCK_SIZE, to };
        promises.push(
          contract.queryFilter(transferFilter, to - BLOCK_SIZE, to)
        );
        to -= BLOCK_SIZE + 1;
        logger.debug(`indexing from ${to - BLOCK_SIZE} to ${to}`);
      }
      indexedBlocks += 1;
      const result = await Promise.allSettled(promises);
      logger.info(
        `****Completed ${
          ((indexedBlocks * BATCH_SIZE * BLOCK_SIZE) / totalBlocks) * 100
        }****`
      );
      let events: Btoken[] = [];
      result.map((ele) => {
        if (ele.status == "fulfilled") {
          if (ele.value.length) {
            const transferEvents = this.prepareData(ele.value);
            events.push(...transferEvents);
          }
        }
      });
      setTimeout(() => {
        tokenRepo.insert(events, tokenAddress);
      }, 0);
    }
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
