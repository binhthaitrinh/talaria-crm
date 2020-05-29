const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Item = require('../../models/itemModel');
const Account = require('../../models/accountModel');
const Transaction = require('../../models/transactionModel');
const Paxful = require('../../models/paxfulModel');

// Config path to config file
dotenv.config({ path: `${__dirname}/../../config.env` });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((connection) => {
    console.log('DB connection successful');
  });

// Read JSON File
const items = JSON.parse(fs.readFileSync(`${__dirname}/order.json`, 'utf-8'));
const accounts = JSON.parse(
  fs.readFileSync(`${__dirname}/accounts.json`, 'utf-8')
);
const paxfuls = JSON.parse(
  fs.readFileSync(`${__dirname}/paxful.json`, 'utf-8')
);
// const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
// const reviews = JSON.parse(
//   fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
// );

// Import data into db
const importData = async () => {
  try {
    if (process.argv[3] === '--item') {
      await Item.create(items);
      console.log('Data successfully loaded');
    } else if (process.argv[3] === '--account') {
      await Account.create(accounts);
      console.log('Data successfully loaded');
    } else if (process.argv[3] === '--paxful') {
      await Paxful.create(paxfuls);
    }

    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// Delete all data from collection
const deleteData = async () => {
  try {
    if (process.argv[3] === '--item') {
      await Item.deleteMany();
      console.log('Data deleted');
    } else if (process.argv[3] === '--account') {
      await Account.deleteMany();
      console.log('Data deleted');
    } else if (process.argv[3] === '--transaction') {
      await Transaction.deleteMany();
    } else if (process.argc[3] === '--paxful') {
      await Paxful.deleteMany();
    }

    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
