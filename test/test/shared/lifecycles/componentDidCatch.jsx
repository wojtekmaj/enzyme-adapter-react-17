import { describe, expect, it, vi } from 'vitest';
import React from 'react';

import { describeIf, itIf } from '../../_helpers';
import { Fragment } from '../../_helpers/react-compat';

export default function describeCDC({ Wrap, isShallow }) {
  describe('componentDidCatch', () => {
    describe('errors inside an error boundary', () => {
      const errorToThrow = new EvalError('threw an error!');
      // in React 16.0 - 16.2 and 16.9+, and some older nodes, the actual error thrown isn't reported.
      const reactError = new Error(
        "An error was thrown inside one of your components, but React doesn't know what it was. This is likely due to browser flakiness. React does its best to preserve the \"Pause on exceptions\" behavior of the DevTools, which requires some DEV-mode only tricks. It's possible that these don't work in your browser. Try triggering the error in production mode, or switching to a modern browser. If you suspect that this is actually an issue with React, please file an issue.",
      );
      const properErrorMessage = (error) =>
        error instanceof Error &&
        (error.message === errorToThrow.message || error.message === reactError.message);

      const hasFragments = true;
      const MaybeFragment = hasFragments ? Fragment : 'main';

      function Thrower({ throws }) {
        if (throws) {
          throw errorToThrow;
        }
        return null;
      }

      class ErrorBoundary extends React.Component {
        constructor(...args) {
          super(...args);
          this.state = {
            throws: false,
            didThrow: false,
          };
        }

        componentDidCatch(error, info) {
          const { spy } = this.props;
          spy(error, info);
          this.setState({
            throws: false,
            didThrow: true,
          });
        }

        render() {
          const { ThrowerComponent } = this.props;
          const { didThrow, throws } = this.state;
          return (
            <div>
              <MaybeFragment>
                <span>
                  <ThrowerComponent throws={throws} />
                  <div>{didThrow ? 'HasThrown' : 'HasNotThrown'}</div>
                </span>
              </MaybeFragment>
            </div>
          );
        }
      }

      ErrorBoundary.defaultProps = {
        ThrowerComponent: Thrower,
      };

      function ErrorSFC(props) {
        return <ErrorBoundary {...props} />;
      }

      describe('Thrower', () => {
        it('does not throw when `throws` is `false`', () => {
          expect(() => Wrap(<Thrower throws={false} />)).not.to.throw();
        });

        itIf(isShallow, 'throws when `throws` is `true`', () => {
          expect(() => Wrap(<Thrower throws />)).to.throw(errorToThrow);
        });

        itIf(!isShallow, 'throws when `throws` is `true`', () => {
          expect(() => Wrap(<Thrower throws />)).to.throw();
          try {
            Wrap(<Thrower throws />);
            expect(true).to.equal(false, 'this line should not be reached');
          } catch (e) {
            expect(e).to.satisfy(properErrorMessage);
          }
        });
      });

      it('catches a simulated error', () => {
        const spy = vi.fn();
        const wrapper = Wrap(<ErrorBoundary spy={spy} />);

        expect(spy).to.have.property('callCount', 0);

        expect(() => wrapper.find(Thrower).simulateError(errorToThrow)).not.to.throw();

        expect(spy).to.have.property('callCount', 1);

        expect(spy.mock.calls).to.be.an('array').and.have.lengthOf(1);
        const [[actualError, info]] = spy.mock.calls;
        expect(() => {
          throw actualError;
        }).to.throw(errorToThrow);
        expect(info).to.deep.equal({
          componentStack: `
    in Thrower (created by ErrorBoundary)
    in span (created by ErrorBoundary)${
      hasFragments
        ? ''
        : `
    in main (created by ErrorBoundary)`
    }
    in div (created by ErrorBoundary)
    in ErrorBoundary (created by WrapperComponent)
    in WrapperComponent`,
        });
      });

      it('catches a simulated error on memo() component', () => {
        const MemoThrower = React.memo(Thrower);
        const spy = vi.fn();
        const wrapper = Wrap(<ErrorBoundary spy={spy} ThrowerComponent={MemoThrower} />);

        expect(spy).to.have.property('callCount', 0);

        expect(() => wrapper.find(Thrower).simulateError(errorToThrow)).not.to.throw();

        expect(spy).to.have.property('callCount', 1);

        expect(spy.mock.calls).to.be.an('array').and.have.lengthOf(1);
        const [[actualError, info]] = spy.mock.calls;
        expect(() => {
          throw actualError;
        }).to.throw(errorToThrow);
        expect(info).to.deep.equal({
          componentStack: `
    in Memo(Thrower) (created by ErrorBoundary)
    in span (created by ErrorBoundary)${
      hasFragments
        ? ''
        : `
    in main (created by ErrorBoundary)`
    }
    in div (created by ErrorBoundary)
    in ErrorBoundary (created by WrapperComponent)
    in WrapperComponent`,
        });
      });

      it('rerenders on a simulated error', () => {
        const wrapper = Wrap(<ErrorBoundary spy={vi.fn()} />);

        expect(wrapper.find({ children: 'HasThrown' })).to.have.lengthOf(0);
        expect(wrapper.find({ children: 'HasNotThrown' })).to.have.lengthOf(1);

        expect(() => wrapper.find(Thrower).simulateError(errorToThrow)).not.to.throw();

        expect(wrapper.find({ children: 'HasThrown' })).to.have.lengthOf(1);
        expect(wrapper.find({ children: 'HasNotThrown' })).to.have.lengthOf(0);
      });

      itIf(isShallow, 'does not catch errors during Wrapper render', () => {
        const spy = vi.fn();
        const wrapper = Wrap(<ErrorBoundary spy={spy} />);

        expect(spy).to.have.property('callCount', 0);

        wrapper.setState({ throws: true });

        expect(spy).to.have.property('callCount', 0);

        const thrower = wrapper.find(Thrower);
        expect(thrower).to.have.lengthOf(1);
        expect(thrower.props()).to.have.property('throws', true);

        expect(() => thrower.dive()).to.throw(errorToThrow);

        expect(spy).to.have.property('callCount', 0);

        expect(wrapper.find({ children: 'HasThrown' })).to.have.lengthOf(0);
        expect(wrapper.find({ children: 'HasNotThrown' })).to.have.lengthOf(1);
      });

      describeIf(!isShallow, 'descendant components', () => {
        it('rerenders on a simulated error with an SFC root', () => {
          const wrapper = Wrap(<ErrorSFC spy={vi.fn()} />);

          expect(wrapper.find({ children: 'HasThrown' })).to.have.lengthOf(0);
          expect(wrapper.find({ children: 'HasNotThrown' })).to.have.lengthOf(1);

          expect(() => wrapper.find(Thrower).simulateError(errorToThrow)).not.to.throw();

          expect(wrapper.find({ children: 'HasThrown' })).to.have.lengthOf(1);
          expect(wrapper.find({ children: 'HasNotThrown' })).to.have.lengthOf(0);
        });

        it('catches errors during render', () => {
          const spy = vi.fn();
          const wrapper = Wrap(<ErrorBoundary spy={spy} />);

          expect(spy).to.have.property('callCount', 0);

          wrapper.setState({ throws: true });

          expect(spy).to.have.property('callCount', 1);

          expect(spy.mock.calls).to.be.an('array').and.have.lengthOf(1);
          const [[actualError /* , info */]] = spy.mock.calls;
          expect(actualError).to.satisfy(properErrorMessage);
          // FIXME: Fails for @wojtekmaj/enzyme-adapter-react-17
          /*
          expect(info).to.deep.equal({
            componentStack: `
    at Thrower (created by ErrorBoundary)
    at span (created by ErrorBoundary)${
      hasFragments
        ? ''
        : `
    at main (created by ErrorBoundary)`
    }
    at div (created by ErrorBoundary)
    at ErrorBoundary (created by WrapperComponent)
    at WrapperComponent`,
          });
          */
        });

        it('works when the root is an SFC', () => {
          const spy = vi.fn();
          const wrapper = Wrap(<ErrorSFC spy={spy} />);

          expect(spy).to.have.property('callCount', 0);

          wrapper.find(ErrorBoundary).setState({ throws: true });

          expect(spy).to.have.property('callCount', 1);

          expect(spy.mock.calls).to.be.an('array').and.have.lengthOf(1);
          const [[actualError /* , info */]] = spy.mock.calls;
          expect(actualError).to.satisfy(properErrorMessage);

          // FIXME: Fails for @wojtekmaj/enzyme-adapter-react-17
          /*
          expect(info).to.deep.equal({
            componentStack: `
    at Thrower (created by ErrorBoundary)
    at span (created by ErrorBoundary)${
      hasFragments
        ? ''
        : `
    at main (created by ErrorBoundary)`
    }
    at div (created by ErrorBoundary)
    at ErrorBoundary (created by ErrorSFC)
    at ErrorSFC (created by WrapperComponent)
    at WrapperComponent`,
          });
          */
        });
      });
    });
  });
}
