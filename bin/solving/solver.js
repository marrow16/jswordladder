const WordDistanceMap = require('./wordDistanceMap');
const { Solution, CandidateSolution } = require('./solution');

module.exports = class Solver {
    #puzzle;
    #exploredCount;
    #solutions;
    #startWord;
    #endWord;
    #reversed;
    #maximumLadderLength;
    #endDistances;

    constructor(puzzle) {
        this.#puzzle = puzzle;
        this.#startWord = puzzle.startWord;
        this.#endWord = puzzle.endWord;
        this.#exploredCount = 0;
        this.#solutions = [];
        this.#reversed = false;
        this.#maximumLadderLength = 0;
        this.#endDistances = null;
    }

    solve(maximumLadderLength) {
        this.#exploredCount = 0;
        this.#solutions = [];
        this.#startWord = this.#puzzle.startWord;
        this.#endWord = this.#puzzle.endWord;
        this.#reversed = false;
        this.#maximumLadderLength = maximumLadderLength;

        let diffs = this.#startWord.differences(this.#endWord);
        switch (diffs) {
            case 0:
                this.#addSolution(this.#startWord);
                return this.#solutions;
            case 1:
                this.#addSolution(this.#startWord, this.#endWord);
                switch (maximumLadderLength) {
                    case 2:
                        // maximum ladder is 2 so we already have the only answer...
                        return this.#solutions;
                    case 3:
                        return this.#shortCircuitLadderLength3();
                }
                break;
            case 2:
                if (maximumLadderLength === 3) {
                    return this.#shortCircuitLadderLength3();
                }
        }
        // begin with the word that has the least number of linked words...
        // (this reduces the number of pointless solution candidates explored!)
        this.#reversed = this.#startWord.links.length > this.#endWord.links.length;
        if (this.#reversed) {
            this.#startWord = this.#puzzle.endWord;
            this.#endWord = this.#puzzle.startWord;
        }

        this.#endDistances = new WordDistanceMap(this.#endWord);
        this.#startWord.links.forEach(linkedWord => {
            if (this.#endDistances.reachable(linkedWord, maximumLadderLength)) {
                this.#solve(new CandidateSolution(this.#startWord, linkedWord));
            }
        });
        return this.#solutions;
    }

    #solve(candidate) {
        this.#exploredCount++;
        let lastWord = candidate.lastWord;
        if (lastWord === this.#endWord) {
            this.#solutions.push(candidate.asSolution(this.#reversed));
            return;
        }
        let ladderLen = candidate.length;
        if (ladderLen < this.#maximumLadderLength) {
            let newMax = this.#maximumLadderLength - ladderLen;
            lastWord.links.forEach(linkedWord => {
                if (!candidate.seen(linkedWord) && this.#endDistances.reachable(linkedWord, newMax)) {
                    this.#solve(candidate.spawn(linkedWord));
                }
            });
        }
    }

    get exploredCount() {
        return this.#exploredCount;
    }

    #addSolution(...words) {
        this.#solutions.push(new Solution(words));
    }

    #shortCircuitLadderLength3() {
        let common = new Set();
        this.#startWord.links.forEach(linkedWord => common.add(linkedWord));
        this.#endWord.links.forEach(linkedWord => {
            if (common.has(linkedWord)) {
                this.#addSolution(this.#startWord, linkedWord, this.#endWord);
            }});
        return this.#solutions;
    }

    static SortSolutions(solutions) {
        return solutions.slice()
            .sort((s1, s2) => {
                if (s1.length === s2.length) {
                    let wordCompare = 0;
                    for (let i = 0; i < s1.length && wordCompare === 0; i++) {
                        wordCompare = s1.get(i).actualWord.localeCompare(s2.get(i).actualWord);
                    }
                    return wordCompare;
                } else if (s1.length > s2.length) {
                    return 1;
                }
                return -1;
            });
    }
}