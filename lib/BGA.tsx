import { Cuboid, Sphere, Translate, Union, Cylinder, Colorize } from 'jscad-fiber';

interface BGAProps {
    D?: number; 
    E?: number;  
    A?: number;  
    A1?: number; 
    e?: number;  
    b?: number;  
    rows?: number;
    columns?: number;
  }
  
  export const BGA = ({
    D = 10,
    E = 10,
    A = 1.2,
    A1 = 0.2,
    e = 0.8,
    b = 0.5,
    rows = 10,
    columns = 10
  }: BGAProps) => {
    const A2 = A - A1; 
  
    return (
      <>
        {/* Package body */}
        <Cuboid
          size={[D, E, A2]}
          center={[0, 0, A1 + A2/2]}
        />
  
        {/* Balls */}
        {Array.from({ length: rows * columns }).map((_, index) => {
          const row = Math.floor(index / columns);
          const col = index % columns;
          const x = (col - (columns - 1) / 2) * e;
          const y = (row - (rows - 1) / 2) * e;
  
          return (
            <Translate key={index} center={[x, y, A1/2]}>
              <Sphere radius={b/2} />
            </Translate>
          );
        })}
      </>
    );
  };