var twit = require('twit');
var request = require('request');

var keys = require('./permissions.js');

var T = new twit(keys);

const TWITTER_SCREEN_NAME = "CernCompliments";

var streamUser = T.stream('user');

streamUser.on('tweet',mentionMe);

streamUser.on('direct_message', directMessage);

function directMessage(eventMsg){

	var replyto = eventMsg.direct_message.sender.id_str;
	var text = eventMsg.text;
	var from = eventMsg.direct_message.sender.screen_name;

	if(from != TWITTER_SCREEN_NAME){
		var url = 'https://spreadsheets.google.com/feeds/list/1eEa2ra2yHBXVZ_ctH4J15tFSGEu-VTSunsrvaCAV598/od6/public/values?alt=json'
		request(url, function (error, response, body) {
			var compliments = JSON.parse(body).feed.entry;
			var number = Math.floor(Math.random() * (compliments.length));
			var reply = {
					"event": {
					"type": "message_create",
					"message_create": {
						"target": {
							"recipient_id":replyto
						},
						"message_data": {
							"text": compliments[number].title.$t,
						}
					}
				}
			}

			T.post('direct_messages/events/new',reply,postTweet);
		});
	}
}

function mentionMe(eventMsg){

	var replyto = eventMsg.in_reply_to_screen_name;
	var text = [eventMsg.text];
	var from = eventMsg.user.screen_name;

	if(replyto === TWITTER_SCREEN_NAME){
		console.log("They are talking to me!");
	}
}

function tweetIt(txt, statusID){
	var tweet = {
		status: txt,
		in_reply_to_status_id: statusID
	}

	T.post('statuses/update',tweet,postTweet);
}

function postTweet(err,data,response){
	if(err){
		console.log("This went wrong! "+err);
	}else{
		console.log("It Worked!");
	}
}
