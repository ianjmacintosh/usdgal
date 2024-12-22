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
  res.on("data", (data) => {
    fs.writeFile("./src/ijm-index.html", data, (err) => {
      if (err) {
        console.error(err);
      }
    });
  });
});

req.on("error", (e) => {
  console.error(e);
});
req.end();
