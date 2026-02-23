import { h, Fragment as HFragment } from "./h";

export const Fragment = HFragment;
export const jsx = (type: any, props: any, _key?: any) => h(type, props);
export const jsxs = (type: any, props: any, _key?: any) => h(type, props);

export default { Fragment, jsx, jsxs };
