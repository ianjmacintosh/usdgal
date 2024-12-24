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

// Read the saved data file's JSON and store its "timestamp" property in a variable
const savedData = JSON.parse(fs.readFileSync(SAVED_DATA_PATH));
const savedDataTimestamp = savedData.timestamp * 1000; // Convert to milliseconds

// Only update if the saved data is older than 23 hours
//   - This script is schedule to run at the same time every night
//   - If it was stale only after exactly 24 hours, the script would be flaky; it might
//     run a millisecond early and miss the update
const isExchangeRateDataOld =
  Date.now() > savedDataTimestamp + 23 * 60 * 60 * 1000;

// Show difference in timestamps in hours, minutes, and seconds
const hours = Math.floor((Date.now() - savedDataTimestamp) / 1000 / 60 / 60);
const minutes = Math.floor(
  (Date.now() - savedDataTimestamp) / 1000 / 60 - hours * 60,
);
const seconds = Math.floor(
  (Date.now() - savedDataTimestamp) / 1000 - hours * 60 * 60 - minutes * 60,
);

console.log(
  `Saved data is ${hours} hours, ${minutes} minutes, and ${seconds} seconds old`,
);

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
  let rawData = "";
  let parsedData = {};
  res.on("data", (chunk) => {
    if (typeof chunk !== "undefined") {
      rawData += chunk;
    }
  });
  res.on("end", () => {
    try {
      parsedData = JSON.parse(rawData);
    } catch (error) {
      console.error("Response from endpoint is not valid JSON");
      console.log("### START ###");
      console.log(rawData);
      console.log("### END ###");
      req.end();
      process.exit(1);
    }
    if (parsedData.success !== true) {
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
