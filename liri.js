const keychain = require("./keys.js");

const Twitter = require("twitter");
const Spotify = require("node-spotify-api");
const request = require("request");
const fs = require("fs");

let currentCommand = process.argv[2];
let optionalArgument = process.argv[3];

const logOutput = function(output) {
  fs.appendFile("log.txt", output, "utf8", function(error) {
    if (error) {
      return console.log(error);
    }
    console.log("log.txt was updated!");
  });
};

const liriBot = {
  // -----------------------------------------
  // ---------- TWITTER QUERY ----------------
  // -----------------------------------------
  // This will show your last 20 tweets and when they were created at in your terminal/bash window
  "my-tweets": () => {
    const client = new Twitter(keychain.twitterKeys);
    const params = {
      screen_name: "catfishcowgirl9",
      count: 20
    };
    let results = [];

    client.get("statuses/user_timeline", params, function(
      error,
      tweets,
      response
    ) {
      if (error) {
        return console.log("Error occurred: " + error);
      } else {
        tweets.forEach(function(tweet) {
          let output = `
          ------------------------------\n
          ${tweet.text}\n
          ${tweet.created_at}
          `;
          console.log(output);
          results.push(output);
        });
      }
      logOutput(results);
    });

    console.log("Twitter is working... just wait!");
  },
  // -----------------------------------------
  // ----------- SPOTIFY QUERY ---------------
  // -----------------------------------------
  // This will show the following information about the song in your terminal/bash window
  // * Artist(s)
  // * The song's name
  // * A preview link of the song from Spotify
  // * The album that the song is from
  // If no song is provided then your program will default to "The Sign" by Ace of Base.
  "spotify-this-song": songTitle => {
    const spotify = new Spotify(keychain.spotifyKeys);
    let results = [];

    // Default song if none is provided
    if (songTitle === undefined) {
      songTitle = "The Sign%20artist:Ace+of+Base";
    }

    spotify.search(
      { type: "track", query: songTitle, offset: 0, limit: 1 },
      function(error, data) {
        if (error) {
          return console.log("Error occurred: " + error);
        } else {
          const searchResults = data.tracks.items;
          // I'm using a loop just in case limit param is increased
          searchResults.forEach(function(song) {
            // For songs with multiple artists, add artist names to an array
            const artistFullData = song.artists;
            let artistNamesList = [];
            artistFullData.forEach(function(artist) {
              let artistName = artist.name;
              artistNamesList.push(artistName);
            });

            let output = `
            ------------------------------\n
            Artist: ${artistNamesList.join(", ")}\n
            Song: ${song.name}\n
            Song Preview: ${song.preview_url}\n
            Album: ${song.album.name}\n
            `;
            console.log(output);
            results.push(output);
          });
        }
        logOutput(results);
      }
    );

    console.log("Spotify is working... just wait!");
  },
  // -----------------------------------------
  // -------------- OMDB QUERY ---------------
  // -----------------------------------------
  // This will output the following information to your terminal/bash window:
  // * Title of the movie.
  // * Year the movie came out.
  // * IMDB Rating of the movie.
  // * Rotten Tomatoes Rating of the movie.
  // * Country where the movie was produced.
  // * Language of the movie.
  // * Plot of the movie.
  // * Actors in the movie.
  // If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'

  "movie-this": movieName => {
    // Default movie if none is provided
    if (movieName === undefined) {
      movieName = "Mr. Nobody";
    }

    const queryUrl =
      "http://www.omdbapi.com/?t=" +
      movieName +
      "&y=&plot=short&apikey=trilogy";
    console.log(queryUrl);

    let results = [];

    request(queryUrl, function(error, response, body) {
      if (error) {
        return console.log("Error occurred: " + error);
      } else {
        let output = `
        ------------------------------\n
        Title: ${JSON.parse(body).Title}\n
        Release Year: ${JSON.parse(body).Year}\n
        IMDB Rating: ${
          JSON.parse(body).Ratings.find(
            source => source.Source === "Internet Movie Database"
          ).Value
        }\n
        Rotten Tomatoes Rating: ${
          JSON.parse(body).Ratings.find(
            source => source.Source === "Rotten Tomatoes"
          ).Value
        }\n
        Country Produced: ${JSON.parse(body).Country}\n
        Language: ${JSON.parse(body).Language}\n
        Plot: ${JSON.parse(body).Plot}\n
        Actors: ${JSON.parse(body).Actors}\n
        `;
        console.log(output);
        results.push(output);
        logOutput(results);
      }
    });

    console.log("Movie request is working... just wait!");
  },
  // -----------------------------------------
  // -------------- FS COMMAND ---------------
  // -----------------------------------------
  // Take the text inside of random.txt and then use it to call one of LIRI's commands
  "do-what-it-says": () => {
    console.log("Running random.txt...");
    fs.readFile("random.txt", "utf8", function(error, data) {
      if (error) {
        return console.log(error);
      } else {
        const splitData = data.split(",");
        currentCommand = splitData[0];
        optionalArgument = splitData[1];

        liriBot[currentCommand](optionalArgument);
      }
    });
  }
};

liriBot[currentCommand](optionalArgument);
