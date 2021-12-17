const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const Dictionary = require('../bin/words/dictionary');
const Puzzle = require('../bin/solving/puzzle');

describe('Puzzle Tests', function () {
    it('calculateMinimumLadderLength() [no diff]', function () {
        let dict = new Dictionary(3);
        let cat = dict.get('cat');
        assert.isDefined(cat);

        let puzzle = new Puzzle(cat, cat);
        assert.strictEqual(puzzle.calculateMinimumLadderLength(), 1);
    })

    it('calculateMinimumLadderLength() [1 letter diff]', function () {
        let dict = new Dictionary(3);
        let cat = dict.get('cat');
        assert.isDefined(cat);
        let cot = dict.get('cot');
        assert.isDefined(cot);

        let puzzle = new Puzzle(cat, cot);
        assert.strictEqual(puzzle.calculateMinimumLadderLength(), 2);
    })

    it('calculateMinimumLadderLength() [2 letter diff]', function () {
        let dict = new Dictionary(3);
        let cat = dict.get('cat');
        assert.isDefined(cat);
        let bar = dict.get('bar');
        assert.isDefined(bar);

        let puzzle = new Puzzle(cat, bar);
        assert.strictEqual(puzzle.calculateMinimumLadderLength(), 3);
    })

    it('calculateMinimumLadderLength() [all letters diff]', function () {
        let dict = new Dictionary(3);
        let cat = dict.get('cat');
        assert.isDefined(cat);
        let dog = dict.get('dog');
        assert.isDefined(dog);

        let puzzle = new Puzzle(cat, dog);
        assert.strictEqual(puzzle.calculateMinimumLadderLength(), 4);
    })

    it('calculateMinimumLadderLength() [longest]', function () {
        let dict = new Dictionary(3);
        let exo = dict.get('exo');
        assert.isDefined(exo);
        let zzz = dict.get('zzz');
        assert.isDefined(zzz);

        let puzzle = new Puzzle(exo, zzz);
        assert.strictEqual(puzzle.calculateMinimumLadderLength(), 9);
    })
})
