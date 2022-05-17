const ERC20_ABI = [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function totalSupply() view returns (uint256)',
    'function balanceOf(address) view returns (uint)',
    'function decimals() view returns (uint)',

    'event Transfer(address indexed from, address indexed to, uint amount)',
  ];

  const INFURA_ID = '85e60d507da543c7938e7e00d9df53e8';



  export  {ERC20_ABI, INFURA_ID}