[![npm](https://img.shields.io/npm/dm/botfather.svg?style=flat-square)](https://www.npmjs.com/package/botfather)
[![npm](https://img.shields.io/badge/dependencies-none-brightgreen.svg?style=flat-square)](https://github.com/aleki/botfather/blob/master/package.json)
[![npm](https://img.shields.io/node/v/botfather.svg?style=flat-square)](https://nodejs.org/en/download/current/)
[![npm](https://img.shields.io/npm/v/botfather.svg?style=flat-square)](https://www.npmjs.com/package/botfather)
[![npm](https://img.shields.io/npm/l/botfather.svg?style=flat-square)](https://github.com/aleki/botfather/blob/master/LICENSE)

# Getting Started with BotFather

## Bots using BotFather

| Name | Description |
| --- | --- |
| [RadioArchiveBot](http://telegram.me/RadioArchiveBot) | Listen your favorite radio stations right in the Telegram! |
| [EPGBot](http://telegram.me/EPGBot) | Electronic program guides (TV guides)

Want to add your bot? Please submit a pull request on [GitHub](https://github.com/aleki/botfather) to update this page!

## Installing BotFather
```bash
$ cd MyBot
$ npm install botfather --save
```


## Using BotFather
```javascript
// We recommend storing the token as environment variable.
const TOKEN = process.env.TOKEN

const BotFather = require('botfather')
const bf = new BotFather(TOKEN)
```

### Example #1 (Getting basic information about the bot)
```javascript
bf.api('getMe')
  .then((json) => {
    if(json.ok) {
      return json.result
    }
    console.error(json.description)
  })
  .then(bot => {
    console.info(`Your bot is @${bot.username}, right? :)`)
  })
  .catch((exception) => {
    console.error(exception.stack)
  })
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
    if(json.ok) {
      return json.result
    }
    console.error(json.description)
  })
  .then((result) => {
    console.info(result)
  })
  .catch((exception) => {
    console.error(exception.stack)
  })
```

### Example #3 (Extending your own class)
```javascript
class MyBot extends BotFather {

  /**
   * @param {string} token
   * @see https://core.telegram.org/bots#6-botfather
   */
  constructor(token) {
    super(token)
    this.api('getMe')
      .then((json) => {
        if(json.ok) {
          return json.result
        }
        console.error(json.description)
      })
      .then(bot => {
        console.info(`Your bot is @${bot.username}, right? :)`)
      })
      .catch((exception) => {
        console.error(exception.stack)
      })
  }
}
new MyBot(TOKEN)
```

### Example #4 (Getting updates recursively)
```javascript
class MyBot extends BotFather {

  /**
   * @constructor
   * @param {string} token
   * @see https://core.telegram.org/bots#6-botfather
   */
  constructor(token) {
    super(token)
    this.getUpdates()
  }

  /**
   * @param {Object} parameters
   * @see https://core.telegram.org/bots/api#getupdates
   */
  getUpdates(parameters = {limit: 100, timeout: 60 * 2}) {
    this.api('getUpdates', parameters)
      .then((json) => {
        if(json.ok) {
          return json.result
        }
        console.error(json.description)
        setTimeout(() => this.getUpdates(parameters), 5000)
      })
      .then(updates => {
        for(let update of updates) {
          this.onReceiveUpdate(update)
        }
        // offset = update_id of last processed update + 1
        if(updates.length > 0) {
          const identifiers = updates.map((update) => update.update_id)
          parameters.offset = Math.max.apply(Math, identifiers) + 1
        }
        this.getUpdates(parameters)
      })
      .catch((exception) => {
        console.error(exception.stack)
        setTimeout(() => this.getUpdates(parameters), 5000)
      })
  }

  /**
   * @param {Object} update
   * @see https://core.telegram.org/bots/api#update
   */
   onReceiveUpdate(update) {
     console.log(update)
   }
}

new MyBot(TOKEN)
```
