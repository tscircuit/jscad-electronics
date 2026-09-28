import { Colorize, Cuboid, Translate } from "jscad-fiber"

/** 68-contact ceramic leadless chip carrier. Dimensions are in mm.
 * The package is centered in XY and sits on z=0. Contact numbering is not
 * encoded here; the four sides each have 17 contacts on a 1.27 mm pitch.
 */
export interface LCC68Props {
  bodySize: number
  height: number
  lidSize: number
  lidHeight: number
  contactPitch: number
  contactWidth: number
  contactLength: number
  contactThickness: number
}

export function LCC68(p: LCC68Props) {
  for (const key of Object.keys(p) as (keyof LCC68Props)[])
    if (!Number.isFinite(p[key]) || p[key] <= 0)
      throw new Error(`${key} must be finite and positive`)
  if (
    p.lidSize > p.bodySize ||
    p.lidHeight >= p.height ||
    p.contactThickness >= p.height - p.lidHeight ||
    p.contactWidth >= p.contactPitch ||
    p.contactLength >= p.bodySize / 2 ||
    16 * p.contactPitch + p.contactWidth > p.bodySize
  )
    throw new Error("Invalid LCC68 package geometry")

  const contactCenter = (p.bodySize - p.contactLength) / 2
  const contacts = Array.from(
    { length: 17 },
    (_, i) => (i - 8) * p.contactPitch,
  )
  return (
    <>
      <Colorize color="#c5c2b7">
        <Translate z={(p.height - p.lidHeight) / 2}>
          <Cuboid size={[p.bodySize, p.bodySize, p.height - p.lidHeight]} />
        </Translate>
      </Colorize>
      <Colorize color="#aaa9a5">
        <Translate z={p.height - p.lidHeight / 2}>
          <Cuboid size={[p.lidSize, p.lidSize, p.lidHeight]} />
        </Translate>
      </Colorize>
      <Colorize color="#c7b17a">
        {contacts.flatMap((offset) => [
          <Translate
            key={`west-${offset}`}
            offset={[-contactCenter, offset, p.contactThickness / 2]}
          >
            <Cuboid
              size={[p.contactLength, p.contactWidth, p.contactThickness]}
            />
          </Translate>,
          <Translate
            key={`east-${offset}`}
            offset={[contactCenter, offset, p.contactThickness / 2]}
          >
            <Cuboid
              size={[p.contactLength, p.contactWidth, p.contactThickness]}
            />
          </Translate>,
          <Translate
            key={`south-${offset}`}
            offset={[offset, -contactCenter, p.contactThickness / 2]}
          >
            <Cuboid
              size={[p.contactWidth, p.contactLength, p.contactThickness]}
            />
          </Translate>,
          <Translate
            key={`north-${offset}`}
            offset={[offset, contactCenter, p.contactThickness / 2]}
          >
            <Cuboid
              size={[p.contactWidth, p.contactLength, p.contactThickness]}
            />
          </Translate>,
        ])}
      </Colorize>
    </>
  )
}
