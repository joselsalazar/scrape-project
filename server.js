// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongojs = require("mongojs");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");

var PORT = process.env.PORT || 3000;

// Requiring Variables in Folders
var Article = require("./models/Article.js");

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Initialize Express Server
var app = express();

// Configure our app for morgan and body parser
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Static file support with public folder
app.use(express.static("public"));

// Database configuration with mongoose
// Local Host
// mongoose.connect("mongodb://localhost/scrapedArticles", {
//   useMongoClient: true
// });

// Remote Host
mongoose.connect("mongodb://heroku_8d7nmsbz:6ppg5hgcjgfs9gc45p6gdnfr0d@ds161483.mlab.com:61483/heroku_8d7nmsbz");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Routes

// Post a book to the mongoose database
app.post("/submit", function(req, res) {

  // Save the request body as an object called book
  var entry = new Article(req.body);

  // Save the book object as an entry into the books collection in mongo
  entry.save(function(error, doc) {
    // Show any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the response to the client (for AJAX success function)
    else {
      res.send(doc);
    }
  });
});

// A GET request to scrape the echojs website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  request("http://www.ign.com/", function(error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Now, we grab every h2 within an article tag, and do the following:
    $("div.listElmnt div.listElmnt-blogItem").each(function(i, element) {

      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children("a.listElmnt-storyHeadline").text();
      var fullText = $(this).children("p").text();
      var links = $(this).children("p").children("a").text();
      var spans = $(this).children("p").children("span").text();
      var finalText = fullText.replace(links, "").replace(spans, "");
      result.desc = finalText;
      result.link = $(this).children("a").attr("href");

      // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      var entry = new Article(result);

      // Now, save that entry to the db
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
        }
      });

    });
  });
  // Tell the browser that we finished scraping the text
  res.send("Scrape Complete");
  console.log("Scrape Complete!");
});

app.get("/all", function(req, res) {
	Article.find({}, function(error, found) {
		if (error) {
			console.log(error);
		}
		else {
			res.json(found);
		}
	});
});

app.delete("/all/:id", function(req, res) {
  Article.remove({ "_id": req.params.id })
  .exec(function(error, found) {
    if (error) {
      console.log(error);
    } else {
      res.json(found);
    }
  });
})

// Listen on port 3000
app.listen(PORT, function() {
  console.log("App running on port 3000!");
});
