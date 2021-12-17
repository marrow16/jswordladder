const Word = require('./word')
const dictionaries = require('./resources/dictionaries');

const dictionaryCache = new Map();

module.exports = class Dictionary{
    #wordLength;
    #words;

    constructor(wordLength) {
        this.#wordLength = wordLength;
        if (dictionaryCache.has(wordLength)) {
            this.#words = dictionaryCache.get(wordLength);
        } else {
            this.#words = new Map();
            this.#load();
            dictionaryCache.set(wordLength, this.#words);
        }
    }

    get(key) {
        return this.#words.get(key.toUpperCase());
    }

    get words() {
        return this.#words;
    }

    get wordLength() {
        return this.#wordLength;
    }

    get size() {
        return this.#words.size;
    }

    #load() {
        let linkageBuilder = new Map();
        dictionaries[this.#wordLength].forEach(word => {
            this.#addWord(word, linkageBuilder);
        })
    }

    #addWord(actualWord, linkageBuilder) {
        let word = new Word(actualWord);
        this.#words.set(word.actualWord, word);
        this.#linkWord(word, linkageBuilder);
    }

    #linkWord(word, linkageBuilder) {
        word.variations.forEach(pattern => {
            if (!linkageBuilder.has(pattern)) {
                linkageBuilder.set(pattern, []);
            }
            let links = linkageBuilder.get(pattern);
            links.forEach(linked => {
                linked.addLink(word);
                word.addLink(linked);
            });
            links.push(word);
        });
    }
}
