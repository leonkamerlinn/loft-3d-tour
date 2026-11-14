import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { WalkController, buildCollider, disposeCollider } from './walk.js?v=13';
import { MeasureTool } from './measure.js?v=13';
import { PROJECT, ZONES } from './spec-data.js?v=13';

// ---------------------------------------------------------------------------
// Device profile
// ---------------------------------------------------------------------------
const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
const isSmallScreen = Math.min(window.innerWidth, window.innerHeight) < 600;
const IS_MOBILE = isCoarsePointer || isSmallScreen;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const QUALITY = IS_MOBILE
  ? { pixelRatio: 1.5, antialias: false, shadows: false, extraFillLights: false }
  : { pixelRatio: 2.0, antialias: true, shadows: true, extraFillLights: true };

// Convert Blender Z-up (xb, yb, zb) -> glTF / Three.js Y-up (xb, zb, -yb)
const b2t = (xb, yb, zb) => new THREE.Vector3(xb, zb, -yb);

const GROUND_FLOOR_Z = -2.999; // 0.00 m reference floor height in Blender metres
const STOP_COUNT = 15;

// 15 room stops + corridor/stair waypoints across complete Po+Pr+Pk house + 3D Garden (Banfi 201A).
const TOUR_NODES = [
  { cam: [7.80, -8.20, -4.13], look: [-0.60, -1.20, -1.35] },    // 0: 01 Prilaz Banfi & Eksterijer (parking apron)
  { cam: [1.50, -7.20, -4.13], look: [-4.50, -5.00, -2.50] },    // 1: apron heading west to exterior stair foot
  { cam: [-5.15, -6.20, -4.13], look: [-5.15, -1.00, -1.80] },   // 2: foot of Vanjsko stubište
  { cam: [-5.15, -1.25, -1.40], look: [-7.60, -2.10, -1.55] },   // 3: top of Vanjsko stubište turning W into 3D Vrt
  { cam: [-6.80, -0.55, -1.40], look: [-9.50, -2.40, -1.55] },   // 4: garden stepping stones toward Pergola
  { cam: [-9.35, -3.35, -1.40], look: [-5.20, -0.50, -1.45] },   // 5: 02 3D Vrt & Pergola (looking NE toward porch)
  { cam: [-6.65, -0.55, -1.40], look: [-4.80, 0.15, -1.42] },     // 6: stepping stones back onto Ulazni trijem
  { cam: [-5.15, 0.18, -1.40], look: [-1.80, 0.15, -1.48] },      // 7: 03 Ulazni trijem & Glavni ulaz
  { cam: [-3.10, 0.18, -1.40], look: [-0.45, 0.10, -1.48] },      // 8: inside Ulazni hodnik (mirror, coat niche & frosted glass)
  { cam: [0.08, 0.24, -1.40], look: [2.25, -0.45, -1.45] },       // 9: 04 Ulazni hodnik & Atrij (through open 5-stripe glass door)
  { cam: [0.08, -1.62, -1.40], look: [-2.80, -2.10, -1.60] },     // 10: south past Central Pier into kitchen overhang
  { cam: [-1.25, -1.65, -1.40], look: [-4.15, -2.85, -1.65] },    // 11: 05 Kuhinja
  { cam: [-0.45, -1.95, -1.40], look: [-1.86, -3.23, -1.65] },    // 12: east of dining table
  { cam: [-0.45, -2.65, -1.40], look: [-1.65, -3.75, -1.60] },    // 13: 06 Blagovaonica & Kamin
  { cam: [-0.38, -3.88, -1.40], look: [0.45, -4.40, -1.55] },     // 14: aisle south of pillar & west of sofa
  { cam: [0.55, -4.05, -1.40], look: [2.45, -2.35, -1.48] },      // 15: 07 Dnevni boravak
  { cam: [2.26, -4.50, -1.40], look: [2.25, -5.65, -1.45] },      // 16: approach open patio door
  { cam: [2.26, -5.62, -1.40], look: [-0.20, -5.62, -1.42] },     // 17: step out onto Balkon SE
  { cam: [1.35, -5.62, -1.40], look: [-2.40, -5.20, -1.35] },     // 18: 08 Jugoistočni balkon
  { cam: [2.26, -5.62, -1.40], look: [2.26, -4.10, -1.40] },      // 19: return through patio door
  { cam: [2.26, -4.35, -1.40], look: [0.08, -3.95, -1.40] },      // 20: south living aisle
  { cam: [0.08, -3.88, -1.40], look: [0.08, -1.00, -1.40] },      // 21: west of sofa aligned with Atrium aisle
  { cam: [0.08, -0.45, -1.40], look: [0.08, 0.85, -1.40] },       // 22: head north along Central Pier East face to Predsoblje door
  { cam: [0.08, 0.85, -1.40], look: [-0.25, 2.40, -1.45] },     // 23: through Loft -> Predsoblje NorthHall door
  { cam: [-0.37, 2.25, -1.40], look: [-0.37, 3.20, -1.48] },    // 24: align with Soba 1 doorway (X in [-0.82, 0.08])
  { cam: [-0.35, 2.92, -1.40], look: [-2.65, 4.15, -1.65] },    // 25: 09 Sjeverno krilo Pr (Soba 1, Predsoblje, Kup, Soba 2)
  { cam: [-0.37, 2.25, -1.40], look: [-0.38, 1.38, -1.55] },    // 26: step back out of Soba 1 doorway
  { cam: [-0.38, 1.38, -1.40], look: [-2.50, 1.38, -2.40] },    // 27: head of internal U-staircase (Pr -> Podrum)
  { cam: [-1.95, 1.38, -2.10], look: [-3.30, 1.65, -2.85] },    // 28: descending upper flight W
  { cam: [-3.28, 1.78, -2.765], look: [-1.20, 2.18, -3.80] },   // 29: U-stair mid-landing turn
  { cam: [-1.65, 2.18, -3.55], look: [0.10, 2.18, -4.13] },     // 30: descending lower flight E
  { cam: [-0.25, 2.18, -4.13], look: [-2.20, 4.20, -4.20] },    // 31: foot of U-staircase glancing into Vešeraj
  { cam: [0.15, 1.73, -4.13], look: [2.20, 2.20, -4.18] },      // 32: approach Kotlovnica doorway (Y in [1.28, 2.18])
  { cam: [1.35, 1.85, -4.13], look: [4.25, 3.85, -4.20] },      // 33: 10 Podrum: Vešeraj & Kotlovnica
  { cam: [1.60, 0.86, -4.13], look: [1.60, -2.20, -4.18] },     // 34: through KotlovGar doorway (X in [1.15, 2.05])
  { cam: [1.60, -1.50, -4.13], look: [1.50, -4.20, -4.22] },    // 35: Garaža NE aisle
  { cam: [2.15, -3.65, -4.13], look: [-0.65, 0.50, -4.25] },    // 36: 11 Podrum: Garaža & Radna prostorija
  { cam: [0.40, -0.45, -4.13], look: [-1.80, -0.10, -4.18] },    // 37: cross Garaža south of GarazaHall open door leaf
  { cam: [-0.95, 0.37, -4.13], look: [-2.65, 0.37, -4.18] },    // 38: approach RadnaIn doorway (Y in [-0.08, 0.82])
  { cam: [-2.55, 0.37, -4.13], look: [-3.55, -0.85, -4.22] },   // 39: through RadnaIn doorway
  { cam: [-2.75, -0.85, -4.13], look: [-3.85, -0.55, -4.25] },  // 40: inside Radna prostorija
  { cam: [-2.55, 0.37, -4.13], look: [-0.27, 0.37, -4.18] },    // 41: exit RadnaIn doorway along Y=0.37
  { cam: [-0.27, 0.37, -4.13], look: [-0.27, 2.18, -4.13] },    // 42: align with GarazaHall doorway (X=-0.27)
  { cam: [-0.27, 2.18, -4.13], look: [-2.60, 2.18, -3.20] },    // 43: through GarazaHall doorway back to U-stairs foot
  { cam: [-3.28, 1.78, -2.765], look: [-1.20, 1.38, -2.00] },   // 44: mid-landing returning up to Pr
  { cam: [-0.38, 1.38, -1.40], look: [0.08, 0.85, -1.40] },     // 45: top of U-staircase back in Predsoblje
  { cam: [0.08, 0.85, -1.40], look: [0.08, -0.80, -1.40] },     // 46: back through Predsoblje -> Atrij door
  { cam: [0.08, -0.45, -1.40], look: [0.08, -3.60, -1.40] },     // 47: Atrij aisle east of Central Pier
  { cam: [0.08, -3.88, -1.40], look: [2.60, -3.60, -1.40] },     // 48: south of sofa heading east
  { cam: [2.85, -2.38, -1.35], look: [0.45, -0.35, 1.55] },      // 49: 12 Krovna rešetka & Glavno L-stepenište
  { cam: [3.58, -0.35, -0.38], look: [0.85, -1.55, -0.15] },    // 50: L-stair corner landing
  { cam: [1.52, 0.22, 0.48], look: [-0.95, -3.15, 1.30] },      // 51: ascending open-riser upper flight under truss
  { cam: [0.22, 0.25, 1.08], look: [-2.85, -0.75, 0.62] },      // 52: top step onto Most galerije
  { cam: [-0.55, 0.24, 1.15], look: [-3.25, -0.95, 0.52] },     // 53: 13 Most galerije & Radni kutak
  { cam: [-1.05, -0.95, 1.14], look: [-3.35, -0.95, 0.45] },    // 54: Galerija L-desk & skylight
  { cam: [-0.94, 0.95, 1.15], look: [0.15, 3.35, 0.95] },       // 55: through Gallery -> Garderoba doorway
  { cam: [-0.85, 1.60, 1.16], look: [0.60, 3.95, 0.80] },       // 56: Garderoba & radni kutak (Pk)
  { cam: [-0.95, 2.30, 1.16], look: [-2.30, 2.55, 0.95] },      // 57: turn W to Kupaonica Pk door
  { cam: [-1.51, 2.50, 1.18], look: [-2.55, 2.60, 0.90] },      // 58: through Kupaonica Pk doorway
  { cam: [-2.42, 2.45, 1.16], look: [-1.95, 4.30, 0.75] },      // 59: 14 Kupaonica potkrovlja
  { cam: [-2.25, 3.35, 1.16], look: [-2.95, 1.35, 0.45] },      // 60: turn toward corner bathtub
  { cam: [-1.51, 2.50, 1.18], look: [0.65, 2.45, 0.95] },       // 61: exit Kupaonica Pk doorway
  { cam: [0.85, 2.30, 1.18], look: [1.60, 1.65, 0.95] },        // 62: corridor north of StudyDesk & west of Wardrobe
  { cam: [1.18, 1.52, 1.18], look: [2.20, 1.52, 0.95] },        // 63: align with Master Bedroom doorway
  { cam: [1.91, 1.52, 1.18], look: [3.65, 2.85, 0.85] },        // 64: through Master Bedroom doorway
  { cam: [2.35, 1.95, 1.16], look: [4.35, 3.25, 0.62] },        // 65: 15 Glavna spavaća soba (Pk)
  { cam: [2.65, 3.95, 1.16], look: [4.70, 1.70, 0.66] }         // 66: NW bedroom corner overview
];

const STOP_NODE_IDX = [0, 5, 7, 9, 11, 13, 15, 18, 25, 33, 36, 49, 53, 59, 65];
// Per stop: horizontal field of view (wider in small rooms) and mouse-parallax strength
const STOP_VIEW = [
  { hfov: 88, parallax: 0.9 },   // 01 Eksterijer & Prilaz Banfi
  { hfov: 92, parallax: 0.9 },   // 02 3D Vrt & Pergola
  { hfov: 92, parallax: 0.9 },   // 03 Ulazni trijem & Glavni ulaz
  { hfov: 90, parallax: 1.0 },   // 04 Ulazni hodnik & Atrij
  { hfov: 96, parallax: 0.8 },   // 05 Kuhinja
  { hfov: 90, parallax: 1.0 },   // 06 Blagovaonica & Kamin
  { hfov: 90, parallax: 1.0 },   // 07 Dnevni boravak
  { hfov: 94, parallax: 0.85 },  // 08 Jugoistočni balkon
  { hfov: 96, parallax: 0.75 },  // 09 Sjeverno krilo Pr
  { hfov: 96, parallax: 0.75 },  // 10 Podrum: Vešeraj & Kotlovnica
  { hfov: 94, parallax: 0.8 },   // 11 Podrum: Garaža & Radna
  { hfov: 92, parallax: 0.85 },  // 12 Krovna rešetka & Stepenište
  { hfov: 96, parallax: 0.75 },  // 13 Most galerije & Radni kutak
  { hfov: 102, parallax: 0.5 },  // 14 Kupaonica potkrovlja
  { hfov: 98, parallax: 0.6 }    // 15 Glavna spavaća soba (Pk)
];
const WALK_HFOV = 92;

const smoothstep01 = (f) => f * f * (3 - 2 * f);
// Slight ease-in/out between stops: the camera settles while a card is readable, then moves on
const easeSegment = (f) => f + (smoothstep01(f) - f) * 0.55;

function stopSegment(t) {
  const s = THREE.MathUtils.clamp(t, 0, 1) * (STOP_COUNT - 1);
  const k = Math.min(STOP_COUNT - 2, Math.floor(s));
  return { k, f: s - k };
}

function scrollTToCurveU(t) {
  const { k, f } = stopSegment(t);
  const idx = STOP_NODE_IDX[k] + easeSegment(f) * (STOP_NODE_IDX[k + 1] - STOP_NODE_IDX[k]);
  return idx / (TOUR_NODES.length - 1);
}

/** Per-stop value blended smoothly by tour progress. */
function blendStop(t, pick) {
  const { k, f } = stopSegment(t);
  return THREE.MathUtils.lerp(pick(k), pick(k + 1), smoothstep01(f));
}

const camCurve = new THREE.CatmullRomCurve3(TOUR_NODES.map((n) => b2t(...n.cam)), false, 'catmullrom', 0.38);
// View direction is interpolated as (unwrapped) yaw / pitch, not via look-target points: big turns inside
// small rooms then sweep smoothly instead of dipping towards the floor halfway through the turn.
const angleCurve = new THREE.CatmullRomCurve3((() => {
  let prevYaw = null;
  return TOUR_NODES.map(({ cam, look }) => {
    const dx = look[0] - cam[0];
    const dy = look[1] - cam[1];
    let yaw = Math.atan2(dx, dy);
    if (prevYaw !== null) {
      while (yaw - prevYaw > Math.PI) yaw -= Math.PI * 2;
      while (yaw - prevYaw < -Math.PI) yaw += Math.PI * 2;
    }
    prevYaw = yaw;
    return new THREE.Vector3(yaw, Math.atan2(look[2] - cam[2], Math.hypot(dx, dy)), 0);
  });
})(), false, 'catmullrom', 0.38);

const _ang = new THREE.Vector3();
/** Camera pose on the tour curve (Three.js space). */
function poseAt(u, outPos, outLook) {
  camCurve.getPoint(u, outPos);
  angleCurve.getPoint(u, _ang);
  const c = Math.cos(_ang.y);
  // Blender direction (sin yaw·cos pitch, cos yaw·cos pitch, sin pitch) → Three.js (x, z, −y)
  return outLook.set(outPos.x + Math.sin(_ang.x) * c * 2, outPos.y + Math.sin(_ang.y) * 2, outPos.z - Math.cos(_ang.x) * c * 2);
}

// Exact eye / look point at each stop (stops may sit between two nodes)
const STOP_POSES = STOP_NODE_IDX.map((idx) => {
  const cam = new THREE.Vector3();
  const look = new THREE.Vector3();
  poseAt(idx / (TOUR_NODES.length - 1), cam, look);
  return { cam, look };
});

// ---------------------------------------------------------------------------
// DOM
// ---------------------------------------------------------------------------
const $ = (id) => document.getElementById(id);
const canvas = $('webgl-canvas');
const loaderEl = $('loader');
const loaderBar = $('loader-bar');
const loaderStatus = $('loader-status');
const roomNav = $('room-nav');
const navPills = Array.from(document.querySelectorAll('.nav-pill'));
// Must match the mobile media query in styles.css (minimap collapses behind a toggle there)
const mobileLayoutMQ = window.matchMedia('(max-width: 820px), (max-height: 560px)');
const storySections = Array.from(document.querySelectorAll('.story-section'));
const elevReadout = $('elev-readout');
const scrollPctEl = $('scroll-pct');
const railFill = $('rail-fill');
const floorBadge = $('floor-badge');
const minimapCard = $('minimap-card');
const minimapToggle = $('minimap-toggle');
const minimapCanvas = $('minimap-canvas');
const mctx = minimapCanvas.getContext('2d');
const btnLighting = $('btn-lighting');
const lightingIcon = $('lighting-icon');
const lightingLabel = $('lighting-label');
const btnFreeMode = $('btn-free-mode');
const modeLabel = $('mode-label');
const freeBanner = $('free-banner');
const btnResumeScroll = $('btn-resume-scroll');
const btnBackTop = $('btn-back-top');
const btnMeasure = $('btn-measure');
const btnMeasureClear = $('btn-measure-clear');
const measureLayer = $('measure-layer');
const hoverTip = $('hover-tip');
const joystick = $('walk-joystick');
const joystickKnob = joystick?.querySelector('.walk-knob');
const btnSpec = $('btn-spec');
const specDrawer = $('spec-drawer');
const specKicker = $('spec-kicker');
const specTitle = $('spec-title');
const specBody = $('spec-body');
const specClose = $('spec-close');
const specMeasure = $('spec-measure');
const specFull = $('spec-full');

// ---------------------------------------------------------------------------
// Renderer & scene
// ---------------------------------------------------------------------------
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: QUALITY.antialias,
  powerPreference: 'high-performance'
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, QUALITY.pixelRatio));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
renderer.shadowMap.enabled = QUALITY.shadows;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// The scene is static: render shadow maps once (and again when lighting changes), not every frame.
renderer.shadowMap.autoUpdate = false;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0d13);

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
pmrem.dispose();
scene.environmentIntensity = 0.24;

const camera = new THREE.PerspectiveCamera(66, window.innerWidth / window.innerHeight, 0.05, 150);

/** Vertical FOV that gives the requested horizontal FOV, clamped so portrait phones don't go fisheye. */
function verticalFovFor(hfovDeg) {
  const aspect = window.innerWidth / window.innerHeight;
  const v = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(hfovDeg) / 2) / aspect);
  return THREE.MathUtils.clamp(THREE.MathUtils.radToDeg(v), 50, 100);
}

function updateCameraFov(hfovDeg = STOP_VIEW[0].hfov) {
  camera.fov = verticalFovFor(hfovDeg);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
updateCameraFov();

// ---------------------------------------------------------------------------
// Interiors: "current" = 1:1 reconstruction, "redesign" = Japandi concept (same architecture)
// ---------------------------------------------------------------------------
const INTERIORS = {
  current: { url: './assets/room_3d.glb?v=13', exposure: 1.08, name: 'postojeći interijer' },
  redesign: { url: './assets/room_redesign.glb?v=13', exposure: 1.16, name: 'redizajn Japandi' }
};
let activeInterior = document.documentElement.dataset.interior === 'redesign' ? 'redesign' : 'current';

// ---------------------------------------------------------------------------
// Lighting — every light belongs to 'common', 'current' or 'redesign'
// ---------------------------------------------------------------------------
const managedLights = [];

const hemiLight = new THREE.HemisphereLight(0xffe9cf, 0x2c241d, 0.42);
scene.add(hemiLight);

function registerLight(light, base, group, zone = 'all') {
  light.userData.base = base;
  light.userData.group = group;
  light.userData.zone = zone;
  managedLights.push(light);
  scene.add(light);
  if (light.target) scene.add(light.target);
  return light;
}

function addPoint(xb, yb, zb, color, intensity, distance = 9, castShadow = false, group = 'common', zone = 'all') {
  const l = new THREE.PointLight(color, intensity, distance, 1.7);
  l.position.copy(b2t(xb, yb, zb));
  if (castShadow && QUALITY.shadows) {
    l.castShadow = true;
    l.shadow.mapSize.set(1024, 1024);
    l.shadow.bias = -0.0008;
    l.shadow.radius = 3;
  }
  return registerLight(l, intensity, group, zone);
}

function addSpot(posB, targetB, color, intensity, angleDeg, penumbra = 0.45, dist = 8, group = 'common', zone = 'all') {
  const s = new THREE.SpotLight(color, intensity, dist, THREE.MathUtils.degToRad(angleDeg), penumbra, 1.6);
  s.position.copy(b2t(...posB));
  s.target.position.copy(b2t(...targetB));
  return registerLight(s, intensity, group, zone);
}

// Common: Loft (South Pr + Truss), Upper North Wing, Prizemlje North Wing, Podrum, Exterior 3D Vrt
addSpot([-0.44, -4.64, -1.32], [-0.44, -4.73, 0.35], 0xffcf96, 6.5, 36, 0.55, 4.5, 'common', 'loft');
addSpot([-0.44, -4.64, -1.43], [-0.44, -4.73, -2.95], 0xffcf96, 6.5, 36, 0.55, 4.5, 'common', 'loft');
addSpot([0.44, -4.64, -1.32], [0.44, -4.73, 0.35], 0xffcf96, 6.5, 36, 0.55, 4.5, 'common', 'loft');
addSpot([0.44, -4.64, -1.43], [0.44, -4.73, -2.95], 0xffcf96, 6.5, 36, 0.55, 4.5, 'common', 'loft');
addPoint(-3.1, -2.55, -0.65, 0xffe0ba, 3.6, 7.5, false, 'common', 'loft');
addPoint(-2.35, -0.6, 1.45, 0xffe2be, 4.8, 9.0, false, 'common', 'loft');
addPoint(-3.15, -0.9, 1.65, 0xedf6ff, 3.6, 7.5, false, 'common', 'loft');
addPoint(-0.08, 0.25, 1.35, 0xfff0dd, 2.2, 5.5, false, 'common', 'loft');
// Upper North Wing (Potkrovlje Pk)
addPoint(0.15, 3.0, 1.72, 0xffe2be, 4.4, 7.5, false, 'common', 'upper_n');
addPoint(-2.15, 2.85, 1.95, 0xfff0da, 4.5, 7.0, false, 'common', 'upper_n');
addPoint(3.48, 3.35, 1.65, 0xffdeb4, 4.8, 8.5, false, 'common', 'upper_n');
// Ground North Wing (Predsoblje, Soba 1 SZ, Kupaonica Pr, Soba 2 SI)
addPoint(-0.30, 2.40, -0.75, 0xffe2be, 4.0, 7.5, false, 'common', 'ground_n');
addPoint(-2.80, 3.85, -0.75, 0xffe0ba, 4.2, 7.5, false, 'common', 'ground_n');
addPoint(0.42, 3.80, -0.75, 0xfff0dc, 3.6, 6.5, false, 'common', 'ground_n');
addPoint(3.15, 3.45, -0.75, 0xffe0ba, 4.2, 7.5, false, 'common', 'ground_n');
// Basement (Podrum: Veseraj, Kotlovnica, Garaza, Radna)
addPoint(-2.20, 3.20, -3.55, 0xfff0dd, 3.8, 7.5, false, 'common', 'podrum');
addPoint(2.50, 2.90, -3.55, 0xf2f7ff, 4.4, 8.5, false, 'common', 'podrum');
addPoint(1.55, -2.20, -3.55, 0xf4f8ff, 5.4, 10.5, false, 'common', 'podrum');
addPoint(-2.75, -2.40, -3.55, 0xffe3be, 4.2, 8.5, false, 'common', 'podrum');
// Exterior (3D Vrt Pergola, Ulazni trijem, Driveway & Balkon)
addPoint(-5.15, -0.10, -0.85, 0xffcf94, 4.2, 8.5, false, 'common', 'ext');
addPoint(-9.45, -2.55, -0.75, 0xffc888, 5.2, 10.5, false, 'common', 'ext');
addPoint(0.20, -5.65, -0.95, 0xffcf94, 3.4, 7.5, false, 'common', 'ext');
addPoint(7.20, -2.50, -3.60, 0xffd5a0, 4.5, 13.0, false, 'common', 'ext');

// Current interior: dining domes, opal globes, 4-way X sconce on the dark wood wall
addPoint(-1.86, -3.55, -1.36, 0xffd29e, 5.2, 8.5, true, 'current', 'loft');
addPoint(-1.86, -2.88, -1.36, 0xffd29e, 5.2, 8.5, false, 'current', 'loft');
addPoint(1.35, -3.45, -0.55, 0xffdcb4, 4.4, 9.5, true, 'current', 'loft');
addPoint(2.25, -2.35, -0.35, 0xffdcb4, 3.8, 9.5, false, 'current', 'loft');
addPoint(1.15, -1.55, -0.75, 0xffdcb4, 3.4, 9.0, false, 'current', 'loft');
addSpot([4.11, -1.79, -0.89], [4.16, -2.85, -1.95], 0xffca85, 8.0, 14, 0.4, 4.2, 'current', 'loft');
addSpot([4.11, -1.79, -0.81], [4.16, -2.85, 0.25], 0xffca85, 8.0, 14, 0.4, 4.2, 'current', 'loft');
addSpot([4.11, -1.71, -0.89], [4.16, -0.65, -1.95], 0xffca85, 8.0, 14, 0.4, 4.2, 'current', 'loft');
addSpot([4.11, -1.71, -0.81], [4.16, -0.65, 0.25], 0xffca85, 8.0, 14, 0.4, 4.2, 'current', 'loft');

// Redesign: Akari-style paper lanterns (warmer 2700 K), TV-bench LED wash, under-cabinet kitchen LED
addPoint(-1.86, -3.23, -1.02, 0xffc790, 7.0, 9.0, true, 'redesign', 'loft');
addPoint(1.35, -3.45, -0.12, 0xffc790, 4.2, 9.5, true, 'redesign', 'loft');
addPoint(2.25, -2.35, 0.05, 0xffc790, 3.4, 9.5, false, 'redesign', 'loft');
addPoint(1.15, -1.55, -0.4, 0xffc790, 3.0, 9.0, false, 'redesign', 'loft');
addSpot([3.92, -3.0, -2.74], [3.7, -3.0, -3.0], 0xffc78a, 3.0, 70, 0.8, 1.6, 'redesign', 'loft');
addSpot([3.92, -4.0, -2.74], [3.7, -4.0, -3.0], 0xffc78a, 3.0, 70, 0.8, 1.6, 'redesign', 'loft');
addSpot([-3.95, -3.43, -1.48], [-3.95, -3.43, -2.02], 0xffd2a0, 4.0, 62, 0.7, 2.0, 'redesign', 'loft');

// Secondary fills: skipped on phones to keep fragment shaders cheap
if (QUALITY.extraFillLights) {
  addPoint(-2.2, -1.05, -0.65, 0xffe0ba, 2.8, 7.0, false, 'common', 'loft');
  addPoint(0.12, 1.85, -1.15, 0xffe4c4, 3.2, 6.5, false, 'common', 'ground_n');
  addPoint(2.2, 0.1, -1.25, 0xffd9ad, 2.6, 6.5, false, 'common', 'loft');
  addPoint(0.25, 2.1, 1.55, 0xffe2be, 2.5, 7.0, false, 'common', 'upper_n');
  addPoint(-1.46, 3.42, 1.55, 0xeef6ff, 2.4, 4.5, false, 'current', 'upper_n');
  addPoint(-1.55, 3.65, 1.25, 0xffdcb0, 2.4, 4.5, false, 'redesign', 'upper_n');
  addPoint(5.04, 2.22, 0.50, 0xffad60, 2.5, 4.6, false, 'current', 'upper_n');
  addPoint(4.92, 1.38, 0.34, 0xff6e38, 1.8, 3.8, false, 'current', 'upper_n');
  addPoint(5.05, 4.68, 0.56, 0xffc790, 2.6, 4.8, false, 'redesign', 'upper_n');
  addPoint(5.05, 2.24, 0.56, 0xffc790, 2.6, 4.8, false, 'redesign', 'upper_n');
} else {
  hemiLight.intensity = 0.55; // compensate for the missing fills
}

const sunLight = new THREE.DirectionalLight(0xfff4e2, 0.0);
sunLight.position.copy(b2t(-5.5, -14.5, 9.5));
sunLight.target.position.copy(b2t(-1.0, 0.0, -2.5));
if (QUALITY.shadows) {
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(2048, 2048);
  Object.assign(sunLight.shadow.camera, { near: 0.5, far: 48, left: -16, right: 16, top: 16, bottom: -16 });
  sunLight.shadow.bias = -0.0005;
}
scene.add(sunLight, sunLight.target);

let isDaylight = false;
let activeZoneKey = '';
function activeZonesFor(camPos) {
  const xb = camPos.x;
  const yb = -camPos.z;
  const eye = camPos.y - GROUND_FLOOR_Z;
  if (camPos.y < -3.05) return ['podrum', 'ground_n', 'ext'];
  if (xb < -4.55 || xb > 5.65 || yb < -5.35 || yb > 5.25) return ['ext', 'loft'];
  if (camPos.y > 0.35 || eye > 2.2) return yb > 0.75 ? ['upper_n', 'loft'] : ['loft', 'upper_n'];
  return yb > 0.75 ? ['ground_n', 'loft'] : ['loft', 'ground_n'];
}
function syncLightZone(camPos, force = false) {
  const zones = activeZonesFor(camPos);
  const key = `${zones.join(',')}:${activeInterior}`;
  if (!force && key === activeZoneKey) return;
  activeZoneKey = key;
  managedLights.forEach((light) => {
    const { group, zone } = light.userData;
    const modeMatch = group === 'common' || group === activeInterior;
    const zoneMatch = zone === 'all' || zones.includes(zone);
    light.visible = modeMatch && zoneMatch;
  });
}

const baseHemi = hemiLight.intensity;
function applyLightingMode(day) {
  isDaylight = day;
  scene.background.setHex(day ? 0xbcd0e4 : 0x0b0d13);
  scene.environmentIntensity = day ? 0.85 : 0.24;
  hemiLight.color.setHex(day ? 0xf4f8ff : 0xffe9cf);
  hemiLight.groundColor.setHex(day ? 0x8a7968 : 0x2c241d);
  hemiLight.intensity = day ? 1.18 : baseHemi;
  sunLight.intensity = day ? 2.85 : 0.0;
  renderer.toneMappingExposure = day ? 1.02 : INTERIORS[activeInterior].exposure;
  managedLights.forEach((light) => {
    const { base } = light.userData;
    light.intensity = day ? base * 0.28 : base;
  });
  syncLightZone(camera.position, true);
  lightingIcon.textContent = day ? '☀' : '☾';
  lightingLabel.textContent = day ? 'Dan' : 'Večer';
  btnLighting.setAttribute('aria-pressed', String(day));
  renderer.shadowMap.needsUpdate = true;
  requestRender();
}
btnLighting.addEventListener('click', () => applyLightingMode(!isDaylight));

// ---------------------------------------------------------------------------
// Materials (per-interior colour grading lost in GLB export)
// ---------------------------------------------------------------------------
const GLASS_MATERIALS = [
  'Mat_Arch_Glass', 'Mat_Glass_Shelf', 'Mat_Frosted_Glass',
  'Mat_ENT_FrostedGlass', 'Mat_ENT_SmokedGlass', 'Mat_ENT_ClearGlass',
  'Mat_R2_SmokedFrosted', 'Mat_R2_ReededFrosted', 'Mat_R2_ClearGlass',
  'Mat_FH_Glass', 'Mat_FH_Frosted'
];

function tuneMaterial(mesh, m, interior) {
  const name = m.name || '';
  if (GLASS_MATERIALS.some((g) => name.includes(g))) {
    const isSmoked = name.includes('Smoked');
    const isFrosted = name.includes('Frosted');
    m.transparent = true;
    m.opacity = isSmoked ? 0.62 : (isFrosted ? 0.58 : 0.24);
    m.roughness = isFrosted ? 0.42 : 0.06;
    m.metalness = 0.08;
    m.depthWrite = false;
    mesh.castShadow = false; // glass must not block the sun / lamps
    return;
  }
  if (name.includes('_leaves')) {
    m.alphaTest = 0.42;
    m.transparent = false;
    m.side = THREE.DoubleSide;
  } else if (name.includes('Mat_Blue_LED') || name.includes('Mat_ENT_LEDBlue')) {
    m.emissive = new THREE.Color(0x2ea8ff);
    m.emissiveIntensity = 2.4;
  } else if (name.includes('Mat_R2_SaltCrystal')) {
    m.emissive = new THREE.Color(0xff5e24);
    m.emissiveIntensity = 2.0;
  } else if (name.includes('Mat_R2_CopperLining')) {
    m.emissive = new THREE.Color(0xff9442);
    m.emissiveIntensity = 1.5;
  } else if (name.includes('Mat_R2_LEDDaylight') || name.includes('Mat_FH_LEDCool')) {
    m.emissive = new THREE.Color(0xeaf5ff);
    m.emissiveIntensity = 2.6;
  } else if (name.includes('Mat_FH_LEDWarm') || name.includes('Mat_R3Fix_LEDWarm') || name.includes('Mat_ENT_LEDWarm')) {
    m.emissive = new THREE.Color(0xffcb92);
    m.emissiveIntensity = 2.2;
    mesh.castShadow = false;
  } else if (name.includes('Mat_R2_GlossWhite')) {
    m.roughness = 0.08;
    m.metalness = 0.02;
  } else if (name.includes('Mat_TV_Screen')) {
    m.color.setRGB(0.02, 0.02, 0.025);
    m.roughness = 0.08;
    m.metalness = 0.35;
  } else if (name.includes('Mat_R2_Mirror') || name.includes('Mat_FH_Mirror') || name.includes('Mat_ENT_Mirror')) {
    m.roughness = 0.02;
    m.metalness = 0.98;
  } else if (name.includes('Mat_R2_SanitaryCeramic') || name.includes('Mat_FH_Sanitary')) {
    m.roughness = 0.10;
    m.metalness = 0.02;
  } else if (interior === 'current') {
    if (name.includes('Mat_Sofa_GreyFabric')) {
      m.color.setRGB(0.28, 0.28, 0.3);
      m.roughness = 0.85;
    } else if (name.includes('Mat_OliveWood_Sculpt') || name.includes('Golden_Oak') || name.includes('oak_veneer')) {
      // The GLB optimiser deduplicated the identical oak materials into one; one warm honey-oak grade
      m.color.setRGB(1.03, 0.9, 0.74);
      m.roughness = 0.38;
    } else if (name.includes('red_bricks_04')) {
      m.color.setRGB(1.08, 0.94, 0.88);
    } else if (name.includes('dark_wooden_planks')) {
      m.color.setRGB(0.86, 0.73, 0.62);
      m.roughness = 0.46;
    } else if (name.includes('Mat_Lamp_Dome_White') || name.includes('Mat_Opal_Globe')) {
      m.emissive = new THREE.Color(0xffe6c2);
      m.emissiveIntensity = name.includes('Dome') ? 0.55 : 0.38;
      mesh.castShadow = false;
    }
  } else {
    // Redesign: the Blender Hue/Sat lift on limewash + whitewash is re-applied as a colour factor
    if (name.includes('beige_wall_001')) {
      m.color.setRGB(1.5, 1.43, 1.33);
      m.roughness = 0.95;
    } else if (name.includes('whitewashed_brick')) {
      m.color.setRGB(1.28, 1.24, 1.2);
    } else if (name.includes('oak_veneer')) {
      m.color.setRGB(1.05, 0.95, 0.82);
      m.roughness = 0.45;
    } else if (name.includes('Mat_Paper_Lantern') || name.includes('Mat_Paper_Rib')) {
      m.emissiveIntensity = name.includes('Rib') ? 0.35 : 0.85;
      mesh.castShadow = false; // lantern shells must not shadow their own bulb
    } else if (name.includes('Mat_LED_Warm')) {
      m.emissiveIntensity = 1.6;
      mesh.castShadow = false;
    }
  }
  m.needsUpdate = true;
}

// ---------------------------------------------------------------------------
// Model loading / switching
// ---------------------------------------------------------------------------
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('./node_modules/three/examples/jsm/libs/draco/gltf/');
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.setMeshoptDecoder(MeshoptDecoder);

const models = { current: null, redesign: null };
const modelPromises = { current: null, redesign: null };

function loadInterior(key, onProgress) {
  if (models[key]) return Promise.resolve(models[key]);
  if (modelPromises[key]) return modelPromises[key];
  modelPromises[key] = new Promise((resolve, reject) => {
    gltfLoader.load(
      INTERIORS[key].url,
      (gltf) => {
        const root = gltf.scene;
        root.name = `interior-${key}`;
        root.traverse((obj) => {
          if (!obj.isMesh) return;
          obj.castShadow = QUALITY.shadows;
          obj.receiveShadow = QUALITY.shadows;
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => m && tuneMaterial(obj, m, key));
        });
        root.visible = false;
        scene.add(root);
        models[key] = root;
        resolve(root);
      },
      (xhr) => {
        if (onProgress && xhr.total > 0) onProgress(Math.min(99, Math.round((xhr.loaded / xhr.total) * 100)));
      },
      (err) => {
        modelPromises[key] = null;
        reject(err);
      }
    );
  });
  return modelPromises[key];
}

// Phones keep only one interior in GPU memory (two full texture sets can trigger iOS context loss)
function disposeInterior(key) {
  const root = models[key];
  if (!root) return;
  root.traverse((obj) => {
    if (!obj.isMesh) return;
    obj.geometry.dispose();
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    mats.forEach((m) => {
      if (!m) return;
      Object.values(m).forEach((v) => v && v.isTexture && v.dispose());
      m.dispose();
    });
  });
  scene.remove(root);
  models[key] = null;
  modelPromises[key] = null;
  disposeCollider(colliders[key]);
  colliders[key] = null;
}

// Collision BVH per interior (walls, furniture, stairs) for the free walk mode, built on demand
const colliders = { current: null, redesign: null };
function getCollider(key) {
  if (!colliders[key] && models[key]) {
    const t0 = performance.now();
    colliders[key] = buildCollider(models[key]);
    console.info(`[walk] collider ${key}: ${colliders[key].userData.triangles} tris in ${Math.round(performance.now() - t0)} ms`);
  }
  return colliders[key];
}

const interiorToast = $('interior-toast');
const interiorButtons = Array.from(document.querySelectorAll('.isw-btn'));
let firstLoadDone = false;

function reflectInteriorInUi(key) {
  document.documentElement.dataset.interior = key;
  interiorButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.interior === key)));
  const url = new URL(location.href);
  if (key === 'redesign') url.searchParams.set('interijer', 'redizajn');
  else url.searchParams.delete('interijer');
  history.replaceState(null, '', url);
}

async function setInterior(key) {
  activeInterior = key;
  reflectInteriorInUi(key);
  applyLightingMode(isDaylight);
  // The other card variant has a different height: re-measure scroll anchors and card framing
  requestAnimationFrame(() => {
    computeScrollAnchors();
    computeCardShifts();
  });

  if (!models[key]) {
    const onProgress = (pct) => {
      if (!firstLoadDone) {
        loaderBar.style.width = `${pct}%`;
        loaderStatus.textContent = `Učitavanje 3D modela i PBR tekstura… ${pct}%`;
      } else {
        interiorToast.textContent = `Učitavam ${INTERIORS[key].name}… ${pct}%`;
      }
    };
    if (firstLoadDone) {
      interiorToast.textContent = `Učitavam ${INTERIORS[key].name}…`;
      interiorToast.classList.remove('hidden');
    }
    try {
      await loadInterior(key, onProgress);
    } catch (err) {
      console.error('GLB load error:', err);
      const msg = 'Greška pri učitavanju 3D modela. Osvježite stranicu.';
      if (!firstLoadDone) loaderStatus.textContent = msg;
      else interiorToast.textContent = msg;
      return;
    }
    interiorToast.classList.add('hidden');
  }
  if (activeInterior !== key) return; // user switched again while this one was loading

  Object.entries(models).forEach(([k, root]) => {
    if (root) root.visible = k === key;
  });
  if (IS_MOBILE) Object.keys(models).forEach((k) => k !== key && disposeInterior(k));
  if (isFreeMode) walk.setCollider(getCollider(key));
  if (specDrawer && !specDrawer.hidden) renderSpecDrawer(hudCache.stop >= 0 ? hudCache.stop : 0);
  renderer.shadowMap.needsUpdate = true;
  requestRender();

  if (!firstLoadDone) {
    firstLoadDone = true;
    loaderBar.style.width = '100%';
    loaderStatus.textContent = 'Prostor spreman!';
    computeScrollAnchors();
    computeCardShifts();
    jumpToHashStop();
    setTimeout(() => loaderEl.classList.add('fade-out'), 260);
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1500));
    // Pre-build the walk collider so entering 360° mode is instant (phones: lazily, to save memory)
    if (!IS_MOBILE) idle(() => getCollider(activeInterior), { timeout: 4000 });
    // Desktop: warm up the other interior in the background so switching is instant
    if (!IS_MOBILE) {
      const other = key === 'current' ? 'redesign' : 'current';
      idle(() => loadInterior(other).catch(() => {}));
    }
  }
}

interiorButtons.forEach((b) => b.addEventListener('click', () => {
  if (b.dataset.interior !== activeInterior) setInterior(b.dataset.interior);
}));
document.querySelectorAll('[data-switch-interior]').forEach((b) => b.addEventListener('click', () => {
  setInterior(b.dataset.switchInterior);
}));

canvas.addEventListener('webglcontextlost', (e) => {
  e.preventDefault();
  loaderEl.classList.remove('fade-out');
  loaderStatus.textContent = 'Grafički kontekst je izgubljen (premalo memorije). Osvježite stranicu.';
});

// ---------------------------------------------------------------------------
// Scroll → tour progress (piecewise-linear between section anchors)
// ---------------------------------------------------------------------------
// Anchor k = scroll position where section k's card is centred in the viewport. Mapping between anchors
// keeps the camera in sync with the cards even when cards wrap to different heights on phones.
let scrollAnchors = [];

function computeScrollAnchors() {
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  scrollAnchors = storySections.map((sec, k) => {
    if (k === 0) return 0;
    if (k === storySections.length - 1) return maxScroll;
    const centre = sec.offsetTop + sec.offsetHeight / 2 - window.innerHeight / 2;
    return THREE.MathUtils.clamp(centre, 0, maxScroll);
  });
  updateScrollTarget();
}

function scrollYToT(y) {
  const a = scrollAnchors;
  if (a.length < 2) return 0;
  if (y <= a[0]) return 0;
  for (let k = 0; k < a.length - 1; k++) {
    if (y <= a[k + 1]) {
      const span = Math.max(1, a[k + 1] - a[k]);
      return (k + (y - a[k]) / span) / (STOP_COUNT - 1);
    }
  }
  return 1;
}

let targetScrollT = 0;
let currentScrollT = 0;

function updateScrollTarget() {
  targetScrollT = THREE.MathUtils.clamp(scrollYToT(window.scrollY), 0, 1);
  requestRender();
}
window.addEventListener('scroll', updateScrollTarget, { passive: true });

function scrollToStop(stopIndex, behavior) {
  const top = scrollAnchors[stopIndex] ?? 0;
  if (isFreeMode) {
    // While walking, the room pills / minimap teleport instead of leaving the walk mode
    walk.teleport(STOP_POSES[stopIndex].cam, STOP_POSES[stopIndex].look);
    window.scrollTo({ top, behavior: 'auto' });
    targetScrollT = currentScrollT = stopIndex / (STOP_COUNT - 1);
    requestRender();
    return;
  }
  window.scrollTo({ top, behavior: behavior || (prefersReducedMotion ? 'auto' : 'smooth') });
}

navPills.forEach((pill) => {
  pill.addEventListener('click', () => scrollToStop(Number(pill.dataset.stop || 0)));
});
btnBackTop?.addEventListener('click', () => scrollToStop(0));

// Deep links from the contractor documentation: index.html#stop-9
function jumpToHashStop() {
  const m = /^#stop-(\d{1,2})$/.exec(location.hash);
  if (!m) return;
  const k = THREE.MathUtils.clamp(Number(m[1]), 0, STOP_COUNT - 1);
  scrollToStop(k, 'auto');
  currentScrollT = targetScrollT = k / (STOP_COUNT - 1);
}
window.addEventListener('hashchange', jumpToHashStop);

// ---------------------------------------------------------------------------
// Card-aware framing: shift the projection (like a tilt-shift lens, no distortion) so the room is centred
// in the part of the screen NOT covered by the story card (desktop: left/right, phones: bottom sheet).
// ---------------------------------------------------------------------------
let cardShifts = [];
const viewShift = { x: 0, y: 0 };

function computeCardShifts() {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const mobile = mobileLayoutMQ.matches;
  const hudBottom = document.querySelector('.top-hud')?.getBoundingClientRect().bottom ?? 0;
  cardShifts = storySections.map((sec) => {
    const card = sec.querySelector('.room-card');
    if (!card) return { x: 0, y: 0 };
    const r = card.getBoundingClientRect();
    if (mobile) {
      const freeTop = hudBottom;
      const freeBottom = Math.max(freeTop + 80, H - r.height - 12);
      return { x: 0, y: THREE.MathUtils.clamp(H / 2 - (freeTop + freeBottom) / 2, 0, H * 0.24) * 0.9 };
    }
    const left = card.classList.contains('side-left');
    const freeL = left ? r.right : 0;
    const freeR = left ? W : r.left;
    return { x: THREE.MathUtils.clamp((freeL + freeR) / 2 - W / 2, -W * 0.22, W * 0.22) * 0.8, y: 0 };
  });
}

function applyViewShift(dt) {
  let tx = 0;
  let ty = 0;
  if (!isFreeMode && cardShifts.length === STOP_COUNT) {
    tx = blendStop(currentScrollT, (k) => cardShifts[k].x);
    ty = blendStop(currentScrollT, (k) => cardShifts[k].y);
  }
  const a = prefersReducedMotion ? 1 : 1 - Math.exp(-dt * 6);
  const nx = viewShift.x + (tx - viewShift.x) * a;
  const ny = viewShift.y + (ty - viewShift.y) * a;
  const changed = Math.abs(nx - viewShift.x) > 0.05 || Math.abs(ny - viewShift.y) > 0.05;
  viewShift.x = Math.abs(nx - tx) < 0.05 ? tx : nx;
  viewShift.y = Math.abs(ny - ty) < 0.05 ? ty : ny;
  const W = window.innerWidth;
  const H = window.innerHeight;
  if (Math.abs(viewShift.x) < 0.5 && Math.abs(viewShift.y) < 0.5) {
    if (camera.view?.enabled) camera.clearViewOffset();
  } else {
    // Content moves right by sx when the view window starts sx px to the left, up when it starts lower
    camera.setViewOffset(W, H, -viewShift.x, viewShift.y, W, H);
  }
  return changed;
}

// ---------------------------------------------------------------------------
// Pointer parallax (desktop only)
// ---------------------------------------------------------------------------
let mouseX = 0;
let mouseY = 0;
let smoothMouseX = 0;
let smoothMouseY = 0;
const parallaxEnabled = !isCoarsePointer && !prefersReducedMotion;
if (parallaxEnabled) {
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || isFreeMode) return;
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    requestRender();
  });
}

// ---------------------------------------------------------------------------
// 360° free walk mode: WASD / arrows, drag to look, tap the floor to walk there, measuring tool
// ---------------------------------------------------------------------------
let isFreeMode = false;
let freeModeBusy = false;
const returnPose = { active: false, t: 0, pos: new THREE.Vector3(), quat: new THREE.Quaternion() };

const ndc = (x, y) => [(x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1];

// Floor cursor (Matterport-style ring) + tap ripple
const cursorGroup = new THREE.Group();
const cursorRing = new THREE.Mesh(
  new THREE.RingGeometry(0.15, 0.19, 48),
  new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 })
);
const cursorDisc = new THREE.Mesh(
  new THREE.CircleGeometry(0.15, 48),
  new THREE.MeshBasicMaterial({ color: 0xe0a96d, transparent: true, opacity: 0.22, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 })
);
cursorGroup.add(cursorRing, cursorDisc);
cursorGroup.visible = false;
cursorGroup.renderOrder = 998;
scene.add(cursorGroup);

const measure = new MeasureTool(scene, measureLayer);
measure.setVisible(false);

const walk = new WalkController({
  camera,
  dom: canvas,
  reducedMotion: prefersReducedMotion,
  onChange: requestRender,
  onTap: handleWalkTap,
  onHover: (x, y) => {
    pendingHover = { x, y };
    requestRender();
  }
});
let pendingHover = null;

function placeCursor(hit) {
  if (!hit) {
    cursorGroup.visible = false;
    return;
  }
  cursorGroup.position.copy(hit.point).addScaledVector(hit.normal, 0.01);
  cursorGroup.lookAt(_tmpV.copy(hit.point).add(hit.normal));
  cursorGroup.visible = true;
}
const _tmpV = new THREE.Vector3();

function processHover() {
  if (!pendingHover || !isFreeMode) return;
  const { x, y } = pendingHover;
  pendingHover = null;
  const hit = walk.raycast(...ndc(x, y));
  if (measure.active) {
    cursorGroup.visible = false;
    measure.preview(hit);
    if (hit) {
      const h = walk.heightAboveFloor(hit.point, hit.normal);
      hoverTip.textContent = h === null ? '' : `Visina od poda: ${Math.round(h * 100)} cm`;
      hoverTip.style.transform = `translate(${x + 16}px, ${y + 18}px)`;
      hoverTip.classList.toggle('hidden', h === null);
    } else {
      hoverTip.classList.add('hidden');
    }
    return;
  }
  hoverTip.classList.add('hidden');
  // Ring on walkable surfaces only (floors, stair treads)
  placeCursor(hit && hit.normal.y > 0.6 ? hit : null);
}

function handleWalkTap(x, y) {
  const hit = walk.raycast(...ndc(x, y));
  if (!hit) return;
  if (measure.active) {
    measure.addPoint(hit);
    btnMeasureClear.classList.toggle('hidden', !measure.hasItems);
    requestRender();
    return;
  }
  if (hit.normal.y > 0.6) {
    walk.walkTo(hit.point);
  } else if (Math.abs(hit.normal.y) < 0.35) {
    // Tapped a wall / cabinet front: walk up to it and stop ~45 cm in front
    walk.walkTo(hit.point.clone().addScaledVector(hit.normal, 0.45));
  }
}

function setMeasureMode(on) {
  measure.setActive(on);
  btnMeasure.classList.toggle('active', on);
  btnMeasure.setAttribute('aria-pressed', String(on));
  document.body.classList.toggle('measure-active', on);
  cursorGroup.visible = false;
  hoverTip.classList.add('hidden');
  requestRender();
}
btnMeasure?.addEventListener('click', () => setMeasureMode(!measure.active));
btnMeasureClear?.addEventListener('click', () => {
  measure.clear();
  btnMeasureClear.classList.add('hidden');
  requestRender();
});

// Virtual joystick for touch screens
if (joystick) {
  let stickId = null;
  const R = 46;
  const setKnob = (dx, dy) => {
    joystickKnob.style.transform = `translate(${dx}px, ${dy}px)`;
  };
  joystick.addEventListener('pointerdown', (e) => {
    stickId = e.pointerId;
    joystick.setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  joystick.addEventListener('pointermove', (e) => {
    if (e.pointerId !== stickId) return;
    const r = joystick.getBoundingClientRect();
    let dx = e.clientX - (r.left + r.width / 2);
    let dy = e.clientY - (r.top + r.height / 2);
    const len = Math.hypot(dx, dy);
    if (len > R) {
      dx *= R / len;
      dy *= R / len;
    }
    setKnob(dx, dy);
    walk.setStick(dx / R, -dy / R);
  });
  const end = (e) => {
    if (e.pointerId !== stickId) return;
    stickId = null;
    setKnob(0, 0);
    walk.setStick(0, 0);
  };
  joystick.addEventListener('pointerup', end);
  joystick.addEventListener('pointercancel', end);
}

function showToast(text) {
  interiorToast.textContent = text;
  interiorToast.classList.remove('hidden');
}

async function setFreeMode(enable) {
  if (enable === isFreeMode || freeModeBusy || !firstLoadDone || !models[activeInterior]) return;
  freeModeBusy = true;
  if (enable) {
    if (!colliders[activeInterior]) {
      showToast('Pripremam slobodnu šetnju…');
      await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 30))); // let the toast paint
      getCollider(activeInterior);
      interiorToast.classList.add('hidden');
    }
    returnPose.active = false;
    camera.clearViewOffset();
    viewShift.x = viewShift.y = 0;
    walk.setCollider(colliders[activeInterior]);
    walk.baseFov = verticalFovFor(WALK_HFOV);
    walk.enable();
    measure.setVisible(true);
    joystick?.classList.toggle('hidden', !isCoarsePointer);
  } else {
    walk.disable();
    setMeasureMode(false);
    measure.setVisible(false);
    cursorGroup.visible = false;
    joystick?.classList.add('hidden');
    // Glide back from wherever the visitor walked to the guided tour path
    returnPose.active = !prefersReducedMotion;
    returnPose.t = 0;
    returnPose.pos.copy(camera.position);
    returnPose.quat.copy(camera.quaternion);
  }
  isFreeMode = enable;
  document.body.classList.toggle('free-mode-active', enable);
  btnFreeMode.classList.toggle('active', enable);
  btnFreeMode.setAttribute('aria-pressed', String(enable));
  freeBanner.classList.toggle('hidden', !enable);
  modeLabel.textContent = enable ? 'Šetnja aktivna' : '360° šetnja';
  freeModeBusy = false;
  requestRender();
}

btnFreeMode.addEventListener('click', () => setFreeMode(!isFreeMode));
btnResumeScroll.addEventListener('click', () => setFreeMode(false));
window.addEventListener('keydown', (e) => {
  if (e.target instanceof HTMLElement && e.target.closest('input, textarea, select')) return;
  if (document.body.classList.contains('modal-open') || e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.code === 'KeyM' && isFreeMode) setMeasureMode(!measure.active);
  // Pressing a movement key in the guided tour jumps straight into walking
  if (!isFreeMode && ['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) setFreeMode(true);
});

// ---------------------------------------------------------------------------
// Photo vs render modal
// ---------------------------------------------------------------------------
const modal = $('compare-modal');
const modalTitle = $('modal-title');
const modalPhoto = $('modal-photo');
const modalRender = $('modal-render');
const modalClose = $('modal-close');
let lastFocused = null;

document.querySelectorAll('.compare-btn[data-photo]').forEach((btn) => {
  btn.addEventListener('click', () => {
    lastFocused = btn;
    modalTitle.textContent = btn.dataset.title || 'Usporedba';
    modalPhoto.src = btn.dataset.photo;
    modalRender.src = btn.dataset.render;
    $('modal-cap-a').textContent = btn.dataset.capA || 'Stvarna referentna fotografija (.JPG)';
    $('modal-cap-b').textContent = btn.dataset.capB || 'Blender Cycles 1:1 3D rekonstrukcija';
    modal.classList.remove('hidden');
    document.body.classList.add('modal-open');
    modalClose.focus();
  });
});

// Before / after slider (current vs redesign renders from the identical camera)
const baModal = $('ba-modal');
const baRange = $('ba-range');
const baStage = $('ba-stage');
let baLastFocused = null;

function setBaSplit(pct) {
  baStage.style.setProperty('--split', `${pct}%`);
  baRange.value = String(pct);
}

document.querySelectorAll('.ba-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    baLastFocused = btn;
    $('ba-title').textContent = btn.dataset.title || 'Prije / poslije';
    $('ba-before').src = btn.dataset.before;
    $('ba-after').src = btn.dataset.after;
    setBaSplit(50);
    baModal.classList.remove('hidden');
    document.body.classList.add('modal-open');
    $('ba-close').focus();
  });
});
baRange.addEventListener('input', () => setBaSplit(Number(baRange.value)));

function closeBaModal() {
  if (baModal.classList.contains('hidden')) return false;
  baModal.classList.add('hidden');
  document.body.classList.remove('modal-open');
  baLastFocused?.focus();
  return true;
}
$('ba-close').addEventListener('click', closeBaModal);
$('ba-backdrop').addEventListener('click', closeBaModal);

function closeModal() {
  if (modal.classList.contains('hidden')) return;
  modal.classList.add('hidden');
  document.body.classList.remove('modal-open');
  lastFocused?.focus();
}
modalClose.addEventListener('click', closeModal);
$('modal-backdrop').addEventListener('click', closeModal);
function escHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
}

function renderSpecDrawer(stopIdx) {
  if (!specDrawer || !specBody) return;
  const zone = ZONES[Math.max(0, Math.min(ZONES.length - 1, stopIdx))] || ZONES[0];
  const isCurrent = activeInterior === 'current';
  if (specKicker) {
    specKicker.textContent = `ZONA ${zone.code} · ${zone.floor.toUpperCase()} · ${isCurrent ? 'POSTOJEĆE' : 'REDIZAJN'}`;
  }
  if (specTitle) specTitle.textContent = zone.name;
  if (specFull) specFull.href = `./majstor.html#zona-${zone.code}`;

  const d = zone.dims;
  const kneeHtml = d.kneeWall_m != null ? `<div><span>Nadozid</span><strong>${d.kneeWall_m.toFixed(2)} m</strong></div>` : '';
  const dimsHtml = `
    <div class="dims">
      <div><span>Duljina × Širina</span><strong>${d.length_m.toFixed(2)} × ${d.width_m.toFixed(2)} m</strong></div>
      <div><span>Svijetla visina</span><strong>${d.clearHeight_m.toFixed(2)} m</strong></div>
      <div><span>Pod / Zidovi</span><strong>${d.floorArea_m2.toFixed(1)} / ${d.wallArea_m2.toFixed(1)} m²</strong></div>
      ${kneeHtml}
    </div>
    ${d.note ? `<p class="note">${escHtml(d.note)}</p>` : ''}`;

  if (isCurrent) {
    const existingList = (zone.existing || []).map((item) => `<li>${escHtml(item)}</li>`).join('');
    specBody.innerHTML = `
      ${dimsHtml}
      <h4>Postojeće stanje i opseg demontaže</h4>
      <ul>${existingList}</ul>
      <p class="note">${escHtml(PROJECT.disclaimer)}</p>`;
    return;
  }

  const r = zone.redesign;
  const finishesRows = (r.finishes || [])
    .map((f) => `<tr><td><strong>${escHtml(f.element)}</strong><br>${escHtml(f.material)}</td><td>${escHtml(f.spec)}</td><td class="num">${f.qty} ${escHtml(f.unit)}</td></tr>`)
    .join('');
  const furnitureRows = (r.furniture || [])
    .map((f) => `<tr><td><strong>${escHtml(f.item)}</strong><br>${escHtml(f.material)}</td><td>${escHtml(f.dims)}<br><span class="note">${escHtml(f.position)}</span></td></tr>`)
    .join('');
  const lightingList = (r.lighting || [])
    .map((l) => `<li><strong>${escHtml(l.item)} (${l.qty}×)</strong> — ${escHtml(l.spec)} · <em>${escHtml(l.mount)}</em></li>`)
    .join('');
  const electroList = (r.electrical || [])
    .map((el) => `<li><strong>${escHtml(el.item)} (${el.qty}×)</strong> — h=${el.height_cm} cm, ${escHtml(el.position)}</li>`)
    .join('');
  const plumbingList = (r.plumbing || [])
    .map((p) => `<li><strong>${escHtml(p.item)}</strong> — ${escHtml(p.spec)} · h=${p.height_cm} cm (${escHtml(p.position)})</li>`)
    .join('');
  const seqList = (r.sequence || []).map((s) => `<li>${escHtml(s)}</li>`).join('');

  specBody.innerHTML = `
    <p>${escHtml(r.summary)}</p>
    ${dimsHtml}
    ${finishesRows ? `<h4>Obloge i materijali</h4><table><thead><tr><th>Pozicija</th><th>Specifikacija</th><th class="num">Kol.</th></tr></thead><tbody>${finishesRows}</tbody></table>` : ''}
    ${furnitureRows ? `<h4>Stolarija i namještaj po mjeri</h4><table><thead><tr><th>Element</th><th>Dimenzije i pozicija</th></tr></thead><tbody>${furnitureRows}</tbody></table>` : ''}
    ${lightingList ? `<h4>Rasvjeta (2700 K)</h4><ul>${lightingList}</ul>` : ''}
    ${electroList ? `<h4>Elektroinstalacije</h4><ul>${electroList}</ul>` : ''}
    ${plumbingList ? `<h4>Vodovod i odvodnja</h4><ul>${plumbingList}</ul>` : ''}
    ${seqList ? `<h4>Redoslijed radova</h4><ol>${seqList}</ol>` : ''}
    <p class="note">${escHtml(PROJECT.disclaimer)}</p>`;
}

function setSpecOpen(open) {
  if (!specDrawer) return;
  specDrawer.hidden = !open;
  btnSpec?.setAttribute('aria-expanded', open ? 'true' : 'false');
  btnSpec?.classList.toggle('active', open);
  if (open) renderSpecDrawer(hudCache.stop >= 0 ? hudCache.stop : 0);
}

btnSpec?.addEventListener('click', () => setSpecOpen(Boolean(specDrawer?.hidden)));
specClose?.addEventListener('click', () => setSpecOpen(false));
specMeasure?.addEventListener('click', async () => {
  if (mobileLayoutMQ.matches) setSpecOpen(false);
  await setFreeMode(true);
  setMeasureMode(true);
});

window.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (closeBaModal()) return;
  if (!modal.classList.contains('hidden')) closeModal();
  else if (isFreeMode && measure.cancelPending()) requestRender();
  else if (specDrawer && !specDrawer.hidden) setSpecOpen(false);
  else if (isFreeMode) {
    if (measure.active) setMeasureMode(false);
    else setFreeMode(false);
  }
});

// ---------------------------------------------------------------------------
// Floor-plan minimap
// ---------------------------------------------------------------------------
function setupMinimapCanvas() {
  // Crisp drawing on high-DPI screens: back the 210×240 CSS box with a scaled bitmap
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  minimapCanvas.width = 210 * dpr;
  minimapCanvas.height = 240 * dpr;
  mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
setupMinimapCanvas();
const MAP_W = 210;
const MAP_H = 240;

const MINIMAP_BOUNDS = {
  ext:        { xMin: -13.5, xMax: 11.2, yMin: -12.0, yMax: 11.5 },
  podrum:     { xMin: -6.3,  xMax: 5.8,  yMin: -6.3,  yMax: 5.3 },
  prizemlje:  { xMin: -12.0, xMax: 6.0,  yMin: -6.8,  yMax: 5.5 },
  potkrovlje: { xMin: -4.8,  xMax: 5.9,  yMin: -5.3,  yMax: 5.3 }
};

function minimapModeFor(camPos) {
  const xb = camPos.x;
  const yb = -camPos.z;
  if (camPos.y < -3.05) {
    return (xb < -6.3 || xb > 5.8 || yb < -6.3 || yb > 5.3) ? 'ext' : 'podrum';
  }
  if (xb < -4.55 || xb > 5.65 || yb < -5.35 || yb > 5.25) {
    return (yb > -5.5 && xb > -12.0 && xb < 6.0 && camPos.y >= -3.05 && camPos.y <= 0.35) ? 'prizemlje' : 'ext';
  }
  return camPos.y > 0.35 ? 'potkrovlje' : 'prizemlje';
}

function worldToMinimap(xb, yb, bounds = MINIMAP_BOUNDS.prizemlje) {
  const pad = 12;
  const u = (xb - bounds.xMin) / (bounds.xMax - bounds.xMin);
  const v = 1.0 - (yb - bounds.yMin) / (bounds.yMax - bounds.yMin); // North (+Y Blender) at the top
  return [pad + u * (MAP_W - pad * 2), pad + v * (MAP_H - pad * 2)];
}

function drawRectPlan(x0, y0, x1, y1, fill, stroke = null, bounds = MINIMAP_BOUNDS.prizemlje) {
  const [px0, py0] = worldToMinimap(x0, y1, bounds);
  const [px1, py1] = worldToMinimap(x1, y0, bounds);
  mctx.fillStyle = fill;
  mctx.fillRect(px0, py0, px1 - px0, py1 - py0);
  if (stroke) {
    mctx.strokeStyle = stroke;
    mctx.lineWidth = 1;
    mctx.strokeRect(px0, py0, px1 - px0, py1 - py0);
  }
}

let lastMinimapMode = 'prizemlje';
function renderMinimap(camPos, lookPos, activeStop) {
  const xb = camPos.x;
  const yb = -camPos.z;
  const mode = minimapModeFor(camPos);
  lastMinimapMode = mode;
  const B = MINIMAP_BOUNDS[mode];
  mctx.clearRect(0, 0, MAP_W, MAP_H);

  if (mode === 'ext') {
    drawRectPlan(-13.5, 9.6, 11.2, 11.5, 'rgba(130,138,148,0.34)', 'rgba(255,255,255,0.2)', B); // Banfi road
    drawRectPlan(6.7, -9.5, 9.6, 9.6, 'rgba(220,210,196,0.24)', 'rgba(255,255,255,0.18)', B);   // East driveway
    drawRectPlan(-4.5, -9.5, 6.7, -5.1, 'rgba(220,210,196,0.22)', 'rgba(255,255,255,0.16)', B);  // Parking apron
    drawRectPlan(-12.2, -4.8, -7.6, -0.4, 'rgba(130,185,120,0.24)', 'rgba(224,169,109,0.5)', B); // 3D Vrt Pergola
    drawRectPlan(-6.0, -6.2, -4.4, 0.95, 'rgba(224,169,109,0.26)', 'rgba(224,169,109,0.55)', B); // Trijem + Ext stairs
    drawRectPlan(-4.4, -5.1, 4.3, 0.95, 'rgba(255,244,228,0.14)', 'rgba(255,238,214,0.45)', B);  // South volume
    drawRectPlan(-3.8, 0.95, 5.55, 5.1, 'rgba(255,244,228,0.12)', 'rgba(255,238,214,0.42)', B);  // North volume
  } else if (mode === 'podrum') {
    drawRectPlan(-6.0, -6.2, -4.4, -1.2, 'rgba(224,169,109,0.22)', 'rgba(224,169,109,0.45)', B); // Ext stairs
    drawRectPlan(-4.35, -5.0, -1.45, -0.4, 'rgba(224,169,109,0.16)', 'rgba(255,238,214,0.38)', B); // Radna
    drawRectPlan(-0.45, -5.0, 4.25, 0.85, 'rgba(255,244,228,0.08)', 'rgba(255,238,214,0.38)', B);  // Garaza
    drawRectPlan(-3.75, 0.95, 0.45, 2.35, 'rgba(224,169,109,0.22)', 'rgba(255,238,214,0.42)', B);  // U-stubiste + hodnik
    drawRectPlan(-3.75, 2.35, 0.45, 4.95, 'rgba(160,210,235,0.14)', 'rgba(255,238,214,0.38)', B);  // Veseraj
    drawRectPlan(0.45, 0.95, 5.45, 4.95, 'rgba(160,210,235,0.16)', 'rgba(255,238,214,0.38)', B);   // Kotlovnica
  } else if (mode === 'prizemlje') {
    drawRectPlan(-11.4, -4.6, -8.0, -0.4, 'rgba(130,185,120,0.20)', 'rgba(224,169,109,0.45)', B); // 3D Vrt Pergola
    drawRectPlan(-6.0, -6.1, -4.4, 0.95, 'rgba(224,169,109,0.22)', 'rgba(224,169,109,0.52)', B);  // Trijem + Vanjsko stubiste
    drawRectPlan(-4.35, -5.0, 4.25, 0.85, 'rgba(255,244,228,0.07)', 'rgba(255,238,214,0.32)', B);  // South Loft
    drawRectPlan(-2.95, -6.1, 2.95, -5.0, 'rgba(224,169,109,0.16)', 'rgba(224,169,109,0.45)', B);  // Balkon SE
    drawRectPlan(-4.34, -5.0, -3.65, -1.16, 'rgba(224,169,109,0.28)', null, B); // kitchen
    drawRectPlan(-0.68, -5.0, 0.68, -4.7, 'rgba(201,123,80,0.55)', null, B); // chimney
    drawRectPlan(3.1, -2.1, 4.15, 0.72, 'rgba(224,169,109,0.24)', null, B); // stairs lower
    drawRectPlan(-3.78, 0.95, -1.15, 4.95, 'rgba(255,244,228,0.06)', 'rgba(255,238,214,0.30)', B); // Soba 1 SZ
    drawRectPlan(-1.15, 0.95, 1.45, 2.65, 'rgba(224,169,109,0.14)', 'rgba(255,238,214,0.28)', B);  // Predsoblje + U-stair
    drawRectPlan(-1.15, 2.65, 1.45, 4.95, 'rgba(160,210,235,0.16)', 'rgba(255,238,214,0.30)', B);  // Kupaonica Pr
    drawRectPlan(1.45, 0.95, 5.54, 4.95, 'rgba(255,244,228,0.06)', 'rgba(255,238,214,0.30)', B);   // Soba 2 SI
  } else {
    drawRectPlan(-4.35, -5.0, 4.25, 0.85, 'rgba(255,244,228,0.04)', 'rgba(255,238,214,0.18)', B);  // South void
    drawRectPlan(-4.32, -2.1, -0.28, 0.85, 'rgba(224,169,109,0.20)', 'rgba(224,169,109,0.70)', B); // Galerija
    drawRectPlan(-0.28, -0.24, 0.15, 0.76, 'rgba(224,169,109,0.20)', 'rgba(224,169,109,0.70)', B); // Catwalk
    drawRectPlan(0.1, -0.25, 3.1, 0.72, 'rgba(224,169,109,0.24)', null, B); // stairs upper
    drawRectPlan(-3.78, 0.96, -1.45, 4.98, 'rgba(224,169,109,0.14)', 'rgba(224,169,109,0.72)', B); // Kupaonica Pk
    drawRectPlan(-1.45, 0.96, 1.91, 4.98, 'rgba(224,169,109,0.14)', 'rgba(224,169,109,0.72)', B);  // Garderoba
    drawRectPlan(1.91, 0.96, 5.54, 4.98, 'rgba(224,169,109,0.14)', 'rgba(224,169,109,0.72)', B);   // Spavaca Pk
    drawRectPlan(3.15, 2.52, 5.39, 4.45, 'rgba(224,169,109,0.44)', null, B); // king bed
  }

  STOP_POSES.forEach((st, idx) => {
    const [px, py] = worldToMinimap(st.cam.x, -st.cam.z, B);
    if (px < 0 || px > MAP_W || py < 0 || py > MAP_H) return;
    mctx.beginPath();
    mctx.arc(px, py, idx === activeStop ? 5.2 : 3.2, 0, Math.PI * 2);
    mctx.fillStyle = idx === activeStop ? '#e0a96d' : 'rgba(255,255,255,0.38)';
    mctx.fill();
  });

  const [cx, cy] = worldToMinimap(xb, yb, B);
  const [tx, ty] = worldToMinimap(lookPos.x, -lookPos.z, B);
  const angle = Math.atan2(ty - cy, tx - cx);
  const fovHalf = Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * camera.aspect);
  mctx.beginPath();
  mctx.moveTo(cx, cy);
  mctx.arc(cx, cy, 34, angle - fovHalf, angle + fovHalf);
  mctx.closePath();
  const grad = mctx.createRadialGradient(cx, cy, 2, cx, cy, 34);
  grad.addColorStop(0, 'rgba(224, 169, 109, 0.52)');
  grad.addColorStop(1, 'rgba(224, 169, 109, 0.0)');
  mctx.fillStyle = grad;
  mctx.fill();
  mctx.beginPath();
  mctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
  mctx.fillStyle = '#ffffff';
  mctx.fill();
  mctx.lineWidth = 2;
  mctx.strokeStyle = '#c97b50';
  mctx.stroke();
}

minimapCanvas.addEventListener('click', (e) => {
  const rect = minimapCanvas.getBoundingClientRect();
  const mx = ((e.clientX - rect.left) / rect.width) * MAP_W;
  const my = ((e.clientY - rect.top) / rect.height) * MAP_H;
  const B = MINIMAP_BOUNDS[lastMinimapMode] || MINIMAP_BOUNDS.prizemlje;
  let bestIdx = 0;
  let bestDist = Infinity;
  STOP_POSES.forEach((st, idx) => {
    const [px, py] = worldToMinimap(st.cam.x, -st.cam.z, B);
    const d = Math.hypot(mx - px, my - py);
    if (d < bestDist) {
      bestDist = d;
      bestIdx = idx;
    }
  });
  scrollToStop(bestIdx);
});

minimapToggle?.addEventListener('click', () => {
  const open = minimapCard.classList.toggle('open');
  minimapToggle.setAttribute('aria-expanded', String(open));
  requestRender();
});

// ---------------------------------------------------------------------------
// Resize (debounced: mobile URL-bar show/hide fires many resize events)
// ---------------------------------------------------------------------------
let resizeTimer = 0;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    updateCameraFov();
    renderer.setSize(window.innerWidth, window.innerHeight);
    walk.baseFov = verticalFovFor(WALK_HFOV);
    computeScrollAnchors();
    computeCardShifts();
    requestRender();
  }, 120);
});

// ---------------------------------------------------------------------------
// Render loop — renders only while something is changing (saves battery on phones)
// ---------------------------------------------------------------------------
let renderRequested = true;
function requestRender() {
  renderRequested = true;
}

const tmpLook = new THREE.Vector3();
const tmpPos = new THREE.Vector3();
const tmpRight = new THREE.Vector3();
const tmpFwd = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0);
const tmpQuat = new THREE.Quaternion();
const hudCache = { stop: -1, elev: '', pct: -1, floor: '' };

function updateHud(activeStop) {
  if (activeStop !== hudCache.stop) {
    hudCache.stop = activeStop;
    if (specDrawer && !specDrawer.hidden) renderSpecDrawer(activeStop);
    navPills.forEach((p, idx) => {
      const active = idx === activeStop;
      p.classList.toggle('active', active);
      if (active) p.setAttribute('aria-current', 'step');
      else p.removeAttribute('aria-current');
    });
    // Keep the active pill visible in the horizontally scrolling mobile nav. (Not scrollIntoView():
    // that can cancel the window's own smooth scroll in some browsers.)
    const pill = navPills[activeStop];
    if (pill && roomNav.scrollWidth > roomNav.clientWidth) {
      roomNav.scrollTo({
        left: pill.offsetLeft - (roomNav.clientWidth - pill.offsetWidth) / 2,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    }
  }
  const eye = camera.position.y - GROUND_FLOOR_Z;
  const elev = `${eye >= 0 ? '+' : ''}${eye.toFixed(2)} m`;
  if (elev !== hudCache.elev) elevReadout.textContent = hudCache.elev = elev;
  const pct = Math.round(currentScrollT * 100);
  if (pct !== hudCache.pct) {
    hudCache.pct = pct;
    scrollPctEl.textContent = `${pct}%`;
    railFill.style.height = `${pct}%`;
  }
  const xb = camera.position.x;
  const yb = -camera.position.z;
  let floor;
  if (camera.position.y < -3.05) {
    floor = (xb < -4.55 || xb > 5.65 || yb < -5.35 || yb > 5.25)
      ? 'VRT & PARCELA (-2.73 m)'
      : 'PODRUM (-2.73 m)';
  } else if (xb < -4.55 || xb > 5.65 || yb < -5.35 || yb > 5.25) {
    floor = 'VRT & PARCELA (±0.00 m)';
  } else if (yb > 0.95 && eye > 3.2) {
    floor = 'POTKROVLJE (+2.73 m)';
  } else if (eye > 3.6) {
    floor = 'GALERIJA / POTKROVLJE (+2.73 m)';
  } else if (eye > 2.2) {
    floor = 'STEPENIŠTE (USPON)';
  } else if (yb > 0.95) {
    floor = 'SJEVERNO KRILO • PRIZEMLJE (0.00 m)';
  } else {
    floor = 'PRIZEMLJE (0.00 m)';
  }
  if (floor !== hudCache.floor) floorBadge.textContent = hudCache.floor = floor;
}

function animate(now = performance.now()) {
  requestAnimationFrame(animate);
  const dt = Math.min(0.1, Math.max(0, (now - lastFrameTime) / 1000));
  lastFrameTime = now;

  let moving = false;
  if (!isFreeMode) {
    // Frame-rate independent easing (identical feel at 60 Hz and 120 Hz)
    const dT = targetScrollT - currentScrollT;
    if (Math.abs(dT) > 1e-5) {
      currentScrollT += dT * (prefersReducedMotion ? 1 : 1 - Math.exp(-dt * 4.6));
      moving = true;
    } else {
      currentScrollT = targetScrollT;
    }
    const dmx = mouseX - smoothMouseX;
    const dmy = mouseY - smoothMouseY;
    if (Math.abs(dmx) > 1e-4 || Math.abs(dmy) > 1e-4) {
      const a = 1 - Math.exp(-dt * 3.7);
      smoothMouseX += dmx * a;
      smoothMouseY += dmy * a;
      moving = true;
    }
    if (returnPose.active) moving = true;
  } else {
    processHover();
    if (walk.update(dt)) moving = true;
  }
  if (applyViewShift(dt)) moving = true;

  if (!moving && !renderRequested) return;
  renderRequested = false;

  let activeStop;
  if (!isFreeMode) {
    const curveU = scrollTToCurveU(currentScrollT);
    poseAt(curveU, tmpPos, tmpLook);
    const par = blendStop(currentScrollT, (k) => STOP_VIEW[k].parallax);
    tmpFwd.copy(tmpLook).sub(tmpPos).normalize();
    tmpRight.crossVectors(tmpFwd, UP).normalize();
    tmpLook.addScaledVector(tmpRight, smoothMouseX * 0.26 * par).addScaledVector(UP, -smoothMouseY * 0.14 * par);
    camera.position.copy(tmpPos);
    camera.lookAt(tmpLook);
    if (returnPose.active) {
      returnPose.t = Math.min(1, returnPose.t + dt / 0.9);
      const e = smoothstep01(returnPose.t);
      camera.position.lerpVectors(returnPose.pos, tmpPos, e);
      tmpQuat.copy(camera.quaternion);
      camera.quaternion.slerpQuaternions(returnPose.quat, tmpQuat, e);
      if (returnPose.t >= 1) returnPose.active = false;
    }
    // Wider lens in small rooms
    const fov = verticalFovFor(blendStop(currentScrollT, (k) => STOP_VIEW[k].hfov));
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
    activeStop = THREE.MathUtils.clamp(Math.round(currentScrollT * (STOP_COUNT - 1)), 0, STOP_COUNT - 1);
  } else {
    camera.getWorldDirection(tmpFwd);
    tmpLook.copy(camera.position).addScaledVector(tmpFwd, 2);
    activeStop = nearestStop(camera.position);
    measure.updateLabels(camera, window.innerWidth, window.innerHeight);
  }

  syncLightZone(camera.position);
  updateHud(activeStop);
  // (offsetParent is always null for position:fixed elements, so visibility is tracked explicitly)
  if (!mobileLayoutMQ.matches || minimapCard.classList.contains('open')) {
    renderMinimap(camera.position, tmpLook, activeStop);
  }
  renderer.render(scene, camera);
}

/** Room the walker is in: nearest stop viewpoint on the same storey. */
function nearestStop(p) {
  let best = 0;
  let bestD = Infinity;
  STOP_POSES.forEach((s, k) => {
    const d = Math.hypot(s.cam.x - p.x, s.cam.z - p.z) + Math.abs(s.cam.y - p.y) * 3;
    if (d < bestD) {
      bestD = d;
      best = k;
    }
  });
  return best;
}

let lastFrameTime = performance.now();
computeScrollAnchors();
setInterior(activeInterior);
animate();
