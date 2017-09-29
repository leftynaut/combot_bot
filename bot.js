var twitter = require('twitter')
var config = require('./auth.js')
var events = require('events')

var connect = new twitter(config)
var eventEmitter = new events.EventEmitter()
var keywords = {track: '#testing'}
var stream = connect.stream('statuses/filter', keywords)

var reply = function (data) {
  var tweetId = data.data.id_str
  var screenName = data.data.user.screen_name
  var thePost = '@' + screenName + ' FYI: Combat Gent may be out of business. See here: http://bit.ly/combotgent'
  connect.post('statuses/update', {
    status: thePost,
    in_reply_to_status_id: tweetId
  }, function (err, tweet, response) {
    if (err) {
      console.log('error', err)
    } else {
      console.log('tweeted', tweet)
    }
  })
}

eventEmitter.on('replyTo', reply)

stream.on('data', function (data) {
  eventEmitter.emit('replyTo', {data: data})
})
stream.on('error', function (err) {
  console.log(err)
})
