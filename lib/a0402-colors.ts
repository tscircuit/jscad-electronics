export type A0402ColorOverrides = {
  body?: string
  terminal?: string
  leftTerminal?: string
  rightTerminal?: string
}

export type A0402ColorProp = string | A0402ColorOverrides

export type ResolvedA0402Colors = {
  bodyColor: string
  leftTerminalColor: string
  rightTerminalColor: string
}

export const resolveA0402Colors = (
  color?: A0402ColorProp,
  colors?: A0402ColorOverrides,
): ResolvedA0402Colors => {
  const colorOverrides = typeof color === "string" || color == null ? {} : color

  const bodyColor =
    colors?.body ??
    (typeof color === "string" ? color : colorOverrides.body) ??
    "#333"

  const terminalFallback = colors?.terminal ?? colorOverrides.terminal ?? "#ccc"

  const leftTerminalColor =
    colors?.leftTerminal ?? colorOverrides.leftTerminal ?? terminalFallback

  const rightTerminalColor =
    colors?.rightTerminal ?? colorOverrides.rightTerminal ?? terminalFallback

  return { bodyColor, leftTerminalColor, rightTerminalColor }
}
