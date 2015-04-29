var fs = require('fs');
var path = require('path');
var log = console.log.bind(null);
var moment = require('moment');

var Note = function () {};

/**
 * Create a new note.
 *
 * @param {String} body
 * @param {Array.<String>} [tags]
 * @param {Array.<String>} [mentions]
 * @returns {Note} instance
 */
Note.create = function create(body, tags, mentions) {
    var instance = Object.create(Note.prototype);
    instance.body = body;
    instance.createdAt = new Date(Date.now());
    instance.tags = (tags && tags.length ? tags : []);
    instance.mentions = (mentions && mentions.length ? mentions : []);
    return instance;
};

var save = function save() {
    var createdAt = moment(this.createdAt);
    var filename = createdAt.format('YYYYMMDD[T]HHmmSS');
    fs.writeFile(
        path.join(__dirname, '..', '..', 'data', filename),
        JSON.stringify(this),
        function (err) {
            if (err) {
                throw err;
            }
            log('Saved ', filename);
        }
    );
};
Note.prototype.save = save;

module.exports = Note;
