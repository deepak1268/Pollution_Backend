const axios = require("axios");
const {X_API_KEY,AQI_URL} = require("../config")

const getData = async (req, res) => {
  const postalCode = req.query.postalCode;
  const response = await axios.get(
    `${AQI_URL}/latest/by-postal-code?postalCode=${postalCode}&countryCode=IND`,
    {
      headers: {
        "x-api-key": X_API_KEY,
      },
    }
  );
  const reqData = response.data.stations[0];
  const { AQI, PM25, PM10, CO, NO2 } = reqData;
  return res.status(200).json({
    AQI,
    PM25,
    PM10,
    CO,
    NO2,
  });
};

const getTrend = async (req, res) => {
  const postalCode = req.query.postalCode;
  const now = new Date();
  const date = now.toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });
  const time = now.toLocaleTimeString("en-GB", {
    hour12: false,
  });
  try {
    const response = await axios.get(
      `${AQI_URL}/history/by-postal-code?postalCode=${postalCode}&countryCode=IND&from=${date} 00:00:00&to=${date} ${time}`,
      {
        headers: {
          "x-api-key": X_API_KEY,
        },
      }
    );
    const data = response.data.data;
    let trend = [];
    for (let i = 0; i < data.length; i++) {
      const hour = data[i].createdAt.slice(11, 13);
      trend.push({
        hour,
        AQI: data[i].AQI,
      });
    }
    return res.status(200).send(trend);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "API failed",
    });
  }
};

const getCityAvg = async (req, res) => {
  const response = await axios.get(`${AQI_URL}/latest/by-city?city=Delhi`, {
    headers: {
      "x-api-key": X_API_KEY,
    },
  });
  const cityAQI = response.data.stations[0].AQI;
  return res.status(200).json({
    cityAQI,
  });
};

module.exports = {
    getData,
    getTrend,
    getCityAvg
}