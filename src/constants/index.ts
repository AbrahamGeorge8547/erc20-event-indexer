// erc20 ABI for getting name symbol decimals and event transfer.
const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint)",

  "event Transfer(address indexed from, address indexed to, uint amount)",
];


export { ERC20_ABI};
