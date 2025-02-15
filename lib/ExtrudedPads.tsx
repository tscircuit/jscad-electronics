import type { AnyCircuitElement } from "circuit-json"
import { fp } from "@tscircuit/footprinter"
import { FootprintPad } from "./FootprintPad"
import { FootprintPlatedHole } from "./FootprintPlatedHole"

export const ExtrudedPads = ({
  circuitJson,
  footprint,
}: { circuitJson?: AnyCircuitElement[]; footprint?: string }) => {
  if (!circuitJson && footprint) {
    circuitJson = fp.string(footprint).circuitJson() as AnyCircuitElement[]
  }

  if (!circuitJson)
    throw new Error("No circuit json or footprint provided to ExtrudedPads")

  return (
    <>
      {circuitJson
        .filter((s) => s.type === "pcb_smtpad")
        .map((pad, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey:
          <FootprintPad key={i} pad={pad} />
        ))}
      {circuitJson
        .filter((s) => s.type === "pcb_plated_hole")
        .map((hole, i) => {
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey:
            <FootprintPlatedHole key={i} hole={hole} />
          )
        })}
    </>
  )
}
