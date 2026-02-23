import { Colorize, Cuboid, Subtract, Translate } from "jscad-fiber";

export interface ScreenProps {
  width?: number;
  height?: number;
  thickness?: number;
  bezelInset?: number;
  bezelDepth?: number;
  screenColor?: string;
  bezelColor?: string;
  screenWidth?: number;
  screenHeight?: number;
  offset?: { x?: number; y?: number; z?: number };
}

export const Screen = ({
  width = 30,
  height = 22,
  thickness = 1,
  bezelInset = 2,
  bezelDepth = 1,
  screenColor = "#001414",
  bezelColor = "#0f1116",
  screenWidth,
  screenHeight,
  offset,
}: ScreenProps) => {
  const w = width;
  const h = height;
  const stackHeight = Math.max(thickness, 0.4);
  const clampedBezelDepth = Math.max(Math.min(bezelDepth, stackHeight), 0.2);
  const backBlockHeight = Math.max(stackHeight - clampedBezelDepth, 0);
  const inset = Math.max(bezelInset, 0);
  const innerWidth = Math.max(screenWidth ?? w - inset * 2, 2);
  const innerHeight = Math.max(screenHeight ?? h - inset * 2, 2);
  const screenThickness = Math.min(
    Math.max(clampedBezelDepth * 0.6, 0.2),
    clampedBezelDepth,
  );
  const offsetX = offset?.x ?? 0;
  const offsetY = offset?.y ?? 0;
  const offsetZ = offset?.z ?? 0;

  return (
    <Translate offset={{ x: offsetX, y: offsetY, z: offsetZ }}>
      {backBlockHeight > 0 && (
        <Colorize color={bezelColor}>
          <Cuboid
            size={[w, h, backBlockHeight]}
            offset={[0, 0, backBlockHeight / 2]}
          />
        </Colorize>
      )}

      <Colorize color={bezelColor}>
        <Subtract>
          <Cuboid
            size={[w, h, clampedBezelDepth]}
            offset={[0, 0, backBlockHeight + clampedBezelDepth / 2]}
          />
          <Cuboid
            size={[innerWidth, innerHeight, clampedBezelDepth + 0.02]}
            offset={[0, 0, backBlockHeight + clampedBezelDepth / 2]}
          />
        </Subtract>
      </Colorize>

      <Colorize color={screenColor}>
        <Cuboid
          size={[innerWidth, innerHeight, screenThickness]}
          offset={[0, 0, backBlockHeight + screenThickness / 2]}
        />
      </Colorize>
    </Translate>
  );
};

// TODO: remove Display alias after downstreams migrate
export const Display = Screen;

export default Screen;
