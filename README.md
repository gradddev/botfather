[![npm](https://img.shields.io/npm/dm/botfather.svg?style=flat-square)](https://www.npmjs.com/package/botfather)
[![npm](https://img.shields.io/badge/dependencies-none-brightgreen.svg?style=flat-square)](https://github.com/aleki/botfather/blob/master/package.json)
[![npm](https://img.shields.io/node/v/botfather.svg?style=flat-square)](https://nodejs.org/en/download/current/)
[![npm](https://img.shields.io/npm/v/botfather.svg?style=flat-square)](https://www.npmjs.com/package/botfather)
[![npm](https://img.shields.io/npm/l/botfather.svg?style=flat-square)](https://github.com/aleki/botfather/blob/master/LICENSE)

# Getting Started with BotFather
## Installing BotFather
```
$ npm install botfather
```
## Testing BotFather
```
$ cd node_modules/botfather
$ TOKEN=... npm test
```
## Using BotFather
```javascript
const BotFather = require('botfather');
// We recommend storing the token as environment variable.
const token = process.env.TOKEN;
const bf = new BotFather(token);
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
  .catch((reason) => {
    console.error(reason);
  })
```

### Example #2 (Getting updates recursively)
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
    .catch((reason) => {
      console.error(reason);
    })
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
