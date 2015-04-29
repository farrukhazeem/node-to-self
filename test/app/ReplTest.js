var assert = require('assert');
var Repl = require('../../app/Repl');

describe('Repl.parseNoteString', function () {
    it('should parse out tags, mentions, and body text', function () {
        var input = '#tag1 @first-mention one two three #tag2 @second-mention';
        var parsedInput = Repl.parseNoteString(input);
        assert.deepEqual(parsedInput, {
            tags: [ '#tag1', '#tag2' ],
            mentions: [ '@first-mention', '@second-mention' ],
            body: 'one two three'
        });
    });
});
