import { describe, expect, it } from 'vitest';
import React from 'react';

export default function describeFilter({ Wrap }) {
  describe('.filter(selector)', () => {
    it('returns a new wrapper of just the nodes that matched the selector', () => {
      const wrapper = Wrap(
        <div>
          <div className="foo bar baz" />
          <div className="foo" />
          <div className="bar baz">
            <div className="foo bar baz" />
            <div className="foo" />
          </div>
          <div className="baz" />
          <div className="foo bar" />
        </div>,
      );

      expect(wrapper.find('.foo').filter('.bar')).to.have.lengthOf(3);
      expect(wrapper.find('.bar').filter('.foo')).to.have.lengthOf(3);
      expect(wrapper.find('.bar').filter('.bax')).to.have.lengthOf(0);
      expect(wrapper.find('.foo').filter('.baz.bar')).to.have.lengthOf(2);
    });

    it('only looks in the current wrappers nodes, not their children', () => {
      const wrapper = Wrap(
        <div>
          <div className="foo">
            <div className="bar" />
          </div>
          <div className="foo bar" />
        </div>,
      );

      expect(wrapper.find('.foo').filter('.bar')).to.have.lengthOf(1);
    });
  });
}
