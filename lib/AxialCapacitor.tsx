import { mm } from "@tscircuit/mm"
import { Cylinder, Sphere } from "jscad-fiber"

interface AxialCapacitorProps {
  pitch: number
  variant?: string // Make 'variant' optional
}

export const AxialCapacitor = ({
  pitch = 10,
  variant = "vertical",
}: AxialCapacitorProps) => {
  const heightToCenterOfCapacitor = 0.5 + 4 / 2

  return (
    <>
      <Cylinder height={4} radius={0.5} center={[-pitch / 2, 0, 0.5]} />
      <Sphere
        radius={0.5}
        center={[-pitch / 2, 0, heightToCenterOfCapacitor]}
      />
      <Cylinder
        height={pitch / 2 - 1}
        radius={0.5}
        center={[(pitch / 2 + 1) / 2, 0, heightToCenterOfCapacitor]}
        rotation={[0, "90deg", 0]}
      />
      <Sphere radius={0.5} center={[1, 0, heightToCenterOfCapacitor]} />

      <Sphere radius={0.5} center={[-1, 0, heightToCenterOfCapacitor]} />
      <Cylinder
        height={pitch / 2 - 1}
        radius={0.5}
        center={[-(pitch / 2 + 1) / 2, 0, heightToCenterOfCapacitor]}
        rotation={[0, "90deg", 0]}
      />

      {variant === "vertical" ? (
        <>
          <Cylinder
            height={2}
            radius={0.5}
            center={[1, 0, heightToCenterOfCapacitor + 1]}
          />
          <Cylinder
            height={2}
            radius={0.5}
            center={[-1, 0, heightToCenterOfCapacitor + 1]}
          />

          <Cylinder
            height={5}
            color="darkblue"
            radius={2}
            center={[0, 0, heightToCenterOfCapacitor + 2 + 2.5]}
            rotation={[0, 0, 0]}
          />
        </>
      ) : (
        <>
          <Cylinder
            height={5}
            color="darkblue"
            radius={2}
            center={[0, 0, heightToCenterOfCapacitor]}
            rotation={[0, "90deg", 0]}
          />
        </>
      )}

      <Cylinder height={4} radius={0.5} center={[pitch / 2, 0, 0.5]} />
      <Sphere radius={0.5} center={[pitch / 2, 0, heightToCenterOfCapacitor]} />
    </>
  )
}
