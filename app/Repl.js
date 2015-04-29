var prompt = require('prompt');
var log = console.log.bind(null);
var moment = require('moment');

var Note = require('./models/Note');

var Repl = {};

prompt.message = '';
prompt.delimiter = '';

Repl.getCommand = function getCommand() {
    prompt.get([{
        name: 'command',
        description: 'n: new note, s: search notes'.green,
        pattern: /[ns]/
    }], function (err, result) {
        if (err) {
            throw err;
        }
        Repl.dispatchCommand(result.command);
    });
};

Repl.dispatchCommand = function dispatchCommand(command) {
    switch (command) {
        case 'n':
            Repl.getNote();
            break;
        case 's':
            log('searching...');
            break;
    }
};

Repl.getNote = function getNote() {
    prompt.get([{
        name: 'note',
        description: 'New note:'.green
    }], function (err, result) {
        if (err) {
            throw err;
        }
        var parsedInput = Repl.parseNoteString(result.note);
        var note = Note.create(parsedInput.body, parsedInput.tags, parsedInput.mentions);
        note.save();
    });
};

Repl.parseNoteString = function () {
    var tagRe = /#[\w-_]+/g;
    var mentionRe = /@[\w-_]+/g;

    return function parseNoteString(input) {
        var tags = input.match(tagRe);
        input = input.replace(tagRe, '');

        var mentions = input.match(mentionRe);
        input = input.replace(mentionRe, '');

        input = input.trim();
        return { body: input, tags: tags, mentions: mentions };
    };
}();

module.exports = Repl;

if (require.main === module)  {
    Repl.getCommand();
}
