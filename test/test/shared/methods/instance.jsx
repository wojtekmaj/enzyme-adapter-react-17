import { describe, expect, it } from 'vitest';
import React from 'react';

import { itIf } from '../../_helpers';

export default function describeInstance({ Wrap, WrapperName, isShallow }) {
  describe('.instance()', () => {
    it('returns the component instance', () => {
      class Foo extends React.Component {
        render() {
          return <div />;
        }
      }

      const wrapper = Wrap(<Foo />);
      expect(wrapper.instance()).to.be.instanceof(Foo);
      expect(wrapper.instance().render).to.equal(Foo.prototype.render);
    });

    describe('stateless function components (SFCs)', () => {
      function SFC() {
        return <div />;
      }

      it('has no instance', () => {
        const wrapper = Wrap(<SFC />);
        expect(wrapper.instance()).to.equal(null);
      });

      itIf(false, 'has an instance', () => {
        const wrapper = Wrap(<SFC />);
        expect(wrapper.instance()).not.to.equal(null);
      });
    });

    itIf(!isShallow, 'throws when wrapping multiple elements', () => {
      class Test extends React.Component {
        render() {
          return (
            <div>
              <span />
              <span />
            </div>
          );
        }
      }

      const wrapper = Wrap(<Test />).find('span');
      expect(() => wrapper.instance()).to.throw(
        Error,
        'Method “instance” is meant to be run on 1 node. 2 found instead.',
      );
    });

    itIf(isShallow, 'throws if called on something other than the root node', () => {
      class Foo extends React.Component {
        render() {
          return (
            <div>
              <a />
            </div>
          );
        }
      }

      const wrapper = Wrap(<Foo />);
      const div = wrapper.find('div');

      expect(() => div.instance()).to.throw(
        Error,
        `${WrapperName}::instance() can only be called on the root`,
      );
    });
  });
}
