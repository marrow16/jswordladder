const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const Dictionary = require('../bin/words/dictionary');
const WordDistanceMap = require('../bin/solving/wordDistanceMap');

describe('WordDistanceMap', function () {
    it('Island word has limited map', function () {
        let dict = new Dictionary(3);
        let word = dict.get('iwi');
        assert.isDefined(word);

        let wordDistanceMap = new WordDistanceMap(word);
        assert.strictEqual(wordDistanceMap.length, 1);
        assert.strictEqual(wordDistanceMap.distance(word), 1);
        assert.isUndefined(wordDistanceMap.distance(dict.get('cat')));
    })

    it('Cat map', function () {
        let dict = new Dictionary(3);
        let word = dict.get('cat');
        assert.isDefined(word);

        let wordDistanceMap = new WordDistanceMap(word);
        assert.strictEqual(wordDistanceMap.length, 1346);
        assert.strictEqual(wordDistanceMap.distance(word), 1);

        let endWord = dict.get('dog');
        assert.isTrue(wordDistanceMap.contains(endWord));
        assert.strictEqual(wordDistanceMap.distance(endWord), 4);
        assert.isTrue(wordDistanceMap.reachable(endWord, 5));
        assert.isTrue(wordDistanceMap.reachable(endWord, 4));
        assert.isFalse(wordDistanceMap.reachable(endWord, 3));
        assert.isFalse(wordDistanceMap.reachable(endWord, 2));
        assert.isFalse(wordDistanceMap.reachable(endWord, 1));
        assert.isFalse(wordDistanceMap.reachable(endWord, 0));
    })

    it('Cat map limited', function () {
        let dict = new Dictionary(3);
        let word = dict.get('cat');
        assert.isDefined(word);

        let wordDistanceMap = new WordDistanceMap(word, 4);
        assert.strictEqual(wordDistanceMap.length, 1086);

        let endWord = dict.get('dog');
        assert.isTrue(wordDistanceMap.contains(endWord));
        assert.isTrue(wordDistanceMap.reachable(endWord, 5));
        assert.isTrue(wordDistanceMap.reachable(endWord, 4));
        assert.isFalse(wordDistanceMap.reachable(endWord, 3));
        assert.isFalse(wordDistanceMap.reachable(endWord, 2));

        // limit further...
        wordDistanceMap = new WordDistanceMap(word, 3);
        assert.strictEqual(wordDistanceMap.length, 345);
        assert.isFalse(wordDistanceMap.contains(endWord))
    })
})