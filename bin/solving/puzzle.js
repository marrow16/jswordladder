const WordDistanceMap = require('./wordDistanceMap');

module.exports = class Puzzle {
    #startWord;
    #endWord;

    constructor(startWord, endWord) {
        this.#startWord = startWord;
        this.#endWord = endWord;
    }

    get startWord() {
        return this.#startWord;
    }

    get endWord() {
        return this.#endWord;
    }

    calculateMinimumLadderLength() {
        let start = this.#startWord;
        let end = this.#endWord;
        let diffs = start.differences(end);
        switch (diffs) {
            case 0:
            case 1:
                return diffs + 1;
            case 2:
                let common = new Set();
                start.links.forEach(linkedWord => common.add(linkedWord));
                for (let linkedWord of end.links) {
                    if (common.has(linkedWord)) {
                        return 3;
                    }
                }
        }
        if (start.links.length > end.links.length) {
            start = this.#endWord;
            end = this.#startWord;
        }
        return (new WordDistanceMap(start)).distance(end);
    }
}