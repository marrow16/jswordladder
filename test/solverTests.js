const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const Dictionary = require('../bin/words/dictionary');
const Puzzle = require('../bin/solving/puzzle');
const Solver = require('../bin/solving/solver');

describe('Solver Tests', function () {
    it('Solve Cat to Dog', function () {
        let dict = new Dictionary(3);
        let cat = dict.get('cat');
        let dog = dict.get('dog');

        let solver = new Solver(new Puzzle(cat, dog));
        let solutions = solver.solve(4);
        assert.strictEqual(solutions.length, 4);
        assert.strictEqual(solver.exploredCount, 38);

        let midWords = new Map();
        solutions.forEach(solution => {
            assert.strictEqual(solution.ladder.length, 4);
            assert.strictEqual(solution.get(0).actualWord, 'CAT');
            assert.strictEqual(solution.get(3).actualWord, 'DOG');
            let midWord1 = solution.get(1).actualWord;
            midWords.set(midWord1, midWords.has(midWord1) ? midWords.get(midWord1) + 1 : 1);
            let midWord2 = solution.get(2).actualWord;
            midWords.set(midWord2, midWords.has(midWord2) ? midWords.get(midWord2) + 1 : 1);
        });
        assert.strictEqual(midWords.size, 5);
        assert.strictEqual(midWords.get('CAG'), 2);
        assert.strictEqual(midWords.get('COG'), 2);
        assert.strictEqual(midWords.get('COT'), 2);
        assert.strictEqual(midWords.get('DAG'), 1);
        assert.strictEqual(midWords.get('DOT'), 1);
    })

    it('Solve Cold to Warm (and Warm to Cold)', function () {
        let dict = new Dictionary(4);
        let cold = dict.get('cold');
        let warm = dict.get('warm');

        let solver = new Solver(new Puzzle(cold, warm));
        let solutions = solver.solve(5);
        assert.strictEqual(solutions.length, 7);
        assert.strictEqual(solver.exploredCount, 33);

        // now do it the other way around..
        solver = new Solver(new Puzzle(warm, cold));
        solutions = solver.solve(5);
        assert.strictEqual(solutions.length, 7);
        assert.strictEqual(solver.exploredCount, 33);
    })

    it('Solve Kata to Java', function () {
        let dict = new Dictionary(4);
        let kata = dict.get('kata');
        let java = dict.get('java');

        let solver = new Solver(new Puzzle(kata, java));
        let solutions = solver.solve(3);
        assert.strictEqual(solutions.length, 1);
        let solution = solutions[0];
        assert.strictEqual(solution.get(0).actualWord, 'KATA');
        assert.strictEqual(solution.get(1).actualWord, 'KAVA');
        assert.strictEqual(solution.get(2).actualWord, 'JAVA');
    })

    it('Same word is solvable', function () {
        let dict = new Dictionary(3);
        let cat = dict.get('cat');

        let solver = new Solver(new Puzzle(cat, cat));
        let solutions = solver.solve(1);
        assert.strictEqual(solutions.length, 1);
        assert.strictEqual(solver.exploredCount, 0);
    })

    it('One letter difference is solvable', function () {
        let dict = new Dictionary(3);
        let cat = dict.get('cat');
        let cot = dict.get('cot');

        let solver = new Solver(new Puzzle(cat, cot));
        let solutions = solver.solve(2);
        assert.strictEqual(solutions.length, 1);
        assert.strictEqual(solver.exploredCount, 0);
    })

    it('Two letters difference is solvable', function () {
        let dict = new Dictionary(3);
        let cat = dict.get('cat');
        let bar = dict.get('bar');

        let solver = new Solver(new Puzzle(cat, bar));
        let solutions = solver.solve(3);
        assert.strictEqual(solutions.length, 2);
        assert.strictEqual(solver.exploredCount, 0);
    })

    it('Everything unsolvable with bad max ladder length', function () {
        let dict = new Dictionary(3);
        let cat = dict.get('cat');
        let dog = dict.get('dog');

        let solver = new Solver(new Puzzle(cat, dog));
        let solutions = solver.solve(-1);
        assert.strictEqual(solutions.length, 0);
        solutions = solver.solve(0);
        assert.strictEqual(solutions.length, 0);
        solutions = solver.solve(1);
        assert.strictEqual(solutions.length, 0);
        solutions = solver.solve(2);
        assert.strictEqual(solutions.length, 0);
        solutions = solver.solve(3);
        assert.strictEqual(solutions.length, 0);
        solutions = solver.solve(4);
        assert.isTrue(solutions.length > 0);
    })

    it('Short circuit on one letter difference', function () {
        let dict = new Dictionary(3);
        let cat = dict.get('cat');
        let cot = dict.get('cot');

        let solver = new Solver(new Puzzle(cat, cot));
        let solutions = solver.solve(3);
        assert.strictEqual(solutions.length, 3);
        assert.strictEqual(solver.exploredCount, 0);
    })

})