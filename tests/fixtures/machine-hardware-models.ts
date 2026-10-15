import { getComponentModel } from "../helpers/component-model"
import { createHingeGeom, createHingeMesh, Hinge } from "../../lib/models/hinge"
import { register as register0 } from "../../lib/models/hinge/register"
import {
  createBarrelHingeGeom,
  createBarrelHingeMesh,
  BarrelHinge,
} from "../../lib/models/barrelhinge"
import { register as register1 } from "../../lib/models/barrelhinge/register"
import {
  createDrawLatchGeom,
  createDrawLatchMesh,
  DrawLatch,
} from "../../lib/models/drawlatch"
import { register as register2 } from "../../lib/models/drawlatch/register"
import {
  createToggleClampGeom,
  createToggleClampMesh,
  ToggleClamp,
} from "../../lib/models/toggleclamp"
import { register as register3 } from "../../lib/models/toggleclamp/register"
import {
  createLevelingFootGeom,
  createLevelingFootMesh,
  LevelingFoot,
} from "../../lib/models/levelingfoot"
import { register as register4 } from "../../lib/models/levelingfoot/register"
import {
  createCasterGeom,
  createCasterMesh,
  Caster,
} from "../../lib/models/caster"
import { register as register5 } from "../../lib/models/caster/register"
import {
  createRubberBumperGeom,
  createRubberBumperMesh,
  RubberBumper,
} from "../../lib/models/rubberbumper"
import { register as register6 } from "../../lib/models/rubberbumper/register"
import {
  createBridgeHandleGeom,
  createBridgeHandleMesh,
  BridgeHandle,
} from "../../lib/models/bridgehandle"
import { register as register7 } from "../../lib/models/bridgehandle/register"
import {
  createHandwheelGeom,
  createHandwheelMesh,
  Handwheel,
} from "../../lib/models/handwheel"
import { register as register8 } from "../../lib/models/handwheel/register"
import {
  createStarKnobGeom,
  createStarKnobMesh,
  StarKnob,
} from "../../lib/models/starknob"
import { register as register9 } from "../../lib/models/starknob/register"
import {
  createLeverHandleGeom,
  createLeverHandleMesh,
  LeverHandle,
} from "../../lib/models/leverhandle"
import { register as register10 } from "../../lib/models/leverhandle/register"
import {
  createSquareKeyGeom,
  createSquareKeyMesh,
  SquareKey,
} from "../../lib/models/squarekey"
import { register as register11 } from "../../lib/models/squarekey/register"
import {
  createWoodruffKeyGeom,
  createWoodruffKeyMesh,
  WoodruffKey,
} from "../../lib/models/woodruffkey"
import { register as register12 } from "../../lib/models/woodruffkey/register"
import { createIBeamGeom, createIBeamMesh, IBeam } from "../../lib/models/ibeam"
import { register as register13 } from "../../lib/models/ibeam/register"
import {
  createTeeBarGeom,
  createTeeBarMesh,
  TeeBar,
} from "../../lib/models/teebar"
import { register as register14 } from "../../lib/models/teebar/register"
import {
  createRoundBarGeom,
  createRoundBarMesh,
  RoundBar,
} from "../../lib/models/roundbar"
import { register as register15 } from "../../lib/models/roundbar/register"
import {
  createSplitRingHangerGeom,
  createSplitRingHangerMesh,
  SplitRingHanger,
} from "../../lib/models/splitringhanger"
import { register as register16 } from "../../lib/models/splitringhanger/register"
import {
  createDetentPinGeom,
  createDetentPinMesh,
  DetentPin,
} from "../../lib/models/detentpin"
import { register as register17 } from "../../lib/models/detentpin/register"
import {
  createExpandedMetalGeom,
  createExpandedMetalMesh,
  ExpandedMetal,
} from "../../lib/models/expandedmetal"
import { register as register18 } from "../../lib/models/expandedmetal/register"
import {
  createCoolingFanGeom,
  createCoolingFanMesh,
  CoolingFan,
} from "../../lib/models/coolingfan"
import { register as register19 } from "../../lib/models/coolingfan/register"
export const machineHardwareModels = [
  {
    name: "hinge",
    source:
      "hinge_width60mm_length60mm_leafthickness3mm_barreldiameter10mm_pindiameter4mm_holediameter5mm",
    defaults: {
      width: 60,
      length: 60,
      leafThickness: 3,
      barrelDiameter: 10,
      pinDiameter: 4,
      holeDiameter: 5,
    },
    geometry: () => createHingeGeom(),
    mesh: () => createHingeMesh(),
    changedMesh: () => createHingeMesh({ width: 69.0 }),
    component: () => getComponentModel(Hinge, {}),
    register: register0,
  },
  {
    name: "barrelhinge",
    source:
      "barrelhinge_height60mm_barreldiameter14mm_pindiameter6mm_leafwidth20mm_leafthickness4mm_holediameter5mm",
    defaults: {
      height: 60,
      barrelDiameter: 14,
      pinDiameter: 6,
      leafWidth: 20,
      leafThickness: 4,
      holeDiameter: 5,
    },
    geometry: () => createBarrelHingeGeom(),
    mesh: () => createBarrelHingeMesh(),
    changedMesh: () => createBarrelHingeMesh({ height: 69.0 }),
    component: () => getComponentModel(BarrelHinge, {}),
    register: register1,
  },
  {
    name: "drawlatch",
    source:
      "drawlatch_length100mm_width25mm_basethickness4mm_handleheight18mm_wirediameter4mm_holediameter4mm",
    defaults: {
      length: 100,
      width: 25,
      baseThickness: 4,
      handleHeight: 18,
      wireDiameter: 4,
      holeDiameter: 4,
    },
    geometry: () => createDrawLatchGeom(),
    mesh: () => createDrawLatchMesh(),
    changedMesh: () => createDrawLatchMesh({ length: 114.99999999999999 }),
    component: () => getComponentModel(DrawLatch, {}),
    register: register2,
  },
  {
    name: "toggleclamp",
    source:
      "toggleclamp_length110mm_width35mm_basethickness5mm_handleheight55mm_armlength75mm_paddiameter14mm_holediameter5mm",
    defaults: {
      length: 110,
      width: 35,
      baseThickness: 5,
      handleHeight: 55,
      armLength: 75,
      padDiameter: 14,
      holeDiameter: 5,
    },
    geometry: () => createToggleClampGeom(),
    mesh: () => createToggleClampMesh(),
    changedMesh: () => createToggleClampMesh({ length: 126.49999999999999 }),
    component: () => getComponentModel(ToggleClamp, {}),
    register: register3,
  },
  {
    name: "levelingfoot",
    source:
      "levelingfoot_basediameter50mm_baseheight12mm_stemdiameter12mm_stemlength55mm_hexdiameter24mm_hexheight8mm",
    defaults: {
      baseDiameter: 50,
      baseHeight: 12,
      stemDiameter: 12,
      stemLength: 55,
      hexDiameter: 24,
      hexHeight: 8,
    },
    geometry: () => createLevelingFootGeom(),
    mesh: () => createLevelingFootMesh(),
    changedMesh: () =>
      createLevelingFootMesh({ baseDiameter: 57.49999999999999 }),
    component: () => getComponentModel(LevelingFoot, {}),
    register: register4,
  },
  {
    name: "caster",
    source:
      "caster_wheeldiameter75mm_wheelwidth24mm_axlediameter10mm_forkthickness5mm_platewidth50mm_platelength65mm_platethickness5mm_overallheight110mm_holediameter5mm",
    defaults: {
      wheelDiameter: 75,
      wheelWidth: 24,
      axleDiameter: 10,
      forkThickness: 5,
      plateWidth: 50,
      plateLength: 65,
      plateThickness: 5,
      overallHeight: 110,
      holeDiameter: 5,
    },
    geometry: () => createCasterGeom(),
    mesh: () => createCasterMesh(),
    changedMesh: () => createCasterMesh({ wheelDiameter: 86.25 }),
    component: () => getComponentModel(Caster, {}),
    register: register5,
  },
  {
    name: "rubberbumper",
    source:
      "rubberbumper_diameter30mm_height15mm_holediameter6mm_counterborediameter13mm_counterboredepth5mm",
    defaults: {
      diameter: 30,
      height: 15,
      holeDiameter: 6,
      counterboreDiameter: 13,
      counterboreDepth: 5,
    },
    geometry: () => createRubberBumperGeom(),
    mesh: () => createRubberBumperMesh(),
    changedMesh: () => createRubberBumperMesh({ diameter: 34.5 }),
    component: () => getComponentModel(RubberBumper, {}),
    register: register6,
  },
  {
    name: "bridgehandle",
    source:
      "bridgehandle_length120mm_gripdiameter15mm_height40mm_mountingdiameter24mm_mountingheight5mm_holediameter5mm",
    defaults: {
      length: 120,
      gripDiameter: 15,
      height: 40,
      mountingDiameter: 24,
      mountingHeight: 5,
      holeDiameter: 5,
    },
    geometry: () => createBridgeHandleGeom(),
    mesh: () => createBridgeHandleMesh(),
    changedMesh: () => createBridgeHandleMesh({ length: 138.0 }),
    component: () => getComponentModel(BridgeHandle, {}),
    register: register7,
  },
  {
    name: "handwheel",
    source:
      "handwheel_outerdiameter100mm_rimwidth12mm_hubdiameter28mm_hubheight25mm_borediameter12mm_spokes4",
    defaults: {
      outerDiameter: 100,
      rimWidth: 12,
      hubDiameter: 28,
      hubHeight: 25,
      boreDiameter: 12,
      spokes: 4,
    },
    geometry: () => createHandwheelGeom(),
    mesh: () => createHandwheelMesh(),
    changedMesh: () =>
      createHandwheelMesh({ outerDiameter: 114.99999999999999 }),
    component: () => getComponentModel(Handwheel, {}),
    register: register8,
  },
  {
    name: "starknob",
    source:
      "starknob_diameter40mm_height16mm_borediameter6mm_lobes5_hubdiameter18mm_hubheight10mm",
    defaults: {
      diameter: 40,
      height: 16,
      boreDiameter: 6,
      lobes: 5,
      hubDiameter: 18,
      hubHeight: 10,
    },
    geometry: () => createStarKnobGeom(),
    mesh: () => createStarKnobMesh(),
    changedMesh: () => createStarKnobMesh({ diameter: 46.0 }),
    component: () => getComponentModel(StarKnob, {}),
    register: register9,
  },
  {
    name: "leverhandle",
    source:
      "leverhandle_length90mm_width18mm_height16mm_hubdiameter28mm_hubheight25mm_borediameter8mm",
    defaults: {
      length: 90,
      width: 18,
      height: 16,
      hubDiameter: 28,
      hubHeight: 25,
      boreDiameter: 8,
    },
    geometry: () => createLeverHandleGeom(),
    mesh: () => createLeverHandleMesh(),
    changedMesh: () => createLeverHandleMesh({ length: 103.49999999999999 }),
    component: () => getComponentModel(LeverHandle, {}),
    register: register10,
  },
  {
    name: "squarekey",
    source: "squarekey_width8mm_height8mm_length40mm_chamfer1mm",
    defaults: { width: 8, height: 8, length: 40, chamfer: 1 },
    geometry: () => createSquareKeyGeom(),
    mesh: () => createSquareKeyMesh(),
    changedMesh: () => createSquareKeyMesh({ width: 9.2 }),
    component: () => getComponentModel(SquareKey, {}),
    register: register11,
  },
  {
    name: "woodruffkey",
    source: "woodruffkey_diameter30mm_thickness6mm_height12mm",
    defaults: { diameter: 30, thickness: 6, height: 12 },
    geometry: () => createWoodruffKeyGeom(),
    mesh: () => createWoodruffKeyMesh(),
    changedMesh: () => createWoodruffKeyMesh({ diameter: 34.5 }),
    component: () => getComponentModel(WoodruffKey, {}),
    register: register12,
  },
  {
    name: "ibeam",
    source:
      "ibeam_width40mm_height60mm_webthickness4mm_flangethickness6mm_length100mm",
    defaults: {
      width: 40,
      height: 60,
      webThickness: 4,
      flangeThickness: 6,
      length: 100,
    },
    geometry: () => createIBeamGeom(),
    mesh: () => createIBeamMesh(),
    changedMesh: () => createIBeamMesh({ width: 46.0 }),
    component: () => getComponentModel(IBeam, {}),
    register: register13,
  },
  {
    name: "teebar",
    source:
      "teebar_width40mm_height40mm_webthickness4mm_flangethickness6mm_length100mm",
    defaults: {
      width: 40,
      height: 40,
      webThickness: 4,
      flangeThickness: 6,
      length: 100,
    },
    geometry: () => createTeeBarGeom(),
    mesh: () => createTeeBarMesh(),
    changedMesh: () => createTeeBarMesh({ width: 46.0 }),
    component: () => getComponentModel(TeeBar, {}),
    register: register14,
  },
  {
    name: "roundbar",
    source: "roundbar_diameter20mm_length100mm_chamfer1mm",
    defaults: { diameter: 20, length: 100, chamfer: 1 },
    geometry: () => createRoundBarGeom(),
    mesh: () => createRoundBarMesh(),
    changedMesh: () => createRoundBarMesh({ diameter: 23.0 }),
    component: () => getComponentModel(RoundBar, {}),
    register: register15,
  },
  {
    name: "splitringhanger",
    source:
      "splitringhanger_pipediameter32mm_bandthickness3mm_bandwidth15mm_gap2mm_lugwidth14mm_holediameter5mm",
    defaults: {
      pipeDiameter: 32,
      bandThickness: 3,
      bandWidth: 15,
      gap: 2,
      lugWidth: 14,
      holeDiameter: 5,
    },
    geometry: () => createSplitRingHangerGeom(),
    mesh: () => createSplitRingHangerMesh(),
    changedMesh: () => createSplitRingHangerMesh({ pipeDiameter: 36.8 }),
    component: () => getComponentModel(SplitRingHanger, {}),
    register: register16,
  },
  {
    name: "detentpin",
    source:
      "detentpin_shaftdiameter8mm_shaftlength50mm_headdiameter18mm_headheight6mm_balldiameter3mm_balloffset4mm_ringdiameter24mm_ringwire2mm",
    defaults: {
      shaftDiameter: 8,
      shaftLength: 50,
      headDiameter: 18,
      headHeight: 6,
      ballDiameter: 3,
      ballOffset: 4,
      ringDiameter: 24,
      ringWire: 2,
    },
    geometry: () => createDetentPinGeom(),
    mesh: () => createDetentPinMesh(),
    changedMesh: () => createDetentPinMesh({ shaftDiameter: 9.2 }),
    component: () => getComponentModel(DetentPin, {}),
    register: register17,
  },
  {
    name: "expandedmetal",
    source:
      "expandedmetal_width100mm_length100mm_thickness2mm_diamondwidth15mm_diamondlength30mm_strandwidth2mm_framewidth3mm",
    defaults: {
      width: 100,
      length: 100,
      thickness: 2,
      diamondWidth: 15,
      diamondLength: 30,
      strandWidth: 2,
      frameWidth: 3,
    },
    geometry: () => createExpandedMetalGeom(),
    mesh: () => createExpandedMetalMesh(),
    changedMesh: () => createExpandedMetalMesh({ width: 114.99999999999999 }),
    component: () => getComponentModel(ExpandedMetal, {}),
    register: register18,
  },
  {
    name: "coolingfan",
    source:
      "coolingfan_size80mm_thickness25mm_hubdiameter28mm_bladecount7_bladewidth12mm_bladethickness3mm_mountingholediameter4mm_framethickness6mm",
    defaults: {
      size: 80,
      thickness: 25,
      hubDiameter: 28,
      bladeCount: 7,
      bladeWidth: 12,
      bladeThickness: 3,
      mountingHoleDiameter: 4,
      frameThickness: 6,
    },
    geometry: () => createCoolingFanGeom(),
    mesh: () => createCoolingFanMesh(),
    changedMesh: () => createCoolingFanMesh({ size: 92.0 }),
    component: () => getComponentModel(CoolingFan, {}),
    register: register19,
  },
]
