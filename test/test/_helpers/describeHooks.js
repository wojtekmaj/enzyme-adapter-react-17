import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { asyncForEach } from '@wojtekmaj/async-array-utils';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const workingDirectory = path.join(dirname, '..', 'shared', 'hooks');
const filenames = await fs.readdir(workingDirectory);
const map = new Map();
await asyncForEach(filenames, async (methodFilename) => {
  const methodName = path.basename(methodFilename, '.jsx');
  map.set(methodName, (await import(path.join(workingDirectory, methodFilename))).default);
});

export default function describeHooks({ Wrap, Wrapper }, ...hooks) {
  const WrapperName = Wrapper.name;
  const isShallow = WrapperName === 'ShallowWrapper';
  const isMount = WrapperName === 'ReactWrapper';
  const hasDOM = isMount;
  const makeDOMElement = () => (hasDOM ? global.document.createElement('div') : { nodeType: 1 });

  hooks.forEach((hook) => {
    if (!map.has(hook)) {
      throw new Error(`Hook ${hook} does not exist`);
    }

    const hookModule = map.get(hook);

    hookModule({
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
