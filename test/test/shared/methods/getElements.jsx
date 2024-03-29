import { describe, expect, it } from 'vitest';
import React from 'react';

export default function describeGetElements({ Wrap }) {
  describe('.getElements()', () => {
    it('returns the wrapped elements', () => {
      const one = <span />;
      const two = <span />;

      class Test extends React.Component {
        render() {
          return (
            <div>
              {one}
              {two}
            </div>
          );
        }
      }

      const wrapper = Wrap(<Test />);
      expect(wrapper.find('span').getElements()).to.deep.equal([one, two]);
    });
  });
}
