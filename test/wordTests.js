const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const Word = require('../bin/words/word');

describe('Word Tests', function () {
    it('Can construct word', function () {
        let word = new Word('cat');
        assert.strictEqual(word.actualWord, 'CAT');
    })

    it('Variation patterns correct', function () {
        let word = new Word('cat');
        let patts = word.variations;
        assert.strictEqual(patts.length, 3);
        assert.strictEqual(patts[0], '_AT');
        assert.strictEqual(patts[1], 'C_T');
        assert.strictEqual(patts[2], 'CA_');
    })

    it('Differences correct', function () {
        let cat = new Word('cat');
        let cot = new Word('cot');
        let dog = new Word('dog');
        assert.strictEqual(cat.differences(cat), 0);
        assert.strictEqual(cot.differences(cot), 0);
        assert.strictEqual(dog.differences(dog), 0);
        assert.strictEqual(cat.differences(cot), 1);
        assert.strictEqual(cot.differences(cat), 1);
        assert.strictEqual(cot.differences(dog), 2);
        assert.strictEqual(dog.differences(cot), 2);
        assert.strictEqual(cat.differences(dog), 3);
        assert.strictEqual(dog.differences(cat), 3);
    })
})