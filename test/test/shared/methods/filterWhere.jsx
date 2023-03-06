import { describe, expect, it, vi } from 'vitest';
import React from 'react';

export default function describeFilterWhere({ Wrap, Wrapper }) {
  describe('.filterWhere(predicate)', () => {
    it('filters only the nodes of the wrapper', () => {
      const wrapper = Wrap(
        <div>
          <div className="foo bar" />
          <div className="foo baz" />
          <div className="foo bux" />
        </div>,
      );

      const stub = vi.fn();
      stub.mockReturnValueOnce(false);
      stub.mockReturnValueOnce(true);
      stub.mockReturnValueOnce(false);

      const baz = wrapper.find('.foo').filterWhere(stub);
      expect(baz).to.have.lengthOf(1);
      expect(baz.hasClass('baz')).to.equal(true);
    });

    it('calls the predicate with the wrapped node as the first argument', () => {
      const wrapper = Wrap(
        <div>
          <div className="foo bar" />
          <div className="foo baz" />
          <div className="foo bux" />
        </div>,
      );

      const spy = vi.fn();
      spy.mockReturnValue(true);
      wrapper.find('.foo').filterWhere(spy);
      expect(spy).to.have.property('callCount', 3);
      expect(spy.mock.calls[0][0]).to.be.instanceOf(Wrapper);
      expect(spy.mock.calls[1][0]).to.be.instanceOf(Wrapper);
      expect(spy.mock.calls[2][0]).to.be.instanceOf(Wrapper);
      expect(spy.mock.calls[0][0].hasClass('bar')).to.equal(true);
      expect(spy.mock.calls[1][0].hasClass('baz')).to.equal(true);
      expect(spy.mock.calls[2][0].hasClass('bux')).to.equal(true);
    });
  });
}
