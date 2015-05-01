var fs = require('fs');
var log = console.log.bind(null);
var path = require('path');
var prompt = require('prompt');

var Note = require('./models/Note');

var Repl = {};

prompt.message = '';
prompt.delimiter = '';

Repl.notesArray = [];

Repl.loadNotesFromFile = function loadNotesFromFile(filename) {
    fs.readFile(
        path.join(__dirname, '..', filename),
        { encoding: 'utf8' },
        function (err, contents) {
            if (err) {
                throw err;
            }

            contents
                .split('\n')
                .filter(function (string) { return string; }) // filter out any blank lines
                .forEach(function (jsonNote) {
                    var parsedNote = JSON.parse(jsonNote);
                    Repl.notesArray.push(
                        Note.create(
                            parsedNote.body,
                            parsedNote.tags,
                            parsedNote.mentions,
                            parsedNote.createdAt
                        )
                    );
                });
        }
    );
};

Repl.getCommand = function getCommand() {
    prompt.get([{
        name: 'command',
        description: 'n: new note, l: list notes, s: search notes'.green,
        pattern: /[nsl]/
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
        case 'l':
            Repl.listNotes();
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
        note.save(function afterSave() {
            Repl.notesArray.push(note);
            Repl.getCommand();
        });
    });
};

Repl.listNotes = function () {
    Repl.notesArray
        .forEach(function (note) {
            log(JSON.stringify(note));
        });
    Repl.getCommand();
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
    Repl.loadNotesFromFile('data');
    Repl.getCommand();
}
