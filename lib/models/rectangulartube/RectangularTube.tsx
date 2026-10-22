import type { RectangularTubeModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber/headless"
import { createRectangularTubeConstruction } from "./geometry"
export type RectangularTubeProps = RectangularTubeModelPropsInput & {
  color?: string
}
export function RectangularTube({
  color = "#929da9",
  ...props
}: RectangularTubeProps) {
  const { solid, outer, inner, topPath, leftPath } =
    createRectangularTubeConstruction(props)
  return (
    <>
      <Colorize color={color}>
        <Custom geometry={solid} />
      </Colorize>
      <Custom name="outer_profile" geometry={outer} reference />
      <Custom name="inner_profile" geometry={inner} reference />
      {topPath && <Custom name="outer_top" geometry={topPath} reference />}
      {leftPath && <Custom name="outer_left" geometry={leftPath} reference />}
    </>
  )
}
