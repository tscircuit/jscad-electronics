import type { AnySoupElement } from "@tscircuit/soup"
import { fp } from "@tscircuit/footprinter"
import { FootprintPad } from "./FootprintPad"
import { FootprintPlatedHole } from "./FootprintPlatedHole"
import { Union } from "jscad-fiber"

export const ExtrudedPads = ({
  soup,
  footprint,
}: { soup?: AnySoupElement[]; footprint?: string }) => {
  if (!soup && footprint) {
    soup = fp.string(footprint).soup()
  }

  if (!soup) throw new Error("No soup or footprint provided to ExtrudedPads")

  return (
    <>
      {soup
        .filter((s) => s.type === "pcb_smtpad")
        .map((pad, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey:
          <FootprintPad key={i} pad={pad} />
        ))}
      {soup
        .filter((s) => s.type === "pcb_plated_hole")
        .map((hole, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey:
          <FootprintPlatedHole key={i} hole={hole} />
        ))}
    </>
  )
}
