const express = require('express');
const cors = require('cors');
const connectMongo = require('./database/mongoDB');
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(cors({
  origin: [`http://${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}`],
  methods: ['GET', 'POST'],
  credentials: true
}));

// Auth routes

const registerRoute = require('./routes/auth/registerRoute');
const activateRoute = require('./routes/auth/activateRoute');
const loginRoute = require('./routes/auth/loginRoute');
const activationMailRoute = require('./routes/auth/activationMailRoute');
const resetPasswordMailRoute = require('./routes/auth/resetPasswordMailRoute');
const resetPasswordRoute = require('./routes/auth/resetPasswordRoute');
const verifyTokenRoute = require('./routes/auth/verifyToken');

app.use('/register', registerRoute);
app.use('/activate', activateRoute);
app.use('/login', loginRoute);
app.use('/activation-request', activationMailRoute);
app.use('/reset-password-request', resetPasswordMailRoute);
app.use('/password-reset', resetPasswordRoute);
app.use('/verifyToken', verifyTokenRoute);

// Server init

connectMongo().then(() => {
  app.listen(process.env.PORT, process.env.HOST, () => {
    console.log(`Server running on: http://${process.env.HOST}:${process.env.PORT}`);
  });
}).catch((error) => {
  console.error('Failed to connect to MongoDB. Aborting server startup.', error);
});