export type Nullable<T> = T | null;

export type Opt<T> = Nullable<T> | undefined;

export type Reference<T> = {
    ref?: T,
}

export type Predicate<T> = (item: T) => boolean;
export type Producer<X, R> = (x: X) => R;