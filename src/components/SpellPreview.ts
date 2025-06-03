import jsml from "../../lib/jsml/jsml";
import Impulse from "../../lib/Impulse";
import Spell from "../spells/Spell.ts";
import { Opt } from "../../lib/types.ts";
import { is } from "../../lib/std.ts";



type Render = (items: Opt<Spell[]>) => void;
export default function SpellPreview(spells: Impulse<Spell[]>): HTMLElement {
    const container = jsml.div('spell-preview');

    const render: Render = items => {
        if (!is(items)) {
            return;
        }

        container.textContent = '';

        for (const item of items) {
            const preview = jsml.div('preview-container');
            item.getState().listen(item => {
                preview.textContent = '';
                preview.append(item.getPreviewHtml());
            });

            preview.append(item.getPreviewHtml());
            container.append(preview);
        }
    }

    spells.listen(render);
    render(spells.value());

    return container;
}