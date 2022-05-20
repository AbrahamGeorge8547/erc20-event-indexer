import { ethers } from "ethers";
import { Btoken, Itoken } from "../interfaces/token.interface";
import tokenRepo from "../repository/token.repo";

import Logger from "../logger";
import { Bfailed } from "../interfaces/failed.interface";
import failedRepo from "../repository/failed.repo";
import ItokenMeta from "../interfaces/tokenMeta.interface";

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
        results[j] = { from: from, to: from + BLOCK_SIZE };
        promises.push(
          contract.queryFilter(transferFilter, from, from + BLOCK_SIZE)
        );
        from = from + BLOCK_SIZE + 1;
        indexedBlocks += BLOCK_SIZE;
        logger.debug(`indexing from ${from} to ${from + BLOCK_SIZE}`);
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
        } else {
          failedEvents.push({ fromBlock: from, toBlock: to, tokenAddress });
        }
      });
      logger.info(`Indexed ${indexedBlocks} blocks`);
      setTimeout(() => {
        tokenRepo.insert(events, tokenAddress);
      }, 0);
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
  /**
   *
   * @param blockHash hash of the block
   * @param tokenAddress address of the token
   * @description function to delete the block while chain reorg happens
   */
  async deleteBlock(blockHash: string, tokenAddress: string) {
    logger.entry("DeleteBlock");
    logger.info(`Found faulty block with blockhash ${blockHash}`);
    await tokenRepo.deleteBlock(blockHash, tokenAddress);
  },
  /**
   *
   * @param tokenMeta metadatas of supported tokens
   * @param userAddress address of the user
   * @returns all transactions indexed in db
   * @description retirves transactions related to the user from db
   */
  async getAllTransactionsOfAccount(
    tokenMeta: ItokenMeta[],
    userAddress: string
  ) {
    const transactions = [];
    //ToDo: optimize query with groups
    for (let i = 0; i < tokenMeta.length; i++) {
      const fromTransactions = await tokenRepo.getFromTransactions(
        tokenMeta[i].tokenAddress,
        userAddress
      );
      const toTransactions = await tokenRepo.getToTransactions(
        tokenMeta[i].tokenAddress,
        userAddress
      );
      if (fromTransactions.length == 0 && toTransactions.length == 0) {
        continue;
      }
      const toParsed = this.prepareToTransactionData(
        toTransactions,
        tokenMeta[i].decimal
      );
      const fromParsed = this.prepareFromTransactionData(
        fromTransactions,
        tokenMeta[i].decimal
      );
      transactions.push({
        [tokenMeta[i].symbol]: {
          from: JSON.stringify(fromParsed),
          to: JSON.stringify(toParsed),
        },
      });
    }
    return transactions;
  },
  /**
   *
   * @param transactions transactions of the user
   * @param decimal precision of the token
   * @returns formated data
   * @description prepares transaction data to be returned
   */
  prepareFromTransactionData(transactions: Itoken[], decimal: number) {
    const amounts = transactions.map((ele) => {
      return {
        to: ele.to,
        amount: parseInt(ele.amount) / Math.pow(10, decimal),
      };
    });
    return amounts;
  },

  /**
   *
   * @param transactions transactions of the user
   * @param decimal precision of the token
   * @returns formated data
   * @description prepares transaction data to be returned
   */
  prepareToTransactionData(transactions: Itoken[], decimal: number) {
    const amounts = transactions.map((ele) => {
      return {
        to: ele.to,
        amount: parseInt(ele.amount) / Math.pow(10, decimal),
      };
    });

    return amounts;
  },
};

export default tokenService;
