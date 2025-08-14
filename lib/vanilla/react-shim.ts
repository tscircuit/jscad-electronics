// Minimal shim so components that import React hooks won't pull React in vanilla builds.
import { h, Fragment as HFragment } from "./h"

export const useMemo = <T>(factory: () => T, _deps?: any[]): T => factory()

// Support automatic JSX runtime shape when some files are compiled that way.
// esbuild/babel may emit calls to jsx/jsxs from "react/jsx-runtime".
export const Fragment = HFragment
export const jsx = (type: any, props: any, _key?: any) => h(type, props)
export const jsxs = (type: any, props: any, _key?: any) => h(type, props)

export default { useMemo, Fragment, jsx, jsxs }
