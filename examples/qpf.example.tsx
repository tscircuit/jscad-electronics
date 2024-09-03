import { JsCadFixture } from "jscad-fiber";
import { QFP } from "../lib/qpf";
import { ExtrudedPads } from "../src/lib/ExtrudedPads";

export default () => {
  return (
    <JsCadFixture zAxisUp>
      <QFP
        size={7} 
        height={1}         
        pinCount={48}      
        pinWidth={0.2}     
        pinLength={0.6}    
        pinThickness={0.1} 
      />
      <ExtrudedPads footprint="qfp48"/>
    </JsCadFixture>
  );
};