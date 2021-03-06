const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Item = require('../../models/itemModel');
const Account = require('../../models/accountModel');
const Transaction = require('../../models/transactionModel');
const Paxful = require('../../models/paxfulModel');
const GiftCard = require('../../models/giftCardModel');
const Bill = require('../../models/billModel');
const Compensation = require('../../models/compensationModel');
const Customer = require('../../models/customerModel');

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

const giftcards = JSON.parse(
  fs.readFileSync(`${__dirname}/giftcard.json`, 'utf-8')
);
// const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
// const reviews = JSON.parse(
//   fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
// );

// Import data into db
const importData = async () => {
  try {
    if (process.argv[3] === '--item') {
      await Item.create(items[0]);
      await Item.create(items[1]);
      await Item.create(items[2]);
      await Item.create(items[3]);
      await Item.create(items[4]);
      await Item.create(items[5]);
      await Item.create(items[6]);
      await Item.create(items[7]);
      await Item.create(items[8]);
      await Item.create(items[9]);
      console.log('Data successfully loaded');
    } else if (process.argv[3] === '--account') {
      await Account.create(accounts);
      console.log('Data successfully loaded');
    } else if (process.argv[3] === '--paxful') {
      await Paxful.create(paxfuls[0]);
      await Paxful.create(paxfuls[1]);
      await Paxful.create(paxfuls[2]);
      await Paxful.create(paxfuls[3]);
      await Paxful.create(paxfuls[4]);
      await Paxful.create(paxfuls[5]);
      await Paxful.create(paxfuls[6]);
      await Paxful.create(paxfuls[7]);
      await Paxful.create(paxfuls[8]);
      await Paxful.create(paxfuls[9]);
    } else if (process.argv[3] === '--giftcard') {
      await GiftCard.create(giftcards[0]);
      await GiftCard.create(giftcards[1]);
      await GiftCard.create(giftcards[2]);
      await GiftCard.create(giftcards[3]);
      await GiftCard.create(giftcards[4]);
      await GiftCard.create(giftcards[5]);
      await GiftCard.create(giftcards[6]);
      await GiftCard.create(giftcards[7]);
      await GiftCard.create(giftcards[8]);
      await GiftCard.create(giftcards[9]);
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
    } else if (process.argv[3] === '--paxful') {
      await Paxful.deleteMany();
    } else if (process.argv[3] === '--giftcard') {
      await GiftCard.deleteMany();
    } else if (process.argv[3] === '--bill') {
      await Bill.deleteMany();
    } else if (process.argv[3] === '--compensation') {
      await Compensation.deleteMany();
    } else if (process.argv[3] === '--customer') {
      await Customer.deleteMany();
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
