import React from 'react';
import sinon from 'sinon-sandbox';
import { expect } from 'chai';

export default function describeGDSFP({ Wrap }) {
  describe('getDerivedStateFromProps()', () => {
    let spy;

    beforeEach(() => {
      spy = sinon.spy();
    });

    class Spy extends React.Component {
      constructor(...args) {
        super(...args);
        this.state = { state: true };
        spy('constructor');
      }

      shouldComponentUpdate(nextProps, nextState, nextContext) {
        spy('shouldComponentUpdate', {
          prevProps: this.props,
          nextProps,
          prevState: this.state,
          nextState,
          prevContext: this.context,
          nextContext,
        });
        return true;
      }

      componentWillUpdate(nextProps, nextState, nextContext) {
        spy('componentWillUpdate', {
          prevProps: this.props,
          nextProps,
          prevState: this.state,
          nextState,
          prevContext: this.context,
          nextContext,
        });
      }

      componentDidUpdate(prevProps, prevState, prevContext) {
        spy('componentDidUpdate', {
          prevProps,
          nextProps: this.props,
          prevState,
          nextState: this.state,
          prevContext,
          nextContext: this.context,
        });
      }

      render() {
        spy('render');
        return null;
      }
    }

    class CWRP extends Spy {
      componentWillReceiveProps(nextProps, nextContext) {
        spy('componentWillReceiveProps', {
          prevProps: this.props,
          nextProps,
          prevState: this.state,
          nextState: this.state,
          prevContext: this.context,
          nextContext,
        });
      }
    }

    class U_CWRP extends Spy {
      UNSAFE_componentWillReceiveProps(nextProps) {
        spy('UNSAFE_componentWillReceiveProps', {
          prevProps: this.props,
          nextProps,
          prevState: this.state,
          nextState: this.state,
          prevContext: this.context,
          nextContext: undefined,
        });
      }
    }

    class GDSFP extends Spy {
      static getDerivedStateFromProps(props, state) {
        spy('getDerivedStateFromProps', { props, state });
        return {};
      }
    }

    it('calls cWRP when expected', () => {
      const prevProps = { a: 1 };
      const wrapper = Wrap(<CWRP {...prevProps} />);
      expect(spy.args).to.deep.equal([['constructor'], ['render']]);
      spy.resetHistory();

      const foo = {};
      const props = { foo };
      const {
        context: prevContext,
        context: nextContext,
        state: prevState,
        state: nextState,
      } = wrapper.instance();

      wrapper.setProps(props);
      const nextProps = { ...prevProps, ...props };

      const data = {
        prevProps,
        nextProps,
        prevState,
        nextState,
        prevContext,
        nextContext,
      };
      expect(spy.args).to.deep.equal([
        ['componentWillReceiveProps', data],
        ['shouldComponentUpdate', data],
        ['componentWillUpdate', data],
        ['render'],
        [
          'componentDidUpdate',
          {
            ...data,
            prevContext: undefined,
          },
        ],
      ]);
    });

    it('calls UNSAFE_cWRP when expected', () => {
      const prevProps = { a: 1 };
      const wrapper = Wrap(<U_CWRP {...prevProps} />);
      expect(spy.args).to.deep.equal([['constructor'], ['render']]);
      spy.resetHistory();

      const foo = {};
      const props = { foo };
      const {
        context: prevContext,
        context: nextContext,
        state: prevState,
        state: nextState,
      } = wrapper.instance();

      wrapper.setProps(props);
      const nextProps = { ...prevProps, ...props };

      const data = {
        prevProps,
        nextProps,
        prevState,
        nextState,
        prevContext,
        nextContext,
      };
      expect(spy.args).to.deep.equal([
        [
          'UNSAFE_componentWillReceiveProps',
          {
            ...data,
            nextContext: undefined,
          },
        ],
        ['shouldComponentUpdate', data],
        ['componentWillUpdate', data],
        ['render'],
        [
          'componentDidUpdate',
          {
            ...data,
            prevContext: undefined,
          },
        ],
      ]);
    });

    it('calls gDSFP when expected', () => {
      const prevProps = { a: 1 };
      const state = { state: true };
      const wrapper = Wrap(<GDSFP {...prevProps} />);
      expect(spy.args).to.deep.equal([
        ['constructor'],
        [
          'getDerivedStateFromProps',
          {
            props: prevProps,
            state,
          },
        ],
        ['render'],
      ]);
      spy.resetHistory();

      const foo = {};
      const props = { foo };
      const {
        context: prevContext,
        context: nextContext,
        state: prevState,
        state: nextState,
      } = wrapper.instance();

      wrapper.setProps(props);
      const nextProps = { ...prevProps, ...props };

      const data = {
        prevProps,
        nextProps,
        prevState,
        nextState,
        prevContext,
        nextContext,
      };
      expect(spy.args).to.deep.equal([
        [
          'getDerivedStateFromProps',
          {
            props: nextProps,
            state: nextState,
          },
        ],
        ['shouldComponentUpdate', data],
        ['render'],
        [
          'componentDidUpdate',
          {
            ...data,
            prevContext: undefined,
          },
        ],
      ]);
    });

    it('cDU’s nextState differs from `this.state` when gDSFP returns new state', () => {
      class SimpleComponent extends React.Component {
        constructor(props) {
          super(props);
          this.state = { value: props.value };
        }

        static getDerivedStateFromProps(props, state) {
          return props.value === state.value ? null : { value: props.value };
        }

        shouldComponentUpdate(nextProps, nextState) {
          const { value } = this.state;
          return nextState.value !== value;
        }

        render() {
          const { value } = this.state;
          return <input value={value} />;
        }
      }
      const wrapper = Wrap(<SimpleComponent value="initial" />);

      expect(wrapper.find('input').prop('value')).to.equal('initial');

      wrapper.setProps({ value: 'updated' });

      expect(wrapper.find('input').prop('value')).to.equal('updated');
    });
  });
}
