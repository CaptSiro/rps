/**
 * @param {Impulse<number>} fill
 */
export default function Health(fill) {
    const bar = jsml.div({ class: 'fill' });
    const secondary = jsml.div({ class: 'fill secondary' });

    fill.listen(v => {
        bar.style.width = (v * 100) + '%';
        secondary.style.width = (v * 100) + '%';
    });

    return jsml.div({ class: 'health' }, [secondary, bar]);
}