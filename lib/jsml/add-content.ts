import type { Content } from "./jsml.js";
import Impulse from "../Impulse.ts";



function addContentItem(element: HTMLElement, content: Content): void {
    if (content === undefined) {
        return;
    }

    if (typeof content === "string") {
        element.textContent = content;
        return;
    }

    if (content instanceof Node) {
        element.append(content);
        return;
    }

    if (content instanceof Impulse) {
        content.listen(value => {
            element.textContent = value;
        });

        element.textContent = content.value();
    }
}

export default function addContent(element: HTMLElement, content: Content): void {
    if (content instanceof Array) {
        for (const item of content) {
            addContentItem(element, item);
        }

        return;
    }

    addContentItem(element, content);
}