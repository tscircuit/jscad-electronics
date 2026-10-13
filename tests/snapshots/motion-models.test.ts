import { test } from "bun:test"
import { assertIndustrialSnapshot } from "../fixtures/industrial-model-snapshot"
import { createPillowBlockBearingMesh } from "../../lib/models/pillowblockbearing/geometry"
import { createFlangeBearingMesh } from "../../lib/models/flangebearing/geometry"
import { createNeedleBearingMesh } from "../../lib/models/needlebearing/geometry"
import { createCylindricalRollerBearingMesh } from "../../lib/models/cylindricalrollerbearing/geometry"
import { createCamFollowerMesh } from "../../lib/models/camfollower/geometry"
import { createVGrooveWheelMesh } from "../../lib/models/vgroovewheel/geometry"
import { createRodEndMesh } from "../../lib/models/rodend/geometry"
import { createSphericalBearingMesh } from "../../lib/models/sphericalbearing/geometry"
import { createClevisMesh } from "../../lib/models/clevis/geometry"
import { createGearRackMesh } from "../../lib/models/gearrack/geometry"
import { createSprocketMesh } from "../../lib/models/sprocket/geometry"
import { createRollerChainMesh } from "../../lib/models/rollerchain/geometry"
import { createVBeltSheaveMesh } from "../../lib/models/vbeltsheave/geometry"
import { createConveyorRollerMesh } from "../../lib/models/conveyorroller/geometry"
import { createShaftSupportMesh } from "../../lib/models/shaftsupport/geometry"
test("pillowblockbearing: standard labeled four-view snapshot", async () => {
  await assertIndustrialSnapshot({
    name: "pillowblockbearing",
    modelString:
      "pillowblockbearing_bore20mm_bw80mm_bd30mm_bt8mm_hd46mm_ch30mm_ms60mm_mh6mm",
    mesh: createPillowBlockBearingMesh(),
  })
}, 60000)
test("flangebearing: standard labeled four-view snapshot", async () => {
  await assertIndustrialSnapshot({
    name: "flangebearing",
    modelString:
      "flangebearing_bore20mm_fw64mm_ft6mm_hd44mm_hh20mm_ms46mm_mh6mm",
    mesh: createFlangeBearingMesh(),
  })
}, 60000)
test("needlebearing: standard labeled four-view snapshot", async () => {
  await assertIndustrialSnapshot({
    name: "needlebearing",
    modelString: "needlebearing_id20mm_od30mm_w20mm_race1.5mm_rollers18",
    mesh: createNeedleBearingMesh(),
  })
}, 60000)
test("cylindricalrollerbearing: standard labeled four-view snapshot", async () => {
  await assertIndustrialSnapshot({
    name: "cylindricalrollerbearing",
    modelString:
      "cylindricalrollerbearing_id20mm_od42mm_w16mm_race3mm_rollers12",
    mesh: createCylindricalRollerBearingMesh(),
  })
}, 60000)
test("camfollower: standard labeled four-view snapshot", async () => {
  await assertIndustrialSnapshot({
    name: "camfollower",
    modelString: "camfollower_od32mm_w14mm_stud10mm_sl26mm_socket5mm_rollers10",
    mesh: createCamFollowerMesh(),
  })
}, 60000)
test("vgroovewheel: standard labeled four-view snapshot", async () => {
  await assertIndustrialSnapshot({
    name: "vgroovewheel",
    modelString: "vgroovewheel_od40mm_root28mm_bore8mm_w12mm",
    mesh: createVGrooveWheelMesh(),
  })
}, 60000)
test("rodend: standard labeled four-view snapshot", async () => {
  await assertIndustrialSnapshot({
    name: "rodend",
    modelString: "rodend_hd28mm_bore12mm_w12mm_stem10mm_sl30mm",
    mesh: createRodEndMesh(),
  })
}, 60000)
test("sphericalbearing: standard labeled four-view snapshot", async () => {
  await assertIndustrialSnapshot({
    name: "sphericalbearing",
    modelString: "sphericalbearing_od30mm_bore12mm_w14mm_ball22mm",
    mesh: createSphericalBearingMesh(),
  })
}, 60000)
test("clevis: standard labeled four-view snapshot", async () => {
  await assertIndustrialSnapshot({
    name: "clevis",
    modelString: "clevis_w30mm_l45mm_h20mm_gap14mm_back10mm_pin8mm_mount10mm",
    mesh: createClevisMesh(),
  })
}, 60000)
test("gearrack: standard labeled four-view snapshot", async () => {
  await assertIndustrialSnapshot({
    name: "gearrack",
    modelString: "gearrack_pitch8mm_teeth12_w12mm_h8mm_th4mm_mh3.5mm",
    mesh: createGearRackMesh(),
  })
}, 60000)
test("sprocket: standard labeled four-view snapshot", async () => {
  await assertIndustrialSnapshot({
    name: "sprocket",
    modelString:
      "sprocket_od60mm_root48mm_w8mm_bore12mm_teeth16_hub26mm_hh10mm",
    mesh: createSprocketMesh(),
  })
}, 60000)
test("rollerchain: standard labeled four-view snapshot", async () => {
  await assertIndustrialSnapshot({
    name: "rollerchain",
    modelString:
      "rollerchain_pitch12.7mm_links6_roller7.9mm_w8mm_pin4mm_plate1.2mm",
    mesh: createRollerChainMesh(),
  })
}, 60000)
test("vbeltsheave: standard labeled four-view snapshot", async () => {
  await assertIndustrialSnapshot({
    name: "vbeltsheave",
    modelString:
      "vbeltsheave_od60mm_bore12mm_w24mm_grooves2_depth8mm_gw9mm_hub26mm_hh8mm",
    mesh: createVBeltSheaveMesh(),
  })
}, 60000)
test("conveyorroller: standard labeled four-view snapshot", async () => {
  await assertIndustrialSnapshot({
    name: "conveyorroller",
    modelString:
      "conveyorroller_od50mm_l150mm_wall3mm_shaft10mm_ext15mm_end4mm",
    mesh: createConveyorRollerMesh(),
  })
}, 60000)
test("shaftsupport: standard labeled four-view snapshot", async () => {
  await assertIndustrialSnapshot({
    name: "shaftsupport",
    modelString:
      "shaftsupport_bore16mm_bw55mm_bd32mm_bt7mm_hw26mm_hd20mm_hh34mm_ch26mm_ms40mm_mh5mm_slit1.5mm_clamp4mm",
    mesh: createShaftSupportMesh(),
  })
}, 60000)
