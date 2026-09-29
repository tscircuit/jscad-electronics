import { Colorize, Cuboid, Hull, Subtract } from "jscad-fiber"

export interface Ws2812b4020Props {
  bodyColor?: string
  contactColor?: string
  lensColor?: string
}

/** Worldsemi WS2812B-4020 side-view RGB LED, dimensions in millimeters. */
export function Ws2812b4020({
  bodyColor = "#f0eee7",
  contactColor = "#bdbfc1",
  lensColor = "#fff2c0",
}: Ws2812b4020Props) {
  return (
    <>
      <Colorize color={bodyColor}>
        <Subtract>
          <Hull>
            <Cuboid size={[3.98, 0.01, 1.7]} center={[0, -0.85, 1]} />
            <Cuboid size={[3.98, 0.01, 2]} center={[0, 0, 1]} />
            <Cuboid size={[3.98, 0.01, 1.92]} center={[0, 0.85, 1]} />
          </Hull>
          <Hull>
            <Cuboid size={[2.4, 0.01, 1]} center={[0, 0.66, 1]} />
            <Cuboid size={[2.8, 0.01, 1.4]} center={[0, 0.86, 1]} />
          </Hull>
          <Cuboid size={[3.2, 0.85, 0.3]} center={[0, -0.425, 0.15]} />
          <Cuboid size={[3.2, 0.15, 0.7]} center={[0, -0.775, 0.35]} />
        </Subtract>
      </Colorize>
      <Colorize color={contactColor}>
        {[-1.275, -0.425, 0.425, 1.275].map((x) => (
          <Cuboid
            key={x}
            size={[0.5, 0.85, 0.13]}
            center={[x, -0.425, 0.065]}
          />
        ))}
      </Colorize>
      <Colorize color={lensColor}>
        <Cuboid size={[2.1, 0.001, 0.9]} center={[0, 0.657, 1]} />
      </Colorize>
    </>
  )
}
