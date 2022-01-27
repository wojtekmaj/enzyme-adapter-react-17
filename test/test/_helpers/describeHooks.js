export default function describeHooks({ Wrap, Wrapper }, ...hooks) {
  const WrapperName = Wrapper.name;
  const isShallow = WrapperName === 'ShallowWrapper';
  const isMount = WrapperName === 'ReactWrapper';
  const hasDOM = isMount;
  const makeDOMElement = () => (hasDOM ? global.document.createElement('div') : { nodeType: 1 });

  hooks.forEach((hook) => {
    require(`../shared/hooks/${hook}`).default({
      hasHooks: true,
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
