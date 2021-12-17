module.exports = class WordDistanceMap {
    #word;
    #distances;

    constructor(word) {
        this.#word = word;
        this.#distances = new Map();
        this.#init();
    }

    #init() {
        let queue = [];
        this.#distances.set(this.#word, 1);
        queue.push(this.#word);
        while (queue.length > 0) {
            let nextWord = queue.shift();
            let distance = this.#distanceGetOrDefault(nextWord) + 1;
            nextWord.links.forEach(linkedWord => {
                if (!this.#distances.has(linkedWord)) {
                    queue.push(linkedWord);
                    this.#distances.set(linkedWord, distance);
                }
            });
        }
    }

    #distanceGetOrDefault(word) {
        let result = this.#distances.get(word);
        if (result === undefined) {
            result = 0;
        }
        return result;
    }

    get length() {
        return this.#distances.size;
    }

    contains(word) {
        return this.#distances.has(word);
    }

    distance(word) {
        return this.#distances.get(word);
    }

    reachable(word, maximumLadderLength) {
        let distance = this.distance(word);
        if (distance === undefined) {
            return false;
        }
        return distance <= maximumLadderLength;
    }
}