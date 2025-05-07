const app = require('./app');
const connectDB = require('./config/database');

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`####\nServer running on port ${PORT}\n####`);
});