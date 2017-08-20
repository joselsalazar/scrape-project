// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongojs = require("mongojs");

// Initialize Express Server
var app = express();

// Configure our app for morgan and body parser
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Static file support with public folder
app.use(express.static("public"));

// Mongojs configuration
var databaseUrl = "scrapedArticles";
var collections = ["articles"];

// Hook our mongojs config to the db var
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Routes

// Post a book to the mongoose database
app.post("/submit", function(req, res) {

  // Save the request body as an object called book
  var article = req.body;

  // Save the book object as an entry into the books collection in mongo
  db.articles.save(article, function(error, saved) {
    // Show any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the response to the client (for AJAX success function)
    else {
      res.send(saved);
    }
  });
});

app.get("/all", function(req, res) {
	db.articles.find({}, function(error, found) {
		if (error) {
			console.log(error);
		}
		else {
			res.json(found);
		}
	});
});

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});