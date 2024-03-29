import { describe, expect, it } from 'vitest';
import React from 'react';

export default function describeLast({ Wrap }) {
  describe('.last()', () => {
    it('returns the last node in the current set', () => {
      const wrapper = Wrap(
        <div>
          <div className="bar" />
          <div className="bar" />
          <div className="bar" />
          <div className="bar baz" />
        </div>,
      );
      expect(wrapper.find('.bar').last().hasClass('baz')).to.equal(true);
    });
  });
}
