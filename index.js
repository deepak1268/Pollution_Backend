require('dotenv').config();
const express = require("express");
const cors = require("cors")
const { userRouter } = require('./routes/user.routes');
const { AQIRouter } = require('./routes/aqi.routes');
const mongoose = require('mongoose');
const { any } = require('zod');

const app = express();
app.use(cors({
    origin: ["http://localhost:5173"]
}))
app.use(express.json())

app.use("/api/user",userRouter);
app.use("/api/AQI",AQIRouter);

async function main(){
    await mongoose.connect(process.env.DB_URL);
    app.listen(3000);
}

main();