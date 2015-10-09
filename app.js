/*
 * @author Tyler Sedlar
 * @since 10/7/15
 */

var fs = require("fs");
var Datastore = require("nedb");
var Parameters = require("./public/js/Parameters.js");
var DatabaseTool = require("./public/js/DatabaseTool.js");
var Games = require("./public/js/Games.js");
var Players = require("./public/js/Players.js");

var json = JSON.parse(fs.readFileSync("./res/locations.json", "UTF8"));
var locations = json["locations"];

var games = new Datastore({filename: "./data/games-database.db", autoload: true});
var players = new Datastore({filename: "./data/players-database.db", autoload: true});

var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.get("/", function (request, response) {
	response.render("index",
		{title: "Scout", page: "Home"}
	)
});

app.get("/join", function (request, response) {
	response.render("join",
		{title: "Scout", page: "Join a game"}
	)
});

app.post("/join-game", function (request, response) {
	var parameters;
	request.on("data", function (args) {
		parameters = Parameters.fromString(args);
	});
	request.on("end", function () {
		var gameID = parameters["gameID"];
		DatabaseTool.createEntryID(players, {
				"game_id": gameID,
				"name": parameters["playerName"]
			},
			function (playerId) {
				response.redirect("/game?game_id=" + gameID + "&player_id=" + playerId);
			});
	});
});

app.get("/create", function (request, response) {
	response.render("create",
		{title: "Scout", page: "create a game"}
	)
});

app.post("/create-game", function (request, response) {
	var parameters;
	request.on("data", function (args) {
		parameters = Parameters.fromString(args);
	});
	request.on("end", function () {
		DatabaseTool.createEntryID(games, {active: false}, function (id) {
			DatabaseTool.createEntryID(players, {
					"game_id": id,
					"name": parameters["playerName"]
				},
				function (playerId) {
					response.redirect("/game?game_id=" + id + "&player_id=" + playerId);
				});
		});
	});
});

function loadPlayers(gameID, playerID, response, active) {
	players.find({game_id: gameID}, function (err, doc) {
		var playerName;
		var nameArray = [];
		for (var x in doc) {
			var player = doc[x];
			var name = player["name"];
			if (player["id"] === playerID) {
				playerName = name;
			}
			nameArray.push(name);
		}
		if (playerID != -1) {
			response.render("game", {
				title: "Scout", page: "Game - " + gameID, game_id: gameID,
				player_id: playerID, player_name: playerName, player_names: nameArray,
				active: false
			});
		} else {
			response.render("render-game", {
				title: "Scout", page: "Game - " + gameID, game_id: gameID,
				player_names: nameArray, active: active
			});
		}
	});
}

app.get("/game", function (request, response) {
	var gameID = request.query.game_id;
	var playerID = request.query.player_id;
	loadPlayers(gameID, playerID, response, false);
});

app.get("/render-game", function (request, response) {
	var gameID = request.query.game_id;
	games.findOne({id: gameID}, function (err, doc) {
		var active = (doc !== null && doc["active"]);
		loadPlayers(gameID, -1, response, active);
	});
});

app.post("/start-game", function (request, response) {
	var parameters;
	request.on("data", function (args) {
		parameters = Parameters.fromString(args);
		var gameID = parameters["game_id"];
		games.findOne({id: gameID}, function (err, doc) {
			var active = (doc !== null && doc["active"]);
			if (!active) {
				games.update({id: gameID}, {$set: {active: true}}, {}, function () {
					Games.randomize(games, locations, gameID,
						function (location, roles) {
							Players.selectRoles(players, gameID, roles,
								function (id, roles) {
									response.write(JSON.stringify({"success": true}));
									response.end();
								});
						});
				});
			}
		});
	});
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(function (request, response, next) {
	var err = new Error("Not Found");
	err.status = 404;
	next(err);
});

app.use(function (err, request, response, next) {
	var errorMessage = (app.get("env") === "development" ? err : {});
	response.status(err.status || 500);
	response.render("error", {
		message: err.message,
		error: errorMessage
	});
});

app.listen(3000);

module.exports = app;