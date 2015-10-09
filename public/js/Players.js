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
		db.update({id: playerID}, {$set: {role: role}}, {}, function () {
			db.persistence.compactDatafile();
			if (callback) {
				callback(playerID, role);
			}
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
			for (var x in doc) {
				var role = Random.selectArrayElementExcept(roles, assigned);
				assigned.push(role);
				var playerId = doc[x]["id"];
				module.exports.updateRole(db, playerId, role, callback);
			}
		});
	}
};
