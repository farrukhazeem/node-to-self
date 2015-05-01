var fs = require('fs');
var path = require('path');
var log = console.log.bind(null);

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

var save = function save(cb) {
    fs.appendFile(
        path.join(__dirname, '..', '..', 'data'),
        JSON.stringify(this) + '\n',
        function (err) {
            if (err) {
                throw err;
            }
            log('Saved');
            cb();
        }
    );
};
Note.prototype.save = save;

module.exports = Note;
