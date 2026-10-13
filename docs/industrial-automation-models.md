# Industrial automation model families

These are fundamental nominal placement models. They use millimeters after normalization and accept explicit mm, cm, m, in, mil and ft units. Omitted parameters use the defaults below. Unknown parameters, duplicate aliases and incompatible geometry dimensions fail validation. Smooth bores and decorative ribs do not assert functional thread forms or supplier-specific dimensions.

## PneumaticCylinder

Air cylinder with square end caps. The body is along +Z; extension is the visible rod displacement and cannot exceed stroke. End-cap screw holes and cross-body pneumatic ports are geometric openings. Bore and stroke describe nominal assembly sizing; piston, seals, threads and concealed internals are omitted.

`pneumaticcylinder_borediameter32mm_bodylength80mm_roddiameter12mm_stroke50mm_extension25mm_endcaplength10mm_portdiameter6mm`

| Parameter | Default, mm |
| --- | ---: |
| boreDiameter | 32 |
| bodyLength | 80 |
| rodDiameter | 12 |
| stroke | 50 |
| extension | 25 |
| endCapLength | 10 |
| portDiameter | 6 |

## CylinderMount

L-shaped rod-end or cylinder mounting bracket with one horizontal clearance bore in the upright and two mounting holes in the foot. Width is X, depth is Y, height is Z; all bores are nominal clearance openings.

`cylindermount_width50mm_depth25mm_height45mm_thickness5mm_borediameter20mm_holediameter5mm`

| Parameter | Default, mm |
| --- | ---: |
| width | 50 |
| depth | 25 |
| height | 45 |
| thickness | 5 |
| boreDiameter | 20 |
| holeDiameter | 5 |

## AirFilter

Pneumatic filter with a bowl guard, bottom drain and through ports in the head. Bowl and guard are a solid visual envelope; the filter media and transparent bowl interior are omitted. The drain is bored; there are no supplier-specific threads.

`airfilter_bodywidth40mm_bodydepth40mm_bodyheight30mm_bowldiameter28mm_bowllength50mm_portdiameter8mm_drainlength8mm`

| Parameter | Default, mm |
| --- | ---: |
| bodyWidth | 40 |
| bodyDepth | 40 |
| bodyHeight | 30 |
| bowlDiameter | 28 |
| bowlLength | 50 |
| portDiameter | 8 |
| drainLength | 8 |

## AirRegulator

Air pressure regulator with a fluted adjustment knob, front gauge bezel and lateral through ports. The head and gauge are nominal visual envelopes; concealed diaphragm and calibrated gauge markings are omitted.

`airregulator_bodywidth40mm_bodydepth36mm_bodyheight30mm_knobdiameter28mm_knobheight20mm_portdiameter8mm_gaugediameter20mm`

| Parameter | Default, mm |
| --- | ---: |
| bodyWidth | 40 |
| bodyDepth | 36 |
| bodyHeight | 30 |
| knobDiameter | 28 |
| knobHeight | 20 |
| portDiameter | 8 |
| gaugeDiameter | 20 |

## AirLubricator

Air-line lubricator with cylindrical reservoir, sight recess, retaining collar and top fill cap. The solid reservoir is an external envelope and does not represent oil volume or the metering internals.

`airlubricator_bodywidth40mm_bodydepth40mm_bodyheight30mm_bowldiameter28mm_bowllength50mm_portdiameter8mm_filldiameter12mm_fillheight8mm`

| Parameter | Default, mm |
| --- | ---: |
| bodyWidth | 40 |
| bodyDepth | 40 |
| bodyHeight | 30 |
| bowlDiameter | 28 |
| bowlLength | 50 |
| portDiameter | 8 |
| fillDiameter | 12 |
| fillHeight | 8 |

## SolenoidValve

Generic directional air solenoid valve: long valve body, three cross ports, two mounting holes, coil and electrical connector envelope. The internal spool and port switching paths are omitted; the model is not a pneumatic schematic.

`solenoidvalve_length70mm_width28mm_height25mm_coilwidth24mm_coilheight30mm_portdiameter6mm`

| Parameter | Default, mm |
| --- | ---: |
| length | 70 |
| width | 28 |
| height | 25 |
| coilWidth | 24 |
| coilHeight | 30 |
| portDiameter | 6 |

## PressureSwitch

Mechanical pressure switch enclosure with a bottom pressure port, top adjustment screw and bored cable gland on +X. The switch mechanism and pressure calibration are omitted.

`pressureswitch_width32mm_depth28mm_height38mm_portdiameter8mm_portlength10mm`

| Parameter | Default, mm |
| --- | ---: |
| width | 32 |
| depth | 28 |
| height | 38 |
| portDiameter | 8 |
| portLength | 10 |

## PressureGauge

Round pressure gauge facing -Y with a recessed dial, eleven major tick marks and a fixed nominal needle. The bottom stem is bored. Tick marks are decorative and intentionally have no numbers or calibration. The renderer additionally exposes `createPressureGaugeParts`: the metallic case, light dial face and dark needle/scale are separate geometries and share their palette with the four-view snapshot.

`pressuregauge_diameter60mm_depth22mm_stemdiameter10mm_stemlength15mm`

| Parameter | Default, mm |
| --- | ---: |
| diameter | 60 |
| depth | 22 |
| stemDiameter | 10 |
| stemLength | 15 |

## FlowMeter

Vertical variable-area flowmeter with hollow end fittings, a rear tube wall, visible float and scale ticks. The front wall is intentionally cut away to show the nominal internal float through the inspection window; this is an explanatory envelope model rather than a closed pressure vessel.

`flowmeter_length120mm_diameter24mm_borediameter12mm_enddiameter32mm_endlength12mm_floatdiameter8mm`

| Parameter | Default, mm |
| --- | ---: |
| length | 120 |
| diameter | 24 |
| boreDiameter | 12 |
| endDiameter | 32 |
| endLength | 12 |
| floatDiameter | 8 |

## VacuumCup

Tapered vacuum suction cup with a hollow bell, sealing lip and through-bored connection neck. Cup lip rests on Z=0; no flexible deformation, thread form or vacuum rating is modeled.

`vacuumcup_diameter35mm_height22mm_neckdiameter12mm_necklength12mm_wallthickness2mm_borediameter6mm`

| Parameter | Default, mm |
| --- | ---: |
| diameter | 35 |
| height | 22 |
| neckDiameter | 12 |
| neckLength | 12 |
| wallThickness | 2 |
| boreDiameter | 6 |

## InductiveProximitySensor

Cylindrical inductive proximity sensor with two hex mounting nuts, a distinct sensing face on +Z and short cable tail on -Z. Circumferential ribs suggest nominal barrel threading; they are not a functional helical thread.

`inductiveproximitysensor_barreldiameter18mm_barrellength55mm_facethickness2mm_cablediameter5mm_cablelength15mm_nutwidth22mm_nutthickness4mm`

| Parameter | Default, mm |
| --- | ---: |
| barrelDiameter | 18 |
| barrelLength | 55 |
| faceThickness | 2 |
| cableDiameter | 5 |
| cableLength | 15 |
| nutWidth | 22 |
| nutThickness | 4 |

## PhotoelectricSensor

Rectangular photoelectric sensor with two projecting optical lenses facing -Y, a top status indicator, cable tail and two transverse mounting holes. Optical axes are nominal and no sensing range is implied.

`photoelectricsensor_width20mm_depth35mm_height55mm_lensdiameter12mm_cablediameter5mm_mountholediameter4mm`

| Parameter | Default, mm |
| --- | ---: |
| width | 20 |
| depth | 35 |
| height | 55 |
| lensDiameter | 12 |
| cableDiameter | 5 |
| mountHoleDiameter | 4 |

## LimitSwitch

Industrial roller-lever limit switch with a transverse pivot, straight lever, end roller and two mounting bores. The lever is fixed in its nominal horizontal position; electrical contacts and motion are omitted.

`limitswitch_width30mm_depth20mm_height55mm_actuatorlength30mm_rollerdiameter12mm_leverthickness3mm_holediameter4mm`

| Parameter | Default, mm |
| --- | ---: |
| width | 30 |
| depth | 20 |
| height | 55 |
| actuatorLength | 30 |
| rollerDiameter | 12 |
| leverThickness | 3 |
| holeDiameter | 4 |

## PushbuttonOperator

Panel pushbutton operator with nominal mounting barrel, bezel, circular plunger and two rear terminal tabs. The panel is at Z=bodyLength, the actuator faces +Z, and terminals project below Z=0. No contact rating is implied.

`pushbuttonoperator_paneldiameter22mm_bezeldiameter30mm_buttondiameter22mm_bodylength35mm_buttonheight8mm`

| Parameter | Default, mm |
| --- | ---: |
| panelDiameter | 22 |
| bezelDiameter | 30 |
| buttonDiameter | 22 |
| bodyLength | 35 |
| buttonHeight | 8 |

## EmergencyStopSwitch

Mushroom-head emergency stop operator with a panel collar, tapered head, rear contact block and terminal tabs. This is a mechanical placement model and does not assert contact configuration, latching performance or safety certification.

`emergencystopswitch_paneldiameter22mm_headdiameter40mm_bodylength45mm_headheight18mm_collardiameter30mm`

| Parameter | Default, mm |
| --- | ---: |
| panelDiameter | 22 |
| headDiameter | 40 |
| bodyLength | 45 |
| headHeight | 18 |
| collarDiameter | 30 |

## SelectorOperator

Panel selector switch operator with mounting barrel, bezel, raised bar grip and two rear terminals. The grip is aligned with X at its nominal position; detents and switching contacts are omitted.

`selectoroperator_paneldiameter22mm_bezeldiameter30mm_bodylength35mm_knobwidth28mm_knobdepth10mm_knobheight15mm`

| Parameter | Default, mm |
| --- | ---: |
| panelDiameter | 22 |
| bezelDiameter | 30 |
| bodyLength | 35 |
| knobWidth | 28 |
| knobDepth | 10 |
| knobHeight | 15 |

## PilotLight

Panel indicator light with raised lens, surrounding bezel, mounting barrel and two rear terminal tabs. Optical diffusion and illumination are not simulated; no electrical ratings or mounting thread are asserted.

`pilotlight_paneldiameter22mm_lensdiameter28mm_bodylength28mm_lensheight8mm`

| Parameter | Default, mm |
| --- | ---: |
| panelDiameter | 22 |
| lensDiameter | 28 |
| bodyLength | 28 |
| lensHeight | 8 |

## DinRail

Generic top-hat DIN rail with a central floor, upright webs, outturned flanges and repeated oblong mounting holes. Rail length runs along X and the section width is Y. Dimensions are nominal; this model does not assert compliance with a rail standard.

`dinrail_width35mm_height7.5mm_thickness1mm_length100mm_holediameter5mm_slotlength10mm_slotpitch25mm`

| Parameter | Default, mm |
| --- | ---: |
| width | 35 |
| height | 7.5 |
| thickness | 1 |
| length | 100 |
| holeDiameter | 5 |
| slotLength | 10 |
| slotPitch | 25 |

## TerminalBlock

Single DIN terminal block with two wire-entry bores, paired slotted screw heads, center separator recess and underside rail clip recess. The insulating body is an envelope; screw thread, conductive cage and rail latching mechanics are omitted.

`terminalblock_width6mm_depth40mm_height35mm_wirediameter3mm_screwdiameter4mm`

| Parameter | Default, mm |
| --- | ---: |
| width | 6 |
| depth | 40 |
| height | 35 |
| wireDiameter | 3 |
| screwDiameter | 4 |

## WireDuct

Open slotted wire duct with a continuous floor, two comb sidewalls and repeated bottom mounting holes. Length runs along X. The removable lid and flexible sidewall deformation are omitted.

`wireduct_width40mm_height40mm_length100mm_thickness2mm_slotwidth4mm_slotpitch8mm_holediameter5mm`

| Parameter | Default, mm |
| --- | ---: |
| width | 40 |
| height | 40 |
| length | 100 |
| thickness | 2 |
| slotWidth | 4 |
| slotPitch | 8 |
| holeDiameter | 5 |

Repeated DIN rail and wire duct sidewall features are capped at 512. Wire duct length is limited to 12,800 mm to bound the fixed mounting-hole pattern.
