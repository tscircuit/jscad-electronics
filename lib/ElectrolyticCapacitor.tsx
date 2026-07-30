import { Cuboid, Cylinder } from "jscad-fiber"

export interface ElectrolyticCapacitorProps {
  pitch?: number
  diameter?: number
  height?: number
  leadDiameter?: number
  standoffHeight?: number
  leadEmbedDepth?: number
  leadInsertionDepth?: number
  bodyColor?: string
  stripeColor?: string
}

export const ElectrolyticCapacitor = ({
  pitch = 7.5,
  diameter = 10.5,
  height,
  leadDiameter = 0.6,
  standoffHeight = 8,
  leadEmbedDepth = 0.75,
  leadInsertionDepth = 4,
  bodyColor = "#202b3c",
  stripeColor = "#c7c9cc",
}: ElectrolyticCapacitorProps) => {
  const bodyHeight = height ?? diameter * 1.2
  const bodyRadius = diameter / 2
  const bodyCenterZ = standoffHeight + bodyHeight / 2
  const bodyTopZ = standoffHeight + bodyHeight
  const leadTopZ = standoffHeight + leadEmbedDepth
  const leadBottomZ = -leadInsertionDepth
  const leadHeight = leadTopZ - leadBottomZ
  const leadCenterZ = (leadTopZ + leadBottomZ) / 2
  const leadRadius = leadDiameter / 2
  const bungHeight = Math.min(0.6, bodyHeight * 0.08)
  const topDiscHeight = Math.min(0.2, bodyHeight * 0.03)
  const polarityStripeWidth = Math.min(1.6, diameter * 0.18)
  const polarityStripeDepth = Math.min(0.18, diameter * 0.025)
  const ventWidth = diameter * 0.52
  const ventThickness = Math.max(0.1, diameter * 0.015)

  return (
    <>
      {[-pitch / 2, pitch / 2].map((x) => (
        <Cylinder
          key={x}
          color="#b8b8b8"
          radius={leadRadius}
          height={leadHeight}
          center={[x, 0, leadCenterZ]}
        />
      ))}

      <Cylinder
        color={bodyColor}
        radius={bodyRadius}
        height={bodyHeight}
        center={[0, 0, bodyCenterZ]}
      />

      <Cylinder
        color="#16191e"
        radius={bodyRadius * 0.9}
        height={bungHeight}
        center={[0, 0, standoffHeight + bungHeight / 2]}
      />

      <Cuboid
        color={stripeColor}
        size={[polarityStripeDepth, polarityStripeWidth, bodyHeight * 0.78]}
        center={[bodyRadius - polarityStripeDepth / 2 + 0.01, 0, bodyCenterZ]}
      />

      <Cylinder
        color="#9fa3a7"
        radius={bodyRadius * 0.86}
        height={topDiscHeight}
        center={[0, 0, bodyTopZ + topDiscHeight / 2]}
      />

      <Cuboid
        color="#666a6e"
        size={[ventWidth, ventThickness, topDiscHeight / 2]}
        center={[0, 0, bodyTopZ + topDiscHeight]}
      />
      <Cuboid
        color="#666a6e"
        size={[ventThickness, ventWidth, topDiscHeight / 2]}
        center={[0, 0, bodyTopZ + topDiscHeight]}
      />
    </>
  )
}
