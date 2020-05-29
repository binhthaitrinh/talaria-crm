const fs = require('fs');

const paxful = [
  {
    btcAmount: 0.02,
    usdVndRate: 23700,
    btcUsdRate: 6789,
    withdrawFee: 0,
    buyer: 'dat',
    pocketMoney: true,
    moneySpent: {
      amount: 3196054,
      currency: 'vnd',
    },
    date: new Date(2020, 3, 20, 13, 0, 0),
  },
  {
    btcAmount: 0.12383901,
    usdVndRate: 23700,
    btcUsdRate: 9000,
    withdrawFee: 0,
    buyer: 'dat',
    pocketMoney: true,
    moneySpent: {
      amount: 20000000,
      currency: 'vnd',
    },
  },
  {
    btcAmount: 0.11785504,
    usdVndRate: 23700,
    btcUsdRate: 9000,
    withdrawFee: 0,
    buyer: 'dat',
    pocketMoney: true,
    moneySpent: {
      amount: 20000000,
      currency: 'vnd',
    },
  },
  {
    btcAmount: 0.09129641,
    usdVndRate: 23600,
    btcUsdRate: 9000,
    withdrawFee: 0,
    buyer: 'dat',
    pocketMoney: true,
    moneySpent: {
      amount: 15000000,
      currency: 'vnd',
    },
  },
  {
    btcAmount: 0.06999533,
    usdVndRate: 23600,
    btcUsdRate: 9000,
    withdrawFee: 0,
    buyer: 'dat',
    pocketMoney: true,
    moneySpent: {
      amount: 15030000,
      currency: 'vnd',
    },
  },
];

try {
  fs.writeFileSync(`${__dirname}/paxful.json`, JSON.stringify(paxful));
  console.log('Data writen to file...');
} catch (err) {
  console.log(err);
}
