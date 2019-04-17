require("dotenv").config();

//global variables

var axios = require("axios")
var inquirer = require('inquirer')
var fs = require("fs");
//var keys = require("./.env")
var Spotify = require('node-spotify-api');
var keys = require("./keys");

var spotify = new Spotify(keys.spotify);



//Get user function selection & input
inquirer
    .prompt([
        {
            type: 'list',
            message: 'What would you like to search for?',
            choices: ['Upcoming Concerts', 'A Song on Spotify', 'Movie Information'],
            name: 'search',
        },
        {
            type: 'input',
            message: 'Search:',
            name: 'userSearch'
        }
    ]).then(function (resp) {
        console.log(resp)
        if (resp) {
            switch (resp.search) {
                case 'Upcoming Concerts':
                    showConcert(resp.userSearch)
                    break;
                case 'A Song on Spotify':
                    showSong(resp.userSearch)
                    break;
                case 'Movie Information':
                    showMovie(resp.userSearch)
                    break;
                default:
                    console.log("Please Input something that will yield a result");
            }
        }
    });



//Get Spotify Info
function showSong(userSearch) {
    if (userSearch === undefined) {
        userSearch = "I Want It That Way";
    }
    spotify.search({
        type: "track",
        query: userSearch
    },
        function (err, data) {
            if (err) {
                console.log("Error: " + err);
                return;
            }
            var songs = data.tracks.items;

            for (var i = 0; i < songs.length; i++) {
                console.log("******SONG INFO******\n");
                fs.appendFileSync("log.txt", "******SONG INFO******\n");
                console.log(i);
                fs.appendFileSync("log.txt", i + "\n");
                console.log("Song Name: " + songs[i].name);
                fs.appendFileSync("log.txt", "song name: " + songs[i].name + "\n");
                console.log("Preview Song: " + songs[i].preview_url);
                fs.appendFileSync("log.txt", "preview song: " + songs[i].preview_url + "\n");
                console.log("Album: " + songs[i].album.name);
                fs.appendFileSync("log.txt", "album: " + songs[i].album.name + "\n");
                console.log("Artist: " + songs[i].artists[0].name);
                fs.appendFileSync("log text", "artist: " + songs[i].artists[0].name + "\n");
            }
        }
    )
}

//Axios call to get movie information from IMDB
function showMovie(userSearch) {

    if (userSearch === "") {
        userSearch = "Mr. Nobody"
        console.log("If you haven't watched 'Mr. Nobody,' then you should: <http://www.imdb.com/title/tt0485947")
        console.log("It's on Netflix!")
    }
    var queryUrl = 'http://www.omdbapi.com/?t=' + userSearch + '&y=&plot=short&apikey=trilogy';
    axios.get(queryUrl).then(
        function (response) {

            if (response.status === 200) {
                var movies = response.data

                console.log("**********MOVIE INFO*********");
                fs.appendFileSync("log.txt", "**********MOVIE INFO*********\n");
                console.log("Title: " + movies.Title);
                fs.appendFileSync("log.txt", "Title: " + movies.Title + "\n");
                console.log("Release Year: " + movies.Year);
                fs.appendFileSync("log.txt", "Release Year: " + movies.Year + "\n");
                console.log("IMDB Rating: " + movies.imdbRating);
                fs.appendFileSync("log.txt", "IMDB Rating: " + movies.imdbRating + "\n");
                // console.log("Rotten Tomatoes Rating: " + getRottenTomatoesRatingValue(movies));
                // fs.appendFileSync("log.txt", "Rotten Tomatoes Rating: " + getRottenTomatoesRatingValue(movies) + "\n");
                console.log("Country of Production: " + movies.Country);
                fs.appendFileSync("log.txt", "Country of Production: " + movies.Country + "\n");
                console.log("Language: " + movies.Language);
                fs.appendFileSync("log.txt", "Language: " + movies.Language + "\n");
                console.log("Plot: " + movies.Plot);
                fs.appendFileSync("log.txt", "Plot: " + movies.Plot + "\n");
                console.log("Actors: " + movies.Actors);
                fs.appendFileSync("log.txt", "Actors: " + movies.Actors + "\n");
                console.log("*****************************");
                fs.appendFileSync("log.txt", "*****************************\n");
            } else {
                console.log("There is an error")

            }
            //Axios call to get information on concerts from Bands in Town
        });

}
function showConcert(userSearch) {


    var queryUrl = 'https://rest.bandsintown.com/artists/' + userSearch + '/events?app_id=codingbootcamp'
    axios.get(queryUrl).then(
        function (response, error) {
            // console.log(response.data[0])

            // If the request is successful
            if (response.status === 200) {
                var concerts = response.data;
                for (var i = 0; i < concerts.length; i++) {
                    console.log("**********EVENT INFO*********");
                    fs.appendFileSync("log.txt", "**********EVENT INFO*********\n");
                    console.log(i);
                    fs.appendFileSync("log.txt", i + "\n");
                    console.log("Name of the Venue: " + concerts[i].venue.name);
                    fs.appendFileSync("log.txt", "Name of the Venue: " + concerts[i].venue.name + "\n");
                    console.log("Venue Location: " + concerts[i].venue.city);
                    fs.appendFileSync("log.txt", "Venue Location: " + concerts[i].venue.city + "\n");
                    console.log("Date of the Event: " + concerts[i].datetime);
                    fs.appendFileSync("log.txt", "Date of the Event: " + concerts[i].datetime + "\n");
                    console.log("*****************************");
                    fs.appendFileSync("log.txt", "*****************************" + "\n");
                }
            } else {
                console.log('Error occurred.');
            }
        });
}

