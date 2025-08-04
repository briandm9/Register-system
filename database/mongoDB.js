const mongoose = require('mongoose');

const connectMongo = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}`);
    console.log('Connected to DB');
  } catch (error) {
    throw error;
  }
};

module.exports = connectMongo;