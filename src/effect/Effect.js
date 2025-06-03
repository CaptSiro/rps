export default class Effect {
    /** @type {Entity} */
    caster;
    /** @type {Entity} */
    target;
    /** @type {string} */
    name;



    /**
     * @param {Entity} caster
     * @param {Entity} target
     * @param {string} name
     */
    constructor(caster, target, name) {
        this.caster = caster;
        this.target = target;
        this.name = name;
    }

    isHarmful() {
        return false;
    }

    /**
     * @returns {boolean}
     */
    doRemove() {
        return false;
    }

    getRemovedMessage() {
        return 'Effect removed';
    }

    getName() {
        return this.name;
    }

    async bind() {}

    async endOfRound() {}
}