const { div, span } = jsml;

/**
 * @param {Impulse<Spell[]>} spells
 */
export default function SpellPreview(spells) {
    const container = jsml.div('spell-preview');

    const render = items => {
        container.textContent = '';

        for (const item of items) {
            const preview = div('preview-container');
            item.state.listen(item => {
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