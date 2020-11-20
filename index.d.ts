import { EnzymeAdapter } from 'enzyme';

declare module "@wojtekmaj/enzyme-adapter-react-17" {
  export default class ReactSeventeenAdapter extends EnzymeAdapter {
    constructor();
  }
}
