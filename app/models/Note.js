var Note = function () {};

/**
 * Create a new note.
 *
 * @param {String} body
 * @param {Array.<String>} tags
 * @param {Array.<String>} mentions
 * @returns {Note} instance
 */
Note.create = function create(body, tags, mentions) {
    var instance = new Note();
    instance.body = body;
    instance.tags = (tags && tags.length ? tags : []);
    instance.mentions = (mentions && mentions.length ? mentions : []);
    return instance;
};

module.exports = Note;
