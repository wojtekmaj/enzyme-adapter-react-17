import { describe, expect, it } from 'vitest';
import React from 'react';

export default function describeChildAt({ Wrap }) {
  describe('.childAt(index)', () => {
    it('gets a wrapped node at the specified index', () => {
      const wrapper = Wrap(
        <div>
          <div className="bar" />
          <div className="baz" />
        </div>,
      );

      expect(wrapper.childAt(0).hasClass('bar')).to.equal(true);
      expect(wrapper.childAt(1).hasClass('baz')).to.equal(true);
    });
  });
}
