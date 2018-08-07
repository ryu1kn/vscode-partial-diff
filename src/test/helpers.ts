import * as td from 'testdouble';

export const throwErrorIfCalled = () => {
    throw new Error('Shouldn\'t have been called');
};

export function mock<T>(c: new (...args: any[]) => T): T {
    return new (td.constructor(c));
}

export function mockType<T>(params?: any): T {
    return Object.assign({} as T, params);
}

export function mockMethods<T>(methods: string[], params?: any): T {
    return Object.assign(td.object(methods) as T, params);
}

export const mockObject = td.object;
export const argCaptor = td.matchers.captor;
export const verify = td.verify;
export const when = td.when;
export const contains = td.matchers.contains;
export const any = td.matchers.anything;
