const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const Dictionary = require('../bin/words/dictionary');

const expectedDictionarySizes = {
    2:  127,
    3:  1347,
    4:  5638,
    5:  12972,
    6:  23033,
    7:  34342,
    8:  42150,
    9:  42933,
    10: 37235,
    11: 29027,
    12: 21025,
    13: 14345,
    14: 9397,
    15: 5925
};


describe('Dictionary Tests', function () {
    this.timeout(5000);

    it('Can construct dictionary', function () {
        let dict = new Dictionary(3);
        assert.strictEqual(dict.wordLength, 3);
        assert.strictEqual(dict.size, 1347);
    })

    it('Can load dictionaries from constructor', function () {
        for (let wordLen in expectedDictionarySizes) {
            let dict = new Dictionary(wordLen);
            assert.strictEqual(dict.wordLength, wordLen);
            assert.strictEqual(dict.size, expectedDictionarySizes[wordLen]);
        }
    })

    it('Invalid word length dictionary fails to load', function () {
        var fails = false;
        try {
            new Dictionary(1);
        } catch (e) {
            fails = true;
        }
        assert.isTrue(fails);

        fails = false;
        try {
            new Dictionary(16);
        } catch (e) {
            fails = true;
        }
        assert.isTrue(fails);
    })

    it('Dictionary word has linked words', function () {
        let dict = new Dictionary(3);
        let word = dict.get('cat');
        assert.isDefined(word);

        let links = word.links;
        assert.lengthOf(links, 33);
        assert.isTrue(links.indexOf(word) === -1);
    })

    it('Dictionary word is island word', function () {
        let dict = new Dictionary(3);
        let word = dict.get('iwi');
        assert.isDefined(word);
        assert.isTrue(word.isIsland);
        assert.isTrue(word.links.length === 0);
    })

    it('Differences between linked words', function () {
        let dict = new Dictionary(3);
        let word = dict.get('cat');
        assert.isDefined(word);
        assert.isTrue(word.links.length > 0);
        word.links.forEach(linkedWord => {
            assert.strictEqual(word.differences(linkedWord), 1);
        });
    })

    it('Words are inter-linked', function () {
        let dict = new Dictionary(3);
        let word = dict.get('cat');
        assert.isDefined(word);
        assert.isTrue(word.links.length > 0);
        word.links.forEach(linkedWord => {
            assert.isTrue(linkedWord.links.indexOf(word) > -1);
        });
    })
})
