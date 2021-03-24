import React from 'react';
import { Memo } from 'react-is';
import { compareNodeTypeOf } from '@wojtekmaj/enzyme-adapter-utils';
import sinon from 'sinon-sandbox';
import { expect } from 'chai';

/**
 * Simple wrapper around mocha describe which allows a boolean to be passed in first which
 * determines whether or not the test will be run
 */
export function describeIf(test, title, fn) {
  if (typeof test !== 'boolean') {
    throw new TypeError(`a boolean is required, you passed a ${typeof test}`);
  }

  if (test) {
    describe(title, fn);
  } else {
    describe.skip(title, fn);
  }
}

describeIf.only = (test, title, fn) => {
  if (typeof test !== 'boolean') {
    throw new TypeError(`a boolean is required, you passed a ${typeof test}`);
  }

  if (test) {
    describe.only(title, fn);
  } else {
    describe.only('only:', () => {
      describe.skip(title, fn);
    });
  }
};

describeIf.skip = (test, title, fn) => {
  if (typeof test !== 'boolean') {
    throw new TypeError(`a boolean is required, you passed a ${typeof test}`);
  }

  describeIf(false, title, fn);
};

/**
 * Simple wrapper around mocha it which allows a boolean to be passed in first which
 * determines whether or not the test will be run
 */
export function itIf(test, title, fn) {
  if (typeof test !== 'boolean') {
    throw new TypeError(`a boolean is required, you passed a ${typeof test}`);
  }

  if (test) {
    it(title, fn);
  } else {
    it.skip(title, fn);
  }
}

itIf.only = (test, title, fn) => {
  if (typeof test !== 'boolean') {
    throw new TypeError(`a boolean is required, you passed a ${typeof test}`);
  }

  if (test) {
    it.only(title, fn);
  } else {
    it.skip(title, fn);
  }
};

itIf.skip = (test, title, fn) => {
  if (typeof test !== 'boolean') {
    throw new TypeError(`a boolean is required, you passed a ${typeof test}`);
  }

  itIf(false, title, fn);
};

/**
 * Simple wrapper around mocha it which allows an array of possible values to test against.
 * Each test will be wrapped in a try/catch block to handle any errors.
 *
 * @param {Object[]} data
 * @param {String} message
 * @param {Function} factory
 */
export function itWithData(data, message, factory) {
  data.forEach((testCase) => {
    it(`${message} ${testCase.message}`, () => factory(testCase));
  });
}

/**
 * React component used for testing.
 */
class TestHelper extends React.Component {
  render() {
    return <div />;
  }
}

/**
 * Possible values for React render() checks.
 */
export function generateEmptyRenderData() {
  return [
    // Returns true for empty
    { message: 'false', value: false, expectResponse: true },
    { message: 'null', value: null, expectResponse: true },

    // Returns false for empty, valid returns
    { message: 'React component', value: <TestHelper />, expectResponse: false },
    { message: 'React element', value: <span />, expectResponse: false },
    { message: 'React element', value: <noscript />, expectResponse: false },
  ];
}

export function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function isMemo(type) {
  return compareNodeTypeOf(type, Memo);
}

export function argSpy() {
  const spy = sinon.spy();
  spy(1);
  return spy;
}

export function expectArgs(spy, counter, args) {
  spy(counter);
  expect(spy.args).to.deep.equal([
    [counter],
    ...args,
    [counter],
  ]);
  spy.resetHistory();
  spy(counter + 1);
}
