const express = require("express");
const Router = express.Router;
const { getData, getTrend, getCityAvg } = require("../controllers/AQI.controller");
const { getInfo } = require("../controllers/info.controller");

const AQIRouter = Router(); 

AQIRouter.get("/getdata",getData)
AQIRouter.get("/gettrend",getTrend)
AQIRouter.get("/getcityavg",getCityAvg)
AQIRouter.get("/getInfo",getInfo)

module.exports = {
    AQIRouter
}