/*
 * @author Tyler Sedlar
 * @since 10/8/15
 */

var Random = require('./Random.js');

var _ = require('lodash');

module.exports = {
  /**
   * Creates a database entry with an unused 'id'
   *
   * @param db the database to use
   * @param fields the fields to add to the entry
   * @param callback a callback upon creation
   */
  createEntryID: function(db, fields, callback) {
    var id = Random.createID(6);
    db.findOne({ id: id }, function(err, doc) {
      if (doc != null) {
        module.exports.createEntryID(db);
      } else {
        var inserted = { id: id };
        if (fields) {
          inserted = _.assign(inserted, fields);
        }
        db.insert(inserted, function() {
          if (callback) {
            callback(id);
          }
        });
      }
    });
  }
};
