import type { ChannelBarModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createChannelBarGeom } from "./geometry"
export type ChannelBarProps = ChannelBarModelPropsInput & { color?: string }
export function ChannelBar({ color = "#929da9", ...props }: ChannelBarProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createChannelBarGeom(props)} />
    </Colorize>
  )
}
