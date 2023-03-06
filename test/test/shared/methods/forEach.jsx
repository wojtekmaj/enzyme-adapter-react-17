import { describe, expect, it, vi } from 'vitest';
import React from 'react';

export default function describeForEach({ Wrap, Wrapper }) {
  describe('.forEach(fn)', () => {
    it('calls a function for each node in the wrapper', () => {
      const wrapper = Wrap(
        <div>
          <div className="foo bax" />
          <div className="foo bar" />
          <div className="foo baz" />
        </div>,
      );
      const spy = vi.fn();

      wrapper.find('.foo').forEach(spy);

      expect(spy).to.have.property('callCount', 3);
      expect(spy.mock.calls[0][0]).to.be.instanceOf(Wrapper);
      expect(spy.mock.calls[0][0].hasClass('bax')).to.equal(true);
      expect(spy.mock.calls[0][1]).to.equal(0);
      expect(spy.mock.calls[1][0]).to.be.instanceOf(Wrapper);
      expect(spy.mock.calls[1][0].hasClass('bar')).to.equal(true);
      expect(spy.mock.calls[1][1]).to.equal(1);
      expect(spy.mock.calls[2][0]).to.be.instanceOf(Wrapper);
      expect(spy.mock.calls[2][0].hasClass('baz')).to.equal(true);
      expect(spy.mock.calls[2][1]).to.equal(2);
    });
  });
}
