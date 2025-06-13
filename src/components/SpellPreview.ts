import jsml from "../../lib/jsml/jsml";
import Impulse from "../../lib/Impulse";
import Spell from "../spells/Spell.ts";
import { Opt } from "../../types.ts";
import { is, sortChildren } from "../../lib/std.ts";



type Render = (items: Opt<Spell[]>) => void;
export default function SpellPreview(spells: Impulse<Spell[]>): HTMLElement {
    const container = jsml.div('spell-preview');

    const render: Render = items => {
        if (!is(items)) {
            return;
        }

        items = items.toSorted((a, b) => b.getPriority() - a.getPriority());

        container.textContent = '';

        for (const item of items) {
            const preview = jsml.div('preview-container');
            item.getState().listen(item => {
                preview.textContent = '';
                preview.append(item.getPreviewHtml());
                preview.dataset.priority = String(item.getPriority());

                sortChildren(container, (a, b) => {
                    const aPriority = a instanceof HTMLElement
                        ? Number(a.dataset.priority)
                        : Number.NaN;

                    const bPriority = b instanceof HTMLElement
                        ? Number(b.dataset.priority)
                        : Number.NaN;

                    return bPriority - aPriority;
                });
            });

            preview.append(item.getPreviewHtml());
            container.append(preview);
        }
    }

    spells.listen(render);
    render(spells.value());

    return container;
}