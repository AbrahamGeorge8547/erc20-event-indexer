import reorgRepo from "../repository/reorg.repo";
import tokenService from "./token.service";
import Logger from "../logger";

const logger = new Logger("ReorgService");

const reorgService = {
  /**
   *
   * @param blockNumber blocknumber of the event
   * @param blockHash hash of the block of the new event
   * @param tokenAddress address of token
   * @description checks if the blockhash is the same for a given block number if encounters a new block deletes the oldest block and adds the new block
   */
  async checkFaultyBlock(
    blockNumber: number,
    blockHash: string,
    tokenAddress: string
  ) {
    logger.entry("checkFaultyBlock");
    const latestBlocks = await reorgRepo.find(tokenAddress);
    let foundBlock = false;
    if (latestBlocks.length > 4) {
      latestBlocks.map((ele) => {
        if (ele.blockNumber === blockNumber) {
          foundBlock = true;
          if (ele.blockHash != blockHash) {
            setTimeout(() => {tokenService.deleteBlock(blockHash, tokenAddress)},0);
          }
        }
      });
      if (!foundBlock) {
        const oldestBlock = latestBlocks[0];
        await reorgRepo.delete(tokenAddress, oldestBlock.blockHash);
        await reorgRepo.create({ blockNumber, blockHash, tokenAddress });
      }
    } else {
      await reorgRepo.create({ blockNumber, blockHash, tokenAddress });
    }
  },
};

export default reorgService;
