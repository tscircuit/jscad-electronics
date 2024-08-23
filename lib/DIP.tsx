import { Polygon, ExtrudeLinear, Rotate } from "jscad-fiber"

// M 0 0 L 1 2 L 5 2 L 6 0 L 5 -2 L 1 -2
// DIP components look like this:
// https://github.com/nophead/NopSCADlib/raw/master/tests/png/dip.png

export const DIPPinLeg = ({ x, y }: { x: number; y: number }) => {
  return null
}

export const Dip = ({ numPins = 8 }: { numPins?: number }) => {
  return (
    <ExtrudeLinear height={10}>
      <Polygon
        points={[
          [0, 0],
          [1, 2],
          [5, 2],
          [6, 0],
          [5, -2],
          [1, -2],
        ]}
      />
    </ExtrudeLinear>
  )
}

export const DualInlinePackage = Dip
