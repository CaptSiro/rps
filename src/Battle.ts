import Entity from "./entities/Entity.ts";
import { showInfo } from "./core.ts";
import BattleRecord from "./BattleRecord.ts";
import Tournament from "./Tournament.ts";



export default class Battle {
    protected history: [BattleRecord, BattleRecord][];

    public constructor(
        protected tournament: Tournament,
        protected a: Entity,
        protected b: Entity,
    ) {
        this.history = [];
    }



    public getTournament(): Tournament {
        return this.tournament;
    }

    public setup(viewport: HTMLElement): void {
        viewport.textContent = "";
        viewport.append(this.a.getHtml());
        viewport.append(this.b.getHtml());
    }

    protected record(a: BattleRecord, b: BattleRecord): void {
        this.history.push([a, b]);
        a.getEntity().record(a);
        b.getEntity().record(b);
    }

    public async start(): Promise<void> {
        const a = this.a;
        const b = this.b;
        const entities = [a, b];

        await Promise.all([a.onBattleStart(this), b.onBattleStart(this)]);

        while (true) {
            if (!Entity.areAlive(entities)) {
                break;
            }

            await Promise.all([a.onRoundStart(), b.onRoundStart()]);
            const [aSpell, bSpell] = await Promise.all([a.onChooseSpell(), b.onChooseSpell()]);

            if (!aSpell.isAvailable()) {
                const msg = a.getName() + " chose invalid spell " + aSpell.getName();
                alert(msg);
                throw new Error(msg);
            }

            if (!bSpell.isAvailable()) {
                const msg = b.getName() + " chose invalid spell " + bSpell.getName();
                alert(msg);
                throw new Error(msg);
            }

            const aOutcome = aSpell.compare(bSpell);
            const bOutcome = bSpell.compare(aSpell);

            this.record(
                new BattleRecord(a, aSpell, aOutcome, 1),
                new BattleRecord(b, bSpell, bOutcome, 1),
            );

            const noOnePerformsSpell = !aSpell.performPolicy(aOutcome, a, b, bSpell) && !bSpell.performPolicy(bOutcome, b, a, aSpell);
            if (noOnePerformsSpell) {
                await showInfo(['No one wins, nothing happens.']);
            } else {
                await aSpell.perform(aOutcome, a, b, bSpell);
                if (!Entity.areAlive(entities)) {
                    break;
                }

                await bSpell.perform(bOutcome, b, a, aSpell);
                if (!Entity.areAlive(entities)) {
                    break;
                }
            }

            await Promise.all([a.onRoundEnd(), b.onRoundEnd()]);
            if (!Entity.areAlive(entities)) {
                break;
            }

            if (a.getAvailableSpellCount() === 0) {
                await a.onDrawSpells(a.getDeck());
                for (const spell of a.getSpells()) {
                    spell.recharge();
                }
            }

            if (b.getAvailableSpellCount() === 0) {
                await b.onDrawSpells(b.getDeck());
                for (const spell of b.getSpells()) {
                    spell.recharge();
                }
            }
        }

        if (a.isAlive()) {
            await showInfo([a.getName() + ' wins']);
        }

        if (b.isAlive()) {
            await showInfo([b.getName() + ' wins']);
        }
    }
}