const mongoose = require('mongoose');
const fs = require('fs');

const accountWebsite = [
  'amazon',
  'sephora',
  'ebay',
  'walmart',
  'costco',
  'bestbuy',
  'others',
];
const accountTypes = ['owned', 'borrowed'];

const accounts = [
  {
    _id: '5ecef412c697ac79087b4cfb',
    accountWebsite: accountWebsite[0],
    loginID: 'trinhthaibinh.ecom@gmail.com',
    balance: 0,

    notes: '',
    accountType: accountTypes[0],
    status: 'active',
    currency: 'usd',
  },
  {
    _id: '5ecef412c697ac79087b4cfc',
    accountWebsite: accountWebsite[0],
    loginID: 'btrinh27@student.cccd.edu',
    balance: 0,

    notes: '',
    accountType: accountTypes[0],
    status: 'active',
    currency: 'usd',
  },
  {
    _id: '5ecef412c697ac79087b4cfd',
    accountWebsite: accountWebsite[0],
    loginID: 'thaibinh.trinh@student.cccd.edu',
    balance: 0,

    notes: '',
    accountType: accountTypes[0],
    status: 'active',
    currency: 'usd',
  },
  {
    _id: '5ecef412c697ac79087b4cfe',
    accountWebsite: accountWebsite[0],
    loginID: 'tuongvo15694@gmail.com',
    balance: 0,

    notes: '',
    accountType: accountTypes[0],
    status: 'active',
    currency: 'usd',
  },
  {
    _id: '5ecef412c697ac79087b4cff',
    accountWebsite: accountWebsite[0],
    loginID: 'finoa_1709@yahoo.com',
    balance: 0,

    notes: '',
    accountType: accountTypes[0],
    status: 'active',
    currency: 'usd',
  },
  {
    accountWebsite: 'others',
    loginID: 'USD_ACCOUNT',
    balance: 0,
    notes: '',
    accountType: accountTypes[0],
    status: 'active',
    currency: 'usd',
  },
  {
    accountWebsite: 'others',
    loginID: 'VND_ACCOUNT',
    balance: 0,
    notes: '',
    accountType: accountTypes[0],
    status: 'active',
    currency: 'vnd',
  },
];

try {
  fs.writeFileSync(`${__dirname}/accounts.json`, JSON.stringify(accounts));
  console.log('Data writen to file...');
} catch (err) {
  console.log(err);
}
