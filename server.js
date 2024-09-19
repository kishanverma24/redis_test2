const redis = require("redis");
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

app.get("calculate-data", async (req, res) => {
  //complex db call
  try {
    let calculatedData = 0;

    const cachedData = await redisClient.get("calculatedData");
    if (cachedData) {
      return res.json({ data: cachedData });
    }

    for (let i = 0; i < 100000000; i++) {
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
