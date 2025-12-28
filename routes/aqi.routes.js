const express = require("express");
const Router = express.Router;
const axios = require("axios");

const AQIRouter = Router(); 


AQIRouter.get("/getAQIdata",async (req,res) => {
    const postalCode = req.body.postalCode;
    const response = await axios.get(`https://api.ambeedata.com/latest/by-postal-code?postalCode=${postalCode}&countryCode=IND`,{
        headers: {
            "x-api-key" : process.env.X_API_KEY
        }
    })
    const reqData = response.data.stations[0];
    const {AQI,PM25,PM10,CO,NO2} = reqData;
    // console.log(response.data)
    return res.status(200).json({
        AQI,
        PM25,
        PM10,
        CO,
        NO2
    });
})

module.exports = {
    AQIRouter
}