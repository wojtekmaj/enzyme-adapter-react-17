import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import React from 'react';

export default function describeLast({ Wrap }) {
  describe('.isEmpty()', () => {
    let warningStub;
    let fooNode;
    let missingNode;

    beforeEach(() => {
      warningStub = vi.spyOn(console, 'warn');
      const wrapper = Wrap(<div className="foo" />);
      fooNode = wrapper.find('.foo');
      missingNode = wrapper.find('.missing');
    });
    afterEach(() => {
      warningStub.restore();
    });

    it('displays a deprecation warning', () => {
      fooNode.isEmpty();
      expect(warningStub).toHaveBeenCalledWith(
        'Enzyme::Deprecated method isEmpty() called, use exists() instead.',
      );
    });

    it('calls exists() instead', () => {
      const existsSpy = vi.fn();
      fooNode.exists = existsSpy;
      expect(fooNode.isEmpty()).to.equal(true);
      expect(existsSpy).to.have.property('called', true);
    });

    it('returns true if wrapper is empty', () => {
      expect(fooNode.isEmpty()).to.equal(false);
      expect(missingNode.isEmpty()).to.equal(true);
    });
  });
}
