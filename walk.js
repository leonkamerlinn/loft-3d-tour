// First-person "walk" mode for the 3D tour: WASD / arrow keys, drag-to-look, tap-to-walk,
// capsule collision against a BVH of the interior (walls, furniture, stairs) and floor following.
import * as THREE from 'three';
import { MeshBVH, acceleratedRaycast } from 'three-mesh-bvh';

// ---------------------------------------------------------------------------
// Collider: one merged, world-space, position-only geometry + BVH per interior
// ---------------------------------------------------------------------------
const MIN_COLLIDER_SIZE = 0.12; // skip tiny decor (cups, pens…) – irrelevant for walking, saves memory

export function buildCollider(root) {
  root.updateMatrixWorld(true);
  const parts = [];
  let triTotal = 0;
  const box = new THREE.Box3();
  const size = new THREE.Vector3();
  root.traverse((o) => {
    if (!o.isMesh || !o.visible || !o.geometry?.attributes?.position) return;
    const g = o.geometry;
    if (!g.boundingBox) g.computeBoundingBox();
    box.copy(g.boundingBox).applyMatrix4(o.matrixWorld).getSize(size);
    if (Math.max(size.x, size.y, size.z) < MIN_COLLIDER_SIZE) return;
    const tris = (g.index ? g.index.count : g.attributes.position.count) / 3;
    parts.push({ o, g, tris });
    triTotal += tris;
  });

  const positions = new Float32Array(triTotal * 9);
  const v = new THREE.Vector3();
  let w = 0;
  for (const { o, g, tris } of parts) {
    const pos = g.attributes.position; // may be quantized / interleaved: fromBufferAttribute de-normalises
    const idx = g.index;
    for (let i = 0, n = tris * 3; i < n; i++) {
      v.fromBufferAttribute(pos, idx ? idx.getX(i) : i).applyMatrix4(o.matrixWorld);
      positions[w++] = v.x;
      positions[w++] = v.y;
      positions[w++] = v.z;
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.boundsTree = new MeshBVH(geometry, { maxLeafSize: 10 });
  // FrontSide on purpose: rays cast from inside a slab ignore its back faces (used for "height above floor")
  const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ side: THREE.FrontSide }));
  mesh.raycast = acceleratedRaycast;
  mesh.updateMatrixWorld(true);
  mesh.userData.triangles = triTotal;
  return mesh;
}

export function disposeCollider(mesh) {
  if (!mesh) return;
  mesh.geometry.boundsTree = null;
  mesh.geometry.dispose();
  mesh.material.dispose();
}

// ---------------------------------------------------------------------------
// Walk controller
// ---------------------------------------------------------------------------
const EYE_HEIGHT = 1.6;
const RADIUS = 0.22; // body radius (doors ≥ 0.80 m leave ~18 cm either side)
const STEP_HEIGHT = 0.36; // stair risers (~18 cm) are climbed, tables/beds (≥ 0.4 m) block
const WALK_SPEED = 1.35;
const RUN_SPEED = 2.7;
const GRAVITY = 9.81;
const MAX_SUBSTEP = 0.05;

const _ray = new THREE.Raycaster();
_ray.firstHitOnly = true;
const DOWN = new THREE.Vector3(0, -1, 0);
const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _v3 = new THREE.Vector3();
const _box = new THREE.Box3();
const _seg = new THREE.Line3();
const _euler = new THREE.Euler(0, 0, 0, 'YXZ');

export class WalkController {
  constructor({ camera, dom, onChange, onTap, onHover, reducedMotion = false }) {
    this.camera = camera;
    this.dom = dom;
    this.onChange = onChange || (() => {});
    this.onTap = onTap || (() => {});
    this.onHover = onHover || (() => {});
    this.reducedMotion = reducedMotion;

    this.enabled = false;
    this.collider = null;
    this.feet = new THREE.Vector3();
    this.lastSafe = new THREE.Vector3();
    this.eye = EYE_HEIGHT;
    this.eyeTarget = EYE_HEIGHT;
    this.yaw = 0;
    this.pitch = 0;
    this.vel = new THREE.Vector3();
    this.vy = 0;
    this.bob = 0;
    this.keys = new Set();
    this.stick = new THREE.Vector2(); // touch joystick (x = strafe, y = forward)
    this.autoTarget = null;
    this.autoStuck = 0;
    this.baseFov = camera.fov;
    this.fovScale = 1;
    this.drag = null;
    this.dirty = false;

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onPointerDown = this._onPointerDown.bind(this);
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerUp = this._onPointerUp.bind(this);
    this._onWheel = this._onWheel.bind(this);
    this._onBlur = () => this.keys.clear();
    this._onContextMenu = (e) => e.preventDefault();
  }

  get position() {
    return this.camera.position;
  }

  setCollider(collider) {
    this.collider = collider;
  }

  /** Start walking from the camera's current pose. */
  enable() {
    if (this.enabled) return;
    this.enabled = true;
    _euler.setFromQuaternion(this.camera.quaternion, 'YXZ');
    this.yaw = _euler.y;
    this.pitch = THREE.MathUtils.clamp(_euler.x, -1.2, 1.2);
    this.fovScale = 1;
    this.vel.set(0, 0, 0);
    this.vy = 0;
    this.autoTarget = null;
    this._placeOnGround(this.camera.position);
    this.eye = THREE.MathUtils.clamp(this.camera.position.y - this.feet.y, 1.1, EYE_HEIGHT);
    this.eyeTarget = EYE_HEIGHT;

    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
    window.addEventListener('blur', this._onBlur);
    this.dom.addEventListener('pointerdown', this._onPointerDown);
    this.dom.addEventListener('pointermove', this._onPointerMove);
    this.dom.addEventListener('pointerup', this._onPointerUp);
    this.dom.addEventListener('pointercancel', this._onPointerUp);
    this.dom.addEventListener('wheel', this._onWheel, { passive: false });
    this.dom.addEventListener('contextmenu', this._onContextMenu);
    this.dom.style.touchAction = 'none';
    this.dom.style.cursor = 'grab';
    this.dirty = true;
  }

  disable() {
    if (!this.enabled) return;
    this.enabled = false;
    this.keys.clear();
    this.stick.set(0, 0);
    this.drag = null;
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
    window.removeEventListener('blur', this._onBlur);
    this.dom.removeEventListener('pointerdown', this._onPointerDown);
    this.dom.removeEventListener('pointermove', this._onPointerMove);
    this.dom.removeEventListener('pointerup', this._onPointerUp);
    this.dom.removeEventListener('pointercancel', this._onPointerUp);
    this.dom.removeEventListener('wheel', this._onWheel);
    this.dom.removeEventListener('contextmenu', this._onContextMenu);
    this.dom.style.touchAction = '';
    this.dom.style.cursor = '';
  }

  /** Jump to a viewpoint (eye position + look target), e.g. from the room pills or the minimap. */
  teleport(eyePos, lookAt) {
    _v1.copy(lookAt).sub(eyePos);
    this.yaw = Math.atan2(-_v1.x, -_v1.z);
    this.pitch = THREE.MathUtils.clamp(Math.atan2(_v1.y, Math.hypot(_v1.x, _v1.z)), -0.6, 0.6);
    this.vel.set(0, 0, 0);
    this.vy = 0;
    this.autoTarget = null;
    this._placeOnGround(eyePos);
    this._resolveCollisions();
    this.dirty = true;
  }

  /** Walk (with collisions) to a point on the floor. */
  walkTo(point) {
    this.autoTarget = point.clone();
    this.autoStuck = 0;
    this.dirty = true;
  }

  setStick(x, y) {
    this.stick.set(x, y);
    if (x || y) this.autoTarget = null;
    this.dirty = true;
  }

  raycast(ndcX, ndcY) {
    if (!this.collider) return null;
    _ray.setFromCamera(_v1.set(ndcX, ndcY, 0.5), this.camera);
    _ray.far = 65;
    const hit = _ray.intersectObject(this.collider, false)[0];
    if (!hit) return null;
    return { point: hit.point.clone(), normal: hit.face.normal.clone(), distance: hit.distance };
  }

  /** Vertical distance from a surface point down to the floor below it (for the measuring tool). */
  heightAboveFloor(point, normal) {
    if (!this.collider) return null;
    if (normal.y > 0.9 && Math.abs(point.y - this.feet.y) < 0.06) return 0;
    const origin = _v2.copy(point);
    if (Math.abs(normal.y) < 0.5) origin.addScaledVector(normal, 0.03);
    else origin.y -= 0.005; // just below an up-facing top: its own back faces are ignored
    _ray.set(origin, DOWN);
    _ray.far = 6;
    const hit = _ray.intersectObject(this.collider, false)[0];
    return hit ? Math.max(0, point.y - hit.point.y) : null;
  }

  // -------------------------------------------------------------------------
  update(dt) {
    if (!this.enabled) return false;
    dt = Math.min(dt, 0.1);
    let changed = this.dirty;
    this.dirty = false;

    // Desired horizontal velocity from keys / joystick / tap-to-walk
    const k = this.keys;
    let fwd = (k.has('KeyW') || k.has('ArrowUp') ? 1 : 0) - (k.has('KeyS') || k.has('ArrowDown') ? 1 : 0);
    let strafe = (k.has('KeyD') ? 1 : 0) - (k.has('KeyA') ? 1 : 0);
    const turn = (k.has('ArrowLeft') || k.has('KeyQ') ? 1 : 0) - (k.has('ArrowRight') || k.has('KeyE') ? 1 : 0);
    fwd += this.stick.y;
    strafe += this.stick.x;
    if (turn) {
      this.yaw += turn * 1.7 * dt;
      changed = true;
    }
    const run = k.has('ShiftLeft') || k.has('ShiftRight');
    const desired = _v3.set(0, 0, 0);
    const sinY = Math.sin(this.yaw);
    const cosY = Math.cos(this.yaw);
    if (fwd || strafe) {
      this.autoTarget = null;
      desired.set(-sinY * fwd + cosY * strafe, 0, -cosY * fwd - sinY * strafe);
      const len = desired.length();
      if (len > 1) desired.divideScalar(len);
      desired.multiplyScalar(run ? RUN_SPEED : WALK_SPEED);
    } else if (this.autoTarget) {
      desired.set(this.autoTarget.x - this.feet.x, 0, this.autoTarget.z - this.feet.z);
      const dist = desired.length();
      if (dist < 0.1) {
        this.autoTarget = null;
        desired.set(0, 0, 0);
      } else {
        desired.multiplyScalar(Math.min(1.7, dist * 2.2 + 0.25) / dist);
      }
    }

    // Smooth acceleration / deceleration
    const a = 1 - Math.exp(-dt * 9);
    this.vel.lerp(desired, a);
    if (this.vel.lengthSq() < 1e-5 && desired.lengthSq() === 0) this.vel.set(0, 0, 0);

    const before = _v2.copy(this.feet);
    const travel = this.vel.length() * dt;
    if (travel > 0) {
      const steps = Math.max(1, Math.ceil(travel / MAX_SUBSTEP));
      const sdt = dt / steps;
      for (let i = 0; i < steps; i++) {
        this.feet.x += this.vel.x * sdt;
        this.feet.z += this.vel.z * sdt;
        this._resolveCollisions();
        this._followGround(sdt);
      }
      changed = true;
    } else if (this._followGround(dt)) {
      changed = true;
    }

    // Tap-to-walk gives up when blocked
    if (this.autoTarget) {
      const moved = Math.hypot(this.feet.x - before.x, this.feet.z - before.z);
      this.autoStuck = moved < 0.25 * travel ? this.autoStuck + dt : 0;
      if (this.autoStuck > 0.4) this.autoTarget = null;
    }

    // Eye height eases to standing height (scroll tour runs lower in the attic)
    if (Math.abs(this.eyeTarget - this.eye) > 1e-3) {
      this.eye += (this.eyeTarget - this.eye) * (1 - Math.exp(-dt * 4));
      changed = true;
    }

    // Subtle head bob while walking
    const speed = Math.hypot(this.vel.x, this.vel.z);
    if (!this.reducedMotion && speed > 0.2) {
      this.bob += dt * speed * 5.2;
    } else if (this.bob !== 0) {
      this.bob = 0;
      changed = true;
    }
    const bobY = this.reducedMotion ? 0 : Math.sin(this.bob) * 0.012 * Math.min(1, speed / WALK_SPEED);

    this.camera.position.set(this.feet.x, this.feet.y + this.eye + bobY, this.feet.z);
    this.camera.rotation.set(this.pitch, this.yaw, 0, 'YXZ');
    const fov = THREE.MathUtils.clamp(this.baseFov * this.fovScale, 28, 100);
    if (Math.abs(this.camera.fov - fov) > 0.01) {
      this.camera.fov = fov;
      this.camera.updateProjectionMatrix();
    }
    if (changed) this.onChange();
    return changed || speed > 0 || this.vy !== 0;
  }

  // -------------------------------------------------------------------------
  _placeOnGround(eyePos) {
    this.feet.set(eyePos.x, eyePos.y - EYE_HEIGHT, eyePos.z);
    const g = this._groundAt(eyePos.x, eyePos.z, eyePos.y + 0.05, 4.5);
    if (g !== null) this.feet.y = g;
    this.lastSafe.copy(this.feet);
  }

  /** Highest walkable surface under a small footprint (gaps between floating stair treads are bridged). */
  _groundAt(x, z, fromY, far) {
    if (!this.collider) return null;
    let best = null;
    const r = RADIUS * 0.6;
    const offs = [[0, 0], [r, 0], [-r, 0], [0, r], [0, -r]];
    _ray.far = far;
    for (const [ox, oz] of offs) {
      _ray.set(_v1.set(x + ox, fromY, z + oz), DOWN);
      const hit = _ray.intersectObject(this.collider, false)[0];
      if (hit && hit.face.normal.y > 0.5 && (best === null || hit.point.y > best)) best = hit.point.y;
    }
    return best;
  }

  _followGround(dt) {
    const ground = this._groundAt(this.feet.x, this.feet.z, this.feet.y + STEP_HEIGHT, 8);
    const y0 = this.feet.y;
    if (ground === null) {
      this.vy -= GRAVITY * dt;
      this.feet.y += this.vy * dt;
      if (this.feet.y < -16) {
        // fell out of the model: back to the last safe spot
        this.feet.copy(this.lastSafe);
        this.vy = 0;
      }
    } else if (ground > this.feet.y) {
      this.feet.y += (ground - this.feet.y) * Math.min(1, dt * 16); // smooth step-up
      if (ground - this.feet.y < 0.004) this.feet.y = ground;
      this.vy = 0;
    } else if (ground < this.feet.y - 0.002) {
      this.vy -= GRAVITY * dt;
      this.feet.y = Math.max(ground, this.feet.y + this.vy * dt);
      if (this.feet.y === ground) this.vy = 0;
    } else {
      this.vy = 0;
    }
    if (ground !== null && Math.abs(this.feet.y - ground) < 0.01) this.lastSafe.copy(this.feet);
    return Math.abs(this.feet.y - y0) > 1e-4;
  }

  /** Push the body capsule out of every triangle it overlaps (horizontal response only). */
  _resolveCollisions() {
    const bvh = this.collider?.geometry.boundsTree;
    if (!bvh) return;
    _seg.start.set(this.feet.x, this.feet.y + STEP_HEIGHT + RADIUS, this.feet.z);
    _seg.end.set(this.feet.x, this.feet.y + EYE_HEIGHT + 0.02 - RADIUS * 0.5, this.feet.z);
    const startX = _seg.start.x;
    const startZ = _seg.start.z;
    for (let iter = 0; iter < 3; iter++) {
      let pushed = false;
      _box.makeEmpty().expandByPoint(_seg.start).expandByPoint(_seg.end);
      _box.min.addScalar(-RADIUS);
      _box.max.addScalar(RADIUS);
      bvh.shapecast({
        intersectsBounds: (b) => b.intersectsBox(_box),
        intersectsTriangle: (tri) => {
          const triPoint = _v1;
          const capPoint = _v2;
          const dist = tri.closestPointToSegment(_seg, triPoint, capPoint);
          if (dist < RADIUS) {
            const dir = capPoint.sub(triPoint);
            dir.y = 0; // never lift/sink the body: floors are handled by the ground probe
            const len = dir.length();
            const horiz = len / Math.max(dist, 1e-6); // 1 = wall, 0 = ceiling / table top straight above
            if (len < 1e-6 || horiz < 0.3) return false;
            dir.divideScalar(len);
            const depth = Math.min(RADIUS, (RADIUS - dist) / horiz);
            _seg.start.addScaledVector(dir, depth);
            _seg.end.addScaledVector(dir, depth);
            pushed = true;
          }
          return false;
        }
      });
      if (!pushed) break;
    }
    this.feet.x += _seg.start.x - startX;
    this.feet.z += _seg.start.z - startZ;
  }

  // -------------------------------------------------------------------------
  _onKeyDown(e) {
    if (e.target instanceof HTMLElement && e.target.closest('input, textarea, select, [contenteditable]')) return;
    if (document.body.classList.contains('modal-open')) return;
    const codes = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyQ', 'KeyE', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ShiftLeft', 'ShiftRight'];
    if (!codes.includes(e.code)) return;
    if (e.code.startsWith('Arrow')) e.preventDefault(); // no page scrolling while walking
    this.keys.add(e.code);
    this.dirty = true;
  }

  _onKeyUp(e) {
    this.keys.delete(e.code);
  }

  _onPointerDown(e) {
    if (e.pointerType === 'mouse' && e.button !== 0 && e.button !== 2) return;
    this.dom.setPointerCapture(e.pointerId);
    this.drag = { id: e.pointerId, x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, t: performance.now(), type: e.pointerType, button: e.button };
    this.dom.style.cursor = 'grabbing';
  }

  _onPointerMove(e) {
    if (this.drag && e.pointerId === this.drag.id) {
      const dx = e.clientX - this.drag.x;
      const dy = e.clientY - this.drag.y;
      this.drag.x = e.clientX;
      this.drag.y = e.clientY;
      // Rotate the head in place (no orbiting → the camera can never swing through a wall)
      const sens = (this.drag.type === 'touch' ? 0.0042 : 0.0031) * (this.camera.fov / 75);
      this.yaw += dx * sens;
      this.pitch = THREE.MathUtils.clamp(this.pitch + dy * sens, -1.35, 1.35);
      this.dirty = true;
      return;
    }
    if (e.pointerType === 'mouse') this.onHover(e.clientX, e.clientY);
  }

  _onPointerUp(e) {
    if (!this.drag || e.pointerId !== this.drag.id) return;
    const d = this.drag;
    this.drag = null;
    this.dom.style.cursor = 'grab';
    if (this.dom.hasPointerCapture(e.pointerId)) this.dom.releasePointerCapture(e.pointerId);
    const moved = Math.hypot(e.clientX - d.sx, e.clientY - d.sy);
    if (e.type === 'pointerup' && moved < 7 && performance.now() - d.t < 450 && d.button === 0) {
      this.onTap(e.clientX, e.clientY);
    }
  }

  _onWheel(e) {
    e.preventDefault();
    this.fovScale = THREE.MathUtils.clamp(this.fovScale * (1 + e.deltaY * 0.0011), 0.4, 1.35);
    this.dirty = true;
  }
}
