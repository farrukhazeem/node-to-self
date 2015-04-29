var prompt = require('prompt');
var log = console.log.bind(null);

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
            log('new note being made RIGHT NOW');
            break;
        case 's':
            log('searching...');
            break;
    }
    Repl.getCommand();
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
        Repl.dispatchCommand(result.command);
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
        return { tags: tags, mentions: mentions, body: input };
    };
}();

module.exports = Repl;

if (require.main === module)  {
    Repl.getCommand();
}
