import { beforeEach, describe, expect, it, vi } from 'vitest';
import React from 'react';

import { describeIf, itIf } from '../../_helpers';
import { useEffect, useState, Fragment } from '../../_helpers/react-compat';

export default function describeUseEffect({ Wrap, isShallow }) {
  // TODO: enable when the shallow renderer fixes its bug, see https://github.com/facebook/react/issues/15275.
  describeIf(!isShallow, 'hooks: useEffect', () => {
    const timeout = 100;
    function ComponentUsingEffectHook() {
      const [ctr, setCtr] = useState(0);
      useEffect(() => {
        setCtr(1);
        setTimeout(() => {
          setCtr(2);
        }, timeout);
      }, []);
      return <div>{ctr}</div>;
    }

    it('works', () => {
      return new Promise((resolve) => {
        const wrapper = Wrap(<ComponentUsingEffectHook />);

        expect(wrapper.debug()).to.equal(
          isShallow
            ? `<div>
  1
</div>`
            : `<ComponentUsingEffectHook>
  <div>
    1
  </div>
</ComponentUsingEffectHook>`,
        );

        setTimeout(() => {
          wrapper.update();
          expect(wrapper.debug()).to.equal(
            isShallow
              ? `<div>
  2
</div>`
              : `<ComponentUsingEffectHook>
  <div>
    2
  </div>
</ComponentUsingEffectHook>`,
          );
          resolve();
        }, timeout + 1);
      });
    });

    describe('with mount effect', () => {
      const didMountCount = 9;

      function FooCounterWithMountEffect({ initialCount = 0 }) {
        const [count, setCount] = useState(+initialCount);

        useEffect(() => {
          setCount(didMountCount);
        }, []);
        return (
          <Fragment>
            <span className="counter">{count}</span>
          </Fragment>
        );
      }

      it('initial render after did mount effect', () => {
        const wrapper = Wrap(<FooCounterWithMountEffect />);
        expect(wrapper.find('.counter').text()).to.equal(String(didMountCount));
      });
    });

    describe('with async effect', () => {
      it('works with `useEffect`', () => {
        return new Promise((resolve) => {
          const wrapper = Wrap(<ComponentUsingEffectHook />);

          expect(wrapper.debug()).to.equal(
            isShallow
              ? `<div>
  1
</div>`
              : `<ComponentUsingEffectHook>
  <div>
    1
  </div>
</ComponentUsingEffectHook>`,
          );

          setTimeout(() => {
            wrapper.update();
            expect(wrapper.debug()).to.equal(
              isShallow
                ? `<div>
  2
</div>`
                : `<ComponentUsingEffectHook>
  <div>
    2
  </div>
</ComponentUsingEffectHook>`,
            );
            resolve();
          }, timeout + 1);
        });
      });
    });

    it('will receive Props', () => {
      function Foo(props) {
        const [fooVal, setFooVal] = useState('');
        const { initialFooVal } = props;
        useEffect(() => {
          setFooVal(initialFooVal);
        }, [initialFooVal]);

        return (
          <div>
            <p>{fooVal}</p>
          </div>
        );
      }

      const wrapper = Wrap(<Foo />);
      wrapper.setProps({ initialFooVal: 'hey' });
      expect(wrapper.find('p').text()).to.equal('hey');
    });

    describe('on componentDidUpdate & componentDidMount', () => {
      const expectedCountString = (x) => `You clicked ${x} times`;

      let setDocumentTitle;
      function ClickCounterPage() {
        const [count, setCount] = useState(0);

        useEffect(() => {
          setDocumentTitle(expectedCountString(count));
        }, [count]);

        return (
          <div>
            <p>
              {'You clicked '}
              {count}
              {' times'}
            </p>
            <button type="button" onClick={() => setCount(count + 1)}>
              Click me
            </button>
          </div>
        );
      }

      beforeEach(() => {
        setDocumentTitle = vi.fn();
      });

      it('on mount initial render', () => {
        const wrapper = Wrap(<ClickCounterPage />);

        expect(wrapper.find('p').text()).to.eq(expectedCountString(0));
        expect(setDocumentTitle).to.have.property('callCount', 1);
        expect(setDocumentTitle.mock.calls).to.deep.equal([[expectedCountString(0)]]);
      });

      it('on didupdate', () => {
        const wrapper = Wrap(<ClickCounterPage />);

        expect(setDocumentTitle).to.have.property('callCount', 1);
        const [firstCall] = setDocumentTitle.mock.calls;
        expect(firstCall).to.deep.equal([expectedCountString(0)]);
        expect(wrapper.find('p').text()).to.equal(expectedCountString(0));

        wrapper.find('button').invoke('onClick')();

        expect(setDocumentTitle).to.have.property('callCount', 2);
        const [, secondCall] = setDocumentTitle.mock.calls;
        expect(secondCall).to.deep.equal([expectedCountString(1)]);
        expect(wrapper.find('p').text()).to.equal(expectedCountString(1));

        wrapper.find('button').invoke('onClick')();
        wrapper.find('button').invoke('onClick')();

        expect(setDocumentTitle).to.have.property('callCount', 4);
        const [, , , fourthCall] = setDocumentTitle.mock.calls;
        expect(fourthCall).to.deep.equal([expectedCountString(3)]);
        expect(wrapper.find('p').text()).to.equal(expectedCountString(3));
      });
    });

    describe('with cleanup Effect', () => {
      let ChatAPI;

      beforeEach(() => {
        ChatAPI = {
          subscribeToFriendStatus: vi.fn(),
          unsubscribeFromFriendStatus: vi.fn(),
        };
      });

      function FriendStatus({ friend = {} }) {
        const [isOnline, setIsOnline] = useState(null);

        function handleStatusChange(status) {
          setIsOnline(status.isOnline);
        }

        useEffect(() => {
          ChatAPI.subscribeToFriendStatus(friend.id, handleStatusChange);
          return function cleanup() {
            ChatAPI.unsubscribeFromFriendStatus(friend.id, handleStatusChange);
          };
        }, [isOnline]);

        if (isOnline === null) {
          return 'Loading...';
        }
        return isOnline ? 'Online' : 'Offline';
      }

      const friend = { id: 'enzyme' };

      it('on initial mount', () => {
        const wrapper = Wrap(<FriendStatus friend={friend} />);
        expect(wrapper.debug()).to.equal(
          `<FriendStatus friend={{...}}>
  Loading...
</FriendStatus>`,
        );
        expect(wrapper.html()).to.eql('Loading...');
        expect(ChatAPI.subscribeToFriendStatus).toHaveBeenCalledOnce();
        expect(ChatAPI.subscribeToFriendStatus).toHaveBeenCalledWith(
          friend.id,
          expect.any(Function),
        );
      });

      it('simulate status Change', () => {
        const wrapper = Wrap(<FriendStatus friend={friend} />);
        const [[, simulateChange]] = ChatAPI.subscribeToFriendStatus.mock.calls;

        simulateChange({ isOnline: true });

        wrapper.update();
        expect(wrapper.html()).to.eql('Online');
      });

      // TODO: figure out why this test is flaky. Perhaps unmount of useEffect is async?
      itIf.skip(true, 'cleanup on unmount', () => {
        const wrapper = Wrap(<FriendStatus friend={friend} />);

        wrapper.unmount();

        expect(ChatAPI.unsubscribeFromFriendStatus).to.have.property('callCount', 1);
        const [[firstArg]] = ChatAPI.unsubscribeFromFriendStatus.mock.calls;
        expect(firstArg).to.equal(friend.id);
      });
    });
  });
}
