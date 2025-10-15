import { QFN } from "./qfn"

export const QFN32 = ({
  bodyWidth = 5,
  bodyLength = 5,
  bodyThickness = 0.8,
  thermalPadSize = {
    width: 3.2,
    length: 3.2,
  },
  padWidth = 0.25,
  padLength = 0.25,
  pitch = 0.5,
  thermalPadThickness = 0.05,
}: {
  bodyWidth?: number
  bodyLength?: number
  bodyThickness?: number
  thermalPadSize?: {
    width: number
    length: number
  }
  padWidth?: number
  padLength?: number
  pitch?: number
  thermalPadThickness?: number
} = {}) => {
  return (
    <QFN
      num_pins={32}
      bodyWidth={bodyWidth}
      bodyLength={bodyLength}
      bodyThickness={bodyThickness}
      thermalPadSize={thermalPadSize}
      padWidth={padWidth}
      padLength={padLength}
      pitch={pitch}
      thermalPadThickness={thermalPadThickness}
    />
  )
}

export default QFN32