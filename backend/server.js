const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3016;

const cors = require('cors');


const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const {auth} = require('./middleware/authMiddleware');

app.use(express.json());
app.use(cors({
  origin: process.env.TESTURL,
}));

app.use('/api',auth,taskRoutes);
app.use('/auth',authRoutes);

app.listen(PORT, () => {
    console.log("Server started");
})