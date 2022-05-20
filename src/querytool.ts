import tokenService from "./services/token.service"
import tokenMetaService from "./services/meta.service"
import Logger from "./logger";
import connectToDatabase from "./models/databaseConnector";

const queryTool = async () => {
    const userAddress = process.argv[2];
    //db connection init
    await connectToDatabase();
    const tokenMetas = await tokenMetaService.getAllTokens()
    const transactions = await tokenService.getAllTransactionsOfAccount(tokenMetas, userAddress);
    console.log(transactions)
    process.exit(0);
}


queryTool()