const Dictionary = require('./words/dictionary');
const Puzzle = require('./solving/puzzle');
const Solver = require('./solving/solver');
const Interactive = require('./interactive');
const {performance} = require('perf_hooks');

let args = process.argv.slice(2);
if (args.length > 1) {
    const first = args[0];
    let startTime = performance.now();
    const dictionary = new Dictionary(first.length);
    let took = performance.now() - startTime;
    console.log(`Took ${Math.trunc(took * 100) / 100}ms to load dictionary`);
    const startWord = dictionary.get(first);
    if (startWord === undefined) {
        console.error(`Start word '${first}' not in dictionary!`);
        process.exit(-1);
    } else if (startWord.isIsland) {
        console.error(`Start word '${first}' is an island word!`);
        process.exit(-1);
    }
    const second = args[1];
    const endWord = dictionary.get(second);
    if (endWord === undefined) {
        console.error(`End word '${second}' not in dictionary!`);
        process.exit(-1);
    } else if (endWord.isIsland) {
        console.error(`End word '${second}' is an island word!`);
        process.exit(-1);
    }
    let puzzle = new Puzzle(startWord, endWord);
    let maximumLadderLength = -1;
    if (args.length > 2) {
        let third = parseInt(args[2], 10);
        if (!isNaN(third) && third > 0) {
            maximumLadderLength = third;
        } else {
            console.error('Maximum ladder length arg must be an integer greater than 0 (zero)');
            process.exit(-1);
        }
    } else {
        startTime = performance.now();
        maximumLadderLength = puzzle.calculateMinimumLadderLength();
        took = performance.now() - startTime;
        if (maximumLadderLength === undefined) {
            console.error(`Cannot solve '${first}' to '${second}'`);
            process.exit(-1);
        }
        console.log(`Took ${Math.trunc(took * 100) / 100}ms to determine minimum ladder length of ${maximumLadderLength}`);
    }
    const solver = new Solver(puzzle);
    startTime = performance.now();
    let solutions = solver.solve(maximumLadderLength);
    took = performance.now() - startTime;
    if (solutions.length === 0) {
        console.error(`Cannot solve '${first}' to '${second}' in ladder length ${maximumLadderLength} (took ${Math.trunc(took * 100) / 100}ms)`);
        process.exit(-1);
    }
    solutions = Solver.SortSolutions(solutions);
    let len = solutions.length;
    console.log(`Took ${Math.trunc(took * 100) / 100}ms to find ${len} solutions (explored ${solver.exploredCount} solutions)`);
    solutions.forEach((solution, index) => console.log((index + 1) + '/' + len + ' ' + solution.toString()));
} else {
    new Interactive().run();
}
