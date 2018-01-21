const keychain = require("./keys.js");

const Twitter = require("twitter");
const Spotify = require("node-spotify-api");
const request = require("request");
const fs = require("fs");

let currentCommand = process.argv[2];
let optionalArgument = process.argv[3];

// const writeOutput = function(input) {
//   fs.writeFile("log.txt", input, function(error) {
//     if (error) {
//       return console.log(error);
//     }
//     console.log("log.txt was updated!");
//   });
// };

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
    client.get("statuses/user_timeline", params, function(
      error,
      tweets,
      response
    ) {
      if (error) {
        return console.log("Error occurred: " + error);
      } else {
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
    // Default song if none is provided
    if (songTitle === undefined) {
      songTitle = "The Sign%20artist:Ace+of+Base";
    }

    const spotify = new Spotify(keychain.spotifyKeys);

    spotify.search(
      { type: "track", query: songTitle, offset: 0, limit: 1 },
      function(error, data) {
        if (error) {
          return console.log("Error occurred: " + error);
        } else {
          const results = data.tracks.items;
          results.forEach(function(song) {
            // For songs with multiple artists, add artist names to an array
            const artistFullData = song.artists;
            let artistNamesList = [];
            artistFullData.forEach(function(artist) {
              let artistName = artist.name;
              artistNamesList.push(artistName);
            });

            console.log(`
            ------------------------------\n
            Artist: ${artistNamesList.join(", ")}\n
            Song: ${song.name}\n
            Song Preview: ${song.preview_url}\n
            Album: ${song.album.name}\n
            `);
          });
        }
      }
    );

    console.log("Spotify is working... just wait!");
    // console.log(`Your song: '${process.argv[3]}'`);
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

    request(queryUrl, function(error, response, body) {
      if (error) {
        return console.log("Error occurred: " + error);
      } else {
        console.log(`
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
        `);
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
