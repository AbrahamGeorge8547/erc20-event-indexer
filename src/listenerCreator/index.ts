import Logger from "../logger";
import fs from "fs";
import { customAlphabet } from "nanoid";
import { exec } from "child_process";

/**
 *
 * @param tokenAddress address of the token
 * @description function to capture new events for the token
 */
const logger = new Logger("listenerCreator");
const listenerCreator = (tokenAddress: string) => {
  logger.entry("listenerCreator");
  logger.info(`creating listener for ${tokenAddress}`);
  const id = customAlphabet("abcdefghi", 6)();
  const codeString2 = `
const ${id}Listener = () => {
    logger.entry('${tokenAddress}Listener');
    const url =  "https://mainnet.infura.io/v3/"+INFURA_ID
  const provider = new ethers.providers.JsonRpcProvider(url);
  const tokenAddress = "${tokenAddress}";
  const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  contract.on("Transfer", async (to, amount, from, transaction) => {
    const debugMsg = "New transfer event" + transaction.transactionHash
    logger.debug(debugMsg)
    await tokenService.default.addNewEvent(transaction, tokenAddress);
    const blockNumber = transaction.blockNumber;
    const blockHash = transaction.blockHash;
    await reorgService.default.checkFaultyBlock(blockNumber, blockHash, tokenAddress);
  });
}
${id}Listener()`;
  const file = __dirname + "/listener.service.js";
  // appending to listener.service file
  fs.appendFile(file, codeString2, async (err: any) => {
    if (err) {
      logger.error(err);
    } else {
      logger.info("Restarting process 0");
      await exec("pm2 restart 0");
      logger.info("Restarted process 0");
      await new Promise((r) => setTimeout(r, 2000));
      logger.info("Restarting process 1");
      await exec("pm2 restart 1");
      logger.info("Restarted process 0");
    }
  });
  logger.exit();
};

export default listenerCreator;
