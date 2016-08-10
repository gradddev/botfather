/*
 * BotFather
 * Copyright(c) 2016 Aleki
 * MIT Licensed
 */
"use strict"

const path = require("path")
const https = require("https")
const crypto = require("crypto")

class BotFather {

  /**
   * @param {string} token
   * @see https://core.telegram.org/bots#6-botfather
   */
  constructor(token) {
    this.token = token
  }

  /**
   * @param {string} method
   * @param {Object} parameters
   * @return {Promise}
   * @see https://core.telegram.org/bots/api#making-requests
   */
  api(method, parameters = {}) {
    return new Promise((resolve, reject) => {
      const timeout = (parameters.timeout || 60 * 2) * 1000
      const boundary = crypto.randomBytes(32).toString("hex")
      let options = {
        host: "api.telegram.org",
        port: 443,
        path: "/bot" + this.token + "/" + method,
        method: "POST",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${boundary}`
        }
      }
      if(!Object.keys(parameters).length) {
        options.method = "GET"
        options.headers = {}
      }
      let request = https.request(options, (response) => {
        let data = ""
        response.on("data", (chunk) => {
          data += chunk
        })
        response.on("end", () => {
          try {
            data = JSON.parse(data)
          } catch (exception) {
            reject(exception)
          }
          resolve(data)
        })
      })
      request.on("error", (exception) => {
        reject(exception)
      })
      request.setTimeout(timeout)
      if(!Object.keys(parameters).length) {
        return request.end()
      }
      let buffers = []
      const names = Object.keys(parameters)
      const promises = names.map((name) => new Promise((resolve, reject) => {
        let parameter = parameters[name]
        let buffer = new Buffer(`--${boundary}\r\n`)
        switch(typeof parameter) {
          case "string":
          case "number":
          case "boolean":
            buffer = Buffer.concat([buffer, new Buffer(
              `Content-Disposition: form-data; name="${name}"\r\n\r\n` +
              `${parameter}\r\n`
            )])
            buffers.push(buffer)
            resolve()
          break
          case "array":
          case "object":
            if(parameter.constructor.name != "ReadStream") {
              parameter = JSON.stringify(parameter)
              buffer = Buffer.concat([buffer, new Buffer(
                `Content-Disposition: form-data; name="${name}"\r\n\r\n` +
                `${parameter}\r\n`
              )])
              buffers.push(buffer)
              resolve()
            } else {
              const file = parameter
              const filename = path.basename(file.path)
              buffer = Buffer.concat([buffer, new Buffer(
                `Content-Disposition: form-data; name="${name}"; filename="${filename}"\r\n` +
                `Content-Type: application/octet-stream\r\n\r\n`
              )])
              file
                .on("data", (chunk) => {
                  buffer = Buffer.concat([buffer, new Buffer(chunk)])
                })
                .on("end", () => {
                  buffer = Buffer.concat([buffer, new Buffer("\r\n")])
                  buffers.push(buffer)
                  resolve()
                })
            }
          break
        }
      }))
      Promise
        .all(promises)
        .then(() => {
          buffers.push(new Buffer(`--${boundary}--\r\n`))
          const buffer = Buffer.concat(buffers)
          request.end(buffer)
        })
        .catch((exception) => {
          reject(exception)
        })
    })
  }
}

module.exports = BotFather