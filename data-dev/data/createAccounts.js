const mongoose = require('mongoose');
const fs = require('fs');

const accountTypes = ['amazon', 'sephora', 'ebay', 'walmart', 'costco'];
const types = ['owned', 'borrowed'];

const accounts = [
  {
    _id: '5ecef412c697ac79087b4cfb',
    accountTypes: accountTypes[0],
    loginID: 'trinhthaibinh.ecom@gmail.com',
    balance: 372.61,
    accountAddedDate: Date.now(),
    transactionHistory: [
      { date: new Date(2020, 4, 30, 10, 33), amount: 30.0 },
      { date: Date.now(), amount: 40.0 },
    ],
    notes: '',
    type: types[0],
  },
  {
    _id: '5ecef412c697ac79087b4cfc',
    accountTypes: accountTypes[0],
    loginID: 'btrinh27@student.cccd.edu',
    balance: 12.48,
    accountAddedDate: Date.now(),
    transactionHistory: [],
    notes: '',
    type: types[0],
  },
  {
    _id: '5ecef412c697ac79087b4cfd',
    accountTypes: accountTypes[0],
    loginID: 'thaibinh.trinh@student.cccd.edu',
    balance: 49.04,
    accountAddedDate: Date.now(),
    transactionHistory: [],
    notes: '',
    type: types[0],
  },
  {
    _id: '5ecef412c697ac79087b4cfe',
    accountTypes: accountTypes[0],
    loginID: 'tuongvo15694@gmail.com',
    balance: 400,
    accountAddedDate: Date.now(),
    transactionHistory: [],
    notes: '',
    type: types[0],
  },
  {
    _id: '5ecef412c697ac79087b4cff',
    accountTypes: accountTypes[0],
    loginID: 'finoa_1709@yahoo.com',
    balance: 400,
    accountAddedDate: Date.now(),
    transactionHistory: [],
    notes: '',
    type: types[0],
  },
];

console.log(accounts.length);

try {
  fs.writeFileSync(`${__dirname}/accounts.json`, JSON.stringify(accounts));
  console.log('Data writen to file...');
} catch (err) {
  console.log(err);
}
