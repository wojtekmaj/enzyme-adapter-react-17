import { lazy } from './react-compat';

function fakeSyncThenable(result) {
  return {
    then(resolve) {
      return resolve({ default: result });
    },
  };
}

export default function getLoadedLazyComponent(wrappedComponent) {
  return lazy(() => fakeSyncThenable(wrappedComponent));
}
