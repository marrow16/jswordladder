class Solution {
    #ladder;

    constructor(words) {
        this.#ladder = words.slice();
    }

    toString() {
        let builder = [];
        this.#ladder.forEach(word => builder.push(word.toString()));
        return '[' + builder.join(',') + ']';
    }

    get ladder() {
        return this.#ladder;
    }

    get(wordIndex) {
        return this.#ladder[wordIndex];
    }

    get length() {
        return this.#ladder.length;
    }
}

const SYMBOL_LADDER = Symbol('ladder');
const SYMBOL_SEEN = Symbol('seen');

class CandidateSolution {
    constructor(...words) {
        this[SYMBOL_LADDER] = words.slice();
        this[SYMBOL_SEEN] = new Set();
        words.forEach(word => this[SYMBOL_SEEN].add(word));
    }

    get lastWord() {
        return this[SYMBOL_LADDER][this[SYMBOL_LADDER].length - 1];
    }

    get length() {
        return this[SYMBOL_LADDER].length;
    }

    seen(word) {
        return this[SYMBOL_SEEN].has(word);
    }

    spawn(nextWord) {
        let result = new CandidateSolution();
        result[SYMBOL_LADDER] = this[SYMBOL_LADDER].slice();
        result[SYMBOL_LADDER].push(nextWord);
        this[SYMBOL_SEEN].forEach(seenWord => result[SYMBOL_SEEN].add(seenWord));
        result[SYMBOL_SEEN].add(nextWord);
        return result;
    }

    asSolution(reversed) {
        if (reversed) {
            return new Solution(this[SYMBOL_LADDER].slice().reverse());
        } else {
            return new Solution(this[SYMBOL_LADDER]);
        }
    }
}

module.exports = { Solution, CandidateSolution }