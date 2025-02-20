import { Cuboid, Cylinder } from "jscad-fiber"

export const PushButton = () => {
  return (
    <>
      <Cuboid size={[7, 7, 3.5]} center={[0, 0, 2]} color="black" />
      <Cuboid size={[7, 7, 0.5]} center={[0, 0, 4]} color="silver" />
      <Cylinder height={3} radius={2} center={[0, 0, 6]} color="black" />
      <Cylinder
        height={0.5}
        radius={0.7}
        center={[-2.5, -2.5, 4.5]}
        color="black"
      />
      <Cylinder
        height={0.5}
        radius={0.7}
        center={[2.5, -2.5, 4.5]}
        color="black"
      />
      <Cylinder
        height={0.5}
        radius={0.7}
        center={[-2.5, 2.5, 4.5]}
        color="black"
      />
      <Cylinder
        height={0.5}
        radius={0.7}
        center={[2.5, 2.5, 4.5]}
        color="black"
      />
      <Cuboid
        size={[0.65, 0.65, 4]}
        center={[-2.25, -3.35, -1]}
        color="silver"
      />
      <Cuboid
        size={[0.65, 0.65, 4]}
        center={[2.25, -3.35, -1]}
        color="silver"
      />
      <Cuboid
        size={[0.65, 0.65, 4]}
        center={[-2.25, 3.35, -1]}
        color="silver"
      />
      <Cuboid size={[0.65, 0.65, 4]} center={[2.25, 3.35, -1]} color="silver" />
    </>
  )
}
