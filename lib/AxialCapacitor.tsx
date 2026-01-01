import { Colorize, Cylinder, Rotate, Sphere, Translate } from "jscad-fiber"

interface AxialCapacitorProps {
  pitch: number
}

export const AxialCapacitor = ({ pitch = 10 }: AxialCapacitorProps) => {
  const heightToCenterOfCapacitor = 0.5 + 4 / 2

  return (
    <>
      <Cylinder height={4} radius={0.5} center={[-pitch / 2, 0, 0.5]} />
      <Sphere
        radius={0.5}
        center={[-pitch / 2, 0, heightToCenterOfCapacitor]}
      />
      <Translate x={-2.5} y={0} z={heightToCenterOfCapacitor}>
        <Rotate rotation={[0, Math.PI / 2, 0]}>
          <Cylinder
            height={pitch}
            radius={0.5}
            center={[0, 0, heightToCenterOfCapacitor]}
          />
          <Colorize color="#d2b48c">
            <Cylinder
              height={5}
              radius={1.3}
              center={[0, 0, heightToCenterOfCapacitor]}
            />
          </Colorize>
        </Rotate>
      </Translate>
      <Cylinder height={4} radius={0.5} center={[pitch / 2, 0, 0.5]} />
      <Sphere radius={0.5} center={[pitch / 2, 0, heightToCenterOfCapacitor]} />
    </>
  )
}
