export type VNode = {
  type: any;
  props: Record<string, any>;
  children?: any[];
};

export const Fragment = Symbol("Fragment");

export function h(type: any, props: any, ...restChildren: any[]): VNode {
  const provided = restChildren.length
    ? restChildren
    : props?.children !== undefined
      ? [props.children]
      : [];
  const flatChildren: any[] = [];
  const stack = (Array.isArray(provided) ? provided : [provided]).flat(
    Infinity,
  ) as any[];
  for (const ch of stack) {
    if (ch == null || ch === false) continue;
    if (Array.isArray(ch)) flatChildren.push(...ch);
    else flatChildren.push(ch);
  }
  return {
    type,
    props:
      (props && props.children !== undefined
        ? { ...props, children: undefined }
        : props) || {},
    children: flatChildren,
  };
}
