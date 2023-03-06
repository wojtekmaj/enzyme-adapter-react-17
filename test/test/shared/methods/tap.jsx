import { describe, expect, it, vi } from 'vitest';
import React from 'react';

export default function describeTap({ Wrap }) {
  describe('.tap()', () => {
    it('calls the passed function with current Wrapper and returns itself', () => {
      const spy = vi.fn();
      const wrapper = Wrap(
        <ul>
          <li>xxx</li>
          <li>yyy</li>
          <li>zzz</li>
        </ul>,
      ).find('li');
      const result = wrapper.tap(spy);
      expect(spy).toHaveBeenCalledWith(wrapper);
      expect(result).to.equal(wrapper);
    });
  });
}
