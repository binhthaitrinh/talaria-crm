const mongoose = require('mongoose');
const fs = require('fs');

const accountWebsite = ['amazon', 'sephora', 'ebay', 'walmart', 'costco'];
const accountTypes = ['owned', 'borrowed'];

const accounts = [
  {
    _id: '5ecef412c697ac79087b4cfb',
    accountWebsite: accountWebsite[0],
    loginID: 'trinhthaibinh.ecom@gmail.com',
    balance: 372.61,
    addedAt: Date.now(),
    notes: '',
    accountType: accountTypes[0],
    status: 'active',
  },
  {
    _id: '5ecef412c697ac79087b4cfc',
    accountWebsite: accountWebsite[0],
    loginID: 'btrinh27@student.cccd.edu',
    balance: 12.48,
    addedAt: Date.now(),

    notes: '',
    accountType: accountTypes[0],
    status: 'active',
  },
  {
    _id: '5ecef412c697ac79087b4cfd',
    accountWebsite: accountWebsite[0],
    loginID: 'thaibinh.trinh@student.cccd.edu',
    balance: 49.04,
    addedAt: Date.now(),

    notes: '',
    accountType: accountTypes[0],
    status: 'active',
  },
  {
    _id: '5ecef412c697ac79087b4cfe',
    accountWebsite: accountWebsite[0],
    loginID: 'tuongvo15694@gmail.com',
    balance: 400,
    addedAt: Date.now(),

    notes: '',
    accountType: accountTypes[0],
    status: 'active',
  },
  {
    _id: '5ecef412c697ac79087b4cff',
    accountWebsite: accountWebsite[0],
    loginID: 'finoa_1709@yahoo.com',
    balance: 400,
    addedAt: Date.now(),

    notes: '',
    accountType: accountTypes[0],
    status: 'active',
  },
];

console.log(accounts.length);

try {
  fs.writeFileSync(`${__dirname}/accounts.json`, JSON.stringify(accounts));
  console.log('Data writen to file...');
} catch (err) {
  console.log(err);
}
