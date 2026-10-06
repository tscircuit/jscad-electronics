import { componentMaterials } from "./materials"
import type { SheetMetalModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createSheetMetalMesh } from "./mechanical/sheet-metal-mesh"
import { indexedMeshToGeom3 } from "./mechanical/indexedMeshToGeom3"

export type SheetMetalProps = SheetMetalModelPropsInput & { color?: string }

/** Base midsurface Z=0; bends and flanges rise along +Z. Dimensions in mm. */
export function createSheetMetalGeom(input: SheetMetalModelPropsInput) {
  return indexedMeshToGeom3(createSheetMetalMesh(input))
}

export function SheetMetal({ color = "#737e8f", ...props }: SheetMetalProps) {
  return (
    <Colorize color={color} material={componentMaterials.brushedMetal}>
      <Custom geometry={createSheetMetalGeom(props)} />
    </Colorize>
  )
}

export { createSheetMetalMesh } from "./mechanical/sheet-metal-mesh"
export type { SheetMetalMesh } from "./mechanical/sheet-metal-mesh"
