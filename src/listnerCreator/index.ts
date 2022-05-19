import Logger from "../logger";
import fs from "fs";
import { customAlphabet } from "nanoid";

/**
 *
 * @param tokenAddress address of the token
 * @description function to capture new events for the token
 */
const logger = new Logger("listnerCreator");
const listnerCreator = (tokenAddress: string) => {
  logger.entry("listnerCreator");
  logger.info(`creating listner for ${tokenAddress}`);
  const id = customAlphabet("abcdefghi", 6)();
  const codeString2 = `
const ${id}Listner = () => {
    logger.entry('${tokenAddress}Listner');
    const url =  "https://mainnet.infura.io/v3/"+INFURA_ID
  const provider = new ethers.providers.JsonRpcProvider(url);
  const tokenAddress = "${tokenAddress}";
  const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  contract.on("Transfer", async (to, amount, from, transaction) => {
      const debugMsg = "New transfer event" + transaction.transactionHash
      logger.debug(debugMsg)
    await tokenService.default.addNewEvent(transaction, tokenAddress);
  });
}
${id}Listner()`;
  const file = __dirname + "/listner.service.js";
  // appending to listner.service file
  fs.appendFile(file, codeString2, (err: any) => {
    if (err) {
      logger.error(err);
    }
  });
  logger.exit();
};

export default listnerCreator;
