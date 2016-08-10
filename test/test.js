/*
 * BotFather
 * Copyright(c) 2016 Aleki
 * MIT Licensed
 */
"use strict"

const TOKEN = process.env.TOKEN

const BotFather = require("../index.js")
const bf = new BotFather(TOKEN)

bf.api("getMe")
  .then(json => {
    if(json.ok) {
      return json.result
    }
    console.error(json.description)
  })
  .then(bot => {
    console.info(`All right! Your @${bot.username} ready for use :)`)
  })
  .catch((exception) => {
    console.error(exception.stack)
  })