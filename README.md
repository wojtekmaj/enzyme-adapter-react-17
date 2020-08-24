# @wojtekmaj/enzyme-adapter-react-17

Unofficial adapter for React 17 for [Enzyme](https://enzymejs.github.io/enzyme/).

## Installation

```
npm install --save-dev @wojtekmaj/enzyme-adapter-react-17
```

or, if you're using Yarn:

```
yarn add --dev @wojtekmaj/enzyme-adapter-react-17
```

Finally, you need to configure enzyme to use the adapter you want it to use. To do this, you can use the top level `configure(...)` API.

```js
import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

Enzyme.configure({ adapter: new Adapter() });
```
