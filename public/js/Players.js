/*
 * @author Tyler Sedlar
 * @since 10/8/15
 */

var Random = require("./Random.js");

module.exports = {

	/**
	 * Updates the role of the given player
	 *
	 * @param db the database to use
	 * @param playerID the id of the player
	 * @param role the new role
	 * @param callback a callback upon updating the player's role
	 */
	updateRole: function (db, playerID, role, callback) {
		db.update({id: playerID}, {$set: {role: role}}, {}, function() {
			callback();
		});
	},

	/**
	 * Randomizes every player's role in the given game
	 *
	 * @param db the database to use
	 * @param gameID the id of the game
	 * @param roles the list of roles
	 * @param callback a callback upon randomizing every player's role
	 */
	selectRoles: function (db, gameID, roles, callback) {
		db.find({game_id: gameID}, function (err, doc) {
			var assigned = [];
			var total = doc.length;
			var scoutIndex = Math.floor(Math.random() * total);
			var completed = 0;
			for (var i = 0; i < doc.length; i++) {
				var role;
				if (i == scoutIndex) {
					role = "Scout";
				} else {
					role = Random.selectArrayElementExcept(roles, assigned);
					assigned.push(role);
				}
				var playerId = doc[i]["id"];
				module.exports.updateRole(db, playerId, role, function() {
					completed++;
					if (completed >= total) {
						db.persistence.compactDatafile();
						callback();
					}
				});
			}
		});
	}
};
