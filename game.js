const { div, h3 } = jsml;

const viewport = $('.viewport');
const screens = $$('[data-screen]');
const spellsScreen = $('.spells');
const infoScreen = $('.info');



class Effect {
    /** @type {Entity} */
    caster;
    /** @type {Entity} */
    target;

    /**
     * @param {Entity} caster
     * @param {Entity} target
     */
    constructor(caster, target) {
        this.caster = caster;
        this.target = target;
    }

    async bind() {}

    async endOfRound() {}
}

class Bleed extends Effect {
    bind() {}

    async endOfRound() {
        await showInfo([this.target.getName() + ' is bleeding']);
        this.target.takeDamage(this.target.definition.maxHealth * 0.05, false, false);
    }
}

class StatModifier extends Effect {
    /** @type {(caster: Entity, target: Entity) => Promise<void>} */
    modifier;

    /**
     * @param {Entity} caster
     * @param {Entity} target
     * @param {(caster: Entity, target: Entity) => Promise<void>} modifier
     */
    constructor(caster, target, modifier) {
        super(caster, target);
        this.modifier = modifier;
    }

    async bind() {
        await this.modifier(this.caster, this.target);
    }
}

/**
 * @typedef {{ title: string, description: string, uid: number }} SpellDefinition
 */

class Spell {
    static #uid = 0;
    static uid() {
        return this.#uid++;
    }



    /** @type {SpellDefinition} */
    definition;

    /**
     * @param {SpellDefinition} definition
     */
    constructor(definition) {
        this.definition = definition;
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
        return div({ dataUid: this.definition.uid }, [
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
        target.takeDamage(caster.definition.strength + target.getMissingHealth() * 0.05);
    }
}

class Paper extends Spell {
    /**
     * @param {Entity} caster
     * @param {Entity} target
     * @param {Spell} targetSpell
     */
    async perform(caster, target, targetSpell) {
        await caster.addEffect(new StatModifier(caster, target, async c => {
            c.definition.speed += c.definition.speed * 0.1;
            await showInfo([caster.getName() + "'s speed increased"]);
        }));
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
        target.takeDamage(caster.definition.strength * 0.1 + target.definition.maxHealth * 0.05);
        await target.addEffect(new Bleed(caster, target));
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

    /**
     * @return {Promise<Spell>}
     */
    async chooseSpell() {
        return new Promise(resolve => resolve(this.spells[Math.floor(Math.random() * this.spells.length)]));
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

const rock = new Rock({
    uid: Spell.uid(),
    title: 'Rock',
    description: 'Deal heavy blow. The damage is bigger the lower the enemy\'s health is.'
});
const paper = new Paper({
    uid: Spell.uid(),
    title: 'Paper',
    description: 'Buffs caster\'s probability to evade opponents attack'
});
const scissors = new Scissors({
    uid: Spell.uid(),
    title: 'Scissors',
    description: 'Cut opponent for small amount of damage and add one stack of bleeding.'
});

/** @type {Map<Spell, Map<Spell, number>>} */
const spellMap = new Map();
spellMap.set(rock, pairsToMap([
    [rock, 0],
    [paper, -1],
    [scissors, 1]
]));
spellMap.set(paper, pairsToMap([
    [rock, 1],
    [paper, 0],
    [scissors, -1]
]));
spellMap.set(scissors, pairsToMap([
    [rock, -1],
    [paper, 1],
    [scissors, 0]
]));

const defaultSpells = [rock, paper, scissors];

const enemies = [
    new Entity({
        name: "Billy",
        maxHealth: 100,
        strength: 25,
        toughness: 10,
        speed: 1
    }, defaultSpells)
];

const player = new Player({
    name: "Player",
    maxHealth: 100,
    strength: 20,
    toughness: 10,
    speed: 1
}, defaultSpells);



/**
 * @param {Entity} player
 * @param {Entity} enemy
 * @returns {Promise<void>}
 */
async function startBattle(player, enemy) {
    viewport.textContent = "";
    viewport.append(enemy.getHtml());
    viewport.append(player.getHtml());

    while (true) {
        if (!enemy.isAlive() || !player.isAlive()) {
            break;
        }

        const enemySpell = enemy.chooseSpell();
        const playerSpell = player.chooseSpell();
        
        await Promise.all([enemySpell, playerSpell]);
        const es = await enemySpell;
        const ps = await playerSpell;

        const value = spellMap.get(ps).get(es);

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
        }
        
        if (value < 0) {
            await es.perform(enemy, player, ps);
        }

        for (const effect of player.effects) {
            await effect.endOfRound();
        }

        for (const effect of enemy.effects) {
            await effect.endOfRound();
        }
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
            s.addEventListener('click', () => {
                resolve(spell);
            });

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
