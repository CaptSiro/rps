import jsml, { _ } from "../lib/jsml/jsml.ts";
import { $, $$, assert, wait } from "../lib/std.ts";
import Spell, { SpellPrefab } from "./spells/Spell.ts";



export type Prefab = {
    name: string
};


const { div } = jsml;

export const SCREEN_SPELLS = 'spells';
export const SCREEN_INFO = 'info';
export const SCREEN_ADDITION = 'addition';

const screens = $$('[data-screen]');
const infoScreen = assert($('.info'));



export function instantiate<T>(prefab: T): T {
    const instance: T = JSON.parse(JSON.stringify(prefab));

    for (const key in prefab) {
        if (typeof prefab[key] === "function") {
            instance[key] = prefab[key];
        }
    }

    return instance;
}

export function power(prefab: SpellPrefab, or: number): number {
    return prefab.power ?? or;
}

/**
 * Converts health to HP stat
 * @param health
 */
export function hp(health: number): number {
    return health / 10;
}

/**
 * Converts evasiveness stat to speed
 * @param evasiveness
 */
export function speed(evasiveness: number): number {
    return evasiveness / 10;
}

export function showScreen(screen: string): void {
    for (const s of screens) {
        s.classList.toggle('hide', s.dataset.screen !== screen);
    }
}

function getScreensSpells(screen: string): HTMLElement {
    return assert($(`[data-screen="${screen}"] .spells`));
}

export async function showInfo(lines: string[], delay: number = 500): Promise<unknown> {
    if (lines.length === 0) {
        return Promise.resolve();
    }

    showScreen('info');
    infoScreen.textContent = '';

    for (const line of lines) {
        await wait(delay);
        infoScreen.append(div(_, line));
    }

    infoScreen.append(div({ class: 'dismiss' }, '(Click to dismiss)'));

    return new Promise(resolve => {
        infoScreen.addEventListener('click', resolve, { once: true });
    });
}

export async function playerChooseSpell(spells: Spell[]): Promise<Spell> {
    return new Promise(resolve => {
        showScreen(SCREEN_SPELLS);
        const spellsContainer = getScreensSpells(SCREEN_SPELLS);
        spellsContainer.textContent = '';

        for (const spell of spells) {
            const s = spell.getHtml();
            if (spell.isAvailable()) {
                s.addEventListener('click', () => resolve(spell));
            }

            spellsContainer.append(s);
        }
    });
}

export async function playerChooseNewSpell(spells: Spell[]): Promise<Spell> {
    return new Promise(resolve => {
        showScreen(SCREEN_ADDITION);
        const spellsContainer = getScreensSpells(SCREEN_ADDITION);
        spellsContainer.textContent = '';

        for (const spell of spells) {
            const s = spell.getHtml();
            s.addEventListener('click', () => resolve(spell));
            spellsContainer.append(s);
        }
    });
}