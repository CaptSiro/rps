/**
 * @typedef {Impulse<any> | HTMLElement | Node | string | undefined} ContentItem
 *
 * @typedef {ContentItem | ArrayLike<ContentItem> | ContentItem[] | HTMLCollection} Content
 *
 * @typedef {{
 *     [key: string]: ((event: Event) => any) | Impulse<any> | any
 * } & {
 *     style?: Partial<CSSStyleDeclaration>
 * }} Attributes
 *
 * @typedef {Attributes | string | undefined} Props
 *
 * @typedef {{ [key in keyof HTMLElementTagNameMap]: (props?: Props | string, content?: Content) => HTMLElementTagNameMap[key] }} JSML
 */

/**
 * @returns {JSML | {}}
 */
function jsmlInit() {
    /**
     * @param {HTMLElement} element
     * @param {ContentItem} item
     */
    function addContentItem(element, item) {
        if (item === undefined) {
            return;
        }

        if (typeof item === "string") {
            element.textContent = item;
            return;
        }

        if (item instanceof Impulse) {
            if (item.value() instanceof Node) {
                let last = item.value();
                element.append(last);

                item.listen((n) => {
                    element.replaceChild(n, last);
                    last = n;
                });

                return;
            }

            const text = document.createTextNode(String(item.value()));
            element.append(text);

            item.listen(x => {
                text.textContent = String(x);
            });

            return;
        }

        if (item instanceof Node) {
            element.append(item);
        }
    }

    /**
     * @param {HTMLElement} element
     * @param {Content} content
     */
    function addContent(element, content) {
        if (!Array.isArray(content)) {
            // @ts-ignore Should be just singular object
            addContentItem(element, content);
            return;
        }

        for (const item of content) {
            addContentItem(element, item);
        }
    }

    /**
     * @param {string} key
     * @returns {string}
     */
    function parse(key) {
        return key.substring(Number(key[0] === "\\"));
    }

    /**
     * @param {HTMLElement} element
     * @param {string} attribute
     * @param {any} value
     */
    function setAttribute(element, attribute, value) {
        switch (typeof value) {
            case "undefined":
                break;
            case "boolean":
                element.toggleAttribute(attribute, value);
                break;
            case "string":
                element.setAttribute(attribute, value);
                break;
            default:
                element.setAttribute(attribute, String(value));
                break;
        }
    }

    /**
     * @param {Record<string, any>} styles
     * @returns {string}
     */
    function createCssString(styles) {
        let buffer = "";

        for (const key in styles) {
            if (styles[key] === undefined) {
                continue;
            }

            buffer += `${camelToKebab(key)}: ${styles[key]};`;
        }

        return buffer;
    }

    /**
     * @param {string} string
     * @returns {string}
     */
    function camelToKebab(string) {
        let buffer = "";

        for (let i = 0; i < string.length; i++) {
            if (uppercase.includesChar(string[i])) {
                buffer += "-" + string[i].toLowerCase();
                continue;
            }

            buffer += string[i];
        }

        return buffer;
    }

    /**
     * @param {HTMLElement} element
     * @param {Props | string} props
     */
    function addProps(element, props) {
        if (props === undefined || typeof props === "string") {
            return;
        }

        if (props.style !== undefined) {
            setAttribute(element, "style", createCssString(props.style));
            delete props.style;
        }

        for (const key in props) {
            if (key[0] === "o" && key[1] === "n") {
                element.addEventListener(key.substring(2).toLowerCase(), props[key]);
                continue;
            }

            const k = camelToKebab(parse(key));
            if (typeof props[key] === "boolean") {
                setAttribute(element, k, props[key]);
                continue;
            }

            if (props[key] instanceof Impulse) {
                const v = props[key].value();
                if (v !== undefined) {
                    setAttribute(element, k, v);
                }

                props[key].listen((x) => {
                    setAttribute(element, k, x);
                });

                continue;
            }

            setAttribute(element, k, props[key]);
        }
    }

    return new Proxy({}, {
        get(_, tag) {
            return (props, content) => {
                if (props instanceof HTMLElement) {
                    console.error(`Can not use HTMLElement as options. Caught at: ${String(tag)}`);
                    return document.createElement(String(tag));
                }

                const element = document.createElement(/** @type {keyof HTMLElementTagNameMap} */ tag);

                if (typeof props === "string") {
                    element.className = String(props);
                } else if (props !== undefined && "class" in props) {
                    element.className = String(props.class);
                    delete props.class;
                }

                addProps(element, props);
                addContent(element, content);

                return element;
            }
        }
    });
}

const jsml = jsmlInit();
const _ = undefined;

/**
 * @param {string} selector
 * @param {Element | Document} element
 * @returns {HTMLAnchorElement | HTMLElement | HTMLAreaElement | HTMLAudioElement | HTMLBaseElement | HTMLQuoteElement | HTMLBodyElement | HTMLBRElement | HTMLButtonElement | HTMLCanvasElement | HTMLTableCaptionElement | HTMLTableColElement | HTMLDataElement | HTMLDataListElement | HTMLModElement | HTMLDetailsElement | HTMLDialogElement | HTMLDivElement | HTMLDListElement | HTMLEmbedElement | HTMLFieldSetElement | HTMLFormElement | HTMLHeadingElement | HTMLHeadElement | HTMLHRElement | HTMLHtmlElement | HTMLIFrameElement | HTMLImageElement | HTMLInputElement | HTMLLabelElement | HTMLLegendElement | HTMLLIElement | HTMLLinkElement | HTMLMapElement | HTMLMenuElement | HTMLMetaElement | HTMLMeterElement | HTMLObjectElement | HTMLOListElement | HTMLOptGroupElement | HTMLOptionElement | HTMLOutputElement | HTMLParagraphElement | HTMLPictureElement | HTMLPreElement | HTMLProgressElement | HTMLScriptElement | HTMLSelectElement | HTMLSlotElement | HTMLSourceElement | HTMLSpanElement | HTMLStyleElement | HTMLTableElement | HTMLTableSectionElement | HTMLTableCellElement | HTMLTemplateElement | HTMLTextAreaElement | HTMLTimeElement | HTMLTitleElement | HTMLTableRowElement | HTMLTrackElement | HTMLUListElement | HTMLVideoElement}
 */
function $(selector, element = document) {
    return element.querySelector(selector);
}

/**
 * @param {string} selector
 * @param {Element | Document} element
 * @returns {NodeListOf<HTMLElementTagNameMap[keyof HTMLElementTagNameMap]> |  NodeListOf<Element>}
 */
function $$(selector, element = document) {
    return element.querySelectorAll(selector);
}