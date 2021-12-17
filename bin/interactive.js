const Dictionary = require('./words/dictionary');
const Puzzle = require('./solving/puzzle');
const Solver = require('./solving/solver');

const prompt = require('prompt-sync')({ sigint: true });
const {performance} = require('perf_hooks');

const appName = 'WordLadder';
const promptPrefix = appName + '> ';
const minimumWordLength = 2;
const maximumWordLength = 15;
const minimumLadderLength = 1;
const maximumLadderLength = 20;

const steps = [
    'Enter start word: ',
    'Enter final word: ',
    `Maximum ladder length? [${minimumLadderLength}-${maximumLadderLength}, or return]: `
];

module.exports = class Interactive {
    #onStep;
    #dictionary;
    #dictionaryLoadTime;
    #startWord;
    #endWord;
    #maximumLadderLength;

    constructor() {
        this.#onStep = 0;
        this.#dictionary = null;
        this.#dictionaryLoadTime = 0;
        this.#startWord = null;
        this.#endWord = null;
        this.#maximumLadderLength = -1;
    }

    run() {
        let again = true;
        while (again) {
            while (this.#onStep < steps.length) {
                this.#processInput();
            }
            this.#onStep = 0;

            this.#solve();

            console.log('');
            let input = prompt(`${promptPrefix}Run again [y/n]: `);
            again = input === 'y' || input === 'Y';
            console.log('');
        }
    }

    #processInput() {
        const input = prompt(promptPrefix + steps[this.#onStep]);
        let ok = false;
        switch (this.#onStep) {
            case 0:
                ok = this.#setStartWord(input);
                break;
            case 1:
                ok = this.#setEndWord(input);
                break;
            case 2:
                ok = this.#setMaximumLadderLength(input);
                break;
        }
        if (ok) {
            this.#onStep++;
        }
    }

    #setStartWord(input) {
        if (input.length < minimumWordLength || input.length > maximumWordLength) {
            console.error(red(`            Please enter a word with between ${minimumWordLength} and ${maximumWordLength} characters!`));
            return false;
        }
        this.#loadDictionary(input.length);
        this.#startWord = this.#validateWord(input);
        return this.#startWord !== undefined;
    }

    #setEndWord(input) {
        if (input.length !== this.#dictionary.wordLength) {
            console.error(red('            Final word length must match start word length!'));
            return false;
        }
        this.#endWord = this.#validateWord(input);
        return this.#endWord !== undefined;
    }

    #validateWord(input) {
        const word = this.#dictionary.get(input);
        if (word === undefined) {
            console.error(red(`            Word '${input}' does not exist!`));
            return;
        } else if (word.isIsland) {
            console.error(red(`            Word '${input}' is an island word (cannot change single letter to form another word)`));
            return;
        }
        return word;
    }

    #setMaximumLadderLength(input) {
        if (input.length === 0) {
            console.log(green('            No answer - assuming auto calc of minimum ladder length'));
            this.#maximumLadderLength = -1;
            return true;
        }
        const value = parseInt(input, 10);
        if (isNaN(value) || value < minimumLadderLength || value > maximumLadderLength) {
            console.error(red(`            Invalid input (please enter a number between ${minimumLadderLength} and ${maximumLadderLength})`));
            return false;
        }
        this.#maximumLadderLength = value;
        return true;
    }

    #loadDictionary(wordLength) {
        const startTime = performance.now();
        this.#dictionary = new Dictionary(wordLength);
        this.#dictionaryLoadTime = performance.now() - startTime;
    }

    #solve() {
        console.log(`Took ${green(formatMs(this.#dictionaryLoadTime))} to load dictionary`);
        const puzzle = new Puzzle(this.#startWord, this.#endWord);
        if (this.#maximumLadderLength === -1) {
            const start = performance.now();
            const min = puzzle.calculateMinimumLadderLength();
            const took = performance.now() - start;
            if (min === undefined) {
                console.error(red(`Cannot solve '${this.#startWord.actualWord}' to '${this.#endWord.actualWord}' (took ${formatMs(took)} to determine that)`));
                return;
            }
            this.#maximumLadderLength = min;
            console.log(`Took ${green(formatMs(took))} to determine minimum ladder length of ${green(min)}`);
        }
        const solver = new Solver(puzzle);
        const start = performance.now();
        const solutions = solver.solve(this.#maximumLadderLength);
        const took = performance.now() - start;
        if (solutions.length === 0) {
            console.error(red(`Took ${formatMs(took)} to find no solutions (explored ${solver.exploredCount} solutions)`));
            return;
        }
        console.log(`Took ${green(formatMs(took))} to find ${green(solutions.length)} solutions (explored ${green(solver.exploredCount)} solutions)`);
        this.#displaySolutions(solutions);
    }

    #displaySolutions(solutions) {
        const sorted = Solver.SortSolutions(solutions);
        let pageStart = 0;
        const len = sorted.length;
        while (pageStart < len) {
            let more = pageStart > 0 ? ' more' : '';
            let input = prompt(`${promptPrefix}List${more} solutions? (Enter 'n' for no, 'y' or return for next 10, 'all' for all or how many): `);
            let limit = 10;
            if (input === 'n' || input === 'N') {
                return;
            } else if (input === 'all') {
                limit = len;
            } else if (input.length !== 0 && input !== 'y' && input !== 'Y') {
                let val = parseInt(input, 10);
                if (!isNaN(val) && val > 0) {
                    limit = val;
                }
            }
            for (let s = 0; s < limit && (s + pageStart) < len; s++) {
                console.log(`${s + pageStart + 1}/${len} ${sorted[s + pageStart].toString()}`);
            }
            pageStart = pageStart + limit;
        }
    }
}

function formatMs(took) {
    return (Math.trunc(took * 100) / 100) + 'ms';
}

const terminalColourRed = '\u001b[31m';
const terminalColourGreen = '\u001b[32m';
const terminalColourBlack = '\u001b[0m';

function green(msg) {
    return terminalColourGreen + msg + terminalColourBlack;
}

function red(msg) {
    return terminalColourRed + msg + terminalColourBlack;
}
