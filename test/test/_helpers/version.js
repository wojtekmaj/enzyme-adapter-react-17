import React from 'react';
import semver from 'semver';

export const VERSION = React.version;

export function is(range) {
  if (/&&/.test(range)) {
    throw new RangeError('&& may not work properly in ranges, apparently');
  }
  return semver.satisfies(VERSION, range);
}

// The shallow renderer in React 17 does not yet support batched updates. When it does,
// we should be able to go un-skip all of the tests that are skipped with this flag.
export const BATCHING = false;
