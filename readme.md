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
const TOKEN = 'token';

const BotFather = require('botfather');
const bf = new BotFather(TOKEN);

bf.api('getMe')
  .then((json) => {
    if(json.ok) {
      const bot = json.result;
      console.info(`Your bot is @${bot.username}? ;)`);
    } else {
      console.error(json.description);
    }
  })
  .catch((reason) => {
    console.error(reason);
  });
```
## Example for getting updates recursively
```javascript
/**
  * @param {Object} parameters
  * @see https://core.telegram.org/bots/api#getupdates
  */
function getUpdates(parameters) {
  const timeout = parameters.timeout || 2;
  bf.api('getUpdates', parameters, timeout)
    .then((json) => {
      if(json.ok) {
        const updates = json.result;
        // ...
        if(updates.length > 0) {
          const identifiers = updates.map((update) => update.update_id);
          parameters.offset = Math.max.apply(Math, identifiers) + 1;
        }
        getUpdates(parameters);
      } else {
        console.error(json.description);
      }
    })
    .catch((reason) => {
      console.error(reason);
    })
}

getUpdates({limit: 100, timeout: 8});
```