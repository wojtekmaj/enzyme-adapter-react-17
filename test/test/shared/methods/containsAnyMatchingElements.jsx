import { describe, expect, it, vi } from 'vitest';
import React from 'react';

export default function describeContainsAnyMatchingElements({ Wrap }) {
  describe('.containsAnyMatchingElements(nodes)', () => {
    it('matches on an array with at least one node that looks like a rendered node', () => {
      const spy1 = vi.fn();
      const spy2 = vi.fn();
      const wrapper = Wrap(
        <div>
          <div onClick={spy1} style={{ fontSize: 12, color: 'red' }}>
            Hello World
          </div>
          <div onClick={spy2} style={{ fontSize: 13, color: 'blue' }}>
            Goodbye World
          </div>
        </div>,
      );
      expect(
        wrapper.containsAnyMatchingElements([
          <div>Bonjour le monde</div>,
          <div>Goodbye World</div>,
        ]),
      ).to.equal(true);
      expect(
        wrapper.containsAnyMatchingElements([
          <div onClick={spy1} style={{ fontSize: 12, color: 'red' }}>
            Bonjour le monde
          </div>,
          <div>Goodbye World</div>,
        ]),
      ).to.equal(true);
      expect(
        wrapper.containsAnyMatchingElements([
          <div>Bonjour le monde</div>,
          <div onClick={spy2} style={{ fontSize: 13, color: 'blue' }}>
            Goodbye World
          </div>,
        ]),
      ).to.equal(true);
      expect(
        wrapper.containsAnyMatchingElements([
          <div onClick={spy1} style={{ fontSize: 12, color: 'red' }}>
            Bonjour le monde
          </div>,
          <div onClick={spy2} style={{ fontSize: 13, color: 'blue' }}>
            Goodbye World
          </div>,
        ]),
      ).to.equal(true);
      expect(
        wrapper.containsAnyMatchingElements([
          <div onClick={spy1}>Bonjour le monde</div>,
          <div onClick={spy2} style={{ fontSize: 13, color: 'blue' }}>
            Goodbye World
          </div>,
        ]),
      ).to.equal(true);
      expect(
        wrapper.containsAnyMatchingElements([
          <div style={{ fontSize: 12, color: 'red' }}>Bonjour le monde</div>,
          <div onClick={spy2} style={{ fontSize: 13, color: 'blue' }}>
            Goodbye World
          </div>,
        ]),
      ).to.equal(true);
      expect(
        wrapper.containsAnyMatchingElements([
          <div onClick={spy1} style={{ fontSize: 12, color: 'red' }}>
            Bonjour le monde
          </div>,
          <div style={{ fontSize: 13, color: 'blue' }}>Goodbye World</div>,
        ]),
      ).to.equal(true);
      expect(
        wrapper.containsAnyMatchingElements([
          <div onClick={spy1} style={{ fontSize: 12, color: 'red' }}>
            Bonjour le monde
          </div>,
          <div onClick={spy2}>Goodbye World</div>,
        ]),
      ).to.equal(true);
      expect(spy1).to.have.property('callCount', 0);
      expect(spy2).to.have.property('callCount', 0);
    });

    it('does not match on an array with no nodes that look like a rendered node', () => {
      const spy1 = vi.fn();
      const spy2 = vi.fn();
      const wrapper = Wrap(
        <div>
          <div onClick={spy1} style={{ fontSize: 12, color: 'red' }}>
            Hello World
          </div>
          <div onClick={spy2} style={{ fontSize: 13, color: 'blue' }}>
            Goodbye World
          </div>
        </div>,
      );
      expect(
        wrapper.containsAnyMatchingElements([
          <div onClick={spy1} style={{ fontSize: 12, color: 'red' }}>
            Bonjour le monde
          </div>,
          <div onClick={spy2}>Au revoir le monde</div>,
        ]),
      ).to.equal(false);
      expect(spy1).to.have.property('callCount', 0);
      expect(spy2).to.have.property('callCount', 0);
    });
  });
}
