module.exports = class Word{
    #actualWord;
    #linked;

    constructor(actualWord) {
        this.#actualWord = actualWord.toUpperCase();
        this.#linked = [];
    }

    get actualWord() {
        return this.#actualWord;
    }

    get variations() {
        let result = [];
        for (let i = 0; i < this.#actualWord.length; i++) {
            result.push(this.#actualWord.substring(0, i) + '_' + this.#actualWord.substring(i + 1));
        }
        return result;
    }

    get links() {
        return this.#linked;
    }

    get isIsland() {
        return this.#linked.length === 0;
    }

    differences(otherWord) {
        let otherActual = otherWord.actualWord;
        var result = 0;
        for (let i = 0; i < this.#actualWord.length; i++) {
            if (this.#actualWord.substring(i, i + 1) !== otherActual.substring(i, i + 1)) {
                result++;
            }
        }
        return result;
    }

    addLink(otherWord) {
        this.#linked.push(otherWord);
    }

    toString() {
        return this.#actualWord;
    }
}
