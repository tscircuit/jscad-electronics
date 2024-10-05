import { Cylinder, Cuboid, Sphere } from "jscad-fiber"
import { mm } from "@tscircuit/mm"

interface AxialLedProps {
  pitch: number
}

export const AxialLed = ({ pitch = 10 }: AxialLedProps) => {
  const heightToCenterOfLed = 0.5 + 4 / 2

  return (
    <>
      <Cylinder height={4} radius={0.5} center={[-pitch / 2, 0, 0.5]} />
      <Sphere radius={0.5} center={[-pitch / 2, 0, heightToCenterOfLed]} />
      <Cylinder
        height={pitch}
        radius={0.5}
        center={[0, 0, heightToCenterOfLed]}
        rotation={[0, "90deg", 0]}
      />

      <Cuboid size={[2.5, 2.5, 1]} center={[0, 0, heightToCenterOfLed]} color="red" />
      <Cylinder height={2} radius={1} center={[0, 0, heightToCenterOfLed + 1]} color="red" />
      <Sphere radius={1} center={[0, 0, heightToCenterOfLed + 2]} color="red" />

      <Cylinder height={4} radius={0.5} center={[pitch / 2, 0, 0.5]} />
      <Sphere radius={0.5} center={[pitch / 2, 0, heightToCenterOfLed]} />
    </>
  )
}
