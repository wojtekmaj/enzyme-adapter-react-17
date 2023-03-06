import { describe, expect, it } from 'vitest';
import React from 'react';

export default function describeGetNode({ Wrap, WrapperName, isShallow }) {
  describe('.getNode()', () => {
    it('throws', () => {
      const wrapper = Wrap(<div />);
      expect(() => wrapper.getNode()).to.throw(
        `${WrapperName}::getNode() is no longer supported. Use ${WrapperName}::${
          isShallow ? 'getElement' : 'instance'
        }() instead`,
      );
    });
  });
}
