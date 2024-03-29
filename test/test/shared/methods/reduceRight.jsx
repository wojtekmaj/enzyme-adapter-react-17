import { describe, expect, it, vi } from 'vitest';
import React from 'react';

import { getElementPropSelector, getWrapperPropSelector } from '../../_helpers/selectors';

export default function describeReduceRight({ Wrap, Wrapper }) {
  describe('.reduceRight(fn[, initialValue])', () => {
    it('has the right length', () => {
      expect(Wrapper.prototype.reduceRight).to.have.lengthOf(1);
    });

    it('calls a function with a wrapper for each node in the wrapper in reverse', () => {
      const wrapper = Wrap(
        <div>
          <div className="foo bax" />
          <div className="foo bar" />
          <div className="foo baz" />
        </div>,
      );
      const spy = vi.fn((n) => n + 1);

      wrapper.find('.foo').reduceRight(spy, 0);

      expect(spy).to.have.property('callCount', 3);
      expect(spy.mock.calls[0][1]).to.be.instanceOf(Wrapper);
      expect(spy.mock.calls[0][1].hasClass('baz')).to.equal(true);
      expect(spy.mock.calls[1][1]).to.be.instanceOf(Wrapper);
      expect(spy.mock.calls[1][1].hasClass('bar')).to.equal(true);
      expect(spy.mock.calls[2][1]).to.be.instanceOf(Wrapper);
      expect(spy.mock.calls[2][1].hasClass('bax')).to.equal(true);
    });

    it('accumulates a value', () => {
      const wrapper = Wrap(
        <div>
          <div id="bax" className="foo qoo" />
          <div id="bar" className="foo boo" />
          <div id="baz" className="foo hoo" />
        </div>,
      );
      const result = wrapper.find('.foo').reduceRight((obj, n) => {
        obj[n.prop('id')] = n.prop('className');
        return obj;
      }, {});

      expect(result).to.eql({
        bax: 'foo qoo',
        bar: 'foo boo',
        baz: 'foo hoo',
      });
    });

    it('allows the initialValue to be omitted', () => {
      const one = <div id="bax" className="foo qoo" />;
      const two = <div id="bar" className="foo boo" />;
      const three = <div id="baz" className="foo hoo" />;
      const wrapper = Wrap(
        <div>
          {one}
          {two}
          {three}
        </div>,
      );
      const counter = <noscript id="counter" />;
      const result = wrapper
        .find('.foo')
        .reduceRight((acc, n) => [].concat(acc, n, new Wrapper(counter)))
        .map(getWrapperPropSelector('id'));

      expect(result).to.eql([three, two, counter, one, counter].map(getElementPropSelector('id')));
    });
  });
}
