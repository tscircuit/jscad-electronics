import { expect, test } from "bun:test"
import { Cuboid } from "jscad-fiber"
import type { ReactElement } from "react"
import { FlexScreen, type FlexScreenProps } from "../../lib/FlexScreen"
import { createAnnotatedViewSheet } from "../fixtures/annotated-view-sheet"
import "../fixtures/png-matcher"
import type { CameraPreset } from "../helpers/camera-presets"
import { renderComponent } from "../helpers/render-component"

const BoardReference = ({
  edgeY,
  depth,
}: {
  edgeY: number
  depth: number
}) => (
  <Cuboid
    color="#397a45"
    center={[0, edgeY - depth / 2, -0.8]}
    size={[60, depth, 1.6]}
  />
)

const Assembly = ({
  props,
  boardEdgeY,
  boardDepth,
}: {
  props: FlexScreenProps
  boardEdgeY: number
  boardDepth: number
}): ReactElement => (
  <>
    <BoardReference edgeY={boardEdgeY} depth={boardDepth} />
    <FlexScreen {...props} />
  </>
)

interface SnapshotView {
  cameraPreset: CameraPreset
  annotation: string
}

interface SnapshotConfiguration {
  name: string
  title: string
  props: FlexScreenProps
  boardEdgeY: number
  boardDepth: number
  views: readonly SnapshotView[]
}

const aboveFlatViews = (configurationName: string): SnapshotView[] => [
  {
    cameraPreset: "top-left-corner",
    annotation: `Angled Above\n${configurationName}`,
  },
  {
    cameraPreset: "top-down",
    annotation: `Top Down\n${configurationName}`,
  },
  {
    cameraPreset: "left-sideview",
    annotation: `Side Profile\n${configurationName}`,
  },
]

const foldedViews = (configurationName: string): SnapshotView[] => [
  {
    cameraPreset: "top-left-corner",
    annotation: `Angled Above\n${configurationName}`,
  },
  {
    cameraPreset: "bottom-center-angled",
    annotation: `Angled Below\n${configurationName}`,
  },
  {
    cameraPreset: "left-sideview",
    annotation: `Fold Profile\n${configurationName}`,
  },
]

const configurations: SnapshotConfiguration[] = [
  {
    name: "sits-flat-default",
    title: "sitsFlat keeps the screen and cable flat on top of the board",
    props: { sitsFlat: true },
    boardEdgeY: 58,
    boardDepth: 66,
    views: aboveFlatViews("sitsFlatDefault"),
  },
  {
    name: "sits-flat-diagonal-four-three",
    title: "sitsFlat supports diagonal sizing and a 4:3 ratio",
    props: {
      orientation: "sitsFlat",
      diagonal: 50,
      aspectRatio: "4:3",
      flexCableLength: 34,
      flexCableWidth: 12,
      conductorCount: 10,
    },
    boardEdgeY: 72,
    boardDepth: 80,
    views: aboveFlatViews("sitsFlatFourThree"),
  },
  {
    name: "folded-above-screen",
    title: "folded-above screen uses a 180-degree cable loop",
    props: {
      foldedToFaceAboveBoard: true,
      flexCableLength: 28,
      distanceAboveBoard: 7,
      foldDistanceFromConnector: 7,
      foldOutset: 4,
    },
    boardEdgeY: 7,
    boardDepth: 52,
    views: foldedViews("foldedAboveScreen"),
  },
  {
    name: "folded-above-high-clearance",
    title: "folded-above distance and loop reach vary independently",
    props: {
      foldsAboveBoard: true,
      flexCableLength: 40,
      distanceAboveBoard: 14,
      foldDistanceFromConnector: 10,
      foldOutset: 6,
      foldSegments: 24,
    },
    boardEdgeY: 10,
    boardDepth: 58,
    views: foldedViews("foldedAboveHigh"),
  },
  {
    name: "folded-below-board-edge",
    title: "folded-below screen turns 180 degrees over the board edge",
    props: {
      foldedToFaceBelowBoard: true,
      flexCableLength: 32,
      distanceBelowBoard: 7,
      foldDistanceFromConnector: 6,
      foldOutset: 5,
    },
    boardEdgeY: 6,
    boardDepth: 52,
    views: foldedViews("foldedBelowScreen"),
  },
  {
    name: "folded-below-long-edge-loop",
    title: "folded-below screen supports a larger edge loop and drop",
    props: {
      foldsBelowBoard: true,
      flexCableLength: 46,
      distanceBelowBoard: 14,
      foldDistanceFromConnector: 10,
      foldOutset: 8,
      foldSegments: 26,
    },
    boardEdgeY: 10,
    boardDepth: 60,
    views: foldedViews("foldedBelowLongEdge"),
  },
  {
    name: "right-angle-above",
    title: "right-angle screen above the board from three angles",
    props: {
      foldedToRightAngleAboveBoard: true,
      flexCableLength: 34,
      bendRadius: 4.5,
      rightAngleVerticalLead: 4,
    },
    boardEdgeY: 42,
    boardDepth: 50,
    views: [
      {
        cameraPreset: "top-left-corner",
        annotation: "Angled Above\nrightAngleAbove",
      },
      {
        cameraPreset: "back",
        annotation: "Screen Face\nrightAngleAbove",
      },
      {
        cameraPreset: "left-sideview",
        annotation: "Bend Profile\nrightAngleAbove",
      },
    ],
  },
  {
    name: "right-angle-below",
    title: "right-angle screen below the board from three angles",
    props: {
      foldedToRightAngleBelowBoard: true,
      flexCableLength: 36,
      bendRadius: 4.5,
      bendSegments: 14,
    },
    boardEdgeY: 42,
    boardDepth: 50,
    views: [
      {
        cameraPreset: "bottom-center-angled",
        annotation: "Angled Below\nrightAngleBelow",
      },
      {
        cameraPreset: "front",
        annotation: "Screen Face\nrightAngleBelow",
      },
      {
        cameraPreset: "right-sideview",
        annotation: "Bend Profile\nrightAngleBelow",
      },
    ],
  },
  {
    name: "folded-above-custom-cable",
    title: "folded-above screen supports a custom cable stack",
    props: {
      diagonal: 55,
      aspectRatio: "4:3",
      foldsAboveBoard: true,
      flexCableLength: 43,
      distanceAboveBoard: 10,
      foldDistanceFromConnector: 9,
      foldOutset: 6,
      flexCableWidth: 14,
      flexCableThickness: 0.28,
      flexCableColor: "#7a4eb2",
      conductorCount: 10,
      conductorPitch: 1.2,
      conductorWidth: 0.46,
      conductorColor: "#e4b642",
      stiffenerColor: "#d9dbe5",
      screenColor: "#2d123d",
    },
    boardEdgeY: 9,
    boardDepth: 62,
    views: foldedViews("foldedAboveCustom"),
  },
  {
    name: "folded-below-portrait",
    title: "folded-below screen supports a portrait aspect ratio",
    props: {
      diagonal: 48,
      ratio: [9, 16],
      foldedToFaceBelowBoard: true,
      flexCableLength: 46,
      distanceBelowBoard: 12,
      foldDistanceFromConnector: 10,
      foldOutset: 7,
      flexCableWidth: 7,
      conductorCount: 6,
    },
    boardEdgeY: 10,
    boardDepth: 64,
    views: foldedViews("foldedBelowPortrait"),
  },
]

for (const configuration of configurations) {
  test(configuration.title, async () => {
    const element = Assembly(configuration)
    const renderedViews = await Promise.all(
      configuration.views.map(async (view) => ({
        png: await renderComponent(element, {
          width: 480,
          height: 360,
          cameraPreset: view.cameraPreset,
          gridZ: 0,
        }),
        annotation: view.annotation,
      })),
    )
    const sheet = createAnnotatedViewSheet(renderedViews)
    await expect(sheet).toMatchPngSnapshot(import.meta.path, configuration.name)
  })
}
