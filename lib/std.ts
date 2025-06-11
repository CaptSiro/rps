import { Opt, Producer } from "./../types.ts";
import Effect from "../src/effects/Effect.ts";

export type RelativeTimestamp = {
    name: string | any,
    amount: number
}

export type SkipPredicate<T> = (item: T) => boolean;



export function $<T extends HTMLElement = HTMLElement>(query: string, root: HTMLElement|Document = document): T|null {
    return root.querySelector(query);
}

export function $$(query: string, root: HTMLElement|Document = document): Iterable<HTMLElement> {
    return root.querySelectorAll(query);
}

export function is<T>(variable: T|null|undefined): variable is T {
    return variable !== undefined && variable !== null;
}

export function assert<T>(variable: Opt<T>): T {
    if (!is(variable)) {
        throw new Error("Is-Assertion failed x does not have defined value");
    }

    return variable;
}



export function rangeInRange(a1: number, b1: number, a2: number, b2: number): boolean {
    if (b1 > a1) {
        const t = a1;
        a1 = b1;
        b1 = t;
    }

    if (b2 > a2) {
        const t = a2;
        a2 = b2;
        b2 = t;
    }

    return (a1 <= a2 && b2 <= b1)
        || (a2 <= a1 && b1 <= b2);
}

export function clamp(min: number, max: number, x: number): number {
    if (x < min) {
        return min;
    }

    return x > max
        ? max
        : x;
}

export function map(value: number, fromA: number, fromB: number, toA: number, toB: number): number {
    return ((value - fromA) / (fromB - fromA)) * (toB - toA) + toA;
}

export function linear(a: number, b: number, x: number): number {
    return (b - x) / (b - a);
}

export function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

/**
 * If x >= 0 then y is in <0;1) where for example f(0.5) ~ 0.5; f(1) ~ 0.75;
 * @param x
 */
export function expFalloff(x: number): number {
    return 1 - Math.exp(- (1 / 2) * Math.E * x);
}

export function wait(ms: number): Promise<void> {
    return new Promise(
        resolve => setTimeout(resolve, ms)
    );
}

export async function parallelize<T>(array: T[], producer: Producer<T, Promise<void>>): Promise<void> {
    const promises = new Array(array.length);

    for (let i = 0; i < array.length; i++) {
        promises[i] = producer(array[i]);
    }

    await Promise.all(promises);
}


export function random(a: number, b: number): number {
    return lerp(a, b, Math.random());
}

export function randomInt(a: number, b: number): number {
    return Math.floor(random(a, b));
}

export function randomItem<T>(array: T[]): Opt<T> {
    if (array.length <= 0) {
        return;
    }

    return array[randomInt(0, array.length)];
}



const relativeTimeFormat = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

/**
 * @type {RelativeTimestamp[]}
 */
export const RELATIVE_TIMESTAMPS = [{
    amount: 60,
    name: 'seconds'
}, {
    amount: 60,
    name: 'minutes'
}, {
    amount: 24,
    name: 'hours'
}, {
    amount: 7,
    name: 'days'
}, {
    amount: 4.34524,
    name: 'weeks'
}, {
    amount: 12,
    name: 'months'
}, {
    amount: Number.POSITIVE_INFINITY,
    name: 'years'
}];

export function dateRelative(date: Date): string {
    let duration = (date.getTime() - (new Date()).getTime()) / 1000;

    for (let i = 0; i <= RELATIVE_TIMESTAMPS.length; i++) {
        const relativeTimestamp = RELATIVE_TIMESTAMPS[i];
        if (Math.abs(duration) < relativeTimestamp.amount) {
            return relativeTimeFormat.format(Math.round(duration), relativeTimestamp.name as any);
        }

        duration /= relativeTimestamp.amount;
    }

    return 'Long time ago';
}



export function scrollIntoView(child: HTMLElement, parent: HTMLElement): void {
    const childRect = child.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    const scroll = parent.scrollTop;

    const parentA = scroll;
    const parentB = parentA + parentRect.height;

    let current = child.parentElement;
    let parentTop = 0;

    while (true) {
        parentTop += current?.offsetTop ?? 0;

        if (!is(current) || current !== parent) {
            break;
        }

        current = current.parentElement;
    }

    const childA = child.offsetTop - parentTop;
    const childB = childA + childRect.height;

    if (rangeInRange(parentA, parentB, childA, childB)) {
        return;
    }

    let top = scroll;

    // childA        parentA  childB            parentB
    //    > ########### >       <                  <
    if (childA < parentA) {
        top -= Math.abs(parentA - childA);

        // parentA        childA  parentB            childB
        //    >             >       < ################ <
    } else if (parentB < childB) {
        top += Math.abs(childB - parentB);
    }

    parent.scrollTo({
        top,
        behavior: "smooth"
    });
}

export function findChild(
    child: HTMLElement,
    next: (child: HTMLElement, parent: HTMLElement) => Opt<HTMLElement>,
    skipPredicate: SkipPredicate<HTMLElement>
): Opt<HTMLElement> {
    const parent = child.parentElement;
    if (!is(parent)) {
        return null;
    }

    const len = parent.children.length;
    if (len <= 0) {
        return null;
    }

    if (len <= 1) {
        return child;
    }

    let current: Opt<HTMLElement> = child;
    for (let i = 0; i < len; i++) {
        current = next(current, parent);
        if (!is(current)) {
            return null;
        }

        if (skipPredicate(current)) {
            continue;
        }

        return current;
    }

    return null;
}

export function nextChild(child: HTMLElement, parent: HTMLElement): Opt<HTMLElement> {
    return (child.nextElementSibling ?? parent.children[0]) as Opt<HTMLElement>;
}

export function previousChild(child: HTMLElement, parent: HTMLElement): Opt<HTMLElement> {
    return (child.previousElementSibling ?? parent.children[parent.children.length - 1]) as Opt<HTMLElement>;
}



/**
 * Calls function with provided element. This function expects `fn` to be one valid fully qualified function name
 */
export function getFunction(fn: Opt<string>): Opt<Function> {
    if (!is(fn)) {
        return undefined;
    }

    let context: any = window;

    for (const part of fn.split('.')) {
        context = context[part.trim()];

        if (context === undefined) {
            return undefined;
        }
    }

    return context;
}

/**
 * Parses function call and calls produced function on given element
 *
 * Example: `functionLiteral = 'console.log,custom'` will print `element` to console and call `custom(element)`
 */
export function call(element: HTMLElement, functionLiteral: string): void {
    for (const literal of functionLiteral.split(',')) {
        const fn = getFunction(literal.trim());
        if (!is(fn)) {
            continue;
        }

        fn(element);
    }
}



export function arrayEquals<T, R>(
    array1: T[],
    array2: R[],
    // @ts-ignore
    compareFunction = ((a: T, b: R) => a === b)
): boolean {
    if (array1.length !== array2.length) {
        return false;
    }

    for (let i = 0; i < array1.length; i++) {
        if (!compareFunction(array1[i], array2[i])) {
            return false;
        }
    }

    return true;
}
