/*
 * @author Tyler Sedlar
 * @since 10/8/15
 */

module.exports = {

	/**
	 * Cleans up a post argument string ("A+Space" -> "A Space")
	 *
	 * @param string the string to clean
	 * @returns {String|Ident|string|void|*|XML} a cleaned up post argument string
	 */
	cleanString: function(string) {
		return string.replace("+", " ");
	},

	/**
	 * Creates a map from a given post argument string
	 *
	 * @param string the post argument string
	 * @returns {Array} a map of the given post arguments
	 */
	fromString: function(string) {
		string = decodeURIComponent(string);
		var args = string.split("&");
		var parameters = [];
		for (var i = 0; i < args.length; i++) {
			var arg = args[i];
			var splitIndex = arg.indexOf("=");
			var key = module.exports.cleanString(arg.substring(0, splitIndex));
			var val = module.exports.cleanString(arg.substring(splitIndex + 1));
			parameters[key] = val;
		}
		return parameters;
	}
};