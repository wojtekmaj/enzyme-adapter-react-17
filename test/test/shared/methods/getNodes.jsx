import { describe, expect, it } from 'vitest';
import React from 'react';

export default function describeGetNodes({ Wrap, WrapperName }) {
  describe('.getNodes()', () => {
    it('throws', () => {
      const wrapper = Wrap(<div />);
      expect(() => wrapper.getNodes()).to.throw(
        `${WrapperName}::getNodes() is no longer supported.`,
      );
    });
  });
}
