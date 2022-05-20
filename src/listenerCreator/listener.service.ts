const { ethers } = require("ethers");
const { INFURA_ID, ERC20_ABI } = require("../constants");
const tokenService = require("../services/token.service");
const connector = require("../models/databaseConnector");
const Logger = require("../logger");

const logger = new Logger.default("Listener");

connector.default();

// dummy function so that typescript compiler doesnot ignore this function.
const dMS1d2YRyPDJqmSemRUrMYListener = () => {
  const url = "https://mainnet.infura.io/v3/" + INFURA_ID;
  console.log(url);
  const provider = new ethers.providers.JsonRpcProvider(url);
  const tokenAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  // contract.on("Transfer", async (to, amount, from, transactionHash) => {
  //   await tokenService.default.addNewEvent(transactionHash, tokenAddress);
  // });
};
