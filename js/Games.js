/*
 * @author Tyler Sedlar
 * @since 10/8/15
 */

module.exports = {

	/**
	 * Randomizes the given game with a random location.
	 *
	 * @param db the database to use
	 * @param locations the supported game locations
	 * @param gameID the id of the game
	 * @param callback a callback upon randomizing the game
	 */
	randomize: function (db, locations, gameID, callback) {
		var keys = Object.keys(locations);
		var location = keys[Math.floor(Math.random() * keys.length)];
		var roles = locations[location]["roles"];
		db.update({id: gameID}, {$set: {location: location, roles: roles}}, {},
			function () {
				db.persistence.compactDatafile();
				if (callback) {
					callback(gameID, location, roles);
				}
			});
	}
};