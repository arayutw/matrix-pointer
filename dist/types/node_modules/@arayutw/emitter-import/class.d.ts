type Type = string | number | symbol;
type Handler<T1, T2, T3> = (event: {
    target: T1;
    type: T2;
} & T3) => any;
type Options = {
    once: boolean;
};
export default class Emitter<T1, T2 extends Record<Type, {
    [key: string]: any;
}>> {
    private readonly Emitter$items;
    on<U extends keyof T2>(name: U, handler: Handler<T1, U, T2[U]>, options?: Options): void;
    off<U extends keyof T2 | "*">(name: U, handler?: Handler<T1, U, T2[U]>): void;
    emit<U extends keyof T2>(name: U, event: T2[U]): void;
}
export {};
