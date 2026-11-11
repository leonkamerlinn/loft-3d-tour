import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

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
const STOP_COUNT = 8;

// 8 room stops (even indices) + 7 corridor midpoints (odd indices).
// CatmullRomCurve3.getPoint(t) is parameterised by control-point index, so t = k / 7 lands exactly
// on stop k. Every node was ray-cast checked in Blender for wall/beam clearance.
const TOUR_NODES = [
  { cam: [0.12, 0.36, -1.36], look: [-0.35, -4.2, -0.95] }, // 01 Atrij
  { cam: [-1.55, -0.42, -1.4], look: [-3.35, -2.35, -1.48] },
  { cam: [-2.82, -1.72, -1.4], look: [-4.05, -3.75, -1.55] }, // 02 Kuhinja
  { cam: [-1.75, -1.58, -1.4], look: [-1.85, -3.45, -1.62] },
  { cam: [-0.08, -2.02, -1.4], look: [-1.45, -4.55, -1.48] }, // 03 Blagovaonica (IMG_6449)
  { cam: [-0.22, -2.25, -1.4], look: [-0.55, -4.75, -1.05] },
  { cam: [0.05, -2.5, -1.4], look: [0.0, -4.85, -1.15] }, // 04 Kamin
  { cam: [0.45, -3.75, -1.4], look: [2.2, -2.9, -1.42] },
  { cam: [0.68, -4.28, -1.4], look: [2.65, -1.95, -1.32] }, // 05 Boravak (IMG_6452 / 6453)
  { cam: [2.88, -3.5, -1.38], look: [2.75, -0.75, -1.22] },
  { cam: [2.85, -2.38, -1.35], look: [2.08, 0.38, -1.08] }, // 06 Stepenište
  { cam: [3.48, -0.35, -0.38], look: [0.85, -1.55, -0.15] },
  { cam: [1.52, 0.22, 0.48], look: [-0.95, -3.15, 0.28] }, // 07 Krovište
  { cam: [0.05, -0.75, 0.8], look: [-2.6, -1.0, 0.6] }, // passes under tie beam, over railing
  { cam: [-0.75, -1.0, 1.12], look: [-3.4, -0.95, 0.15] } // 08 Galerija (between trusses)
];

const STOP_BLENDER_COORDS = TOUR_NODES.filter((_, i) => i % 2 === 0);

const camCurve = new THREE.CatmullRomCurve3(TOUR_NODES.map((n) => b2t(...n.cam)), false, 'catmullrom', 0.38);
const lookCurve = new THREE.CatmullRomCurve3(TOUR_NODES.map((n) => b2t(...n.look)), false, 'catmullrom', 0.38);

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

const camera = new THREE.PerspectiveCamera(66, window.innerWidth / window.innerHeight, 0.06, 65);

// Keep a usable horizontal field of view on portrait phones (vertical FOV alone gets very narrow).
function updateCameraFov() {
  const aspect = window.innerWidth / window.innerHeight;
  const minHorizontalFov = THREE.MathUtils.degToRad(64);
  const neededVertical = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(minHorizontalFov / 2) / aspect));
  camera.fov = THREE.MathUtils.clamp(neededVertical, 66, 96);
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
}
updateCameraFov();

// OrbitControls are created WITHOUT a DOM element: connecting them sets `touch-action: none` on the
// canvas, which would block native touch scrolling on phones. We only connect in 360° free mode.
const controls = new OrbitControls(camera);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.rotateSpeed = IS_MOBILE ? 0.5 : 0.65;
controls.zoomSpeed = 0.8;
controls.minDistance = 0.25;
controls.maxDistance = 7.5;
controls.maxPolarAngle = Math.PI * 0.92;

// ---------------------------------------------------------------------------
// Lighting
// ---------------------------------------------------------------------------
const eveningLights = [];

const hemiLight = new THREE.HemisphereLight(0xffe9cf, 0x2c241d, 0.42);
scene.add(hemiLight);

function addPoint(xb, yb, zb, color, intensity, distance = 9, castShadow = false) {
  const l = new THREE.PointLight(color, intensity, distance, 1.7);
  l.position.copy(b2t(xb, yb, zb));
  if (castShadow && QUALITY.shadows) {
    l.castShadow = true;
    l.shadow.mapSize.set(1024, 1024);
    l.shadow.bias = -0.0008;
    l.shadow.radius = 3;
  }
  scene.add(l);
  eveningLights.push({ light: l, base: intensity });
  return l;
}

function addSpot(posB, targetB, color, intensity, angleDeg, penumbra = 0.45, dist = 8) {
  const s = new THREE.SpotLight(color, intensity, dist, THREE.MathUtils.degToRad(angleDeg), penumbra, 1.6);
  s.position.copy(b2t(...posB));
  s.target.position.copy(b2t(...targetB));
  scene.add(s, s.target);
  eveningLights.push({ light: s, base: intensity });
  return s;
}

// Dining pendant domes
addPoint(-1.86, -3.55, -1.36, 0xffd29e, 5.2, 8.5, true);
addPoint(-1.86, -2.88, -1.36, 0xffd29e, 5.2, 8.5, false);
// Brick chimney up/down sconces
addSpot([-0.44, -4.64, -1.32], [-0.44, -4.73, 0.35], 0xffcf96, 6.5, 36, 0.55, 4.5);
addSpot([-0.44, -4.64, -1.43], [-0.44, -4.73, -2.95], 0xffcf96, 6.5, 36, 0.55, 4.5);
addSpot([0.44, -4.64, -1.32], [0.44, -4.73, 0.35], 0xffcf96, 6.5, 36, 0.55, 4.5);
addSpot([0.44, -4.64, -1.43], [0.44, -4.73, -2.95], 0xffcf96, 6.5, 36, 0.55, 4.5);
// Living room opal globes
addPoint(1.35, -3.45, -0.55, 0xffdcb4, 4.4, 9.5, true);
addPoint(2.25, -2.35, -0.35, 0xffdcb4, 3.8, 9.5, false);
addPoint(1.15, -1.55, -0.75, 0xffdcb4, 3.4, 9.0, false);
// East wall 4-way X sconce
addSpot([4.11, -1.79, -0.89], [4.16, -2.85, -1.95], 0xffca85, 8.0, 14, 0.4, 4.2);
addSpot([4.11, -1.79, -0.81], [4.16, -2.85, 0.25], 0xffca85, 8.0, 14, 0.4, 4.2);
addSpot([4.11, -1.71, -0.89], [4.16, -0.65, -1.95], 0xffca85, 8.0, 14, 0.4, 4.2);
addSpot([4.11, -1.71, -0.81], [4.16, -0.65, 0.25], 0xffca85, 8.0, 14, 0.4, 4.2);
// Kitchen + gallery (always on)
addPoint(-3.1, -2.55, -0.65, 0xffe0ba, 3.6, 7.5, false);
addPoint(-2.35, -0.6, 1.45, 0xffe2be, 4.8, 9.0, false);
// Secondary fills: skipped on phones to keep fragment shaders cheap
if (QUALITY.extraFillLights) {
  addPoint(-2.2, -1.05, -0.65, 0xffe0ba, 2.8, 7.0, false);
  addPoint(0.12, 1.85, -1.15, 0xffe4c4, 3.2, 6.5, false);
  addPoint(2.2, 0.1, -1.25, 0xffd9ad, 2.6, 6.5, false);
  addPoint(0.25, 2.1, 1.55, 0xffe2be, 2.5, 7.0, false);
} else {
  hemiLight.intensity = 0.55; // compensate for the missing fills
}

const sunLight = new THREE.DirectionalLight(0xfff4e2, 0.0);
sunLight.position.copy(b2t(-2.2, -9.5, 4.2));
sunLight.target.position.copy(b2t(0.0, -1.5, -2.2));
if (QUALITY.shadows) {
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(2048, 2048);
  Object.assign(sunLight.shadow.camera, { near: 1, far: 22, left: -7, right: 7, top: 7, bottom: -7 });
  sunLight.shadow.bias = -0.0005;
}
scene.add(sunLight, sunLight.target);

let isDaylight = false;
const baseHemi = hemiLight.intensity;
function applyLightingMode(day) {
  isDaylight = day;
  scene.background.setHex(day ? 0xcfdbe6 : 0x0b0d13);
  scene.environmentIntensity = day ? 0.82 : 0.24;
  hemiLight.color.setHex(day ? 0xf4f8ff : 0xffe9cf);
  hemiLight.groundColor.setHex(day ? 0x8a7968 : 0x2c241d);
  hemiLight.intensity = day ? 1.15 : baseHemi;
  sunLight.intensity = day ? 2.8 : 0.0;
  renderer.toneMappingExposure = day ? 1.02 : 1.08;
  eveningLights.forEach(({ light, base }) => {
    light.intensity = day ? base * 0.25 : base;
  });
  lightingIcon.textContent = day ? '☀' : '☾';
  lightingLabel.textContent = day ? 'Dan' : 'Večer';
  btnLighting.setAttribute('aria-pressed', String(day));
  renderer.shadowMap.needsUpdate = true;
  requestRender();
}
btnLighting.addEventListener('click', () => applyLightingMode(!isDaylight));

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------
const GLASS_MATERIALS = ['Mat_Arch_Glass', 'Mat_Glass_Shelf', 'Mat_Frosted_Glass'];

function tuneMaterial(mesh, m) {
  const name = m.name || '';
  if (GLASS_MATERIALS.some((g) => name.includes(g))) {
    m.transparent = true;
    m.opacity = name.includes('Frosted') ? 0.55 : 0.24;
    m.roughness = name.includes('Frosted') ? 0.6 : 0.06;
    m.metalness = 0.1;
    m.depthWrite = false;
    mesh.castShadow = false; // glass must not block the sun / lamps
    return;
  }
  if (name.includes('Mat_Sofa_GreyFabric')) {
    m.color.setRGB(0.28, 0.28, 0.3);
    m.roughness = 0.85;
  } else if (name.includes('Mat_OliveWood_Sculpt') || name.includes('Golden_Oak') || name.includes('oak_veneer')) {
    // The GLB optimiser deduplicated all three identical oak materials into one; give it a single warm
    // honey-oak grade (previously only the sculpture was darkened, which would now darken all oak).
    m.color.setRGB(1.03, 0.9, 0.74);
    m.roughness = 0.38;
  } else if (name.includes('red_bricks_04')) {
    m.color.setRGB(1.08, 0.94, 0.88);
  } else if (name.includes('dark_wooden_planks')) {
    m.color.setRGB(0.86, 0.73, 0.62);
    m.roughness = 0.46;
  } else if (name.includes('potted_plant_02_leaves')) {
    m.alphaTest = 0.42;
    m.transparent = false;
    m.side = THREE.DoubleSide;
  } else if (name.includes('Mat_Lamp_Dome_White') || name.includes('Mat_Opal_Globe')) {
    m.emissive = new THREE.Color(0xffe6c2);
    m.emissiveIntensity = name.includes('Dome') ? 0.55 : 0.38;
    mesh.castShadow = false; // lamp shades must not shadow their own light
  } else if (name.includes('Mat_Blue_LED')) {
    m.emissive = new THREE.Color(0x2ea8ff);
    m.emissiveIntensity = 2.4;
  } else if (name.includes('Mat_TV_Screen')) {
    m.color.setRGB(0.02, 0.02, 0.025);
    m.roughness = 0.08;
    m.metalness = 0.35;
  }
  m.needsUpdate = true;
}

const gltfLoader = new GLTFLoader();
gltfLoader.setMeshoptDecoder(MeshoptDecoder);
gltfLoader.load(
  './assets/room_3d.glb',
  (gltf) => {
    gltf.scene.traverse((obj) => {
      if (!obj.isMesh) return;
      obj.castShadow = QUALITY.shadows;
      obj.receiveShadow = QUALITY.shadows;
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach((m) => m && tuneMaterial(obj, m));
    });
    scene.add(gltf.scene);
    renderer.shadowMap.needsUpdate = true;
    loaderBar.style.width = '100%';
    loaderStatus.textContent = 'Prostor spreman!';
    computeScrollAnchors();
    requestRender();
    setTimeout(() => loaderEl.classList.add('fade-out'), 260);
  },
  (xhr) => {
    if (xhr.total > 0) {
      const pct = Math.min(99, Math.round((xhr.loaded / xhr.total) * 100));
      loaderBar.style.width = `${pct}%`;
      loaderStatus.textContent = `Učitavanje 3D modela i PBR tekstura… ${pct}%`;
    }
  },
  (err) => {
    console.error('GLB load error:', err);
    loaderStatus.textContent = 'Greška pri učitavanju 3D modela. Osvježite stranicu.';
  }
);

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

function scrollToStop(stopIndex) {
  if (isFreeMode) setFreeMode(false);
  const top = scrollAnchors[stopIndex] ?? 0;
  window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
}

navPills.forEach((pill) => {
  pill.addEventListener('click', () => scrollToStop(Number(pill.dataset.stop || 0)));
});
btnBackTop?.addEventListener('click', () => scrollToStop(0));

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
    if (e.pointerType !== 'mouse') return;
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    requestRender();
  });
}

// ---------------------------------------------------------------------------
// 360° free mode
// ---------------------------------------------------------------------------
let isFreeMode = false;

function setFreeMode(enable) {
  isFreeMode = enable;
  document.body.classList.toggle('free-mode-active', enable);
  btnFreeMode.classList.toggle('active', enable);
  btnFreeMode.setAttribute('aria-pressed', String(enable));
  freeBanner.classList.toggle('hidden', !enable);
  modeLabel.textContent = enable ? 'Aktivni 360°' : '360° pogled';

  if (enable) {
    const camPos = camCurve.getPoint(currentScrollT);
    const dir = lookCurve.getPoint(currentScrollT).sub(camPos).normalize();
    camera.position.copy(camPos);
    controls.target.copy(camPos).addScaledVector(dir, 1.85);
    controls.connect(canvas); // takes over touch/mouse input only now
    controls.update();
  } else {
    controls.disconnect(); // restores native touch scrolling on the canvas
  }
  requestRender();
}

btnFreeMode.addEventListener('click', () => setFreeMode(!isFreeMode));
btnResumeScroll.addEventListener('click', () => setFreeMode(false));
controls.addEventListener('change', requestRender);

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
    modal.classList.remove('hidden');
    document.body.classList.add('modal-open');
    modalClose.focus();
  });
});

function closeModal() {
  if (modal.classList.contains('hidden')) return;
  modal.classList.add('hidden');
  document.body.classList.remove('modal-open');
  lastFocused?.focus();
}
modalClose.addEventListener('click', closeModal);
$('modal-backdrop').addEventListener('click', closeModal);
window.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (!modal.classList.contains('hidden')) closeModal();
  else if (isFreeMode) setFreeMode(false);
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

function worldToMinimap(xb, yb) {
  const pad = 16;
  const u = (xb + 4.5) / 9.0;
  const v = 1.0 - (yb + 5.2) / 10.4; // North (+Y Blender) at the top
  return [pad + u * (MAP_W - pad * 2), pad + v * (MAP_H - pad * 2)];
}

function drawRectPlan(x0, y0, x1, y1, fill, stroke = null) {
  const [px0, py0] = worldToMinimap(x0, y1);
  const [px1, py1] = worldToMinimap(x1, y0);
  mctx.fillStyle = fill;
  mctx.fillRect(px0, py0, px1 - px0, py1 - py0);
  if (stroke) {
    mctx.strokeStyle = stroke;
    mctx.lineWidth = 1;
    mctx.strokeRect(px0, py0, px1 - px0, py1 - py0);
  }
}

function renderMinimap(camPos, lookPos, activeStop) {
  const xb = camPos.x;
  const yb = -camPos.z;
  const isUpper = camPos.y > 0.1;
  mctx.clearRect(0, 0, MAP_W, MAP_H);

  drawRectPlan(-4.35, -5.0, 4.25, 0.85, 'rgba(255,244,228,0.06)', 'rgba(255,238,214,0.28)');
  drawRectPlan(-1.3, 0.85, 2.0, 5.0, 'rgba(255,244,228,0.04)', 'rgba(255,238,214,0.18)');

  const a = isUpper ? 0.12 : 0.26;
  drawRectPlan(-4.34, -5.0, -3.65, -1.16, `rgba(224,169,109,${a})`); // kitchen
  drawRectPlan(-2.38, -4.2, -1.34, -2.27, `rgba(224,169,109,${a + 0.08})`); // dining table
  drawRectPlan(-0.68, -5.0, 0.68, -4.7, 'rgba(201,123,80,0.55)'); // chimney
  drawRectPlan(0.0, -2.2, 2.7, -1.2, `rgba(200,200,210,${a})`); // sofa N
  drawRectPlan(-0.1, -3.6, 0.95, -1.9, `rgba(200,200,210,${a})`); // sofa W
  drawRectPlan(3.65, -4.75, 4.2, -2.38, `rgba(255,255,255,${a})`); // TV console
  drawRectPlan(3.1, -2.1, 4.15, 0.72, 'rgba(224,169,109,0.24)'); // stairs lower
  drawRectPlan(0.1, -0.25, 3.1, 0.72, 'rgba(224,169,109,0.24)'); // stairs upper
  drawRectPlan(
    -4.32, -2.1, -0.28, 0.85,
    isUpper ? 'rgba(224,169,109,0.20)' : 'rgba(255,255,255,0.02)',
    isUpper ? 'rgba(224,169,109,0.75)' : 'rgba(255,255,255,0.12)'
  );
  if (isUpper) drawRectPlan(-3.95, -1.65, -2.38, 0.14, 'rgba(224,169,109,0.45)'); // desk

  STOP_BLENDER_COORDS.forEach((st, idx) => {
    const [px, py] = worldToMinimap(st.cam[0], st.cam[1]);
    mctx.beginPath();
    mctx.arc(px, py, idx === activeStop ? 5.2 : 3.4, 0, Math.PI * 2);
    mctx.fillStyle = idx === activeStop ? '#e0a96d' : 'rgba(255,255,255,0.38)';
    mctx.fill();
  });

  const [cx, cy] = worldToMinimap(xb, yb);
  const [tx, ty] = worldToMinimap(lookPos.x, -lookPos.z);
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
  let bestIdx = 0;
  let bestDist = Infinity;
  STOP_BLENDER_COORDS.forEach((st, idx) => {
    const [px, py] = worldToMinimap(st.cam[0], st.cam[1]);
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
    computeScrollAnchors();
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
const tmpRight = new THREE.Vector3();
const tmpFwd = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0);
const hudCache = { stop: -1, elev: '', pct: -1, floor: '' };
const lerpFactor = prefersReducedMotion ? 1 : 0.075;

function updateHud(activeStop) {
  if (activeStop !== hudCache.stop) {
    hudCache.stop = activeStop;
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
  const elev = `+${eye.toFixed(2)} m`;
  if (elev !== hudCache.elev) elevReadout.textContent = hudCache.elev = elev;
  const pct = Math.round(currentScrollT * 100);
  if (pct !== hudCache.pct) {
    hudCache.pct = pct;
    scrollPctEl.textContent = `${pct}%`;
    railFill.style.height = `${pct}%`;
  }
  const floor = eye > 3.6 ? 'GALERIJA / KAT (+2.74 m)' : eye > 2.2 ? 'STEPENIŠTE (USPON)' : 'PRIZEMLJE (0.00 m)';
  if (floor !== hudCache.floor) floorBadge.textContent = hudCache.floor = floor;
}

function animate() {
  requestAnimationFrame(animate);

  let moving = false;
  if (!isFreeMode) {
    const dt = targetScrollT - currentScrollT;
    if (Math.abs(dt) > 1e-5) {
      currentScrollT += dt * lerpFactor;
      moving = true;
    } else {
      currentScrollT = targetScrollT;
    }
    const dmx = mouseX - smoothMouseX;
    const dmy = mouseY - smoothMouseY;
    if (Math.abs(dmx) > 1e-4 || Math.abs(dmy) > 1e-4) {
      smoothMouseX += dmx * 0.06;
      smoothMouseY += dmy * 0.06;
      moving = true;
    }
  } else if (controls.update()) {
    moving = true; // damping still settling
  }

  if (!moving && !renderRequested) return;
  renderRequested = false;

  if (!isFreeMode) {
    const camPos = camCurve.getPoint(currentScrollT);
    const baseLook = lookCurve.getPoint(currentScrollT);
    tmpFwd.copy(baseLook).sub(camPos).normalize();
    tmpRight.crossVectors(tmpFwd, UP).normalize();
    tmpLook.copy(baseLook)
      .addScaledVector(tmpRight, smoothMouseX * 0.28)
      .addScaledVector(UP, -smoothMouseY * 0.16);
    camera.position.copy(camPos);
    camera.lookAt(tmpLook);
  } else {
    tmpLook.copy(controls.target);
  }

  const activeStop = THREE.MathUtils.clamp(Math.round(currentScrollT * (STOP_COUNT - 1)), 0, STOP_COUNT - 1);
  updateHud(activeStop);
  // (offsetParent is always null for position:fixed elements, so visibility is tracked explicitly)
  if (!mobileLayoutMQ.matches || minimapCard.classList.contains('open')) {
    renderMinimap(camera.position, tmpLook, activeStop);
  }
  renderer.render(scene, camera);
}

applyLightingMode(false);
computeScrollAnchors();
animate();
