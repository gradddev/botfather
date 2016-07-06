[![npm](https://img.shields.io/npm/dm/botfather.svg?style=flat-square)](https://www.npmjs.com/package/botfather)
[![npm](https://img.shields.io/badge/dependencies-none-brightgreen.svg?style=flat-square)](https://github.com/aleki/botfather/blob/master/package.json)
[![npm](https://img.shields.io/node/v/botfather.svg?style=flat-square)](https://nodejs.org/en/download/current/)
[![npm](https://img.shields.io/npm/v/botfather.svg?style=flat-square)](https://www.npmjs.com/package/botfather)
[![npm](https://img.shields.io/npm/l/botfather.svg?style=flat-square)](https://github.com/aleki/botfather/blob/master/LICENSE)

# Getting Started with BotFather

## Bots using BotFather

### [RadioArchiveBot](http://radioarchivebot.ru/)
![RadioArchiveBot](https://gist.githubusercontent.com/aleki/22275632ab2b4c644837c0a764a46d7d/raw/913e0d176046363a4a69dce43a2d0aa84a2d50de/RadioArchiveBot.png)

Want to add your bot? Please submit a pull request on [GitHub](https://github.com/aleki/botfather) to update this page!

## Installing BotFather
```bash
$ cd MyBot
$ npm install botfather --save
```

## Using BotFather
```javascript
const BotFather = require('botfather');
// We recommend storing the token as environment variable.
const token = process.env.TOKEN;
const bf = new BotFather(token);
// ...
```

### Example #1 (Getting basic information about the bot)
```javascript
bf.api('getMe')
  .then((json) => {
    if(!json.ok) {
      console.error(json.description);
      return;
    }
    const bot = json.result;
    console.info(`Your bot is @${bot.username}, right? :)`);
  })
  .catch((exception) => {
    console.error(exception.stack);
  });
```

### Example #2 (Sending file)
```javascript
const fs = require("fs");
// ...
bf.api("sendDocument", {
  chat_id: CHAT_ID,
  document: fs.createReadStream(PATH_TO_FILE)
})
  .then((json) => {
    if(!json.ok) {
      console.error(json.description);
      return;
    }
    console.info(json.result);
  })
  .catch((exception) => {
    console.error(exception.stack);
  });
```

### Example #3 (Extending your own class)
```javascript
class MyBot extends BotFather {
  constructor(token) {
    super(token);
    this.api('getMe')
      .then((json) => {
        if(!json.ok) {
          console.error(json.description);
          return;
        }
        const bot = json.result;
        console.info(`Your bot is @${bot.username}, right? :)`);
      })
      .catch((exception) => {
        console.error(exception.stack);
      });
  }
}
new MyBot(token);
```

### Example #4 (Getting updates recursively)
```javascript
/**
  * @param {Object} parameters
  * @see https://core.telegram.org/bots/api#getupdates
  */
function getUpdates(parameters) {
  bf.api('getUpdates', parameters)
    .then((json) => {
      if(!json.ok) {
        console.error(json.description);
        return;
      }
      const updates = json.result;
      for(let update of updates) {
        onReceiveUpdate(update);
      }
      if(updates.length > 0) {
        const identifiers = updates.map((update) => update.update_id);
        parameters.offset = Math.max.apply(Math, identifiers) + 1;
      }
      getUpdates(parameters);
    })
    .catch((exception) => {
      console.error(exception.stack);
    });
}
/**
 * @param {Object} update
 * @see https://core.telegram.org/bots/api#update
 */
function onReceiveUpdate(update) {
  console.log(update);
}

//
getUpdates({limit: 100, timeout: 60 * 2});
```