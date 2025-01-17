const { div, h3, span } = jsml;

const viewport = $('.viewport');
const screens = $$('[data-screen]');
const spellsScreen = $('.spells');
const infoScreen = $('.info');



class Effect {
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

    getName() {
        return this.name;
    }

    async bind() {}

    async endOfRound() {}
}

class Bleed extends Effect {
    bind() {}

    isHarmful() {
        return true;
    }

    async endOfRound() {
        await showInfo([this.target.getName() + ' is bleeding']);
        await this.target.takeDamage(this.target.definition.maxHealth * 0.05, false, false);
    }
}

class StatModifier extends Effect {
    /** @type {(caster: Entity, target: Entity) => Promise<void>} */
    modifier;

    /**
     * @param {Entity} caster
     * @param {Entity} target
     * @param {string} name
     * @param {(caster: Entity, target: Entity) => Promise<void>} modifier
     */
    constructor(caster, target, name, modifier) {
        super(caster, target, name);
        this.modifier = modifier;
    }

    async bind() {
        await this.modifier(this.caster, this.target);
    }
}

/**
 * @typedef {{ title: string, description: string, disabled?: number }} SpellDefinition
 */

class Spell {
    /** @type {SpellDefinition} */
    definition;
    disabled;

    /**
     * @param {SpellDefinition} definition
     */
    constructor(definition) {
        this.definition = definition;
        this.disabled = definition.disabled ?? 0;
    }

    getName() {
        return this.definition.title;
    }

    isDisabled() {
        return this.disabled !== 0;
    }

    /**
     * @param {number} rounds
     * @param {boolean} addCurrentRoundToCalculation
     */
    disable(rounds, addCurrentRoundToCalculation = true) {
        this.disabled += Math.round(rounds) + (addCurrentRoundToCalculation ? 1 : 0);

        if (this.disabled < 0) {
            this.disabled = 0;
        }
    }

    /**
     * @param {Entity} caster
     * @param {Entity} target
     * @param {Spell} targetSpell
     * @return {Promise<void>}
     */
    async perform(caster, target, targetSpell) {
        throw new Error('Spell is not implemented');
    }

    getHtml() {
        const c = this.isDisabled() ? 'disabled' : '';
        return div({ class: c }, [
            div({ class: 'disabled-overlay' },
                div({ class: 'circle' }, span(_, String(this.disabled)))
            ),
            div({ class: 'title' }, this.definition.title),
            div({ class: 'description' }, this.definition.description),
        ]);
    }
}

class Rock extends Spell {
    /**
     * @param {Entity} caster
     * @param {Entity} target
     * @param {Spell} targetSpell
     */
    async perform(caster, target, targetSpell) {
        await showInfo([caster.getName() + ' hit ' + target.getName()]);
        await target.takeDamage(caster.definition.strength + target.getMissingHealth() * 0.05);
    }
}

class Paper extends Spell {
    /**
     * @param {Entity} caster
     * @param {Entity} target
     * @param {Spell} targetSpell
     */
    async perform(caster, target, targetSpell) {
        const spell = target.getSpell(targetSpell.getName());
        spell?.disable(1);
        caster.heal(caster.definition.strength);

        /** @type {Effect|undefined} */
        let effect = undefined;
        for (let i = 0; i < caster.effects.length; i++) {
            if (caster.effects[i].isHarmful()) {
                effect = caster.effects[i];
                caster.effects.splice(i, 1);
                break;
            }
        }

        const removedNotice = effect !== undefined
            ? ', removed ' + effect?.getName()
            : '';
        await showInfo([
            caster.getName() + ' healed' + removedNotice + ', and disabled ' + target.getName() + "'s "
            + targetSpell.getName() + ' spell for one round.'
        ]);
    }
}

class Scissors extends Spell {
    /**
     * @param {Entity} caster
     * @param {Entity} target
     * @param {Spell} targetSpell
     */
    async perform(caster, target, targetSpell) {
        await showInfo([caster.getName() + ' cut ' + target.getName()]);
        await target.takeDamage(caster.definition.strength * 0.1 + target.definition.maxHealth * 0.05);
        await target.addEffect(new Bleed(caster, target, 'Bleeding'));
    }
}

/**
 * @typedef {{ speed: 1, name: string, maxHealth: number, strength: number, toughness: number }} EntityDefinition
 */
class Entity {
    /** @type {EntityDefinition} */
    definition;
    health;
    /** @type {Impulse<number>} */
    healthImpulse;
    healthBar;
    /** @type {Spell[]} */
    spells;
    /** @type {Effect[]} */
    effects;

    /**
     * @param {EntityDefinition} definition
     * @param {Spell[]} spells
     */
    constructor(definition, spells) {
        this.definition = definition;
        this.spells = spells;
        this.health = definition.maxHealth;
        this.healthImpulse = new Impulse({ default: 1, pulseOnDuplicate: true });
        this.healthBar = Health(this.healthImpulse);
        this.effects = [];
    }

    getMissingHealth() {
        return this.definition.maxHealth - this.health;
    }

    getName() {
        return this.definition.name;
    }

    newRound() {
        for (const spell of this.spells) {
            spell.disable(-1, false);
        }
    }

    /**
     * @param {string} name
     * @returns {Spell|undefined}
     */
    getSpell(name) {
        for (const spell of this.spells) {
            if (spell.getName() === name) {
                return spell;
            }
        }

        return undefined;
    }

    async addEffect(effect) {
        this.effects.push(effect);
        await effect.bind();
    }

    isAlive() {
        return this.health > 0;
    }

    async takeDamage(value, evadeAble = true, reduceAble = true) {
        const chance = Math.max(Math.min(this.definition.speed - 1, 1), 0);
        if (Math.random() < chance && evadeAble) {
            await showInfo([this.getName() + ' evaded the attack']);
            return;
        }

        const reduce = this.definition.toughness === 0 || !reduceAble
            ? 1
            : (1 - 1 / this.definition.toughness);
        this.health -= value * reduce;

        if (this.health < 0) {
            this.health = 0;
        }

        this.healthImpulse.pulse(this.health / this.definition.maxHealth);
    }

    heal(value) {
        this.health += value;

        if (this.health > this.definition.maxHealth) {
            this.health = this.definition.maxHealth;
        }

        this.healthImpulse.pulse(this.health / this.definition.maxHealth);
    }

    /**
     * @return {Promise<Spell>}
     */
    async chooseSpell() {
        return new Promise(resolve => {
            let length = 0;
            for (const spell of this.spells) {
                if (!spell.isDisabled()) {
                    length++;
                }
            }

            let index = Math.floor(Math.random() * length);

            for (const spell of this.spells) {
                if (!spell.isDisabled()) {
                    if (index-- === 0) {
                        resolve(spell);
                        return;
                    }
                }
            }

            // todo empty spell that looses against everything
        });
    }

    getHtml() {
        return div({ class: 'entity' }, [
            h3({ class: 'name' }, this.definition.name),
            this.healthBar
        ]);
    }
}

class Player extends Entity {
    /**
     * @return {Promise<Spell>}
     */
    async chooseSpell() {
        return await playerChooseSpell(this.spells);
    }

    getHtml() {
        return div({ class: 'entity player' }, [
            h3({ class: 'name' }, this.definition.name),
            this.healthBar
        ]);
    }
}

function pairsToMap(pairs) {
    const map = new Map();

    for (const pair of pairs) {
        const [spell, effectiveness] = pair;
        map.set(spell, effectiveness);
    }

    return map;
}

const rockDef = {
    title: 'Rock',
    description: 'Deal heavy blow. The damage is bigger the lower the enemy\'s health is.',
};
const paperDef = {
    title: 'Paper',
    description: 'Heals caster, removes one harmful effect, and disables opponent\'s spell for 1 round'
};
const scissorsDef = {
    title: 'Scissors',
    description: 'Cut opponent for small amount of damage and add one stack of bleeding.'
};

/** @type {Map<string, Map<string, number>>} */
const spellMap = new Map();
spellMap.set(rockDef.title, pairsToMap([
    [rockDef.title, 0],
    [paperDef.title, -1],
    [scissorsDef.title, 1]
]));
spellMap.set(paperDef.title, pairsToMap([
    [rockDef.title, 1],
    [paperDef.title, 0],
    [scissorsDef.title, -1]
]));
spellMap.set(scissorsDef.title, pairsToMap([
    [rockDef.title, -1],
    [paperDef.title, 1],
    [scissorsDef.title, 0]
]));

const enemies = [
    new Entity({
        name: "Billy",
        maxHealth: 100,
        strength: 25,
        toughness: 10,
        speed: 1
    }, [new Rock(rockDef), new Paper(paperDef), new Scissors(scissorsDef)])
];

const player = new Player({
    name: "Player",
    maxHealth: 100,
    strength: 20,
    toughness: 10,
    speed: 1
}, [new Rock(rockDef), new Paper(paperDef), new Scissors(scissorsDef)]);



/**
 * @param {Entity[]} entities
 */
function isAlive(entities) {
    for (const entity of entities) {
        if (!entity.isAlive()) {
            return false;
        }
    }

    return true;
}

/**
 * @param {Entity} player
 * @param {Entity} enemy
 * @returns {Promise<void>}
 */
async function startBattle(player, enemy) {
    viewport.textContent = "";
    viewport.append(enemy.getHtml());
    viewport.append(player.getHtml());

    const entities = [player, enemy];

    while (true) {
        if (!isAlive(entities)) {
            break;
        }

        enemy.newRound();
        player.newRound();

        const enemySpell = enemy.chooseSpell();
        const playerSpell = player.chooseSpell();
        
        await Promise.all([enemySpell, playerSpell]);
        const es = await enemySpell;
        const ps = await playerSpell;

        const value = spellMap.get(ps.getName()).get(es.getName());

        let roundResult = 'No one wins, nothing happens.';
        if (value > 0) {
            roundResult = player.definition.name + ' wins the round.';
        }
        if (value < 0) {
            roundResult = enemy.definition.name + ' wins the round.';
        }

        await showInfo([
            player.definition.name + " used spell " + ps.definition.title
            + " and " + enemy.definition.name + " used spell " + es.definition.title,
            roundResult
        ]);

        if (value > 0) {
            await ps.perform(player, enemy, es);
            if (!isAlive(entities)) {
                break;
            }
        }
        
        if (value < 0) {
            await es.perform(enemy, player, ps);
            if (!isAlive(entities)) {
                break;
            }
        }

        for (const effect of player.effects) {
            await effect.endOfRound();
            if (!isAlive(entities)) {
                break;
            }
        }

        for (const effect of enemy.effects) {
            await effect.endOfRound();
            if (!isAlive(entities)) {
                break;
            }
        }
    }

    if (enemy.isAlive()) {
        await showInfo([enemy.getName() + ' wins']);
    }

    if (player.isAlive()) {
        await showInfo([player.getName() + ' wins']);
    }
}

function showScreen(screen) {
    for (const s of screens) {
        s.classList.toggle('hide', s.dataset.screen !== screen);
    }
}

async function showInfo(lines, delay = 500) {
    if (lines.length === 0) {
        return Promise.resolve();
    }

    showScreen('info');
    infoScreen.textContent = '';

    let isFirst = true;
    for (const line of lines) {
        await new Promise(r => setTimeout(r, delay));
        isFirst = false;
        infoScreen.append(div(_, line));
    }

    await new Promise(r => setTimeout(r, delay));
    infoScreen.append(div({ class: 'dismiss' }, '(Click to dismiss)'));

    return new Promise(resolve => {
        infoScreen.addEventListener('click', resolve, { once: true });
    });
}

/**
 * @param {Spell[]} spells
 */
async function playerChooseSpell(spells) {
    return new Promise(resolve => {
        showScreen('spells');
        spellsScreen.textContent = '';

        for (const spell of spells) {
            const s = spell.getHtml();
            if (!spell.isDisabled()) {
                s.addEventListener('click', () => {
                    resolve(spell);
                });
            }

            spellsScreen.append(s);
        }
    });
}

/**
 * @param {Impulse<number>} fill
 */
function Health(fill) {
    const bar = div({ class: 'fill' });

    fill.listen(v => {
        bar.style.width = (v * 100) + '%';
    });

    return div({ class: 'health' }, bar);
}

startBattle(player, enemies[0]).then();
