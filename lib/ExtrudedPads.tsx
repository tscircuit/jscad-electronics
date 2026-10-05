import { mp } from "@tscircuit/modelprinter"
import type { AnyCircuitElement } from "circuit-json"
import { fp } from "@tscircuit/footprinter"
import { FootprintPad } from "./FootprintPad"
import { FootprintPlatedHole } from "./FootprintPlatedHole"

export const ExtrudedPads = ({
  circuitJson,
  footprint,
}: { circuitJson?: AnyCircuitElement[]; footprint?: string }) => {
  // Mechanical models do not have PCB copper pads.
  if (
    !circuitJson &&
    footprint &&
    [
      "nema",
      "hexsocketbolt",
      "hexnut",
      "sheetmetal",
      "spurgear",
      "wormgear",
      "helicalgear",
    ].includes(mp.string(footprint.split("_", 1)[0]!).params().fn)
  ) {
    mp.string(footprint).json() // Validate mechanical parameters before returning.
    return null
  }
  if (!circuitJson && footprint) {
    circuitJson = fp.string(footprint).circuitJson() as AnyCircuitElement[]
  }

  if (!circuitJson)
    throw new Error("No circuit json or footprint provided to ExtrudedPads")

  return (
    <>
      {circuitJson
        .filter((s) => s.type === "pcb_smtpad")
        .map((pad, i) => {
          const isPin1 = pad.port_hints?.includes("1")
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey:
            <FootprintPad key={i} pad={pad} isPin1={isPin1} />
          )
        })}
      {circuitJson
        .filter((s) => s.type === "pcb_plated_hole")
        .map((hole, i) => {
          const isPin1 = hole.port_hints?.includes("1")
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey:
            <FootprintPlatedHole key={i} hole={hole} isPin1={isPin1} />
          )
        })}
    </>
  )
}
