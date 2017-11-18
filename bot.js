const twitter = require('twitter');
const config = require('./auth.js');
const events = require('events');

const connect = new twitter(config);
const eventEmitter = new events.EventEmitter();
const keywords = { track: '@combatgent' };
const stream = connect.stream('statuses/filter', keywords);

function reply(data) {
  const tweetId = data.data.id_str;
  const screenName = data.data.user.screen_name;
  if (screenName === 'vishaalmelwani') { return; }
  const thePost = `@${screenName} FYI: Combat Gent may be out of business. See here: http://bit.ly/combotgent`;
  connect.post('statuses/update', {
    status: thePost,
    in_reply_to_status_id: tweetId,
  }, (err, tweet) => {
    if (err) {
      console.log('error', err);
    } else {
      console.log('tweeted', tweet);
    }
  });
}

eventEmitter.on('replyTo', reply);

stream.on('data', (data) => {
  eventEmitter.emit('replyTo', { data });
});
stream.on('error', (err) => {
  console.log(err);
});
