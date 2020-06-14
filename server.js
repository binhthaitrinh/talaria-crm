const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

// Config path to config file
dotenv.config({ path: './config.env' });

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
  .then((conn) => console.log('DB connection successful...'))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 4444;
const server = app.listen(PORT, () =>
  console.log(`Listening on port ${PORT}...`)
);

// process.on('unhandledRejection', (err) => {
//   console.log('UNHANDLED REJECTION! Shutting down...');
//   console.log(err.name, err.messsage);
//   server.close(() => {
//     process.exit(1);
//   });
// });
