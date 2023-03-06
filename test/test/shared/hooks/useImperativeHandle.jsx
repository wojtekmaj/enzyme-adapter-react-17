import { describe, expect, it, vi } from 'vitest';
import React from 'react';

import { useImperativeHandle, useRef, forwardRef } from '../../_helpers/react-compat';

export default function describeUseImperativeHandle({ Wrap, isShallow }) {
  describe('hooks: useImperativeHandle', () => {
    function Computer({ compute }, ref) {
      const computerRef = useRef({ compute });
      useImperativeHandle(ref, () => ({
        compute: () => {
          computerRef.current.compute();
        },
      }));
      return <div />;
    }

    const FancyComputer = forwardRef(Computer);

    class ParentComputer extends React.Component {
      componentDidMount() {
        if (this.ref) {
          this.ref.compute();
        }
      }

      render() {
        return (
          <FancyComputer
            ref={(ref) => {
              this.ref = ref;
            }}
            {...this.props}
          />
        );
      }
    }

    it('able to call method with imperative handle', () => {
      const compute = vi.fn();
      Wrap(<ParentComputer compute={compute} />);

      expect(compute).to.have.property('callCount', isShallow ? 0 : 1);
    });
  });
}
