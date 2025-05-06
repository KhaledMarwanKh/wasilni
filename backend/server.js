const dotenv = require('dotenv');
const mongoose = require('mongoose');


process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: `./config` });
const app = require('./app');

mongoose
  .connect(process.env.DATABASE,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('done'))
  .catch((err) => console.log(err));
const port = process.env.port*1 || 3000;
app.listen(port, () => {
  console.log('the server is running');
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});