import { describe, expect, it } from 'vitest';
import React from 'react';

import { itWithData, generateEmptyRenderData, itIf } from '../../_helpers';

import { createClass, memo } from '../../_helpers/react-compat';

export default function describeIsEmptyRender({ Wrap, WrapRendered, isShallow }) {
  describe('.isEmptyRender()', () => {
    class RenderChildren extends React.Component {
      render() {
        const { children } = this.props;
        return children;
      }
    }

    class RenderNull extends React.Component {
      render() {
        return null;
      }
    }

    const emptyRenderValues = generateEmptyRenderData();

    itWithData(emptyRenderValues, 'when a React createClass component returns: ', (data) => {
      const Foo = createClass({
        render() {
          return data.value;
        },
      });
      const wrapper = Wrap(<Foo />);
      expect(wrapper.isEmptyRender()).to.equal(data.expectResponse);
    });

    itWithData(emptyRenderValues, 'when an ES2015 class component returns: ', (data) => {
      class Foo extends React.Component {
        render() {
          return data.value;
        }
      }
      const wrapper = Wrap(<Foo />);
      expect(wrapper.isEmptyRender()).to.equal(data.expectResponse);
    });

    describe('nested nodes', () => {
      it(`returns ${!isShallow} for nested elements that return null`, () => {
        const wrapper = Wrap(
          <RenderChildren>
            <RenderNull />
          </RenderChildren>,
        );

        expect(wrapper.isEmptyRender()).to.equal(!isShallow);
      });

      it('returns false for multiple nested elements that all return null', () => {
        const wrapper = Wrap(
          <RenderChildren>
            <div />
          </RenderChildren>,
        );

        expect(wrapper.isEmptyRender()).to.equal(false);
      });

      it('returns false for multiple nested elements where one fringe returns a non null value', () => {
        const wrapper = Wrap(
          <RenderChildren>
            <div>Hello</div>
          </RenderChildren>,
        );

        expect(wrapper.isEmptyRender()).to.equal(false);
      });

      it('returns false for multiple nested elements that all return null', () => {
        const wrapper = Wrap(
          <RenderChildren>
            <RenderNull />
            <RenderChildren>
              <RenderNull />
              <div />
            </RenderChildren>
          </RenderChildren>,
        );

        expect(wrapper.isEmptyRender()).to.equal(false);
      });

      it('returns false for multiple nested elements where one fringe returns a non null value', () => {
        const wrapper = Wrap(
          <RenderChildren>
            <RenderNull />
            <RenderChildren>
              <RenderNull />
              <RenderNull />
            </RenderChildren>
            <RenderChildren>
              <RenderNull />
              <RenderChildren>
                <RenderNull />
                <RenderNull />
                <RenderNull />
                <div>Hello</div>
              </RenderChildren>
            </RenderChildren>
          </RenderChildren>,
        );

        expect(wrapper.isEmptyRender()).to.equal(false);
      });

      it(`returns ${!isShallow} for multiple nested elements where all values are null`, () => {
        const wrapper = Wrap(
          <RenderChildren>
            <RenderNull />
            <RenderChildren>
              <RenderNull />
              <RenderNull />
            </RenderChildren>
            <RenderChildren>
              <RenderNull />
              <RenderChildren>
                <RenderNull />
                <RenderNull />
                <RenderNull />
              </RenderChildren>
            </RenderChildren>
          </RenderChildren>,
        );

        expect(wrapper.isEmptyRender()).to.equal(!isShallow);
      });
    });

    it('does not return true for HTML elements', () => {
      const wrapper = Wrap(<div className="bar baz" />);
      expect(wrapper.isEmptyRender()).to.equal(false);
    });

    describe('stateless function components (SFCs)', () => {
      itWithData(emptyRenderValues, 'when a component returns: ', (data) => {
        function Foo() {
          return data.value;
        }
        const wrapper = Wrap(<Foo />);
        expect(wrapper.isEmptyRender()).to.equal(data.expectResponse);
      });
    });

    itIf(isShallow, 'returns false for > 1 elements', () => {
      class RendersThree extends React.Component {
        render() {
          return (
            <div>
              <RenderNull />
              <RenderNull />
              <RenderNull />
            </div>
          );
        }
      }

      const wrapper = WrapRendered(<RendersThree />);
      const elements = wrapper.find(RenderNull);
      expect(elements).to.have.lengthOf(3);
      expect(elements.isEmptyRender()).to.equal(false);
    });

    it('works on a memoized functional component', () => {
      const Component = memo(() => null);
      const wrapper = Wrap(<Component />);
      expect(wrapper.debug()).to.equal(isShallow ? '' : '<Memo() />');
      expect(wrapper.isEmptyRender()).to.equal(true);
    });
  });
}
