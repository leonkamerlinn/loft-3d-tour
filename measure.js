// Measuring tool for the walk mode: click two surface points → distance (+ horizontal / vertical split).
import * as THREE from 'three';

const GOLD = 0xffcf8a;

function fmt(m) {
  return `${m.toFixed(2)} m`;
}

export class MeasureTool {
  constructor(scene, layer) {
    this.scene = scene;
    this.layer = layer;
    this.active = false;
    this.pending = null; // first point of the measurement in progress
    this.items = [];
    this.group = new THREE.Group();
    this.group.renderOrder = 999;
    scene.add(this.group);

    this.markerGeo = new THREE.SphereGeometry(0.022, 16, 12);
    this.markerMat = new THREE.MeshBasicMaterial({ color: GOLD, depthTest: false, transparent: true });
    this.lineMat = new THREE.LineBasicMaterial({ color: GOLD, depthTest: false, transparent: true });
    this.previewMat = new THREE.LineDashedMaterial({ color: 0xffffff, dashSize: 0.05, gapSize: 0.035, depthTest: false, transparent: true, opacity: 0.85 });

    this.previewLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), this.previewMat);
    this.previewLine.visible = false;
    this.previewLine.renderOrder = 999;
    this.previewLabel = this._label(true);
    this.group.add(this.previewLine);
  }

  setActive(on) {
    this.active = on;
    if (!on) this.cancelPending();
  }

  get hasItems() {
    return this.items.length > 0 || !!this.pending;
  }

  addPoint(hit) {
    const p = hit.point.clone().addScaledVector(hit.normal, 0.002);
    if (!this.pending) {
      this.pending = { a: p, marker: this._marker(p) };
      return null;
    }
    const a = this.pending.a;
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, p]), this.lineMat);
    line.renderOrder = 999;
    this.group.add(line);
    const item = { a, b: p, line, markers: [this.pending.marker, this._marker(p)], label: this._label(false) };
    item.label.innerHTML = this._text(a, p);
    this.items.push(item);
    this.pending = null;
    this.previewLine.visible = false;
    this.previewLabel.hidden = true;
    return item;
  }

  /** Live rubber-band line from the first point to the cursor. */
  preview(hit) {
    if (!this.pending || !hit) {
      this.previewLine.visible = false;
      this.previewLabel.hidden = true;
      return;
    }
    const b = hit.point;
    const pos = this.previewLine.geometry.attributes.position;
    pos.setXYZ(0, this.pending.a.x, this.pending.a.y, this.pending.a.z);
    pos.setXYZ(1, b.x, b.y, b.z);
    pos.needsUpdate = true;
    this.previewLine.geometry.computeBoundingSphere();
    this.previewLine.computeLineDistances();
    this.previewLine.visible = true;
    this.previewLabel.hidden = false;
    this.previewLabel.innerHTML = this._text(this.pending.a, b);
    this.previewMid = this.pending.a.clone().add(b).multiplyScalar(0.5);
  }

  cancelPending() {
    if (!this.pending) return false;
    this.group.remove(this.pending.marker);
    this.pending = null;
    this.previewLine.visible = false;
    this.previewLabel.hidden = true;
    return true;
  }

  clear() {
    this.cancelPending();
    for (const it of this.items) {
      this.group.remove(it.line, ...it.markers);
      it.line.geometry.dispose();
      it.label.remove();
    }
    this.items = [];
  }

  setVisible(v) {
    this.group.visible = v;
    this.layer.hidden = !v;
  }

  /** Re-project the HTML labels (called every rendered frame while walking). */
  updateLabels(camera, width, height) {
    const v = new THREE.Vector3();
    const place = (el, world) => {
      v.copy(world).project(camera);
      const visible = v.z < 1 && v.z > -1 && Math.abs(v.x) < 1.2 && Math.abs(v.y) < 1.2;
      el.style.visibility = visible ? 'visible' : 'hidden';
      if (visible) el.style.transform = `translate(${((v.x + 1) / 2) * width}px, ${((1 - v.y) / 2) * height}px) translate(-50%, -130%)`;
    };
    for (const it of this.items) place(it.label, v.copy(it.a).add(it.b).multiplyScalar(0.5).clone());
    if (!this.previewLabel.hidden && this.previewMid) place(this.previewLabel, this.previewMid);
  }

  _marker(p) {
    const m = new THREE.Mesh(this.markerGeo, this.markerMat);
    m.position.copy(p);
    m.renderOrder = 1000;
    this.group.add(m);
    return m;
  }

  _label(isPreview) {
    const el = document.createElement('div');
    el.className = `measure-label${isPreview ? ' preview' : ''}`;
    el.hidden = isPreview;
    this.layer.appendChild(el);
    return el;
  }

  _text(a, b) {
    const d = a.distanceTo(b);
    const h = Math.hypot(b.x - a.x, b.z - a.z);
    const vtc = Math.abs(b.y - a.y);
    return `<strong>${fmt(d)}</strong><span>↔ ${fmt(h)} · ↕ ${fmt(vtc)}</span>`;
  }
}
