import { describe, expect, it, vi } from 'vitest';
import React from 'react';

export default function describeCWU({ Wrap }) {
  describe('componentWillUnmount', () => {
    it('calls componentWillUnmount', () => {
      const spy = vi.fn();
      class Foo extends React.Component {
        componentWillUnmount() {
          spy('componentWillUnmount');
        }

        render() {
          spy('render');
          return <div>foo</div>;
        }
      }
      const wrapper = Wrap(<Foo />);
      wrapper.unmount();
      expect(spy.mock.calls).to.deep.equal([['render'], ['componentWillUnmount']]);
    });
  });
}
