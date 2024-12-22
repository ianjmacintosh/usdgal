import { request } from "node:https";
import * as fs from "fs";

const API_KEY = process.env.EXCHANGERATESAPI_KEY;
const SAVED_DATA_PATH = "./src/latest.json";
const API_HOSTNAME = "www.ianjmacintosh.com";
const API_PATH = "/index.html";

if (typeof API_KEY === "undefined") {
  console.error(
    "No API key found in environment variable: EXCHANGERATESAPI_KEY",
  );
  process.exit(1);
}

const isExchangeRateDataOld = true;

if (!isExchangeRateDataOld) {
  console.log(
    `No need to update the exchange rate data, no changes made to saved data (${SAVED_DATA_PATH})`,
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
        console.error(err);
        if (err) throw err;
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
