import Impulse from "../../lib/Impulse";
import jsml from "../../lib/jsml/jsml";



export default function Health(fill: Impulse<number>): HTMLElement {
    const bar = jsml.div({ class: 'fill' });
    const secondary = jsml.div({ class: 'fill secondary' });

    fill.listen(v => {
        bar.style.width = (v * 100) + '%';
        secondary.style.width = (v * 100) + '%';
    });

    return jsml.div({ class: 'health' }, [secondary, bar]);
}