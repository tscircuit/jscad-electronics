import { Cylinder, Rotate, Sphere } from "jscad-fiber"
import { mm } from "@tscircuit/mm"

interface AxialResistorProps {
  pitch: number
}

export const AxialResistor = ({ pitch = 10 }: AxialResistorProps) => {
  const heightToCenterOfResistor = 0.5 + 4 / 2

  return (
    <>
      <Cylinder height={4} radius={0.5} center={[-pitch / 2, 0, 0.5]} />
      <Sphere radius={0.5} center={[-pitch / 2, 0, heightToCenterOfResistor]} />
      <Cylinder
        height={pitch}
        radius={0.5}
        center={[0, 0, heightToCenterOfResistor]}
        rotation={[0, "90deg", 0]}
      />
      <Cylinder
        height={5}
        color="tan"
        radius={1.3}
        center={[0, 0, heightToCenterOfResistor]}
        rotation={[0, "90deg", 0]}
      />
      <Cylinder height={4} radius={0.5} center={[pitch / 2, 0, 0.5]} />
      <Sphere radius={0.5} center={[pitch / 2, 0, heightToCenterOfResistor]} />
    </>
  )
}
