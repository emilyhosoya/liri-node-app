const appKeys = require("./keys.js");

const Twitter = require("twitter");
const spotify = require("node-spotify-api");
const request = require("request");

const currentCommand = process.argv[2];
const optionalArgument = process.argv[3];

const liriBot = {
  "my-tweets": () => {
    // show your last 20 tweets and when they were created at in your terminal/bash window
    const client = new Twitter(appKeys);

    const params = {
      screen_name: "catfishcowgirl9",
      count: 20
    };
    client.get("statuses/user_timeline", params, function(
      error,
      tweets,
      response
    ) {
      if (!error) {
        tweets.forEach(function(tweet) {
          console.log(`
          ------------------------------\n
          ${tweet.text}\n
          ${tweet.created_at}
          `);
        });
      }
    });
    console.log("Twitter is working... just wait!");
  },
  "spotify-this-song": songTitle => {
    // do stuff
    console.log(`Your song: '${process.argv[3]}'`);
  },
  "movie-this": movieName => {
    console.log(`Your move: '${process.argv[3]}'`);
  },
  "do-what-it-says": () => {
    console.log("What do you want me to do?");
  }
};

liriBot[currentCommand](optionalArgument);
