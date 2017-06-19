var twit = require('twit');

var keys = require('./permissions.js');

var T = new twit(keys);

tweetIt("Hello World!");

function tweetIt(txt){
	var tweet = {
		status: txt
	}

	T.post('statuses/update',tweet,tweeted);

	function tweeted(err, data, response) {
		if(err){
			console.log("This went wrong! "+err);
		}else{
			console.log("It worked!");
		}
	}
}
