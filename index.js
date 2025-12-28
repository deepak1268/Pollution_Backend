require('dotenv').config();
const express = require("express");
const { userRouter } = require('./routes/user.routes');
const { AQIRouter } = require('./routes/aqi.routes');
const mongoose = require('mongoose');

const app = express();
app.use(express.json())

app.use("/api/user",userRouter);
app.use("/api/AQI",AQIRouter);

async function main(){
    await mongoose.connect(process.env.DB_URL);
    app.listen(3000);
}

main();