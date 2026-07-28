import type { PcbSmtPad } from "circuit-json"
import { FootprintPad } from "./FootprintPad"

interface SolderJumperProps {
  /** number of pads (2 = jumper2, 3 = jumper3) */
  numPads?: number
  padWidth?: number
  padHeight?: number
  gap?: number
}

/**
 * Solder jumper: 2 (or 3) SMD pads separated by a small gap,
 * meant to be bridged with a blob of solder.
 */
export const SolderJumper = ({
  numPads = 2,
  padWidth = 1,
  padHeight = 1.5,
  gap = 0.3,
}: SolderJumperProps) => {
  const totalWidth = numPads * padWidth + (numPads - 1) * gap
  const startX = -totalWidth / 2 + padWidth / 2

  return (
    <>
      {Array.from({ length: numPads }).map((_, i) => {
        const pad: PcbSmtPad = {
          type: "pcb_smtpad",
          pcb_smtpad_id: `solderjumper_${i}`,
          shape: "rect",
          x: startX + i * (padWidth + gap),
          y: 0,
          width: padWidth,
          height: padHeight,
          layer: "top",
          port_hints: [`${i + 1}`],
        }
        return <FootprintPad key={i} pad={pad} isPin1={i === 0} />
      })}
    </>
  )
}

export default SolderJumper
