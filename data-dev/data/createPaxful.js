const fs = require('fs');

const paxful = [
  {
    btcAmount: 0.04674805,
    usdVndRate: 23287,
    btcUsdRate: 9250,
    withdrawFee: 0.00325195,
    buyer: 'dat',
    pocketMoney: true,
    amountSpent: {
      value: 10069601,
      currency: 'vnd',
    },
    createdAt: new Date(2020, 1, 5, 13, 0, 0),
    transactionType: 'inflow',
    btcAccount: '5f3ea13ab7cd0c25718e444c',
    fromAccount: '5f38a7b5da6c103718a00631',
  },
  {
    btcAmount: 0.06953014,
    usdVndRate: 23287,
    btcUsdRate: 10230,
    withdrawFee: 0.00046986,
    buyer: 'dat',
    pocketMoney: true,
    amountSpent: {
      value: 16563639,
      currency: 'vnd',
    },
    createdAt: new Date(2020, 1, 14, 13, 0, 0),
    transactionType: 'inflow',
    btcAccount: '5f3ea13ab7cd0c25718e444c',
    fromAccount: '5f38a7b5da6c103718a00631',
  },
  {
    btcAmount: 0.07718933,
    usdVndRate: 23287,
    btcUsdRate: 9983,
    withdrawFee: 0.0004,
    buyer: 'dat',
    pocketMoney: true,
    amountSpent: {
      value: 17944252,
      currency: 'vnd',
    },
    createdAt: new Date(2020, 1, 25, 13, 0, 0),
    transactionType: 'inflow',
    btcAccount: '5f3ea13ab7cd0c25718e444c',
    fromAccount: '5f38a7b5da6c103718a00631',
  },
  {
    btcAmount: 0.00486086,
    usdVndRate: 23287,
    btcUsdRate: 10345,
    withdrawFee: 0,
    buyer: 'dat',
    pocketMoney: true,
    amountSpent: {
      value: 1170983,
      currency: 'vnd',
    },
    createdAt: new Date(2020, 2, 11, 13, 0, 0),
    transactionType: 'inflow',
    btcAccount: '5f3ea13ab7cd0c25718e444c',
    fromAccount: '5f38a7b5da6c103718a00631',
  },
  {
    btcAmount: 0.010718,
    usdVndRate: 23370,
    btcUsdRate: 6344,
    withdrawFee: 0,
    buyer: 'dat',
    pocketMoney: true,
    amountSpent: {
      value: 1589043,
      currency: 'vnd',
    },
    createdAt: new Date(2020, 2, 20, 13, 0, 0),
    transactionType: 'inflow',
    btcAccount: '5f3ea13ab7cd0c25718e444c',
    fromAccount: '5f38a7b5da6c103718a00631',
  },
  {
    btcAmount: 0.0358775,
    usdVndRate: 23370,
    btcUsdRate: 5885,
    withdrawFee: 0,
    buyer: 'dat',
    pocketMoney: true,
    amountSpent: {
      value: 4936320,
      currency: 'vnd',
    },
    createdAt: new Date(2020, 2, 22, 13, 0, 0),
    transactionType: 'inflow',
    btcAccount: '5f3ea13ab7cd0c25718e444c',
    fromAccount: '5f38a7b5da6c103718a00631',
  },
  {
    btcAmount: 0.06976,
    usdVndRate: 23540,
    btcUsdRate: 6780,
    withdrawFee: 0.00024,
    buyer: 'dat',
    pocketMoney: true,
    amountSpent: {
      value: 11133780,
      currency: 'vnd',
    },
    createdAt: new Date(2020, 2, 27, 13, 0, 0),
    transactionType: 'inflow',
    btcAccount: '5f3ea13ab7cd0c25718e444c',
    fromAccount: '5f38a7b5da6c103718a00631',
  },
  {
    btcAmount: 0.13801283,
    usdVndRate: 23540,
    btcUsdRate: 6338,
    withdrawFee: 0.00024,
    buyer: 'dat',
    pocketMoney: true,
    amountSpent: {
      value: 20591942,
      currency: 'vnd',
    },
    createdAt: new Date(2020, 2, 30, 13, 0, 0),
    transactionType: 'inflow',
    btcAccount: '5f3ea13ab7cd0c25718e444c',
    fromAccount: '5f38a7b5da6c103718a00631',
  },
  {
    btcAmount: 0.02,
    usdVndRate: 23540,
    btcUsdRate: 6789,
    withdrawFee: 0.00024,
    buyer: 'dat',
    pocketMoney: true,
    amountSpent: {
      value: 3196054,
      currency: 'vnd',
    },
    createdAt: new Date(2020, 2, 31, 13, 0, 0),
    transactionType: 'inflow',
    btcAccount: '5f3ea13ab7cd0c25718e444c',
    fromAccount: '5f38a7b5da6c103718a00631',
  },
  {
    btcAmount: 0.05,
    usdVndRate: 23540,
    btcUsdRate: 6344,
    withdrawFee: 0,
    buyer: 'dat',
    pocketMoney: true,
    amountSpent: {
      value: 8196054,
      currency: 'vnd',
    },
    createdAt: new Date(2020, 3, 4, 13, 0, 0),
    transactionType: 'inflow',
    btcAccount: '5f3ea13ab7cd0c25718e444c',
    fromAccount: '5f38a7b5da6c103718a00631',
  },
];

try {
  fs.writeFileSync(`${__dirname}/paxful.json`, JSON.stringify(paxful));
  console.log('Data writen to file...');
} catch (err) {
  console.log(err);
}
