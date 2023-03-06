import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { asyncForEach } from '@wojtekmaj/async-array-utils';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const workingDirectory = path.join(dirname, '..', 'shared', 'lifecycles');
const filenames = await fs.readdir(workingDirectory);
const map = new Map();
await asyncForEach(filenames, async (methodFilename) => {
  const methodName = path.basename(methodFilename, '.jsx');
  map.set(methodName, (await import(path.join(workingDirectory, methodFilename))).default);
});

export default function describeLifecycles({ Wrap, Wrapper }, ...lifecycles) {
  const WrapperName = Wrapper.name;
  const isShallow = WrapperName === 'ShallowWrapper';
  const isMount = WrapperName === 'ReactWrapper';
  const hasDOM = isMount;
  const makeDOMElement = () => (hasDOM ? global.document.createElement('div') : { nodeType: 1 });

  lifecycles.forEach((lifecycle) => {
    if (!map.has(lifecycle)) {
      throw new Error(`Lifecycle ${lifecycle} does not exist`);
    }

    const lifecycleModule = map.get(lifecycle);

    lifecycleModule({
      Wrap,
      WrapRendered: isShallow ? Wrap : (...args) => Wrap(...args).children(),
      Wrapper,
      WrapperName,
      isShallow,
      isMount,
      hasDOM,
      makeDOMElement,
    });
  });
}
