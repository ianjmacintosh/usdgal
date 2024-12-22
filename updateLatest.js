import { request } from "node:https";
import * as fs from "fs";

const API_KEY = process.env.EXCHANGERATESAPI_KEY;
const SAVED_DATA_PATH = "./src/latest.json";
const API_HOSTNAME = "api.exchangeratesapi.io";
const API_PATH = `/v1/latest?access_key=${API_KEY}`;

if (typeof API_KEY === "undefined") {
  console.error(
    "No API key found in environment variable: EXCHANGERATESAPI_KEY",
  );
  process.exit(1);
}

// Only update if the saved data is older than 24 hours
const isExchangeRateDataOld =
  Date.now() > fs.statSync(SAVED_DATA_PATH).mtime + 24 * 60 * 60 * 1000;

if (!isExchangeRateDataOld) {
  console.log(
    `No need to update the exchange rate data because it is less than 24 hours old, no changes made to saved data (${SAVED_DATA_PATH})`,
  );
  process.exit(0);
}

const options = {
  hostname: API_HOSTNAME,
  port: 443,
  path: API_PATH,
  method: "GET",
};

const req = request(options, (res) => {
  console.log(res.statusCode);
  let rawData;
  res.on("data", (chunk) => {
    rawData += chunk;
  });
  res.on("end", () => {
    try {
      JSON.parse(rawData);
    } catch (error) {
      console.error("Response from endpoint is not valid JSON");
      req.end();
      process.exit(1);
    }
    if (JSON.parse(rawData)?.success !== true) {
      console.err(
        `Endpoint JSON data did not include expected \`"success": true\`, no changes made to saved data (${SAVED_DATA_PATH})`,
      );
      req.end();
      process.exit(1);
    }
    try {
      fs.writeFile(SAVED_DATA_PATH, rawData, (err) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
        console.log("### Successfully updated exchange rate data ###");
        console.log("### START ###");
        console.log(rawData);
        console.log("### END ###");
      });
      console.log();
    } catch (e) {
      console.error(e.message);
    }
  });
});

req.on("error", (e) => {
  console.error(e);
});

req.end();
