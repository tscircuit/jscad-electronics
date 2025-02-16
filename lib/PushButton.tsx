import { Cuboid, Cylinder } from "jscad-fiber"

export const PushButton = () => {
  return (
    <>
      <Cuboid size={[6, 6, 3]} center={[0, 0, 1.5]} color="black" />
      <Cuboid size={[7, 7, 1]} center={[0, 0, 4]} color="silver" />
      <Cylinder height={3} radius={2} center={[0, 0, 6]} color="darkgray" />
      <Cylinder
        height={1}
        radius={0.7}
        center={[-2.5, -2.5, 4.5]}
        color="black"
      />
      <Cylinder
        height={1}
        radius={0.7}
        center={[2.5, -2.5, 4.5]}
        color="black"
      />
      <Cylinder
        height={1}
        radius={0.7}
        center={[-2.5, 2.5, 4.5]}
        color="black"
      />
      <Cylinder
        height={1}
        radius={0.7}
        center={[2.5, 2.5, 4.5]}
        color="black"
      />
      <Cuboid size={[1, 1, 4]} center={[-3, -2, -1]} color="silver" />
      <Cuboid size={[1, 1, 4]} center={[3, -2, -1]} color="silver" />
      <Cuboid size={[1, 1, 4]} center={[-3, 2, -1]} color="silver" />
      <Cuboid size={[1, 1, 4]} center={[3, 2, -1]} color="silver" />
    </>
  )
}
