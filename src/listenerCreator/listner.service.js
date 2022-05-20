
const fcegbbListener = () => {
    logger.entry('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48Listener');
    const url =  "https://mainnet.infura.io/v3/"+INFURA_ID
  const provider = new ethers.providers.JsonRpcProvider(url);
  const tokenAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  contract.on("Transfer", async (to, amount, from, transaction) => {
      const debugMsg = "New transfer event" + transaction.transactionHash
      logger.debug(debugMsg)
    await tokenService.default.addNewEvent(transaction, tokenAddress);
  });
}
fcegbbListener()