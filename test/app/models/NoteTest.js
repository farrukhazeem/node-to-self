var assert = require('assert');
var Note = require('../../../app/models/Note');

describe('Note.prototype.matchesQuery', function () {
    var note;
    beforeEach(function () {
        note = Note.create('some body text', [ '#tag1', '#tag2' ], [ '@mention1', '@mention2' ]);
    });

    describe('matching queries', function () {

        var tests = [
            { query: { body: 'body' } },
            { query: { body: 'some body text' } },
            { query: { tags: [ '#tag1' ] } },
            { query: { tags: [ '#tag1', '#tag2' ] } },
            { query: { mentions: [ '@mention1' ] } },
            { query: { mentions: [ '@mention1', '@mention2' ] } },
            { query: { body: 'ome body tex', tags: [ '#tag1' ], mentions: [ '@mention2' ]  } },
            { query: { body: 'some body text', tags: [ '#tag1', '#tag2' ], mentions: [ '@mention1', '@mention2' ] } }
        ];

        tests.forEach(function (test) {
            it('should match', function () {
                assert.ok(note.matchesQuery(test.query));
            });
        });
    });

    describe('non-matching queries', function () {

        var tests = [
            { query: { body: 'bodo' } },
            { query: { body: 'some body textalot' } },
            { query: { tags: [ '#tag3' ] } },
            { query: { tags: [ '#tag1', '#tag3' ] } },
            { query: { mentions: [ '@mention3' ] } },
            { query: { mentions: [ '@mention1', '@mention3' ] } },
            { query: { body: 'ssssssome body text', tags: [ '#tag1', '#tag2', '#tag3' ], mentions: [ '@mention1', '@mention2', '@mention3' ]  } },
        ];

        tests.forEach(function (test) {
            it('should not match', function () {
                assert.ok(!note.matchesQuery(test.query));
            });
        });
    });
});
