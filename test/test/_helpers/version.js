import React from 'react';

export const VERSION = React.version;

// The shallow renderer in React 17 does not yet support batched updates. When it does,
// we should be able to go un-skip all of the tests that are skipped with this flag.
export const BATCHING = false;
