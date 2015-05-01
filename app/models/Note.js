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
 * @param {Date} [createdAt]
 * @returns {Note} instance
 */
Note.create = function create(body, tags, mentions, createdAt) {
    var instance = Object.create(Note.prototype);
    instance.body = body;
    instance.tags = (tags && tags.length ? tags : []);
    instance.mentions = (mentions && mentions.length ? mentions : []);
    instance.createdAt = createdAt || new Date(Date.now());
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

/**
 * Test note against query to see if we have a match.
 *
 * @param { [body]: String, [tags]: Array.<String>, [mentions]: Array.<String> } query
 * @returns {Boolean} match
 */
var matchesQuery = function matchesQuery(query) {
    var self = this;
    var match = true;

    if (query.body) {
        if (self.body.indexOf(query.body) === -1) {
            match = false;
        }
    }

    [ 'tags', 'mentions' ].forEach(function (arrayToCheck) {
        if (query[arrayToCheck] && query[arrayToCheck].length) {
            query[arrayToCheck].forEach(function (itemToCheck) {
                if (self[arrayToCheck].indexOf(itemToCheck) === -1) {
                    match = false;
                }
            });
        }
    });

    return match;
};
Note.prototype.matchesQuery = matchesQuery;

module.exports = Note;
