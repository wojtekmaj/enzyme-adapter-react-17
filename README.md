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

### Note for npm v7 users

enzyme's dependencies have not yet been updated to declare React 17 in peerDependencies. You need to add `--legacy-peer-deps` to the install command for it to work correctly.

## Configuration

Finally, you need to configure enzyme to use the adapter you want it to use. To do this, you can use the top level `configure(...)` API.

```js
import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

Enzyme.configure({ adapter: new Adapter() });
```
