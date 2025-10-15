import { QFN } from "./qfn"

export const QFN32 = (props: Omit<Parameters<typeof QFN>[0], "num_pins">) => {
  return (
    <QFN
      num_pins={32}
      bodyWidth={5}
      bodyLength={5}
      pitch={0.5}
      padWidth={0.25}
      padLength={0.75}
      thermalPadSize={{
        width: 3.1,
        length: 3.1,
      }}
      {...props}
    />
  )
}

export default QFN32
