import {ethers } from 'ethers';



const indexer = async (address: string) => {
const INFURA_ID = "85e60d507da543c7938e7e00d9df53e8";
const provider = new ethers.providers.JsonRpcProvider(`https://mainnet.infura.io/v3/${INFURA_ID}`)

const ERC20_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint)",

    "event Transfer(address indexed from, address indexed to, uint amount)"
];
const contract = new ethers.Contract(address, ERC20_ABI, provider);
const block = await provider.getBlockNumber()
// console.log(await contract.name());
const transferFilter = contract.filters.Transfer();
const transferDetails = await contract.queryFilter(transferFilter,block-1, block );
console.log(transferDetails)
}


export default indexer;