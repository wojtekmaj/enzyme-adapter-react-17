import { describe, expect } from 'vitest';
import React from 'react';

import { itIf } from '../../_helpers';

import { useLayoutEffect, useState } from '../../_helpers/react-compat';

export default function describeUseLayoutEffect({ Wrap, isShallow }) {
  describe('hooks: useLayoutEffect', () => {
    function ComponentUsingLayoutEffectHook() {
      const [ctr, setCtr] = useState(0);
      useLayoutEffect(() => {
        setCtr(1);
        setTimeout(() => {
          setCtr(2);
        }, 100);
      }, []);
      return <div>{ctr}</div>;
    }

    // TODO: enable when https://github.com/facebook/react/issues/15275 is fixed
    itIf(!isShallow, 'works with `useLayoutEffect`', () => {
      return new Promise((resolve) => {
        const wrapper = Wrap(<ComponentUsingLayoutEffectHook />);

        expect(wrapper.debug()).to.equal(
          isShallow
            ? `<div>
  1
</div>`
            : `<ComponentUsingLayoutEffectHook>
  <div>
    1
  </div>
</ComponentUsingLayoutEffectHook>`,
        );

        setTimeout(() => {
          wrapper.update();
          expect(wrapper.debug()).to.equal(
            isShallow
              ? `<div>
  2
</div>`
              : `<ComponentUsingLayoutEffectHook>
  <div>
    2
  </div>
</ComponentUsingLayoutEffectHook>`,
          );
          resolve();
        }, 100);
      });
    });
  });
}
