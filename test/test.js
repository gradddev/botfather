/*
 * BotFather
 * Copyright(c) 2016 Aleki
 * MIT Licensed
 */
'use strict';

const TOKEN = process.env.TOKEN;

const BotFather = require('../index.js');
const bf = new BotFather(TOKEN);

bf.api('getMe')
  .then((json) => {
    if(json.ok) {
      const bot = json.result;
      console.info(`All right! Your @${bot.username} ready for use :)`);
    } else {
      console.error(json.description);
    }
  })
  .catch((exception) => {
    console.error(exception.stack);
  });