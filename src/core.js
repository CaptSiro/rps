const { div } = jsml;

export const SCREEN_SPELLS = 'spells';
export const SCREEN_INFO = 'info';
export const SCREEN_ADDITION = 'addition';

const screens = $$('[data-screen]');
const infoScreen = $('.info');



export function showScreen(screen) {
    for (const s of screens) {
        s.classList.toggle('hide', s.dataset.screen !== screen);
    }
}

function getScreensSpells(screen) {
    return $(`[data-screen="${screen}"] .spells`);
}

export async function showInfo(lines, delay = 500) {
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
 * @returns {Promise<Spell>}
 */
export async function playerChooseSpell(spells) {
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

/**
 * @param {Spell[]} spells
 * @returns {Promise<Spell>}
 */
export async function playerChooseNewSpell(spells) {
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