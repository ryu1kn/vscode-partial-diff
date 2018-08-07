import * as td from 'testdouble';

export const throwErrorIfCalled = () => {
  throw new Error("Shouldn't have been called");
};

export const mockObject = td.object;
export const argCaptor = td.matchers.captor;
export const verify = td.verify;
export const when = td.when;
export const contains = td.matchers.contains;
export const any = td.matchers.anything;
