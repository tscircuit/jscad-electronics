import { expect, test } from "bun:test"
import { Cuboid } from "jscad-fiber"
import type { ReactElement } from "react"
import { FlexScreen, type FlexScreenProps } from "../../lib/FlexScreen"
import "../fixtures/png-matcher"
import type { CameraPreset } from "../helpers/camera-presets"
import { renderComponent } from "../helpers/render-component"

const BoardReference = () => (
  <Cuboid color="#397a45" center={[0, 26, -0.8]} size={[72, 72, 1.6]} />
)

const Assembly = (props: FlexScreenProps): ReactElement => (
  <>
    <BoardReference />
    <FlexScreen {...props} />
  </>
)

const snapshots: Array<{
  name: string
  title: string
  props: FlexScreenProps
  cameraPreset: CameraPreset
}> = [
  {
    name: "face-above-perspective",
    title: "default folded screen faces above the board",
    props: { foldedToFaceAboveBoard: true },
    cameraPreset: "top-left-corner",
  },
  {
    name: "face-above-top",
    title: "face-above preset from the top with a longer cable",
    props: {
      orientation: "foldedToFaceAboveBoard",
      flexCableLength: 36,
      diagonal: 46,
    },
    cameraPreset: "top-down",
  },
  {
    name: "face-below-perspective",
    title: "folded screen faces below the board",
    props: { foldedToFaceBelowBoard: true },
    cameraPreset: "bottom-center-angled",
  },
  {
    name: "face-below-underside",
    title: "face-below preset from directly under the board",
    props: {
      orientation: "foldedToFaceBelowBoard",
      width: 44,
      height: 25,
      flexCableLength: 33,
    },
    cameraPreset: "bottom-up",
  },
  {
    name: "right-angle-above-front",
    title: "right-angle screen rises above the board",
    props: { foldedToRightAngleAboveBoard: true },
    cameraPreset: "back",
  },
  {
    name: "right-angle-above-side",
    title: "right-angle screen above the board from the side",
    props: {
      orientation: "foldedToRightAngleAboveBoard",
      flexCableLength: 37,
      bendRadius: 5,
      rightAngleVerticalLead: 5,
    },
    cameraPreset: "left-sideview",
  },
  {
    name: "right-angle-below-front",
    title: "right-angle screen drops below the board",
    props: { foldedToRightAngleBelowBoard: true },
    cameraPreset: "front",
  },
  {
    name: "right-angle-below-side",
    title: "right-angle screen below the board from the side",
    props: {
      orientation: "foldedToRightAngleBelowBoard",
      flexCableLength: 35,
      bendRadius: 4.5,
      bendSegments: 14,
    },
    cameraPreset: "right-sideview",
  },
  {
    name: "diagonal-four-three",
    title: "diagonal-driven 4:3 screen with twelve conductors",
    props: {
      diagonal: 55,
      aspectRatio: "4:3",
      orientation: "foldedToRightAngleAboveBoard",
      flexCableLength: 40,
      flexCableWidth: 14,
      conductorCount: 12,
      cableEdgeMargin: 0.8,
      screenColor: "#162c55",
    },
    cameraPreset: "top-right-corner",
  },
  {
    name: "portrait-ratio",
    title: "portrait ratio and narrow flex cable",
    props: {
      diagonal: 48,
      ratio: [9, 16],
      orientation: "foldedToFaceAboveBoard",
      flexCableLength: 31,
      flexCableWidth: 6,
      conductorCount: 6,
    },
    cameraPreset: "top-left-corner",
  },
  {
    name: "short-tight-bend",
    title: "short cable with a tight right-angle bend",
    props: {
      width: 34,
      aspectRatio: "16:10",
      foldedToRightAngleAboveBoard: true,
      flexCableLength: 12,
      bendRadius: 1.5,
      rightAngleVerticalLead: 1.2,
      bendSegments: 16,
      stiffenerLength: 1.4,
    },
    cameraPreset: "top-center-angled",
  },
  {
    name: "custom-cable-stack",
    title: "custom cable stack, colors, offsets, and conductor layout",
    props: {
      diagonal: 52,
      aspectRatio: 2,
      orientation: "foldedToRightAngleBelowBoard",
      flexCableLength: 42,
      flexCableWidth: 15,
      flexCableThickness: 0.28,
      flexCableColor: "#7a4eb2",
      conductorCount: 10,
      conductorPitch: 1.2,
      conductorWidth: 0.46,
      conductorColor: "#e4b642",
      exposedContactLength: 4,
      stiffenerColor: "#d9dbe5",
      stiffenerThickness: 0.25,
      cableLateralOffset: 6,
      screenOffset: { x: 3, y: 0.5 },
      bezelColor: "#282432",
      screenColor: "#2d123d",
    },
    cameraPreset: "bottom-center-angled",
  },
]

for (const snapshot of snapshots) {
  test(snapshot.title, async () => {
    const png = await renderComponent(Assembly(snapshot.props), {
      cameraPreset: snapshot.cameraPreset,
      gridZ: 0,
    })
    await expect(png).toMatchPngSnapshot(import.meta.path, snapshot.name)
  })
}
