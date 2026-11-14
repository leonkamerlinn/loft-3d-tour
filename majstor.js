import { PROJECT, ZONES, BOQ, PLANS } from './spec-data.js?v=13';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let activePlanMode = 'redesign';

function renderHeader() {
  const floorsRows = PROJECT.overall.floors
    .map(
      (f) =>
        `<tr><td><strong>${esc(f.name)}</strong></td><td>Zone ${esc(f.zones)}</td><td class="num">${f.area_m2.toFixed(1)} m²</td><td>${esc(f.height)}</td></tr>`
    )
    .join('');

  $('project-header').innerHTML = `
    <span class="m-kicker">TEHNIČKA DOKUMENTACIJA VER. ${esc(PROJECT.version)} · ${esc(PROJECT.date)}</span>
    <h1>${esc(PROJECT.title)}</h1>
    <p class="m-sub">${esc(PROJECT.subtitle)}</p>
    <div class="m-meta-grid">
      <div class="m-stat"><span>Tlocrtni gabarit</span><strong>${esc(PROJECT.overall.footprint)}</strong></div>
      <div class="m-stat"><span>Visina sljemena</span><strong>${esc(PROJECT.overall.ridge)}</strong></div>
      <div class="m-stat"><span>Ukupna neto površina</span><strong>${PROJECT.overall.netFloorArea_m2.toFixed(1)} m²</strong></div>
      <div class="m-stat"><span>Podloga / točnost</span><strong>${esc(PROJECT.accuracy)}</strong></div>
    </div>
    <div class="m-disclaimer"><strong>Obavezna napomena za izvođače:</strong> ${esc(PROJECT.disclaimer)}</div>
    <div class="m-table-wrap m-floors-table">
      <table>
        <caption>Rekapitulacija etaža</caption>
        <thead><tr><th scope="col">Etaža</th><th scope="col">Zone</th><th scope="col" class="num">Podna površina</th><th scope="col">Svijetle visine</th></tr></thead>
        <tbody>${floorsRows}</tbody>
      </table>
    </div>`;

  $('footer-disclaimer').textContent = `${PROJECT.title} • ${PROJECT.disclaimer}`;
}

function renderToc() {
  $('toc-zones').innerHTML = ZONES.map(
    (z) => `<li><a href="#zona-${esc(z.code)}"><strong>${esc(z.code)}</strong> — ${esc(z.name)} (${z.dims.floorArea_m2.toFixed(1)} m²)</a></li>`
  ).join('');
}

function worldToPx(x, y, plan) {
  const { xMin, xMax, yMin, yMax } = plan.world;
  return [
    ((x - xMin) / (xMax - xMin)) * plan.widthPx,
    ((yMax - y) / (yMax - yMin)) * plan.heightPx
  ];
}

function buildPlanSvg(plan) {
  const mPerPx = (plan.world.xMax - plan.world.xMin) / plan.widthPx;
  const dimsMarkup = plan.dims
    .map((d) => {
      const dx = d.x2 - d.x1;
      const dy = d.y2 - d.y1;
      const len = Math.hypot(dx, dy) || 1;
      const nx = (-dy / len) * (d.offset || 0);
      const ny = (dx / len) * (d.offset || 0);
      const [ax, ay] = worldToPx(d.x1, d.y1, plan);
      const [bx, by] = worldToPx(d.x2, d.y2, plan);
      const [ox1, oy1] = worldToPx(d.x1 + nx, d.y1 + ny, plan);
      const [ox2, oy2] = worldToPx(d.x2 + nx, d.y2 + ny, plan);
      const mx = (ox1 + ox2) / 2;
      const my = (oy1 + oy2) / 2;
      const tick = 9;
      const pLen = Math.hypot(ox2 - ox1, oy2 - oy1) || 1;
      const ux = (ox2 - ox1) / pLen;
      const uy = (oy2 - oy1) / pLen;
      // 45-deg architectural ticks
      const tx = (ux - uy) * tick * 0.7;
      const ty = (uy + ux) * tick * 0.7;
      const pillW = Math.max(76, d.text.length * 11.5 + 18);
      return `
        <line class="dim-ext" x1="${ax.toFixed(1)}" y1="${ay.toFixed(1)}" x2="${ox1.toFixed(1)}" y2="${oy1.toFixed(1)}" />
        <line class="dim-ext" x1="${bx.toFixed(1)}" y1="${by.toFixed(1)}" x2="${ox2.toFixed(1)}" y2="${oy2.toFixed(1)}" />
        <line class="dim-line" x1="${ox1.toFixed(1)}" y1="${oy1.toFixed(1)}" x2="${ox2.toFixed(1)}" y2="${oy2.toFixed(1)}" />
        <line class="dim-line" x1="${(ox1 - tx).toFixed(1)}" y1="${(oy1 - ty).toFixed(1)}" x2="${(ox1 + tx).toFixed(1)}" y2="${(oy1 + ty).toFixed(1)}" />
        <line class="dim-line" x1="${(ox2 - tx).toFixed(1)}" y1="${(oy2 - ty).toFixed(1)}" x2="${(ox2 + tx).toFixed(1)}" y2="${(oy2 + ty).toFixed(1)}" />
        <rect class="dim-pill" x="${(mx - pillW / 2).toFixed(1)}" y="${(my - 15).toFixed(1)}" width="${pillW.toFixed(1)}" height="30" rx="8" />
        <text class="dim-text" x="${mx.toFixed(1)}" y="${my.toFixed(1)}">${esc(d.text)}</text>`;
    })
    .join('');

  const roomsMarkup = plan.rooms
    .map((r) => {
      const [rx, ry] = worldToPx(r.x, r.y, plan);
      const w = Math.max(108, r.label.length * 12 + 24);
      return `
        <a href="#zona-${esc(r.code)}" aria-label="Idi na zonu ${esc(r.label)}">
          <rect class="room-pill" x="${(rx - w / 2).toFixed(1)}" y="${(ry - 17).toFixed(1)}" width="${w.toFixed(1)}" height="34" rx="17" />
          <text class="room-label" x="${rx.toFixed(1)}" y="${ry.toFixed(1)}">${esc(r.label)}</text>
        </a>`;
    })
    .join('');

  // Suppress unused warning while keeping scale ratio clear for SVG debug
  void mPerPx;
  return `<svg class="m-plan-svg" viewBox="0 0 ${plan.widthPx} ${plan.heightPx}" role="img" aria-label="${esc(plan.title)} — tlocrt s kotama">${dimsMarkup}${roomsMarkup}</svg>`;
}

function renderPlans() {
  const shown = PLANS.filter((p) => p.interior === activePlanMode);
  $('plans-grid').innerHTML = shown
    .map(
      (plan) => `
      <article class="m-plan-card">
        <h3>${esc(plan.title)}</h3>
        <div class="m-plan-wrap">
          <div class="m-plan-stage">
            <img src="${esc(plan.image)}" width="${plan.widthPx}" height="${plan.heightPx}" alt="${esc(plan.title)}" loading="lazy" />
            ${buildPlanSvg(plan)}
          </div>
        </div>
      </article>`
    )
    .join('');
}

function renderSequence() {
  $('site-sequence').innerHTML = PROJECT.siteSequence.map((s) => `<li>${esc(s.replace(/^\d+\.\s*/, ''))}</li>`).join('');
}

function populateBoqFilter() {
  const cats = [...new Set(BOQ.map((b) => b.category))];
  const sel = $('boq-filter');
  sel.innerHTML = `<option value="all">Sve kategorije (${BOQ.length} stavki)</option>` +
    cats.map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join('');
  sel.addEventListener('change', () => renderBoq(sel.value));
}

function renderBoq(filter = 'all') {
  const cats = [...new Set(BOQ.map((b) => b.category))].filter((c) => filter === 'all' || c === filter);
  let idx = 1;
  $('boq-tables').innerHTML = cats
    .map((cat) => {
      const items = BOQ.filter((b) => b.category === cat);
      const unitTotals = {};
      for (const it of items) {
        unitTotals[it.unit] = (unitTotals[it.unit] || 0) + Number(it.qty || 0);
      }
      const totalStr = Object.entries(unitTotals)
        .map(([u, q]) => `${Number.isInteger(q) ? q : q.toFixed(1)} ${u}`)
        .join(' · ');
      const rows = items
        .map(
          (it) => `<tr>
            <td class="num">${idx++}</td>
            <td><strong>${esc(it.item)}</strong></td>
            <td>${esc(it.spec)}</td>
            <td>${esc(it.zones.join(', '))}</td>
            <td class="num">${esc(it.unit)}</td>
            <td class="num">${Number.isInteger(it.qty) ? it.qty : it.qty.toFixed(1)}</td>
            <td class="blank-col"></td>
            <td class="blank-col"></td>
          </tr>`
        )
        .join('');
      return `
        <div class="m-table-wrap">
          <table>
            <caption>${esc(cat)} — zbroj količina: ${esc(totalStr)}</caption>
            <thead>
              <tr>
                <th scope="col" class="num">Rb</th>
                <th scope="col">Opis stavke</th>
                <th scope="col">Tehnička specifikacija</th>
                <th scope="col">Zone</th>
                <th scope="col" class="num">J.m.</th>
                <th scope="col" class="num">Količina</th>
                <th scope="col">Jed. cijena (€)</th>
                <th scope="col">Ukupno (€)</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>`;
    })
    .join('');
}

function renderSimpleTable(caption, headers, rowsHtml) {
  if (!rowsHtml) return '';
  return `<div class="m-table-wrap"><table><caption>${esc(caption)}</caption><thead><tr>${headers
    .map((h) => `<th scope="col"${h.num ? ' class="num"' : ''}>${esc(h.label)}</th>`)
    .join('')}</tr></thead><tbody>${rowsHtml}</tbody></table></div>`;
}

function renderZones() {
  $('zones-list').innerHTML = ZONES.map((z) => {
    const d = z.dims;
    const rd = z.redesign;
    const finishesRows = rd.finishes
      .map(
        (f) => `<tr><td><strong>${esc(f.element)}</strong></td><td>${esc(f.material)}</td><td>${esc(f.spec)}</td><td class="num">${esc(f.qty)} ${esc(f.unit)}</td><td>${esc(f.note)}</td></tr>`
      )
      .join('');
    const furnRows = rd.furniture
      .map(
        (f) => `<tr><td><strong>${esc(f.item)}</strong></td><td>${esc(f.dims)}</td><td>${esc(f.material)}</td><td>${esc(f.position)}</td><td>${esc(f.note)}</td></tr>`
      )
      .join('');
    const lightRows = rd.lighting
      .map(
        (l) => `<tr><td><strong>${esc(l.item)}</strong></td><td>${esc(l.spec)}</td><td class="num">${esc(l.qty)}</td><td>${esc(l.mount)}</td><td>${esc(l.circuit)}</td></tr>`
      )
      .join('');
    const elecRows = rd.electrical
      .map(
        (e) => `<tr><td><strong>${esc(e.item)}</strong></td><td class="num">${esc(e.qty)}</td><td class="num">${esc(e.height_cm)} cm</td><td>${esc(e.position)}</td><td>${esc(e.note)}</td></tr>`
      )
      .join('');
    const plumbRows = rd.plumbing
      .map(
        (p) => `<tr><td><strong>${esc(p.item)}</strong></td><td>${esc(p.spec)}</td><td class="num">${esc(p.height_cm)} cm</td><td>${esc(p.position)}</td><td>${esc(p.note)}</td></tr>`
      )
      .join('');

    return `
      <article id="zona-${esc(z.code)}" class="m-zone-card">
        <div class="m-zone-head">
          <div>
            <span class="m-kicker">ZONA ${esc(z.code)} / ${ZONES.length} · ${esc(z.floor)}</span>
            <h3>${esc(z.code)} — ${esc(z.name)}</h3>
          </div>
          <a class="m-zone-link" href="./index.html?interijer=${activePlanMode === 'current' ? 'postojece' : 'redizajn'}#stop-${z.stop}">Otvori u 3D šetnji ↗</a>
        </div>
        <div class="m-meta-grid">
          <div class="m-stat"><span>Duljina × širina</span><strong>${d.length_m.toFixed(2)} × ${d.width_m.toFixed(2)} m</strong></div>
          <div class="m-stat"><span>Svijetla visina</span><strong>${d.clearHeight_m.toFixed(2)} m</strong></div>
          <div class="m-stat"><span>Nadozid (kosina)</span><strong>${d.kneeWall_m ? `${d.kneeWall_m.toFixed(2)} m` : 'Ravni strop'}</strong></div>
          <div class="m-stat"><span>Površina poda</span><strong>${d.floorArea_m2.toFixed(1)} m²</strong></div>
          <div class="m-stat"><span>Neto površina zidova</span><strong>${d.wallArea_m2.toFixed(1)} m²</strong></div>
          <div class="m-stat"><span>Vrsta tlocrta</span><strong>${z.openPlan ? 'Otvoreni plan' : 'Zasebna soba'}</strong></div>
        </div>
        <p class="m-zone-summary"><strong>Opis redizajna:</strong> ${esc(rd.summary)} <em>(${esc(d.note)})</em></p>

        ${renderSimpleTable('Završne obloge i materijali', [
          { label: 'Element' }, { label: 'Materijal' }, { label: 'Specifikacija / ton' }, { label: 'Količina', num: true }, { label: 'Napomena' }
        ], finishesRows)}

        ${renderSimpleTable('Stolarija i namještaj po mjeri / oprema', [
          { label: 'Stavka' }, { label: 'Dimenzije' }, { label: 'Materijal' }, { label: 'Pozicija u prostoru' }, { label: 'Napomena' }
        ], furnRows)}

        ${renderSimpleTable('Rasvjeta', [
          { label: 'Rasvjetno tijelo' }, { label: 'Specifikacija' }, { label: 'Kol.', num: true }, { label: 'Montaža' }, { label: 'Strujni krug' }
        ], lightRows)}

        ${renderSimpleTable('Elektroinstalacije', [
          { label: 'Pozicija / priključak' }, { label: 'Kom', num: true }, { label: 'Visina', num: true }, { label: 'Položaj' }, { label: 'Napomena' }
        ], elecRows)}

        ${renderSimpleTable('Vodovod, odvodnja i grijanje', [
          { label: 'Armatura / priključak' }, { label: 'Specifikacija' }, { label: 'Visina', num: true }, { label: 'Položaj' }, { label: 'Napomena' }
        ], plumbRows)}

        <div class="m-zone-cols">
          <div class="m-box">
            <h4>Zatečeno postojeće stanje</h4>
            <ul>${z.existing.map((e) => `<li>${esc(e)}</li>`).join('')}</ul>
          </div>
          <div class="m-box">
            <h4>Redoslijed radova &amp; kontrola na licu mjesta</h4>
            <ol>${rd.sequence.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
            <h4 style="margin-top:10px">Obavezna provjera majstora</h4>
            <ul>${z.checks.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
          </div>
        </div>
      </article>`;
  }).join('');
}

function downloadBoqCsv() {
  const sep = ';';
  const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = [
    ['Rb', 'Kategorija', 'Stavka', 'Tehnicki opis', 'Zone', 'Jed. mj.', 'Kolicina', 'Jed. cijena (EUR)', 'Ukupno (EUR)'].map(csvCell).join(sep)
  ];
  BOQ.forEach((b, i) => {
    lines.push([
      i + 1,
      b.category,
      b.item,
      b.spec,
      b.zones.join(', '),
      b.unit,
      String(b.qty).replace('.', ','),
      '',
      ''
    ].map(csvCell).join(sep));
  });
  const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'loft-troskovnik-za-majstore.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Wire toolbar controls
document.querySelectorAll('.m-toggle-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    activePlanMode = btn.dataset.planMode || 'redesign';
    document.querySelectorAll('.m-toggle-btn').forEach((b) => {
      const on = b === btn;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    renderPlans();
    renderZones();
  });
});

$('btn-print').addEventListener('click', () => window.print());
$('btn-csv').addEventListener('click', downloadBoqCsv);
$('btn-csv-inline').addEventListener('click', downloadBoqCsv);

renderHeader();
renderToc();
renderPlans();
renderSequence();
populateBoqFilter();
renderBoq('all');
renderZones();
