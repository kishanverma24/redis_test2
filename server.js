const redis = require("redis");
const axios = require("axios");
const express = require("express");
const app = express();

let redisClient;
(async () => {
  redisClient = redis.createClient();
  redisClient.on("error", (error) => {
    console.log(error);
  });
  await redisClient.connect();
})();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/data", async (req, res) => {
  let data = "";
  try {
    const cachedData = await redisClient.get("data");
    if (cachedData) {
      return res.json({ data: JSON.parse(cachedData) });
    }
    await axios
      .get("https://jsonplaceholder.typicode.com/posts")
      .then((response) => {
        data = response.data;
      });
    await redisClient.set("data", JSON.stringify(data));
    return res.json({ data });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

app.get("/calculate", async (req, res) => {
  //complex db call
  try {
    let calculatedData = 0;

    const cachedData = await redisClient.get("calculatedData");
    if (cachedData) {
      return res.json({ data: cachedData });
    }

    for (let i = 0; i < 10000000000; i++) {
      calculatedData += i;
    }
    await redisClient.set("calculatedData", calculatedData);
    return res.json({ data: calculatedData });
  } catch (error) {
    // console.log(error);
    return res.json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server is listening on Port 3000");
});
