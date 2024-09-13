import React from 'react';
import { Cuboid, Translate, Rotate } from 'jscad-fiber';

export const SOT563 = ({ fullWidth = 1.6, fullLength = 1.6 }) => {
 
  const bodyWidth = 1.6;
  const bodyLength = 1.6;
  const bodyHeight = 0.55;
  const leadWidth = 0.2;
  const leadLength = 0.3;
  const leadHeight = 0.1;
  const leadSpacing = 0.5;
  const bodyYOffset = leadHeight;

  return (
    <>
      {/* Main body - rotated 90 degrees around X-axis */}
      <Rotate rotation={[(90 / 180) * Math.PI, 0, 0]}>
        <Translate center={[0, bodyYOffset, 0]}>
          <Cuboid size={[bodyWidth, bodyLength, bodyHeight]} />
        </Translate>
      </Rotate>

      {/* Leads */}
      {[-1, 0, 1].map((xOffset, index) => (
        <React.Fragment key={index}>
          {/* Top lead */}
          <Translate center={[xOffset * leadSpacing, 0, fullLength / 2 - leadLength / 2]}>
            <Cuboid size={[leadWidth, leadHeight, leadLength]} />
          </Translate>
          
          {/* Bottom lead */}
          <Translate center={[xOffset * leadSpacing, 0, -fullLength / 2 + leadLength / 2]}>
            <Cuboid size={[leadWidth, leadHeight, leadLength]} />
          </Translate>
        </React.Fragment>
      ))}
    </>
  );
};

export default SOT563;