import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// Convert Blender Z-up (xb, yb, zb) -> glTF / Three.js Y-up (xb, zb, -yb)
const b2t = (xb, yb, zb) => new THREE.Vector3(xb, zb, -yb);

const GROUND_FLOOR_Z = -2.999; // 0.00 m reference floor height in Blender meters

// 8 Exact Room Stops (even indices 0,2,4,6,8,10,12,14) + 7 Corridor Midpoints (odd indices 1,3,5,7,9,11,13)
// Using curve.getPoint(t) guarantees t = k/7 lands 100% on Stop k while curving cleanly around furniture!
const TOUR_NODES = [
  // STOP 0 (idx 0): 01 Ulaz & Atrij
  { cam: [0.12, 0.36, -1.36], look: [-0.35, -4.20, -0.95], label: 'Atrij' },
  // Mid 0->1 (idx 1): Westward corridor North of mezzanine pier
  { cam: [-1.55, -0.42, -1.40], look: [-3.35, -2.35, -1.48] },

  // STOP 1 (idx 2): 02 Kuhinja
  { cam: [-2.82, -1.72, -1.40], look: [-4.05, -3.75, -1.55], label: 'Kuhinja' },
  // Mid 1->2 (idx 3): Around North head of dining table
  { cam: [-1.75, -1.58, -1.40], look: [-1.85, -3.45, -1.62] },

  // STOP 2 (idx 4): 03 Blagovaonica (matches IMG_6449 / ReconCam)
  { cam: [-0.08, -2.02, -1.40], look: [-1.45, -4.55, -1.48], label: 'Blagovaonica' },
  // Mid 2->3 (idx 5): Central walkway between pink chairs and grey sofa
  { cam: [-0.68, -2.85, -1.40], look: [-0.20, -4.55, -1.35] },

  // STOP 3 (idx 6): 04 Kamin & Opeka
  { cam: [-0.76, -3.62, -1.42], look: [0.02, -4.72, -1.12], label: 'Kamin' },
  // Mid 3->4 (idx 7): Wide South patio walkway into living room
  { cam: [0.12, -4.28, -1.40], look: [1.95, -3.10, -1.45] },

  // STOP 4 (idx 8): 05 Dnevni boravak & TV zid (matches IMG_6452 / IMG_6453)
  { cam: [0.68, -4.28, -1.40], look: [2.65, -1.95, -1.32], label: 'Boravak' },
  // Mid 4->5 (idx 9): Open rug aisle between coffee table and TV console
  { cam: [2.88, -3.50, -1.38], look: [2.75, -0.75, -1.22] },

  // STOP 5 (idx 10): 06 Lebdeće stepenište & vinoteka
  { cam: [2.85, -2.38, -1.35], look: [2.08, 0.38, -1.08], label: 'Stepenište' },
  // Mid 5->6 (idx 11): Ascending lower flight onto corner stair landing
  { cam: [3.48, -0.35, -0.38], look: [0.85, -1.55, -0.15] },

  // STOP 6 (idx 12): 07 Uspon na kat — Krovne grede
  { cam: [1.52, 0.22, 0.48], look: [-0.95, -3.15, 0.28], label: 'Krovište' },
  // Mid 6->7 (idx 13): Stepping off top tread onto mezzanine floor
  { cam: [0.12, 0.22, 1.15], look: [-2.25, -0.75, 0.48] },

  // STOP 7 (idx 14): 08 Gornja galerija & kućni ured
  { cam: [-1.18, 0.16, 1.14], look: [-3.30, -0.98, 0.24], label: 'Galerija' }
];

const STOP_BLENDER_COORDS = TOUR_NODES.filter((_, i) => i % 2 === 0);

const camCurve = new THREE.CatmullRomCurve3(
  TOUR_NODES.map((n) => b2t(...n.cam)),
  false,
  'catmullrom',
  0.38
);

const lookCurve = new THREE.CatmullRomCurve3(
  TOUR_NODES.map((n) => b2t(...n.look)),
  false,
  'catmullrom',
  0.38
);

// DOM Elements
const canvas = document.getElementById('webgl-canvas');
const loaderEl = document.getElementById('loader');
const loaderBar = document.getElementById('loader-bar');
const loaderStatus = document.getElementById('loader-status');
const navPills = Array.from(document.querySelectorAll('.nav-pill'));
const storySections = Array.from(document.querySelectorAll('.story-section'));
const elevReadout = document.getElementById('elev-readout');
const scrollPctEl = document.getElementById('scroll-pct');
const railFill = document.getElementById('rail-fill');
const floorBadge = document.getElementById('floor-badge');
const minimapCanvas = document.getElementById('minimap-canvas');
const mctx = minimapCanvas.getContext('2d');

const btnLighting = document.getElementById('btn-lighting');
const lightingIcon = document.getElementById('lighting-icon');
const lightingLabel = document.getElementById('lighting-label');
const btnFreeMode = document.getElementById('btn-free-mode');
const modeLabel = document.getElementById('mode-label');
const freeBanner = document.getElementById('free-banner');
const btnResumeScroll = document.getElementById('btn-resume-scroll');
const btnBackTop = document.getElementById('btn-back-top');

// Renderer & Scene
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: 'high-performance'
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0d13);

const pmrem = new THREE.PMREMGenerator(renderer);
const roomEnvTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environment = roomEnvTex;
scene.environmentIntensity = 0.24;

// Camera (wide architectural 15mm equiv -> ~68 deg vertical FOV)
const camera = new THREE.PerspectiveCamera(66, window.innerWidth / window.innerHeight, 0.06, 65);

// OrbitControls for 360 Free Mode
const controls = new OrbitControls(camera, canvas);
controls.enabled = false;
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.rotateSpeed = 0.65;
controls.zoomSpeed = 0.8;
controls.minDistance = 0.25;
controls.maxDistance = 7.5;
controls.maxPolarAngle = Math.PI * 0.92;

// Real-Time Architectural Lighting Setup
const eveningLights = [];
const dayLights = [];

const hemiLight = new THREE.HemisphereLight(0xffe9cf, 0x2c241d, 0.42);
scene.add(hemiLight);

function addPoint(xb, yb, zb, color, intensity, distance = 9, castShadow = false) {
  const l = new THREE.PointLight(color, intensity, distance, 1.7);
  l.position.copy(b2t(xb, yb, zb));
  if (castShadow) {
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
  scene.add(s);
  scene.add(s.target);
  eveningLights.push({ light: s, base: intensity });
  return s;
}

// Dining pendant domes (warm 2800K pools over golden oak table, shadow-casting)
addPoint(-1.86, -3.55, -1.36, 0xffd29e, 5.2, 8.5, true);
addPoint(-1.86, -2.88, -1.36, 0xffd29e, 5.2, 8.5, false);

// Brick chimney up/down sconces
addSpot([-0.44, -4.64, -1.32], [-0.44, -4.73, 0.35], 0xffcf96, 6.5, 36, 0.55, 4.5);
addSpot([-0.44, -4.64, -1.43], [-0.44, -4.73, -2.95], 0xffcf96, 6.5, 36, 0.55, 4.5);
addSpot([0.44, -4.64, -1.32], [0.44, -4.73, 0.35], 0xffcf96, 6.5, 36, 0.55, 4.5);
addSpot([0.44, -4.64, -1.43], [0.44, -4.73, -2.95], 0xffcf96, 6.5, 36, 0.55, 4.5);

// Living room 3 opal globes
addPoint(1.35, -3.45, -0.55, 0xffdcb4, 4.4, 9.5, true);
addPoint(2.25, -2.35, -0.35, 0xffdcb4, 3.8, 9.5, false);
addPoint(1.15, -1.55, -0.75, 0xffdcb4, 3.4, 9.0, false);

// East dark wood wall 4-way X-sconce rays
addSpot([4.11, -1.79, -0.89], [4.16, -2.85, -1.95], 0xffca85, 8.0, 14, 0.4, 4.2);
addSpot([4.11, -1.79, -0.81], [4.16, -2.85, 0.25], 0xffca85, 8.0, 14, 0.4, 4.2);
addSpot([4.11, -1.71, -0.89], [4.16, -0.65, -1.95], 0xffca85, 8.0, 14, 0.4, 4.2);
addSpot([4.11, -1.71, -0.81], [4.16, -0.65, 0.25], 0xffca85, 8.0, 14, 0.4, 4.2);

// Kitchen, North hallway & Upstairs Mezzanine office warm fills
addPoint(-3.10, -2.55, -0.65, 0xffe0ba, 3.6, 7.5, false);
addPoint(-2.20, -1.05, -0.65, 0xffe0ba, 2.8, 7.0, false);
addPoint(0.12, 1.85, -1.15, 0xffe4c4, 3.2, 6.5, false);
addPoint(2.20, 0.10, -1.25, 0xffd9ad, 2.6, 6.5, false);
addPoint(-2.35, -0.60, 1.45, 0xffe2be, 4.8, 9.0, false);
addPoint(0.25, 2.10, 1.55, 0xffe2be, 2.5, 7.0, false);

// Daylight Sun & Sky Fill (for Evening / Day toggle)
const sunLight = new THREE.DirectionalLight(0xfff4e2, 0.0);
sunLight.position.copy(b2t(-2.2, -9.5, 4.2));
sunLight.target.position.copy(b2t(0.0, -1.5, -2.2));
sunLight.castShadow = true;
sunLight.shadow.mapSize.set(2048, 2048);
sunLight.shadow.camera.near = 1;
sunLight.shadow.camera.far = 22;
sunLight.shadow.camera.left = -7;
sunLight.shadow.camera.right = 7;
sunLight.shadow.camera.top = 7;
sunLight.shadow.camera.bottom = -7;
sunLight.shadow.bias = -0.0005;
scene.add(sunLight);
scene.add(sunLight.target);
dayLights.push(sunLight);

let isDaylight = false;
function applyLightingMode(day) {
  isDaylight = day;
  if (day) {
    scene.background.setHex(0xcfdbe6);
    scene.environmentIntensity = 0.82;
    hemiLight.color.setHex(0xf4f8ff);
    hemiLight.groundColor.setHex(0x8a7968);
    hemiLight.intensity = 1.15;
    sunLight.intensity = 2.8;
    renderer.toneMappingExposure = 1.02;
    eveningLights.forEach(({ light, base }) => {
      light.intensity = base * 0.25;
    });
    lightingIcon.textContent = '☀';
    lightingLabel.textContent = 'Dan';
  } else {
    scene.background.setHex(0x0b0d13);
    scene.environmentIntensity = 0.24;
    hemiLight.color.setHex(0xffe9cf);
    hemiLight.groundColor.setHex(0x2c241d);
    hemiLight.intensity = 0.42;
    sunLight.intensity = 0.0;
    renderer.toneMappingExposure = 1.08;
    eveningLights.forEach(({ light, base }) => {
      light.intensity = base;
    });
    lightingIcon.textContent = '☾';
    lightingLabel.textContent = 'Večer';
  }
}

btnLighting.addEventListener('click', () => applyLightingMode(!isDaylight));

// Load Reconstructed 1:1 GLB Scene
const loader = new GLTFLoader();
loader.load(
  './assets/room_3d.glb',
  (gltf) => {
    const root = gltf.scene;
    root.traverse((obj) => {
      if (!obj.isMesh) return;
      obj.castShadow = true;
      obj.receiveShadow = true;

      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach((m) => {
        if (!m) return;
        const name = m.name || '';
        // Restore color grading bypassed from Blender Hue/Sat nodes during GLB export
        if (name.includes('Mat_Sofa_GreyFabric')) {
          m.color.setRGB(0.28, 0.28, 0.30);
          m.roughness = 0.85;
        } else if (name.includes('Mat_Golden_Oak')) {
          m.color.setRGB(1.06, 0.86, 0.66);
          m.roughness = 0.36;
        } else if (name.includes('Mat_OliveWood_Sculpt')) {
          m.color.setRGB(0.55, 0.40, 0.26);
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
          m.needsUpdate = true;
        } else if (name.includes('Mat_Arch_Glass') || name.includes('Mat_Glass_Shelf')) {
          m.transparent = true;
          m.opacity = 0.24;
          m.roughness = 0.06;
          m.metalness = 0.1;
          m.depthWrite = false;
        } else if (name.includes('Mat_Lamp_Dome_White') || name.includes('Mat_Opal_Globe')) {
          m.emissive = new THREE.Color(0xffe6c2);
          m.emissiveIntensity = name.includes('Dome') ? 0.55 : 0.38;
        } else if (name.includes('Mat_Blue_LED')) {
          m.emissive = new THREE.Color(0x2ea8ff);
          m.emissiveIntensity = 2.4;
        } else if (name.includes('Mat_TV_Screen')) {
          m.color.setRGB(0.02, 0.02, 0.025);
          m.roughness = 0.08;
          m.metalness = 0.35;
        }
      });
    });

    scene.add(root);
    loaderBar.style.width = '100%';
    loaderStatus.textContent = 'Prostor spreman!';
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
    loaderStatus.textContent = 'Greška pri učitavanju 3D modela.';
  }
);

// Scroll & Camera State
let targetScrollT = 0;
let currentScrollT = 0;
let isFreeMode = false;

// Subtle mouse parallax in guided mode
let mouseX = 0;
let mouseY = 0;
let smoothMouseX = 0;
let smoothMouseY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function updateScrollTarget() {
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  targetScrollT = THREE.MathUtils.clamp(window.scrollY / maxScroll, 0, 1);
}
window.addEventListener('scroll', updateScrollTarget, { passive: true });
updateScrollTarget();

function scrollToStop(stopIndex) {
  if (isFreeMode) setFreeMode(false);
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const targetY = (stopIndex / 7) * maxScroll;
  window.scrollTo({ top: targetY, behavior: 'smooth' });
}

navPills.forEach((pill) => {
  pill.addEventListener('click', () => {
    const idx = Number(pill.dataset.stop || 0);
    scrollToStop(idx);
  });
});

if (btnBackTop) {
  btnBackTop.addEventListener('click', () => scrollToStop(0));
}

// Free 360 Orbit Mode Toggle
function setFreeMode(enable) {
  isFreeMode = enable;
  document.body.classList.toggle('free-mode-active', enable);
  btnFreeMode.classList.toggle('active', enable);
  freeBanner.classList.toggle('hidden', !enable);
  modeLabel.textContent = enable ? 'Aktivni 360° pogled' : '360° Slobodni pogled';

  if (enable) {
    const camPos = camCurve.getPoint(currentScrollT);
    const lookPos = lookCurve.getPoint(currentScrollT);
    const dir = lookPos.clone().sub(camPos).normalize();
    camera.position.copy(camPos);
    controls.target.copy(camPos).addScaledVector(dir, 1.85);
    controls.enabled = true;
    controls.update();
  } else {
    controls.enabled = false;
  }
}

btnFreeMode.addEventListener('click', () => setFreeMode(!isFreeMode));
btnResumeScroll.addEventListener('click', () => setFreeMode(false));

// Modal Photo vs Render Comparison
const modal = document.getElementById('compare-modal');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalClose = document.getElementById('modal-close');
const modalTitle = document.getElementById('modal-title');
const modalPhoto = document.getElementById('modal-photo');
const modalRender = document.getElementById('modal-render');

document.querySelectorAll('.compare-btn[data-photo]').forEach((btn) => {
  btn.addEventListener('click', () => {
    modalTitle.textContent = btn.dataset.title || 'Usporedba';
    modalPhoto.src = btn.dataset.photo;
    modalRender.src = btn.dataset.render;
    modal.classList.remove('hidden');
  });
});

function closeModal() {
  modal.classList.add('hidden');
}
modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    if (isFreeMode) setFreeMode(false);
  }
});

// Interactive 2D Floorplan Radar Drawing (Blender X: [-4.5, 4.5], Y: [-5.2, 5.2])
function worldToMinimap(xb, yb) {
  const pad = 16;
  const w = minimapCanvas.width - pad * 2;
  const h = minimapCanvas.height - pad * 2;
  const u = (xb - (-4.5)) / 9.0;
  // North (+Y_blender) at top of 2D plan, South (-Y_blender) at bottom
  const v = 1.0 - (yb - (-5.2)) / 10.4;
  return [pad + u * w, pad + v * h];
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

function renderMinimap(camThree, lookThree, activeStop) {
  const xb = camThree.x;
  const yb = -camThree.z;
  const zb = camThree.y;
  const isUpper = zb > 0.1;

  mctx.clearRect(0, 0, minimapCanvas.width, minimapCanvas.height);

  // Main ground floor footprint (X: -4.35..4.25, Y: -5.0..0.85)
  drawRectPlan(-4.35, -5.0, 4.25, 0.85, 'rgba(255,244,228,0.06)', 'rgba(255,238,214,0.28)');
  // North hallway / upstairs wing (X: -1.3..2.0, Y: 0.85..5.0)
  drawRectPlan(-1.3, 0.85, 2.0, 5.0, 'rgba(255,244,228,0.04)', 'rgba(255,238,214,0.18)');

  // Ground floor furniture silhouettes
  const gfAlpha = isUpper ? 0.12 : 0.26;
  // Kitchen counters
  drawRectPlan(-4.34, -5.0, -3.65, -1.16, `rgba(224,169,109,${gfAlpha})`);
  // Dining table
  drawRectPlan(-2.38, -4.2, -1.34, -2.27, `rgba(224,169,109,${gfAlpha + 0.08})`);
  // Red-brick chimney
  drawRectPlan(-0.68, -5.0, 0.68, -4.7, 'rgba(201,123,80,0.55)');
  // L-Sofa
  drawRectPlan(0.0, -2.2, 2.7, -1.2, `rgba(200,200,210,${gfAlpha})`);
  drawRectPlan(-0.1, -3.6, 0.95, -1.9, `rgba(200,200,210,${gfAlpha})`);
  // TV console
  drawRectPlan(3.65, -4.75, 4.2, -2.38, `rgba(255,255,255,${gfAlpha})`);
  // Floating L-stairs
  drawRectPlan(3.1, -2.1, 4.15, 0.72, 'rgba(224,169,109,0.24)');
  drawRectPlan(0.1, -0.25, 3.1, 0.72, 'rgba(224,169,109,0.24)');

  // Mezzanine gallery highlight when upstairs
  drawRectPlan(
    -4.32,
    -2.1,
    -0.28,
    0.85,
    isUpper ? 'rgba(224,169,109,0.20)' : 'rgba(255,255,255,0.02)',
    isUpper ? 'rgba(224,169,109,0.75)' : 'rgba(255,255,255,0.12)'
  );
  if (isUpper) {
    // Upstairs L-desk
    drawRectPlan(-3.95, -1.65, -2.38, 0.14, 'rgba(224,169,109,0.45)');
  }

  // Stop pins (0..7)
  STOP_BLENDER_COORDS.forEach((st, idx) => {
    const [px, py] = worldToMinimap(st.cam[0], st.cam[1]);
    mctx.beginPath();
    mctx.arc(px, py, idx === activeStop ? 5.2 : 3.4, 0, Math.PI * 2);
    mctx.fillStyle = idx === activeStop ? '#e0a96d' : 'rgba(255,255,255,0.38)';
    mctx.fill();
  });

  // Live Camera FOV Wedge & Position Dot
  const [cx, cy] = worldToMinimap(xb, yb);
  const lx = lookThree.x;
  const ly = -lookThree.z;
  const [tx, ty] = worldToMinimap(lx, ly);
  const angle = Math.atan2(ty - cy, tx - cx);
  const fovHalf = 0.52;

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

// Click on minimap to jump to nearest room stop
minimapCanvas.addEventListener('click', (e) => {
  const rect = minimapCanvas.getBoundingClientRect();
  const mx = ((e.clientX - rect.left) / rect.width) * minimapCanvas.width;
  const my = ((e.clientY - rect.top) / rect.height) * minimapCanvas.height;
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

// Resize Handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Main Render Loop
const tmpLook = new THREE.Vector3();
const tmpRight = new THREE.Vector3();
const upVec = new THREE.Vector3(0, 1, 0);

function animate() {
  requestAnimationFrame(animate);

  currentScrollT += (targetScrollT - currentScrollT) * 0.065;
  smoothMouseX += (mouseX - smoothMouseX) * 0.06;
  smoothMouseY += (mouseY - smoothMouseY) * 0.06;

  let activeLook = tmpLook;

  if (!isFreeMode) {
    const camPos = camCurve.getPoint(currentScrollT);
    const baseLook = lookCurve.getPoint(currentScrollT);

    // Subtle cursor look-around parallax
    const forward = baseLook.clone().sub(camPos).normalize();
    tmpRight.crossVectors(forward, upVec).normalize();

    activeLook
      .copy(baseLook)
      .addScaledVector(tmpRight, smoothMouseX * 0.28)
      .addScaledVector(upVec, -smoothMouseY * 0.16);

    camera.position.copy(camPos);
    camera.lookAt(activeLook);
  } else {
    controls.update();
    activeLook.copy(controls.target);
  }

  // Update HUD Telemetry & Active Room Pill
  const activeStop = Math.min(7, Math.max(0, Math.round(currentScrollT * 7)));
  navPills.forEach((p, idx) => p.classList.toggle('active', idx === activeStop));

  const eyeAboveFloor = camera.position.y - GROUND_FLOOR_Z;
  elevReadout.textContent = `+${eyeAboveFloor.toFixed(2)} m`;
  const pct = Math.round(currentScrollT * 100);
  scrollPctEl.textContent = `${pct}%`;
  railFill.style.height = `${pct}%`;

  if (eyeAboveFloor > 3.6) {
    floorBadge.textContent = 'GALERIJA / KAT (+2.74 m)';
  } else if (eyeAboveFloor > 2.2) {
    floorBadge.textContent = 'STEPENIŠTE (USPON)';
  } else {
    floorBadge.textContent = 'PRIZEMLJE (0.00 m)';
  }

  renderMinimap(camera.position, activeLook, activeStop);
  renderer.render(scene, camera);
}

applyLightingMode(false);
animate();
