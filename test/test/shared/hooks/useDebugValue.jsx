import { describe, expect, it } from 'vitest';
import React from 'react';
import sinon from 'sinon';

import { useDebugValue } from '../../_helpers/react-compat';

export default function describeUseDebugValue({ Wrap }) {
  // TODO: `useDebugValue`: test using react debug tools, verify it actually works, and try to add it to `.debug`
  describe('hooks: useDebugValue', () => {
    function ComponentUsingDebugValue({ value }) {
      useDebugValue(`debug value: ${value}`);

      return <div>{value}</div>;
    }

    function ComponentUsingDebugValueAndCallback({ value, fn = (x) => `debug value: ${x}` }) {
      useDebugValue(value, fn);

      return <div>{value}</div>;
    }

    it('can render component using useDebugValue', () => {
      const value = 'foo';
      const wrapper = Wrap(<ComponentUsingDebugValue value={value} />);
      expect(wrapper.find('div').prop('children')).to.equal(value);
    });

    it('can render component using useDebugValue and callback', () => {
      const value = 'foo';
      const spy = sinon.spy();
      const wrapper = Wrap(<ComponentUsingDebugValueAndCallback value={value} fn={spy} />);
      expect(wrapper.find('div').prop('children')).to.equal(value);
      expect(spy).to.have.property('callCount', 0);
    });
  });
}
