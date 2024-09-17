import { Cuboid, Translate, Rotate, Colorize } from "jscad-fiber"

const getCcwSot723Coords = (pn: number) => {
  if (pn === 1) {
    return { x: 0, y: 0 }
  } else if (pn === 2) {
    return { x: 0.95, y: -0.4 }
  } else {
    return { x: 0.95, y: 0.4 }
  }
}

export const SOT723 = () => {
  const bodyWidth = 1.2
  const bodyLength = 1.2
  const bodyHeight = 0.5 
  const leadWidth = 0.32
  const leadLength = 0.3
  const leadHeight = 0.1  
  const centerLeadWidth = 0.42

  return (
    <>
      <Rotate rotation={[(90 / 180) * Math.PI, 0, 0]}>
        <Translate center={[0.475, leadHeight / 2, 0]}>
          <Colorize color="grey">
            <Cuboid size={[bodyWidth - 0.5, bodyLength, bodyHeight]} />
          </Colorize>
        </Translate>
      </Rotate>

      {[1, 2, 3].map((pn) => {
        const { x, y } = getCcwSot723Coords(pn)
        return (
          <Translate key={`lead-${pn}`} center={[x, 0, y]}>
            <Cuboid size={[
              pn === 1 ? centerLeadWidth : leadWidth,
              leadHeight,
              leadLength
            ]} />
          </Translate>
        )
      })}
    </>
  );
};

export default SOT723