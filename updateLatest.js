import { request } from "node:https";
import * as fs from "fs";

const API_KEY = process.env.EXCHANGERATESAPI_KEY;

if (typeof API_KEY === "undefined") {
  console.error(
    "No API key found in environment variable: EXCHANGERATESAPI_KEY",
  );
  process.exit(1);
}

const options = {
  hostname: "www.ianjmacintosh.com",
  port: 443,
  path: `/}`,
  method: "GET",
};

const req = request(options, (res) => {
  let rawData = "";
  res.on("data", (chunk) => {
    rawData += chunk;
  });
  res.on("end", () => {
    try {
      fs.writeFile("./src/ijm-index.html", rawData, (err) => {
        console.error(err);
      });
    } catch (e) {
      console.error(e.message);
    }
  });
});

req.on("error", (e) => {
  console.error(e);
});

req.end();
