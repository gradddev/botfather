/*
 * BotFather
 * Copyright(c) 2016 Aleki
 * MIT Licensed
 */
"use strict";

const https = require("https");

class BotFather {
	/**
	 * @param {string} token
	 */
  constructor(token) {
    this.token = token;
  }
	/**
	 * @param {string} method
 	 * @param {Object} parameters
	 * @return {Promise}
	 * @see https://core.telegram.org/bots/api#making-requests
	 */
  api(method, parameters) {
    return new Promise((resolve, reject) => {
      parameters = parameters || {};
      const timeout = (parameters.timeout || 60 * 2) * 1000;
      parameters = JSON.stringify(parameters);

      const options = {
        host: "api.telegram.org",
        port: 443,
        path: "/bot" + this.token + "/" + method,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(parameters)
        }
      };

      let request = https.request(options, (response) => {
        let data = "";
        response.on("data", (chunk) => {
          data += chunk;
        });
        response.on("end", () => {
          try {
            data = JSON.parse(data);
          } catch (exception) {
            reject(exception);
          }
          resolve(data);
        });
      });
      request.on("error", (exception) => {
        reject(exception);
      });
      request.setTimeout(timeout);
      request.write(parameters);
      request.end();
    });
  }
}
module.exports = BotFather;