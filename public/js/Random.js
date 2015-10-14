/*
 * @author Tyler Sedlar
 * @since 10/7/15
 */

var DEFAULT_CHAR_SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

module.exports = {

	/**
	 * Selects a random character from the given character set
	 *
	 * @param charset the character set to select from
	 * @returns {string} a random character from the given character set
	 */
	selectFromCharset: function(charset) {
		return charset.charAt(Math.floor(Math.random() * charset.length));
	},

	/**
	 * Creates a random ID with the given length
	 *
	 * @param length the length of the id to create
	 * @returns {string} a random ID with the given length
	 */
	createID: function (length) {
		return Array.apply(0, new Array(length)).map(function () {
			return module.exports.selectFromCharset(DEFAULT_CHAR_SET);
		}).join("");
	},

	/**
	 * Selects a random element within the given array
	 *
	 * @param array the array to select from
	 * @returns {*} a random element within the given array
	 */
	selectArrayElement: function(array) {
		return array[Math.floor(Math.random() * array.length)];
	},

	/**
	 * Selects a random element within the given array that's not exempt
	 *
	 * @param array the array to select from
	 * @param exempt an array of values not allowed to be selected
	 * @returns {*} a random element within the given array that's not exempt
	 */
	selectArrayElementExcept: function(array, exempt) {
		var element;
		do {
			element = module.exports.selectArrayElement(array);
		} while (exempt.indexOf(element) > -1);
		return element;
	}
};