'use strict';

// ── country centroids (ISO-2 → [lat, lon]) ──────────────────────────────────
const CC = {
  AF:[33.93,67.71],AL:[41.15,20.17],DZ:[28.03,1.66],AO:[-11.2,17.87],AR:[-38.42,-63.62],
  AM:[40.07,45.04],AU:[-25.27,133.78],AT:[47.52,14.55],AZ:[40.14,47.58],BS:[25.03,-77.4],
  BH:[26.0,50.55],BD:[23.68,90.36],BY:[53.71,27.95],BE:[50.5,4.47],BJ:[9.31,2.32],
  BT:[27.51,90.43],BO:[-16.29,-63.59],BA:[43.92,17.68],BW:[-22.33,24.68],BR:[-14.24,-51.93],
  BN:[4.54,114.73],BG:[42.73,25.49],BF:[12.36,-1.56],BI:[-3.37,29.92],KH:[12.57,104.99],
  CM:[3.85,11.5],CA:[56.13,-106.35],CF:[6.61,20.94],TD:[15.45,18.73],CL:[-35.68,-71.54],
  CN:[35.86,104.2],CO:[4.57,-74.3],CG:[-0.23,15.83],CD:[-4.04,21.76],CR:[9.75,-83.75],
  HR:[45.1,15.2],CU:[21.52,-77.78],CY:[35.13,33.43],CZ:[49.82,15.47],DK:[56.26,9.5],
  DO:[18.74,-70.16],EC:[-1.83,-78.18],EG:[26.82,30.8],SV:[13.79,-88.9],GQ:[1.65,10.27],
  ER:[15.18,39.78],EE:[58.6,25.01],ET:[9.15,40.49],FJ:[-16.58,179.41],FI:[61.92,25.75],
  FR:[46.23,2.21],GA:[-0.8,11.61],GM:[13.44,-15.31],GE:[42.31,43.36],DE:[51.17,10.45],
  GH:[7.95,-1.02],GR:[39.07,21.82],GT:[15.78,-90.23],GN:[9.95,-11.82],GW:[11.8,-15.18],
  GY:[4.86,-58.93],HT:[18.97,-72.29],HN:[15.2,-86.24],HU:[47.16,19.5],IS:[64.96,-19.02],
  IN:[20.59,78.96],ID:[-0.79,113.92],IR:[32.43,53.69],IQ:[33.22,43.68],IE:[53.41,-8.24],
  IL:[31.05,34.85],IT:[41.87,12.57],JM:[18.11,-77.3],JP:[36.2,138.25],JO:[30.59,36.24],
  KZ:[48.02,66.92],KE:[-0.02,37.91],KP:[40.34,127.51],KR:[35.91,127.77],KW:[29.31,47.48],
  KG:[41.2,74.77],LA:[19.86,102.49],LV:[56.88,24.6],LB:[33.85,35.86],LR:[6.43,-9.43],
  LY:[26.34,17.23],LT:[55.17,23.88],LU:[49.82,6.13],MK:[41.61,21.75],MG:[-18.77,46.87],
  MW:[-13.25,34.3],MY:[4.21,108.96],MV:[3.2,73.22],ML:[17.57,-3.99],MT:[35.94,14.38],
  MR:[21.0,-10.94],MX:[23.63,-102.55],MD:[47.41,28.37],MN:[46.86,103.85],ME:[42.71,19.37],
  MA:[31.79,-7.09],MZ:[-18.67,35.53],MM:[21.91,95.96],NA:[-22.96,18.49],NP:[28.39,84.12],
  NL:[52.13,5.29],NZ:[-40.9,174.89],NI:[12.87,-85.21],NE:[17.61,8.08],NG:[9.08,8.67],
  NO:[60.47,8.47],OM:[21.51,55.92],PK:[30.38,69.35],PA:[8.54,-80.78],PG:[-6.31,143.96],
  PY:[-23.44,-58.44],PE:[-9.19,-75.02],PH:[12.88,121.77],PL:[51.92,19.15],PT:[39.4,-8.22],
  QA:[25.35,51.18],RO:[45.94,24.97],RU:[61.52,105.32],RW:[-1.94,29.87],SA:[23.89,45.08],
  SN:[14.5,-14.45],RS:[44.02,21.01],SL:[8.46,-11.78],SK:[48.67,19.7],SI:[46.15,14.99],
  SO:[5.15,46.2],ZA:[-30.56,22.94],SS:[7.86,31.57],ES:[40.46,-3.75],LK:[7.87,80.77],
  SD:[12.86,30.22],SR:[3.92,-56.03],SE:[60.13,18.64],CH:[46.82,8.23],SY:[34.8,38.99],
  TW:[23.7,121.0],TJ:[38.86,71.28],TZ:[-6.37,34.89],TH:[15.87,100.99],TL:[-8.87,125.73],
  TG:[8.62,0.82],TT:[10.69,-61.22],TN:[33.89,9.54],TR:[38.96,35.24],TM:[38.97,59.56],
  UG:[1.37,32.29],UA:[48.38,31.17],AE:[23.42,53.85],GB:[55.38,-3.44],US:[37.09,-95.71],
  UY:[-32.52,-55.77],UZ:[41.38,64.59],VE:[6.42,-66.59],VN:[14.06,108.28],YE:[15.55,48.52],
  ZM:[-13.13,27.85],ZW:[-19.02,29.15],
};

// ── state ────────────────────────────────────────────────────────────────────
let map = null;
let lastResult = null;
let lastTakedown = null;
let lastOsint = null;
let markers = [];
let hostMarkers = [];
const SEV_ORDER = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
const SEV_COLORS = {
  critical: '#ff3333', high: '#ff7700', medium: '#ffcc00', low: '#00e5ff', info: '#334d3a'
};

// ── map init ─────────────────────────────────────────────────────────────────
let tileLayer = null, labelLayer = null, mapMode = 'street';
const TILES = {
  dark:  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
};
const SAT_TILE = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const SAT_LABELS = 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}';
function currentTheme() { return document.body.getAttribute('data-theme') || 'dark'; }

function initMap() {
  if (map) { map.invalidateSize(); return; }
  map = L.map('world-map', {
    zoomControl: true, attributionControl: false,
    minZoom: 2, maxZoom: 18,
    worldCopyJump: false,                    // markers stay on the real world, no copies
    maxBounds: [[-85, -180], [85, 180]],     // single world — no infinite horizontal wrap
    maxBoundsViscosity: 1.0,
  });
  setTiles(currentTheme());
  map.setView([25, 0], 2);
  map.on('click', cameraRecon);
  setTimeout(() => map.invalidateSize(), 60);
}

function toggleSatelliteView() {
  mapMode = mapMode === 'satellite' ? 'street' : 'satellite';
  const btn = document.getElementById('sky-satview');
  if (btn) btn.classList.toggle('on', mapMode === 'satellite');
  setTiles(currentTheme());
}

// ── 3D satellite globe (globe.gl) ───────────────────────────────────────────────
let globe3d = null, globe3dTimer = null, globeOn = false;
function toggle3DGlobe() {
  globeOn = !globeOn;
  document.getElementById('sky-3d').classList.toggle('on', globeOn);
  const g = document.getElementById('globe-3d');
  const m = document.getElementById('world-map');
  if (globeOn) {
    m.classList.add('hidden');
    g.classList.remove('hidden');
    initGlobe();
  } else {
    g.classList.add('hidden');
    m.classList.remove('hidden');
    if (globe3dTimer) { clearInterval(globe3dTimer); globe3dTimer = null; }
    setTimeout(() => map && map.invalidateSize(), 60);
    setSkyStatus();
  }
}

function _loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src; s.onload = () => resolve(); s.onerror = () => reject(new Error('load failed'));
    document.head.appendChild(s);
  });
}

async function initGlobe() {
  const el = document.getElementById('globe-3d');
  if (typeof Globe === 'undefined') {
    setSkyStatus('loading 3D engine…');
    try { await _loadScript('https://unpkg.com/globe.gl'); }
    catch (e) { setSkyStatus('3D engine failed to load'); return; }
  }
  if (!globe3d) {
    globe3d = Globe()(el)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
      .pointAltitude('alt').pointColor('color').pointRadius('r')
      .pointLabel(d => `${d.name} · ${Math.round(d.alt * 6371)} km`)
      .width(el.clientWidth || 900).height(520);
    try { globe3d.controls().autoRotate = true; globe3d.controls().autoRotateSpeed = 0.5; } catch (e) {}
    globe3d.pointOfView({ altitude: 2.6 });
  }
  if (!satData.length) {
    setSkyStatus('loading orbital elements…');
    try { satData = (await (await fetch('/api/sky/satellites?group=stations,visual')).json()).satellites || []; } catch (e) {}
  }
  updateGlobeSats();
  if (!globe3dTimer) globe3dTimer = setInterval(updateGlobeSats, 3000);
}

function updateGlobeSats() {
  if (!globe3d || typeof satellite === 'undefined') return;
  const now = new Date();
  const gmst = satellite.gstime(now);
  const pts = [];
  for (const s of satData) {
    try {
      const rec = satellite.twoline2satrec(s.l1, s.l2);
      const pv = satellite.propagate(rec, now);
      if (!pv.position) continue;
      const geo = satellite.eciToGeodetic(pv.position, gmst);
      const lat = satellite.degreesLat(geo.latitude), lng = satellite.degreesLong(geo.longitude);
      if (isNaN(lat) || isNaN(lng)) continue;
      const notable = /ISS|TIANHE|CSS|HUBBLE|NAUKA/i.test(s.name);
      pts.push({ lat, lng, alt: Math.min(geo.height / 6371, 0.6), name: s.name, color: notable ? '#d97757' : '#6aa3c9', r: notable ? 0.55 : 0.28 });
    } catch (e) {}
  }
  globe3d.pointsData(pts);
  setSkyStatus('● 3D globe · ' + pts.length + ' satellites orbiting live');
}

// ── page routing ────────────────────────────────────────────────────────────────
let activePage = 'op';
function showPage(name) {
  activePage = name;
  document.querySelectorAll('.page').forEach(p => p.classList.toggle('hidden', p.id !== 'page-' + name));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.toggle('active', t.dataset.page === name));
  if (activePage !== 'scrape' && scrapeTimer) { clearInterval(scrapeTimer); scrapeTimer = null; }
  if (name === 'radar') { initMap(); refreshBreachMap(); }
  if (name === 'op') ensureOpBoard();
  if (name === 'news') ensureNews();
  if (name === 'ransom') ensureRansom();
  if (name === 'scrape') startScrape();
  if (name === 'website' || name === 'osint') ensureRecon();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// run the deep recon (/api/osint) once per target; feeds Website + OSINT pages
let currentTarget = '', reconTarget = '', reconBusy = false;

function _reconTargetValue() {
  if (currentTarget) return currentTarget;
  const v = document.getElementById('search-input').value.trim();
  return v || '';
}

async function ensureRecon(force) {
  const wstat = document.getElementById('website-status');
  const ostat = document.getElementById('osint-status');
  const raw = _reconTargetValue();

  if (!raw) {
    const msg = '↑ Type a website in the search bar above — recon runs automatically.';
    wstat.textContent = ostat.textContent = msg;
    document.getElementById('website-grid').innerHTML = '<div class="osint-empty">No target yet. Enter a domain in the search bar, then open this tab (or hit Scan).</div>';
    document.getElementById('osint-grid').innerHTML = '<div class="osint-empty">No target yet. Enter a domain in the search bar above.</div>';
    document.getElementById('mindmap-section').classList.add('hidden');
    return;
  }
  if (!force && (reconTarget === raw || reconBusy)) return;

  reconBusy = true;
  currentTarget = raw;
  const username = document.getElementById('osint-username').value.trim();
  wstat.textContent = '⏳ nmap · subfinder · httpx · DNS · WHOIS · reverse-IP … (~30–60s)';
  ostat.textContent = '⏳ subdomains · emails · dorks · registration' + (username ? ' · username footprint' : '') + ' … (~30–60s)';
  document.getElementById('website-grid').innerHTML = skelCards(4);
  document.getElementById('osint-grid').innerHTML = skelCards(4);
  try {
    const data = await (await fetch('/api/osint', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target: raw, username }),
    })).json();
    if (data.error) {
      wstat.textContent = ostat.textContent = 'Error: ' + data.error;
      document.getElementById('website-grid').innerHTML = document.getElementById('osint-grid').innerHTML = `<div class="osint-empty">${esc(data.error)}</div>`;
      return;
    }
    lastOsint = data;
    reconTarget = raw;
    renderWebsite(data);
    renderOsint(data);
    buildMindmap(data);
    wstat.textContent = '✓ complete — ' + (data.domain || raw);
    ostat.textContent = '✓ complete — ' + (data.domain || raw);
  } catch (e) {
    wstat.textContent = ostat.textContent = 'Recon failed: ' + e;
  } finally { reconBusy = false; }
}
function runOsint() { ensureRecon(true); }

function setTiles(theme) {
  if (!map) return;
  if (tileLayer) { tileLayer.remove(); tileLayer = null; }
  if (labelLayer) { labelLayer.remove(); labelLayer = null; }
  if (mapMode === 'satellite') {
    tileLayer = L.tileLayer(SAT_TILE, { maxZoom: 19, noWrap: true, bounds: [[-90, -180], [90, 180]] }).addTo(map);
    labelLayer = L.tileLayer(SAT_LABELS, { maxZoom: 19, noWrap: true, opacity: 0.9, pane: 'overlayPane' }).addTo(map);
  } else {
    tileLayer = L.tileLayer(TILES[theme] || TILES.dark, {
      maxZoom: 19, subdomains: 'abcd', noWrap: true, bounds: [[-90, -180], [90, 180]],
    }).addTo(map);
  }
}

// ── live sky layer: aircraft (OpenSky) + satellites (satellite.js) ──────────────
let airOn = false, airMarkers = [], airTimer = null;
let satOn = false, satData = [], satMarkers = [], satTimer = null;

async function toggleAircraft() {
  airOn = !airOn;
  document.getElementById('sky-air').classList.toggle('on', airOn);
  if (airOn) {
    await refreshAircraft();
    airTimer = setInterval(refreshAircraft, 15000);
    map.on('moveend', refreshAircraft);
  } else {
    clearInterval(airTimer); airTimer = null;
    map.off('moveend', refreshAircraft);
    airMarkers.forEach(m => m.remove()); airMarkers = [];
    setSkyStatus();
  }
}

async function refreshAircraft() {
  if (!airOn || !map) return;
  const b = map.getBounds();
  // clamp to valid WGS-84 ranges — OpenSky returns nothing for out-of-range boxes
  const lamin = Math.max(-90, b.getSouth()).toFixed(3);
  const lamax = Math.min(90, b.getNorth()).toFixed(3);
  const lomin = Math.max(-180, b.getWest()).toFixed(3);
  const lomax = Math.min(180, b.getEast()).toFixed(3);
  setSkyStatus('scanning ADS-B…');
  try {
    const url = `/api/sky/aircraft?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`;
    const list = (await (await fetch(url)).json()).aircraft || [];
    airMarkers.forEach(m => m.remove()); airMarkers = [];
    for (const a of list) {
      const icon = L.divIcon({
        html: `<div class="air-ico" style="transform:rotate(${a.heading || 0}deg)">✈</div>`,
        className: '', iconAnchor: [7, 7],
      });
      const kmh = Math.round((a.velocity || 0) * 3.6);
      const m = L.marker([a.lat, a.lon], { icon }).addTo(map)
        .bindPopup(`<b>${esc(a.callsign || a.icao || 'aircraft')}</b><br>${esc(a.country || '')}<br>alt ${Math.round(a.alt || 0)} m · ${kmh} km/h`);
      airMarkers.push(m);
    }
    setSkyStatus();
  } catch (e) { setSkyStatus('aircraft feed unavailable'); }
}

async function toggleSatellites() {
  satOn = !satOn;
  document.getElementById('sky-sat').classList.toggle('on', satOn);
  if (satOn) {
    if (!satData.length) {
      setSkyStatus('loading orbital elements…');
      try { satData = (await (await fetch('/api/sky/satellites?group=stations,visual')).json()).satellites || []; } catch (e) {}
    }
    updateSatellites();
    satTimer = setInterval(updateSatellites, 3000);
  } else {
    clearInterval(satTimer); satTimer = null;
    satMarkers.forEach(m => m.remove()); satMarkers = [];
    setSkyStatus();
  }
}

function updateSatellites() {
  if (!satOn || typeof satellite === 'undefined') return;
  const now = new Date();
  const gmst = satellite.gstime(now);
  satMarkers.forEach(m => m.remove()); satMarkers = [];
  for (const s of satData) {
    try {
      const rec = satellite.twoline2satrec(s.l1, s.l2);
      const pv = satellite.propagate(rec, now);
      if (!pv.position) continue;
      const geo = satellite.eciToGeodetic(pv.position, gmst);
      const lat = satellite.degreesLat(geo.latitude);
      const lon = satellite.degreesLong(geo.longitude);
      if (isNaN(lat) || isNaN(lon)) continue;
      const notable = /ISS|TIANHE|CSS|HUBBLE|NAUKA/i.test(s.name);
      const icon = L.divIcon({
        html: `<div class="sat-ico" style="${notable ? 'font-size:19px' : ''}">🛰</div>`,
        className: '', iconAnchor: [8, 8],
      });
      const m = L.marker([lat, lon], { icon }).addTo(map)
        .bindPopup(`<b>${esc(s.name)}</b><br>altitude ${geo.height.toFixed(0)} km<br>${notable ? 'crewed / notable' : 'satellite'}`);
      satMarkers.push(m);
    } catch (e) {}
  }
  setSkyStatus();
}

function setSkyStatus(msg) {
  const el = document.getElementById('sky-status');
  if (!el) return;
  if (msg) { el.textContent = msg; return; }
  const bits = [];
  if (threatOn) bits.push(`${threatMarkers.length} threats`);
  if (airOn) bits.push(`${airMarkers.length} aircraft`);
  if (satOn) bits.push(`${satMarkers.length} satellites`);
  if (camOn) bits.push(`${camMarkers.length} cams`);
  el.textContent = bits.length ? '● ' + bits.join(' · ') + ' live' : 'live ADS-B · orbital · threat · cam tracking';
}

// ── real-time threat feed ───────────────────────────────────────────────────────
let threatOn = false, threatMarkers = [], threatTimer = null, threatSeen = new Set();
const TCOLOR = { botnet_c2: '#e5675c', malware_url: '#e0944d' };

async function toggleThreats() {
  threatOn = !threatOn;
  document.getElementById('sky-threat').classList.toggle('on', threatOn);
  const ticker = document.getElementById('threat-ticker');
  if (threatOn) {
    ticker.classList.remove('hidden');
    await refreshThreats(true);
    threatTimer = setInterval(() => refreshThreats(false), 45000);
  } else {
    clearInterval(threatTimer); threatTimer = null;
    threatMarkers.forEach(m => m.remove()); threatMarkers = [];
    ticker.classList.add('hidden');
    setSkyStatus();
  }
}

async function refreshThreats(first) {
  if (!threatOn) return;
  setSkyStatus('pulling threat feed…');
  let list = [];
  try { list = (await (await fetch('/api/threats')).json()).threats || []; }
  catch (e) { setSkyStatus('threat feed unavailable'); return; }

  // map markers — one pulsing ring per unique coordinate
  threatMarkers.forEach(m => m.remove()); threatMarkers = [];
  const placed = new Set();
  for (const t of list) {
    if (t.lat == null || t.lon == null) continue;
    const k = `${t.lat.toFixed(2)},${t.lon.toFixed(2)}`;
    if (placed.has(k)) continue;
    placed.add(k);
    const color = TCOLOR[t.type] || '#e5675c';
    const icon = L.divIcon({ html: `<div class="threat-dot" style="--tcolor:${color}"><i></i></div>`, className: '', iconAnchor: [5, 5] });
    const m = L.marker([t.lat, t.lon], { icon }).addTo(map)
      .bindPopup(`<b>${esc(t.kind)} — ${esc(t.malware || '')}</b><br>${esc(t.country || t.country_code || '')} · ${esc(t.ip || t.host || '')}<br><a href="${esc(t.url)}" target="_blank" rel="noopener">details ↗</a>`);
    threatMarkers.push(m);
  }

  renderTicker(list, first);
  document.getElementById('ticker-meta').textContent =
    `${list.length} active · updated ${new Date().toLocaleTimeString()}`;
  setSkyStatus();
}

function renderTicker(list, first) {
  const body = document.getElementById('ticker-body');
  body.innerHTML = '';
  for (const t of list.slice(0, 80)) {
    const key = `${t.type}|${t.ip || t.host}|${t.url}`;
    const fresh = !first && !threatSeen.has(key);
    const color = TCOLOR[t.type] || '#e5675c';
    const isC2 = t.type === 'botnet_c2';
    const time = (t.date || '').slice(11, 16);
    const host = t.ip || t.host || '';
    const row = document.createElement('div');
    row.className = 'ticker-row' + (fresh ? ' fresh' : '');
    row.innerHTML = `
      <span class="trow-dot" style="background:${color}"></span>
      <span class="trow-kind ${isC2 ? 'c2' : 'url'}">${isC2 ? 'BOTNET C2' : 'MALWARE URL'}</span>
      <span class="trow-cc">${esc(t.country_code || '??')} ${flagEmoji(t.country_code) || ''}</span>
      <span class="trow-host" title="${esc(t.malware || '')}">${t.url ? `<a href="${esc(t.url)}" target="_blank" rel="noopener">${esc(host)}</a>` : esc(host)} · ${esc(t.malware || '')}</span>
      <span class="trow-time">${esc(time)}</span>`;
    body.appendChild(row);
  }
  for (const t of list) threatSeen.add(`${t.type}|${t.ip || t.host}|${t.url}`);
}

function clearMarkers() {
  markers.forEach(m => m.remove());
  markers = [];
}

function plotMarkers(findings, targetGeo) {
  clearMarkers();

  // victim country → counts
  const countryCounts = {};
  for (const f of findings) {
    const c = (f.country || '').toUpperCase().trim();
    if (!c || c.length !== 2) continue;
    if (!countryCounts[c]) countryCounts[c] = { count: 0, sev: 'info' };
    countryCounts[c].count++;
    if (SEV_ORDER[f.severity] < SEV_ORDER[countryCounts[c].sev]) {
      countryCounts[c].sev = f.severity;
    }
  }

  for (const [code, info] of Object.entries(countryCounts)) {
    const pos = CC[code];
    if (!pos) continue;
    const r = Math.min(4 + info.count * 1.5, 16);
    const color = SEV_COLORS[info.sev] || SEV_COLORS.info;
    const circle = L.circleMarker(pos, {
      radius: r, color, fillColor: color, fillOpacity: 0.55, weight: 1,
    }).addTo(map).bindPopup(
      `<b>${code}</b><br>${info.count} finding(s)<br>Severity: ${info.sev.toUpperCase()}`
    );
    markers.push(circle);
  }

  // target host
  if (targetGeo && targetGeo.lat && targetGeo.lon) {
    const icon = L.divIcon({
      html: `<div style="color:#00ff88;font-size:20px;line-height:1;text-shadow:0 0 8px #00ff88">⊕</div>`,
      className: '', iconAnchor: [10, 10],
    });
    const m = L.marker([targetGeo.lat, targetGeo.lon], { icon })
      .addTo(map)
      .bindPopup(`<b>${targetGeo.country_name || targetGeo.country}</b><br>Target host: ${targetGeo.ip || ''}<br>ISP: ${targetGeo.isp || ''}`);
    markers.push(m);
  }
}

function buildLegend(findings) {
  const sev = [...new Set(findings.map(f => f.severity))];
  const el = document.getElementById('map-legend');
  el.innerHTML = '';
  for (const s of ['critical', 'high', 'medium', 'low', 'info'].filter(x => sev.includes(x))) {
    const item = document.createElement('div');
    item.className = 'legend-item';
    item.innerHTML = `<span class="legend-dot" style="background:${SEV_COLORS[s]}"></span>${s.toUpperCase()}`;
    el.appendChild(item);
  }
  const tg = document.createElement('div');
  tg.className = 'legend-item';
  tg.innerHTML = `<span style="color:#00ff88;font-size:14px">⊕</span> TARGET HOST`;
  el.appendChild(tg);

  const host = document.createElement('div');
  host.className = 'legend-item';
  host.innerHTML = `<span style="color:#ff3333;font-size:14px">⌖</span> LEAK HOSTING (after takedown trace)`;
  el.appendChild(host);
}

// ── scan ─────────────────────────────────────────────────────────────────────
async function startScan() {
  const target = document.getElementById('search-input').value.trim();
  if (!target) return;
  // On the Operation landing page, the Scan button launches the full operation.
  if (activePage === 'op') { runOperation(); return; }
  const includeForums = document.getElementById('forums-check').checked;

  setStatus('scanning');
  document.getElementById('scan-btn').disabled = true;
  document.getElementById('scan-label').textContent = 'Scanning';
  document.getElementById('scan-spinner').classList.remove('hidden');
  document.getElementById('error-banner').classList.add('hidden');

  try {
    const res = await fetch('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target, include_forums: includeForums }),
    });
    const data = await res.json();

    if (!res.ok || data.error) {
      showError(data.error || `HTTP ${res.status}`);
      return;
    }

    lastResult = data;
    renderResults(data);
    setStatus('ready');
  } catch (e) {
    showError(String(e));
  } finally {
    document.getElementById('scan-btn').disabled = false;
    document.getElementById('scan-label').textContent = 'Scan';
    document.getElementById('scan-spinner').classList.add('hidden');
  }
}

// ── render ────────────────────────────────────────────────────────────────────
function renderResults(data) {
  const { domain, findings, subdomains, target_geo, scanned_at, risk } = data;

  // verdict
  renderVerdict(risk, findings.length);
  saveRecent(domain);
  saveHistory(data);

  // summary
  document.getElementById('summary-domain').textContent = domain;
  const geo = target_geo;
  document.getElementById('summary-ip').textContent =
    geo ? `${geo.ip}  ·  ${geo.country_name}  ·  ${geo.isp}  ·  scanned ${scanned_at}` : `scanned ${scanned_at}`;

  const counts = {};
  let newsCount = 0;
  for (const f of findings) {
    counts[f.severity] = (counts[f.severity] || 0) + 1;
    if (f.category === 'news') newsCount++;
  }
  const statsEl = document.getElementById('summary-stats');
  statsEl.innerHTML = '';
  for (const [sev, cls] of [['critical','critical'],['high','high'],['medium','medium'],['total','green']]) {
    const chip = document.createElement('div');
    chip.className = `stat-chip ${cls}`;
    chip.innerHTML = `<span class="stat-n">${sev === 'total' ? findings.length : counts[sev] || 0}</span><span class="stat-l">${sev.toUpperCase()}</span>`;
    statsEl.appendChild(chip);
  }
  if (newsCount > 0) {
    const chip = document.createElement('div');
    chip.className = 'stat-chip';
    chip.innerHTML = `<span class="stat-n" style="color:#88bbff">${newsCount}</span><span class="stat-l">NEWS</span>`;
    statsEl.appendChild(chip);
  }

  // live counts on the filter buttons so it's obvious what each yields
  document.querySelectorAll('#page-breach .filter-btn[data-sev]').forEach(b => {
    const s = b.dataset.sev;
    b.textContent = s === 'all' ? `ALL ${findings.length}` : `${s.toUpperCase()} ${counts[s] || 0}`;
  });
  const nb = document.querySelector('#page-breach .filter-btn[data-cat="news"]');
  if (nb) nb.textContent = `NEWS ${newsCount}`;

  // breach map markers are plotted lazily when the Radar page opens
  refreshBreachMap();

  // findings (grouped by category)
  renderFindingGroups(findings);

  // filter reset
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.filter-btn[data-sev="all"]').classList.add('active');

  // subdomains
  const subsSection = document.getElementById('subs-section');
  const subsWrap = document.getElementById('subs-wrap');
  if (subdomains && subdomains.length) {
    subsSection.classList.remove('hidden');
    subsWrap.innerHTML = '';
    for (const s of subdomains) {
      const tag = document.createElement('span');
      tag.className = 'sub-tag';
      tag.textContent = s;
      subsWrap.appendChild(tag);
    }
  } else {
    subsSection.classList.add('hidden');
  }

  // new target → reset takedown + invalidate cached recon
  resetTakedown();
  currentTarget = domain;
  reconTarget = '';
  resetOsint();

  document.getElementById('breach-empty').classList.add('hidden');
  document.getElementById('breach-body').classList.remove('hidden');
  showPage('breach');
}

// plot breach victim + hosting markers on the radar map (safe if map not ready)
function refreshBreachMap() {
  if (!map || !lastResult) return;
  plotMarkers(lastResult.findings, lastResult.target_geo);
  buildLegend(lastResult.findings);
  if (lastTakedown && lastTakedown.records) plotHostingMarkers(lastTakedown.records);
}

function makeCard(f) {
  const sev = (f.severity || 'info').toLowerCase();
  const cat = (f.category || '').toLowerCase();
  const div = document.createElement('div');
  div.className = `finding-card sev-${sev}${cat === 'news' ? ' cat-news' : ''}`;
  div.dataset.sev = sev;
  div.dataset.cat = cat;

  const badgeClass = cat === 'news' ? 'badge badge-news' : `badge badge-${sev}`;
  const badgeLabel = cat === 'news' ? 'NEWS' : sev.toUpperCase();
  const url = f.url ? `<a href="${esc(f.url)}" target="_blank" rel="noopener">${ed(f.title)}</a>` : ed(f.title);
  const date = f.date ? `<span class="find-date">${esc(f.date)}</span>` : '';

  div.innerHTML = `
    <span class="${badgeClass}">${badgeLabel}</span>
    <span class="find-source">${ed(f.source || '')}</span>
    <span class="find-title" title="${ed(f.detail || f.title)}">${url}</span>
    ${date}
  `;
  return div;
}

function esc(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// decode pre-escaped source data first, so esc() yields a single clean pass
function dec(s) {
  return String(s || '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&#x27;/gi, "'");
}
function ed(s) { return esc(dec(s)); }   // decode-then-escape
function skelRows(n) { return Array.from({ length: n }, () => '<div class="skel skel-row"></div>').join(''); }
function skelCards(n) { return Array.from({ length: n }, () => '<div class="skel skel-card"></div>').join(''); }

// ── filters ───────────────────────────────────────────────────────────────────
function filterSev(sev, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.finding-card').forEach(card => {
    card.classList.toggle('hidden', !(sev === 'all' || card.dataset.sev === sev));
  });
  updateGroupVisibility(sev !== 'all');
}

function filterCat(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.finding-card').forEach(card => {
    card.classList.toggle('hidden', card.dataset.cat !== cat);
  });
  updateGroupVisibility(true);
}

function updateGroupVisibility(expandMatches) {
  document.querySelectorAll('.fgroup').forEach(g => {
    const visible = g.querySelectorAll('.finding-card:not(.hidden)').length;
    g.classList.toggle('hidden', visible === 0);
    if (expandMatches && visible > 0) g.classList.remove('collapsed');
  });
  // empty-state message so a 0-result filter clearly reads as "none", not "broken"
  const grid = document.getElementById('findings-grid');
  let msg = document.getElementById('filter-empty');
  if (!msg) {
    msg = document.createElement('div');
    msg.id = 'filter-empty';
    msg.className = 'osint-empty';
    msg.style.padding = '22px 0';
    grid.parentNode.insertBefore(msg, grid.nextSibling);
  }
  const anyVisible = grid.querySelectorAll('.finding-card:not(.hidden)').length;
  msg.style.display = anyVisible ? 'none' : 'block';
  msg.textContent = anyVisible ? '' : 'No findings at this severity — try another filter.';
}

// ── export ────────────────────────────────────────────────────────────────────
function exportJSON() {
  if (!lastResult) return;
  const blob = new Blob([JSON.stringify(lastResult, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `breachintel-${lastResult.domain}-${lastResult.scanned_at.replace(/[:.]/g, '-')}.json`;
  a.click();
}

// ── unified standalone HTML report ──────────────────────────────────────────────
function generateReport() {
  if (!lastResult) { showError('Scan a domain first — then download the report.'); return; }
  const R = lastResult, O = lastOsint, T = lastTakedown, I = lastIntel;
  const risk = R.risk || {};
  const sevColor = { critical: '#c0392b', high: '#c2761c', medium: '#a98a23', low: '#3f7ba3', info: '#888' };
  const esc2 = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const findingRows = (R.findings || []).map(f =>
    `<tr><td><span class="sv" style="background:${sevColor[f.severity] || '#888'}">${(f.severity || '').toUpperCase()}</span></td><td>${esc2(f.source)}</td><td>${esc2(f.title)}</td><td>${esc2(f.date)}</td></tr>`).join('');

  const reg = (O && O.registration) || {};
  const ipp = (O && O.ip_profile) || {};
  const osintBlock = O ? `
    <h2>OSINT &amp; Recon</h2>
    <table class="kv">
      <tr><td>Registrar</td><td>${esc2(reg.registrar)}</td></tr>
      <tr><td>Created</td><td>${esc2(reg.created)}</td></tr><tr><td>Expires</td><td>${esc2(reg.expires)}</td></tr>
      <tr><td>IP / ASN</td><td>${esc2(ipp.ip)} · ${esc2(ipp.asn)}</td></tr>
      <tr><td>Location</td><td>${esc2([ipp.city, ipp.country].filter(Boolean).join(', '))}</td></tr>
      <tr><td>Subdomains</td><td>${(O.subdomains || []).length}</td></tr>
      <tr><td>Open ports</td><td>${((O.nmap || {}).ports || []).map(p => p.port + '/' + p.service).join(', ') || '—'}</td></tr>
      <tr><td>WAF</td><td>${esc2(O.waf) || '—'}</td></tr>
      <tr><td>Emails</td><td>${(O.emails || []).length}</td></tr>
    </table>` : '<p class="muted">OSINT recon not run for this target.</p>';

  const takeBlock = (T && T.records && T.records.length) ? `
    <h2>Takedown — Hosting &amp; Abuse Contacts</h2>
    <table><thead><tr><th>Host</th><th>IP / Tor</th><th>Country</th><th>Abuse contact</th></tr></thead><tbody>
    ${T.records.map(r => `<tr><td>${esc2(r.host)}</td><td>${r.tor ? 'TOR' : esc2(r.ip)}</td><td>${esc2(r.country)}</td><td>${esc2(r.abuse_email || r.registrar_abuse || '—')}</td></tr>`).join('')}
    </tbody></table>` : '';

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>BreachIntel Report — ${esc2(R.domain)}</title>
  <style>
    body{font-family:-apple-system,Segoe UI,Inter,sans-serif;max-width:900px;margin:0 auto;padding:40px;color:#222;line-height:1.5}
    h1{font-size:30px;margin:0 0 4px}h2{font-size:19px;margin:32px 0 10px;border-bottom:2px solid #c15f3c;padding-bottom:4px}
    .meta{color:#666;font-size:13px;margin-bottom:24px}
    .score{display:inline-flex;align-items:center;gap:14px;padding:16px 22px;border-radius:12px;background:#f6f4ef;border:1px solid #e3e0d6;margin:8px 0 20px}
    .score b{font-size:40px;color:${sevColor[risk.level] || '#c15f3c'}}
    .drivers span{display:inline-block;background:#eee;border-radius:14px;padding:3px 11px;margin:2px;font-size:12px}
    table{width:100%;border-collapse:collapse;font-size:13px;margin:6px 0}
    th,td{text-align:left;padding:7px 9px;border-bottom:1px solid #eee;vertical-align:top}
    th{color:#888;font-weight:600;font-size:11px;text-transform:uppercase}
    table.kv td:first-child{color:#888;width:140px}
    .sv{color:#fff;font-size:10px;padding:2px 7px;border-radius:4px;font-weight:700}
    .muted{color:#999;font-style:italic}
    footer{margin-top:40px;padding-top:16px;border-top:1px solid #eee;color:#999;font-size:11px}
  </style></head><body>
    <h1>BreachIntel Intelligence Report</h1>
    <div class="meta"><b>Target:</b> ${esc2(R.domain)} &nbsp;·&nbsp; <b>Generated:</b> ${new Date().toLocaleString()} &nbsp;·&nbsp; <b>Scanned:</b> ${esc2(R.scanned_at)}</div>
    <div class="score"><b>${risk.score || 0}</b><div><div style="font-size:11px;letter-spacing:1px;color:#888">EXPOSURE SCORE</div><div style="font-size:20px;font-weight:600">${esc2(risk.label || '')}</div></div></div>
    <div class="drivers">${(risk.drivers || []).map(d => `<span>${esc2(d)}</span>`).join('')}</div>
    <h2>Findings (${(R.findings || []).length})</h2>
    <table><thead><tr><th>Severity</th><th>Source</th><th>Finding</th><th>Date</th></tr></thead><tbody>${findingRows}</tbody></table>
    ${osintBlock}
    ${takeBlock}
    <footer>Generated by BreachIntel — free/no-key OSINT &amp; threat intelligence. UNCLASSIFIED // FOR AUTHORIZED USE ONLY. Verify before acting.</footer>
  </body></html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `breachintel-report-${R.domain}.html`;
  a.click();
}

// ── scan history + persistence (localStorage) ───────────────────────────────────
function saveHistory(R) {
  let hist = [];
  try { hist = JSON.parse(localStorage.getItem('bi-history') || '[]'); } catch (e) {}
  hist = hist.filter(h => h.domain !== R.domain);
  hist.unshift({ domain: R.domain, score: (R.risk || {}).score || 0, level: (R.risk || {}).level || 'low',
    total: R.total || (R.findings || []).length, ts: new Date().toISOString() });
  hist = hist.slice(0, 25);
  try {
    localStorage.setItem('bi-history', JSON.stringify(hist));
    localStorage.setItem('bi-cache-' + R.domain, JSON.stringify(R));   // cache full result for instant reload
  } catch (e) {}
}
function loadCachedResult(domain) {
  try {
    const c = localStorage.getItem('bi-cache-' + domain);
    if (c) { lastResult = JSON.parse(c); renderResults(lastResult); showPage('breach'); return true; }
  } catch (e) {}
  return false;
}
function toggleHistory() {
  const pop = document.getElementById('history-pop');
  if (!pop.classList.contains('hidden')) { pop.classList.add('hidden'); return; }
  let hist = [];
  try { hist = JSON.parse(localStorage.getItem('bi-history') || '[]'); } catch (e) {}
  const sevColor = { critical: 'var(--critical)', high: 'var(--high)', medium: 'var(--medium)', low: 'var(--low)' };
  pop.innerHTML = hist.length
    ? hist.map(h => `<div class="hist-row" onclick="reopenHistory('${esc(h.domain)}')">
        <span class="hist-score" style="color:${sevColor[h.level] || 'var(--text-dim)'}">${h.score}</span>
        <span class="hist-dom">${esc(h.domain)}</span>
        <span class="hist-meta">${h.total} findings · ${(h.ts || '').slice(0, 10)}</span></div>`).join('')
    : '<div class="osint-empty" style="padding:14px">no scans yet</div>';
  pop.classList.remove('hidden');
}
function reopenHistory(domain) {
  document.getElementById('history-pop').classList.add('hidden');
  document.getElementById('search-input').value = domain;
  currentTarget = domain; reconTarget = '';
  if (!loadCachedResult(domain)) startScan();
}

// ── verdict banner ─────────────────────────────────────────────────────────────
function renderVerdict(risk, total) {
  const el = document.getElementById('verdict');
  if (!risk) { el.innerHTML = ''; return; }
  const score = risk.score || 0;
  const R = 46, C = 2 * Math.PI * R;
  const offset = C * (1 - score / 100);
  const drivers = (risk.drivers || []).map(d => `<span class="driver-pill">${esc(d)}</span>`).join('');
  el.className = `verdict lvl-${risk.level || 'low'}`;
  el.innerHTML = `
    <div class="gauge">
      <svg width="104" height="104" viewBox="0 0 104 104">
        <circle class="gauge-track" cx="52" cy="52" r="${R}"/>
        <circle class="gauge-fill" cx="52" cy="52" r="${R}" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${C.toFixed(1)}"/>
      </svg>
      <div class="gauge-num">${score}</div>
    </div>
    <div class="verdict-body">
      <span class="verdict-level">Exposure score · ${score}/100</span>
      <span class="verdict-label">${esc(risk.label || '')}</span>
      <div class="verdict-drivers">${drivers || '<span class="driver-pill">No critical exposure detected</span>'}</div>
    </div>`;
  // animate the ring after paint
  requestAnimationFrame(() => {
    const fill = el.querySelector('.gauge-fill');
    if (fill) fill.style.strokeDashoffset = offset.toFixed(1);
  });
}

// ── finding category groups ─────────────────────────────────────────────────────
const GROUPS = [
  ['ransomware',  'Ransomware listings'],
  ['infostealer', 'Infostealer infections'],
  ['breach',      'Breach records'],
  ['exposure',    'Exposed services & CVEs'],
  ['phishing',    'Lookalikes & clones'],
  ['paste',       'Paste leaks'],
  ['darkweb',     'Dark-web posts'],
  ['github',      'Code leaks'],
  ['telegram',    'Telegram mentions'],
  ['cracking',    'Forum activity'],
  ['hacking',     'Forum activity'],
  ['threat',      'Threat intelligence'],
  ['posture',     'DNS & email posture'],
  ['google',      'Search exposure'],
  ['news',        'Breach news'],
];
const GROUP_LABEL = Object.fromEntries(GROUPS);
const GROUP_ORDER = GROUPS.map(g => g[0]);
const COLLAPSED_BY_DEFAULT = new Set(['news', 'google']);

function renderFindingGroups(findings) {
  const grid = document.getElementById('findings-grid');
  grid.innerHTML = '';
  if (!findings.length) {
    grid.innerHTML = '<div style="color:var(--text-dim);font-size:14px;padding:24px 0">No findings — target appears clean across all sources.</div>';
    return;
  }
  // bucket
  const buckets = {};
  for (const f of findings) {
    const c = GROUP_LABEL[f.category] ? f.category : 'other';
    (buckets[c] = buckets[c] || []).push(f);
  }
  const order = [...GROUP_ORDER, 'other'].filter(c => buckets[c]);
  for (const cat of order) {
    grid.appendChild(makeGroup(cat, buckets[cat]));
  }
}

function makeGroup(cat, items) {
  const name = GROUP_LABEL[cat] || 'Other';
  const worst = ['critical', 'high', 'medium', 'low', 'info'].find(s => items.some(f => f.severity === s)) || 'info';
  const counts = {};
  for (const f of items) counts[f.severity] = (counts[f.severity] || 0) + 1;
  const spark = ['critical', 'high', 'medium', 'low'].filter(s => counts[s])
    .map(s => `<span class="spark-seg badge-${s}">${counts[s]} ${s[0].toUpperCase()}</span>`).join('');

  const wrap = document.createElement('div');
  wrap.className = 'fgroup' + (COLLAPSED_BY_DEFAULT.has(cat) ? ' collapsed' : '');
  wrap.dataset.group = cat;

  const head = document.createElement('div');
  head.className = 'fgroup-head';
  head.onclick = () => wrap.classList.toggle('collapsed');
  head.innerHTML = `
    <span class="fgroup-caret">▼</span>
    <span class="fgroup-dot" style="background:${SEV_COLORS[worst]}"></span>
    <span class="fgroup-name">${esc(name)}</span>
    <span class="fgroup-count">${items.length}</span>
    <span class="fgroup-spark">${spark}</span>`;
  wrap.appendChild(head);

  const body = document.createElement('div');
  body.className = 'fgroup-body';
  for (const f of items) body.appendChild(makeCard(f));
  wrap.appendChild(body);
  return wrap;
}

// ── recent scans ────────────────────────────────────────────────────────────────
function saveRecent(domain) {
  let list = [];
  try { list = JSON.parse(localStorage.getItem('bi-recent') || '[]'); } catch (e) {}
  list = [domain, ...list.filter(d => d !== domain)].slice(0, 6);
  try { localStorage.setItem('bi-recent', JSON.stringify(list)); } catch (e) {}
  renderRecent();
}

function renderRecent() {
  let list = [];
  try { list = JSON.parse(localStorage.getItem('bi-recent') || '[]'); } catch (e) {}
  const el = document.getElementById('recent');
  if (!list.length) { el.classList.add('hidden'); return; }
  el.classList.remove('hidden');
  el.innerHTML = '<span class="recent-label">Recent:</span>' +
    list.map(d => `<span class="recent-chip" onclick="rescan('${esc(d)}')">${esc(d)}</span>`).join('');
}

function rescan(domain) {
  document.getElementById('search-input').value = domain;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  startScan();
}

// ── OSINT + Website recon (one /api/osint call feeds both pages) ─────────────────
let mindmapNet = null;

function resetOsint() {
  document.getElementById('website-grid').innerHTML = '';
  document.getElementById('osint-grid').innerHTML = '';
  document.getElementById('mindmap-section').classList.add('hidden');
  document.getElementById('vuln-section').classList.add('hidden');
  document.getElementById('vuln-grid').innerHTML = '';
  document.getElementById('website-status').textContent = '';
  document.getElementById('osint-status').textContent = '';
  document.getElementById('vuln-label').textContent = '⚡ Run Vulnerability Scan (nuclei)';
  if (mindmapNet) { mindmapNet.destroy(); mindmapNet = null; }
}

function _kvRows(pairs) {
  return pairs.filter(([, v]) => v !== undefined).map(([k, v]) =>
    `<dt>${esc(k)}</dt><dd class="${v ? '' : 'muted'}">${v ? ed(v) : '—'}</dd>`).join('');
}
function _card(title, html, opts = {}) {
  const div = document.createElement('div');
  div.className = 'ocard' + (opts.wide ? ' wide' : '');
  div.innerHTML = `<div class="ocard-title">${esc(title)}${opts.count != null ? `<span class="oc-count">${opts.count}</span>` : ''}</div>${html}`;
  return div;
}
function _kvCard(title, pairs, opts) { return _card(title, `<dl class="kv">${_kvRows(pairs)}</dl>`, opts); }
function _chipsCard(title, items, opts = {}) {
  const chips = items.length
    ? items.slice(0, 400).map(i => `<span class="ochip">${opts.link ? `<a href="http://${esc(i)}" target="_blank" rel="noopener">${esc(i)}</a>` : esc(i)}</span>`).join('')
    : '<div class="osint-empty">none found</div>';
  return _card(title, `<div class="chip-wrap">${chips}</div>`, { wide: opts.wide, count: opts.count });
}

// Website Info page — technical recon cards
function renderWebsite(d) {
  const grid = document.getElementById('website-grid');
  grid.innerHTML = '';
  const ip = d.ip_profile || {}, nmap = d.nmap || { ports: [] }, web = d.web || {};
  const dns = d.dns || {}, http = d.http || {};

  grid.appendChild(_kvCard('IP / Network Profile', [
    ['IP address', ip.ip], ['Reverse DNS', ip.ptr],
    ['Location', [ip.city, ip.country].filter(Boolean).join(', ')],
    ['ASN', ip.asn], ['ISP', ip.isp], ['Netblock', ip.network], ['Abuse', ip.abuse],
  ]));

  const ports = nmap.ports || [];
  let pbody;
  if (!nmap.ran) pbody = '<div class="osint-empty">nmap unavailable</div>';
  else if (!ports.length) pbody = '<div class="osint-empty">no open ports in scanned range</div>';
  else pbody = `<table class="port-table">${ports.map(p =>
    `<tr><td class="port-num">${p.port}/${esc(p.proto)}</td><td class="port-svc">${esc(p.service)}</td><td class="port-ver">${esc(p.version || '')}</td></tr>`).join('')}</table>`;
  grid.appendChild(_card('Open Ports — nmap', pbody, { count: ports.length }));

  const tech = (web.tech && web.tech.length ? web.tech : (d.tech || []));
  const techChips = tech.map(t => `<span class="ochip">${ed(t)}</span>`).join('');
  grid.appendChild(_card('Web Fingerprint', `
    <dl class="kv">${_kvRows([['HTTP status', web.status], ['Title', web.title], ['Web server', web.webserver || http.server], ['CDN', web.cdn], ['WAF', d.waf]])}</dl>
    ${techChips ? `<div class="chip-wrap" style="margin-top:10px">${techChips}</div>` : ''}`));

  // HTTP security headers
  const sec = http.security || {}, missing = http.missing || [];
  const secRows = Object.keys(sec).map(k => `<span class="ochip tag-on">✓ ${esc(k)}</span>`).join('') +
    missing.map(k => `<span class="ochip" style="color:var(--high);border-color:var(--high)">✗ ${esc(k)}</span>`).join('');
  grid.appendChild(_card('HTTP Security Headers',
    secRows ? `<div class="chip-wrap">${secRows}</div>` : '<div class="osint-empty">no response</div>'));

  const dnsRows = Object.entries(dns).map(([t, vals]) => [t, vals.join('   ·   ')]);
  grid.appendChild(_card('DNS Records', dnsRows.length ? `<dl class="kv">${_kvRows(dnsRows)}</dl>` : '<div class="osint-empty">none</div>'));
}

// OSINT page — people / domain / footprint cards
function renderOsint(d) {
  const grid = document.getElementById('osint-grid');
  grid.innerHTML = '';
  const reg = d.registration || {}, infra = d.infrastructure || {}, c = d.counts || {};

  grid.appendChild(_kvCard('WHOIS / Registration', [
    ['Registrar', reg.registrar], ['Created', reg.created], ['Updated', reg.updated],
    ['Expires', reg.expires], ['Registrant', reg.registrant], ['DNSSEC', reg.dnssec],
    ['Nameservers', (reg.nameservers || []).join(', ')], ['Status', (reg.status || []).join(', ')],
  ]));

  grid.appendChild(_chipsCard('Subdomains', d.subdomains || [], { wide: true, count: c.subdomains }));

  const nb = (infra.reverse_ip || {}).neighbours || [];
  grid.appendChild(_chipsCard('Reverse-IP Neighbours (co-hosted)', nb, { wide: true, count: nb.length, link: true }));

  // Google dorks (inurl:) grouped by category
  const dorks = d.dorks || [];
  if (dorks.length) {
    const byCat = {};
    for (const dk of dorks) (byCat[dk.category] = byCat[dk.category] || []).push(dk);
    const body = Object.entries(byCat).map(([cat, items]) =>
      `<div class="dork-cat"><div class="dork-cat-name">${esc(cat)} <span style="color:var(--text-faint)">${items.length}</span></div>` +
      items.map(dk => `<div class="dork-row"><a href="${esc(dk.url)}" target="_blank" rel="noopener">${esc(dk.url)}</a></div>`).join('') + '</div>').join('');
    grid.appendChild(_card('Google Dorks — inurl: exposure (site-scoped)', body, { wide: true, count: dorks.length }));
  } else {
    grid.appendChild(_card('Google Dorks — inurl: exposure', '<div class="osint-empty">no exposed sensitive paths found via inurl: dorks</div>', { wide: true }));
  }

  grid.appendChild(_chipsCard('Harvested Emails', d.emails || [], { count: (d.emails || []).length }));

  if (d.username && d.username.hits && d.username.hits.length) {
    const hits = d.username.hits.map(h => `<span class="ochip"><a href="${esc(h.url)}" target="_blank" rel="noopener">${esc(h.site)}</a></span>`).join('');
    grid.appendChild(_card(`Username Footprint — @${esc(d.username.query)}`, `<div class="chip-wrap">${hits}</div>`, { wide: true, count: d.username.hits.length }));
  } else if (d.username && d.username.query) {
    grid.appendChild(_card(`Username Footprint — @${esc(d.username.query)}`, '<div class="osint-empty">no accounts found (or sherlock timed out)</div>'));
  }
}

// theHarvester-style interactive mindmap (vis-network)
function buildMindmap(d) {
  const sec = document.getElementById('mindmap-section');
  if (typeof vis === 'undefined') { sec.classList.add('hidden'); return; }
  const dark = currentTheme() !== 'light';
  const fontColor = dark ? '#e8e4da' : '#232220';
  const nodes = [], edges = [];
  let id = 0;
  const add = (label, o = {}) => { const n = ++id; nodes.push({ id: n, label, ...o }); return n; };
  const center = add(d.domain, { shape: 'ellipse', color: { background: '#c15f3c', border: '#c15f3c' }, font: { color: '#fff', size: 22 }, mass: 4 });
  const branch = (label, color) => { const b = add(label, { shape: 'box', color: { background: color, border: color }, font: { color: '#fff', size: 14 } }); edges.push({ from: center, to: b }); return b; };
  const leaf = (p, label, url) => { const l = add(label, { shape: 'dot', size: 6, font: { color: fontColor, size: 11 }, url }); edges.push({ from: p, to: l }); };

  const subs = (d.subdomains || []).slice(0, 40);
  if (subs.length) { const b = branch(`Subdomains (${(d.counts || {}).subdomains || subs.length})`, '#4e80a8'); subs.forEach(s => leaf(b, s.replace('.' + d.domain, '') || s, 'http://' + s)); }
  const hosts = (d.infrastructure || {}).hosts || [];
  if (hosts.length) { const b = branch('IPs / ASN', '#6aa3c9'); hosts.slice(0, 12).forEach(h => leaf(b, h.ip, '')); }
  const emails = d.emails || [];
  if (emails.length) { const b = branch(`Emails (${emails.length})`, '#caa23a'); emails.slice(0, 20).forEach(e => leaf(b, e, 'mailto:' + e)); }
  const ns = (d.registration || {}).nameservers || [];
  if (ns.length) { const b = branch('Nameservers', '#7a8a55'); ns.forEach(n => leaf(b, n, '')); }
  const tech = ((d.web || {}).tech && d.web.tech.length ? d.web.tech : (d.tech || []));
  if (tech.length) { const b = branch('Technology', '#9b6bbf'); tech.slice(0, 12).forEach(t => leaf(b, t, '')); }
  const ports = (d.nmap || {}).ports || [];
  if (ports.length) { const b = branch(`Open Ports (${ports.length})`, '#e5675c'); ports.forEach(p => leaf(b, `${p.port} ${p.service}`, '')); }
  const reg = (d.registration || {}).registrar;
  if (reg) { const b = branch('Registrar', '#8a847a'); leaf(b, reg, ''); }

  const container = document.getElementById('mindmap');
  if (mindmapNet) mindmapNet.destroy();
  mindmapNet = new vis.Network(container, { nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges) }, {
    physics: { stabilization: { iterations: 120 }, barnesHut: { gravitationalConstant: -7000, springLength: 120, springConstant: 0.03 } },
    edges: { color: dark ? '#3a3836' : '#d6d1c4', smooth: { type: 'continuous' }, width: 1 },
    nodes: { borderWidth: 0, shadow: false },
    interaction: { hover: true },
  });
  mindmapNet.on('click', p => {
    if (p.nodes.length) { const n = nodes.find(x => x.id === p.nodes[0]); if (n && n.url) window.open(n.url, '_blank'); }
  });
  sec.classList.remove('hidden');
}

// nuclei vulnerability scan (Website page)
async function runVulnScan() {
  if (!currentTarget) return;
  const btn = document.getElementById('btn-vuln');
  btn.disabled = true;
  document.getElementById('vuln-label').textContent = 'Scanning with nuclei…';
  document.getElementById('vuln-spinner').classList.remove('hidden');
  try {
    const data = await (await fetch('/api/vulnscan', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target: currentTarget }),
    })).json();
    const grid = document.getElementById('vuln-grid');
    grid.innerHTML = '';
    const fs = data.findings || [];
    if (!data.ran) grid.innerHTML = '<div class="osint-empty">nuclei unavailable</div>';
    else if (!fs.length) grid.innerHTML = '<div class="osint-empty">no issues detected by the nuclei templates run</div>';
    else for (const f of fs) {
      const sev = (f.severity || 'info').toLowerCase();
      const div = document.createElement('div');
      div.className = `finding-card sev-${sev}`;
      div.innerHTML = `<span class="badge badge-${sev}">${sev.toUpperCase()}</span><span class="find-source">nuclei</span><span class="find-title" title="${esc((f.tags || []).join(', '))}">${esc(f.name)}</span><span class="find-date">${esc((f.matched || '').slice(0, 46))}</span>`;
      grid.appendChild(div);
    }
    document.getElementById('vuln-section').classList.remove('hidden');
    document.getElementById('vuln-label').textContent = '↻ Re-run Vulnerability Scan';
  } catch (e) {
    showError('Vuln scan failed: ' + e);
    document.getElementById('vuln-label').textContent = '⚡ Run Vulnerability Scan (nuclei)';
  } finally {
    btn.disabled = false;
    document.getElementById('vuln-spinner').classList.add('hidden');
  }
}

// ── public webcams (Radar) ──────────────────────────────────────────────────────
let camOn = false, camMarkers = [], camData = [];
async function toggleCams() {
  camOn = !camOn;
  document.getElementById('sky-cam').classList.toggle('on', camOn);
  if (camOn) {
    if (!camData.length) { try { camData = (await (await fetch('/api/sky/cams')).json()).cams || []; } catch (e) {} }
    for (const c of camData) {
      const icon = L.divIcon({ html: `<div class="cam-ico">📷</div>`, className: '', iconAnchor: [8, 8] });
      const m = L.marker([c.lat, c.lon], { icon }).addTo(map)
        .bindPopup(`<b>${esc(c.name)}</b><br>${esc(c.cat)} · public live webcam<br><a href="${esc(c.url)}" target="_blank" rel="noopener">open live view ↗</a>`);
      camMarkers.push(m);
    }
    setSkyStatus();
  } else {
    camMarkers.forEach(m => m.remove()); camMarkers = [];
    setSkyStatus();
  }
}

// ── geo recon: search a location / click the map → scan a radius ─────────────────
let geoCircle = null, geoMarkers = [];

function plotGeoCameras(cams) {
  geoMarkers.forEach(m => m.remove()); geoMarkers = [];
  for (const c of cams) {
    if (c.lat == null) continue;
    const color = c.alpr ? '#e5675c' : c.webcam ? '#6aa3c9' : c.public ? '#4caf78' : '#e0944d';
    const label = c.alpr ? 'ALPR plate-reader' : c.webcam ? 'public webcam' : c.public ? 'public-area camera' : 'private / indoor camera';
    const icon = L.divIcon({ html: `<div style="color:${color};font-size:14px;filter:drop-shadow(0 0 3px ${color})">📷</div>`, className: '', iconAnchor: [7, 7] });
    const m = L.marker([c.lat, c.lon], { icon }).addTo(map)
      .bindPopup(`<b>${label}</b><br>${esc(c.cam_type || c.type || 'camera')}${c.operator ? '<br>operator: ' + esc(c.operator) : ''}<br><span style="color:#888">${c.dist_m} m away · OSM-mapped location</span>`);
    geoMarkers.push(m);
  }
}
function radiusM() {
  return Math.max(50, Math.min(50000, parseInt(document.getElementById('geo-radius').value) || 100));
}
function drawGeoCircle(lat, lon) {
  if (geoCircle) geoCircle.remove();
  geoCircle = L.circle([lat, lon], {
    radius: radiusM(), color: '#d97757', fillColor: '#d97757', fillOpacity: 0.08, weight: 1.5,
  }).addTo(map);
}
function _fmtDist(m) { return m < 1000 ? `${m} m` : `${(m / 1000).toFixed(1)} km`; }

async function searchLocation() {
  const q = document.getElementById('geo-search').value.trim();
  if (!q) return;
  setSkyStatus('geocoding location…');
  try {
    const g = await (await fetch('/api/geocode?q=' + encodeURIComponent(q))).json();
    if (g.error) { setSkyStatus('location not found'); return; }
    map.flyTo([g.lat, g.lon], 16);
    setTimeout(() => doGeoRecon(g.lat, g.lon, g.name), 650);
  } catch (e) { setSkyStatus('geocode failed'); }
}

// map click handler
function cameraRecon(e) { doGeoRecon(e.latlng.lat, e.latlng.lng, null); }

async function doGeoRecon(lat, lon, place) {
  drawGeoCircle(lat, lon);
  // fly in so the camera/system markers are actually visible on the ground
  map.flyTo([lat, lon], Math.max(map.getZoom(), 15), { duration: 0.8 });
  setSkyStatus('geo recon…');
  const r = radiusM();
  let d;
  try { d = await (await fetch(`/api/georecon?lat=${lat}&lon=${lon}&radius_m=${r}`)).json(); }
  catch (e) { setSkyStatus('geo recon failed'); return; }

  // plot OSM-mapped cameras at their real positions, classified by type
  const osm = d.osm_cameras || [];
  plotGeoCameras(osm);

  const within = d.cams_within || [], near = d.cams_nearest || [];
  const list = (within.length ? within : near);
  const camRows = list.map(c =>
    `<div class="cr-row"><span class="cr-badge pub">LIVE</span><a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.name)}</a><span class="cr-dist">${_fmtDist(c.dist_m)}</span></div>`).join('');
  const camHdr = within.length ? `${within.length} public live-cam(s) within ${r} m` : `nearest public live-cams:`;

  // OSM mapped cameras summary (locations + public/private classification)
  let osmHtml = '';
  if (osm.length) {
    const legend = `<span style="color:#4caf78">● public</span> <span style="color:#e0944d">● private/indoor</span> <span style="color:#6aa3c9">● webcam</span> <span style="color:#e5675c">● ALPR</span>`;
    osmHtml = `<div class="cr-sh"><b>🎥 ${osm.length} OSM-mapped camera(s)</b> · ${d.osm_within} in radius<br>
      <span style="font-size:11px">public-area ${d.osm_public} · private/indoor ${d.osm_private} · ALPR ${d.osm_alpr}</span>
      <div class="cr-shnote" style="margin-top:4px">${legend}</div></div>`;
  } else {
    osmHtml = `<div class="cr-sh muted">🎥 OSM mapped cameras: none recorded here</div>`;
  }

  // CCTV — Shodan camera-device counts in the radius (the headline)
  const cctv = d.cctv || {};
  let cctvHtml = '';
  if (cctv.enabled && cctv.total) {
    const rows = Object.entries(cctv.breakdown || {}).map(([k, v]) =>
      `<div class="cr-cctv-row"><span>${esc(k)}</span><b>${v.toLocaleString()}</b></div>`).join('');
    cctvHtml = `<div class="cr-cctv"><div class="cr-cctv-hd">📹 ${cctv.total.toLocaleString()} internet-exposed camera device(s) in radius</div>${rows}</div>`;
  } else if (cctv.enabled) {
    cctvHtml = `<div class="cr-sh muted">📹 No internet-exposed cameras indexed in this radius.</div>`;
  }

  const sh = d.shodan || {};
  let shHtml;
  if (sh.enabled) {
    const ports = (sh.ports || []).slice(0, 6).map(p => `${p[0]}×${p[1]}`).join('  ·  ');
    shHtml = `<div class="cr-sh"><b>📡 Shodan geo — ${(sh.total||0).toLocaleString()} indexed device(s)</b><br>${ports || 'no port facets'}<div class="cr-shnote">${esc(sh.note || '')}</div></div>`;
  } else {
    shHtml = `<div class="cr-sh muted">📡 Shodan geo device-scan: ${esc(sh.note || 'requires API key')}</div>`;
  }

  const html = `<div class="cam-recon">
    <div class="cr-title">🎯 GEO RECON · ${r} m radius</div>
    <div class="cr-coord">${(place || d.place) ? esc((place || d.place).slice(0, 56)) : lat.toFixed(4) + ', ' + lon.toFixed(4)}</div>
    ${cctvHtml}
    <div class="cr-camhdr">${camHdr}</div>
    <div class="cr-list">${camRows || '<div class="cr-none">no public live-cams indexed nearby</div>'}</div>
    ${osmHtml}
    ${shHtml}
    <div class="cr-note">⛔ Camera <b>counts &amp; locations</b> are aggregate Shodan/OSM metadata, not feed access. Private/unsecured camera feeds are never accessed.</div>
  </div>`;
  L.popup({ maxWidth: 360 }).setLatLng([lat, lon]).setContent(html).openOn(map);
  setSkyStatus();
}

// ── 10-Phase military operation ─────────────────────────────────────────────────
const PHASES = [
  { n: 1,  code: 'RECONNAISSANCE',          tag: 'PASSIVE',    desc: 'WHOIS, DNS &amp; registration footprint' },
  { n: 2,  code: 'SURFACE MAPPING',          tag: 'ENUM',       desc: 'Subdomain &amp; attack-surface enumeration' },
  { n: 3,  code: 'INFRASTRUCTURE PROFILING', tag: 'NETWORK',    desc: 'IP / ASN / netblock / hosting' },
  { n: 4,  code: 'PORT &amp; SERVICE SCAN',  tag: 'ACTIVE',     desc: 'nmap TCP service detection' },
  { n: 5,  code: 'WEB FINGERPRINTING',       tag: 'APPSEC',     desc: 'Tech stack, WAF &amp; security headers' },
  { n: 6,  code: 'BREACH &amp; LEAK INTEL',  tag: 'COMPROMISE', desc: 'Ransomware, infostealer, credentials' },
  { n: 7,  code: 'THREAT CORRELATION',       tag: 'ADVERSARY',  desc: 'Typosquat, phishing &amp; threat exposure' },
  { n: 8,  code: 'VULNERABILITY ASSESSMENT', tag: 'WEAPONIZE',  desc: 'nuclei exposure &amp; CVE templates' },
  { n: 9,  code: 'HUMAN INTELLIGENCE',       tag: 'HUMINT',     desc: 'Emails &amp; username footprint' },
  { n: 10, code: 'DOSSIER &amp; TAKEDOWN',   tag: 'PRODUCT',    desc: 'Hosting, abuse contacts &amp; final product' },
];
let opRendered = false;

function ensureOpBoard() {
  if (currentTarget) document.getElementById('op-target').textContent = '▸ TARGET: ' + currentTarget.toUpperCase();
  if (opRendered) return;
  const grid = document.getElementById('op-grid');
  grid.innerHTML = '';
  for (const p of PHASES) {
    const card = document.createElement('div');
    card.className = 'op-card';
    card.id = `op-phase-${p.n}`;
    card.innerHTML = `
      <div class="op-card-head"><span class="op-num">PHASE ${String(p.n).padStart(2, '0')}</span><span class="op-stat" id="op-stat-${p.n}">STANDBY</span></div>
      <div class="op-code">${p.code}</div><span class="op-tag">${p.tag}</span>
      <div class="op-desc">${p.desc}</div><div class="op-result" id="op-res-${p.n}">—</div>`;
    grid.appendChild(card);
  }
  opRendered = true;
}

function setPhase(nums, state) {
  for (const n of nums) {
    const card = document.getElementById(`op-phase-${n}`);
    const stat = document.getElementById(`op-stat-${n}`);
    if (!card) continue;
    card.className = 'op-card ' + state;
    stat.textContent = { active: 'ACTIVE', complete: 'COMPLETE', nodata: 'NO DATA', standby: 'STANDBY' }[state] || state;
  }
}
function setPhaseResult(n, text, cls) {
  const r = document.getElementById(`op-res-${n}`);
  if (r) { r.textContent = text; r.className = 'op-result' + (cls ? ' ' + cls : ''); }
}
function opProgress(done) { document.getElementById('op-bar').style.width = (done * 10) + '%'; }

async function runOperation() {
  const raw = currentTarget || document.getElementById('search-input').value.trim();
  if (!raw) { showError('Designate a target — enter a domain above first.'); return; }
  ensureOpBoard();
  for (const p of PHASES) { setPhase([p.n], 'standby'); setPhaseResult(p.n, '—'); }
  const btn = document.getElementById('btn-op'); btn.disabled = true;
  document.getElementById('op-label').textContent = 'OPERATION RUNNING';
  document.getElementById('op-spinner').classList.remove('hidden');
  opProgress(0);
  let done = 0; const tick = () => opProgress(++done);

  try {
    // PHASES 6 & 7 — breach + threat correlation
    setPhase([6, 7], 'active');
    if (!lastResult || lastResult.domain.replace(/^www\./, '') !== raw.replace(/^www\./, '')) {
      lastResult = await (await fetch('/api/scan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ target: raw }) })).json();
      renderResults(lastResult);
      showPage('op');   // renderResults switches to Breach; stay on the operation board
    }
    const R = lastResult;
    currentTarget = R.domain;
    document.getElementById('op-target').textContent = '▸ TARGET: ' + currentTarget.toUpperCase();
    const cnt = cat => (R.findings || []).filter(f => f.category === cat).length;
    const crit = (R.findings || []).filter(f => f.severity === 'critical').length;
    setPhaseResult(6, `${R.total || 0} findings · ${crit} critical · ${cnt('ransomware')} ransomware · ${cnt('infostealer')} infostealer`, crit ? 'bad' : '');
    setPhase([6], 'complete'); tick();
    setPhaseResult(7, `risk ${R.risk ? R.risk.score : '?'}/100 · ${cnt('phishing')} lookalikes · ${cnt('threat')} threat-intel hits`);
    setPhase([7], 'complete'); tick();

    // PHASES 1-5 & 9 — recon dossier
    setPhase([1, 2, 3, 4, 5, 9], 'active');
    if (!lastOsint || reconTarget !== currentTarget) {
      const uname = document.getElementById('osint-username').value.trim();
      lastOsint = await (await fetch('/api/osint', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ target: currentTarget, username: uname }) })).json();
      reconTarget = currentTarget;
      renderWebsite(lastOsint); renderOsint(lastOsint); buildMindmap(lastOsint);
    }
    const O = lastOsint, reg = O.registration || {}, ip = O.ip_profile || {}, nmap = O.nmap || { ports: [] }, web = O.web || {}, c = O.counts || {};
    setPhaseResult(1, `${reg.registrar || '?'} · reg ${reg.created || '?'} · ${Object.keys(O.dns || {}).length} DNS record types`); setPhase([1], 'complete'); tick();
    setPhaseResult(2, `${c.subdomains || 0} subdomains · ${c.neighbours || 0} reverse-IP neighbours`); setPhase([2], 'complete'); tick();
    setPhaseResult(3, `${ip.ip || '?'} · ${ip.asn || '?'} · ${ip.country || '?'}`); setPhase([3], 'complete'); tick();
    const np = (nmap.ports || []).length;
    setPhaseResult(4, nmap.ran ? `${np} open service port(s)` : 'nmap unavailable', np ? '' : 'muted'); setPhase([4], np ? 'complete' : 'nodata'); tick();
    setPhaseResult(5, `${(web.tech || O.tech || []).length} tech · WAF: ${O.waf || 'none'} · ${(O.http && O.http.missing || []).length} missing headers`); setPhase([5], 'complete'); tick();
    const hum = (O.emails || []).length + (O.username && O.username.hits ? O.username.hits.length : 0);
    setPhaseResult(9, `${(O.emails || []).length} emails · ${O.username && O.username.hits ? O.username.hits.length : 0} username hits`); setPhase([9], hum ? 'complete' : 'nodata'); tick();

    // PHASE 8 — vulnerability assessment
    setPhase([8], 'active');
    const V = await (await fetch('/api/vulnscan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ target: currentTarget }) })).json();
    const vn = (V.findings || []).length;
    setPhaseResult(8, V.ran ? `${vn} nuclei finding(s)` : 'nuclei unavailable', vn ? 'bad' : 'muted'); setPhase([8], V.ran ? 'complete' : 'nodata'); tick();

    // PHASE 10 — dossier & takedown
    setPhase([10], 'active');
    const T = await (await fetch('/api/takedown', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ target: currentTarget, findings: R.findings || [], scanned_at: R.scanned_at }) })).json();
    lastTakedown = T;
    setPhaseResult(10, `${T.host_count || 0} hosting nodes · ${(T.abuse_contacts || []).length} abuse contact(s)`); setPhase([10], 'complete'); tick();
    refreshBreachMap();

    // intensive analysis: attack paths + remediation derived from all findings
    renderAttackPaths(R.findings || []);

    document.getElementById('op-label').textContent = '✓ OPERATION COMPLETE — RE-RUN';
  } catch (e) {
    showError('Operation error: ' + e);
    document.getElementById('op-label').textContent = '▶ EXECUTE OPERATION';
  } finally {
    btn.disabled = false;
    document.getElementById('op-spinner').classList.add('hidden');
  }
}

// ── News & Forums page ──────────────────────────────────────────────────────────
let newsLoaded = false;
function ensureNews() { if (!newsLoaded) { newsLoaded = true; loadNews(); loadForumStatus(); } }

async function loadNews(force) {
  const el = document.getElementById('news-list');
  el.innerHTML = skelRows(8);
  try {
    const items = (await (await fetch('/api/news')).json()).news || [];
    el.innerHTML = items.map(n =>
      `<a class="news-item" href="${esc(n.url)}" target="_blank" rel="noopener">
        <div class="news-src">${esc(n.source)}${n.date ? ' · ' + esc(n.date) : ''}</div>
        <div class="news-title">${ed(n.title)}</div>
        ${n.summary ? `<div class="news-sum">${ed(n.summary)}</div>` : ''}
      </a>`).join('') || '<div class="osint-empty">no news right now</div>';
  } catch (e) { el.innerHTML = '<div class="osint-empty">news feed unavailable</div>'; }
}

async function loadForumStatus() {
  const el = document.getElementById('forum-status');
  el.innerHTML = skelRows(6);
  try {
    const d = await (await fetch('/api/forums/status')).json();
    document.getElementById('forum-online-count').textContent = `${d.online}/${(d.forums || []).length} up`;
    el.innerHTML = (d.forums || []).map(f =>
      `<div class="forum-row">
        <span class="forum-dot ${f.status}"></span>
        <span class="forum-name">${esc(f.name)}</span>
        ${f.tor ? '<span class="forum-tor">TOR</span>' : ''}
        <span class="forum-stat ${f.status}">${f.status}</span>
      </div>`).join('');
  } catch (e) { el.innerHTML = '<div class="osint-empty">forum check failed</div>'; }
}

// ── Advanced Recon (Recon+) ─────────────────────────────────────────────────────
async function runReconPlus() {
  const target = currentTarget || document.getElementById('search-input').value.trim();
  if (!target) { showError('Enter a domain in the search bar first.'); return; }
  const btn = document.getElementById('btn-reconplus'); btn.disabled = true;
  document.getElementById('rp-label').textContent = 'RUNNING';
  document.getElementById('rp-spinner').classList.remove('hidden');
  const stat = document.getElementById('rp-status');
  stat.textContent = '⏳ takeover · cloud buckets · Shodan host intel · live crawl … (~30–60s)';
  document.getElementById('reconplus-grid').innerHTML = '<div class="osint-empty">running offensive recon…</div>';
  try {
    const hosts = (lastOsint && lastOsint.subdomains) ? lastOsint.subdomains.slice(0, 40) : [];
    const d = await (await fetch('/api/reconplus', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target, hosts }),
    })).json();
    renderReconPlus(d);
    stat.textContent = '✓ complete — ' + (d.domain || target);
    document.getElementById('rp-label').textContent = '↻ RE-RUN ADVANCED RECON';
  } catch (e) {
    stat.textContent = 'Recon+ failed: ' + e;
    document.getElementById('rp-label').textContent = '▶ RUN ADVANCED RECON';
  } finally {
    btn.disabled = false;
    document.getElementById('rp-spinner').classList.add('hidden');
  }
}

function renderReconPlus(d) {
  const grid = document.getElementById('reconplus-grid');
  grid.innerHTML = '';
  const take = d.takeover || [], cloud = d.cloud || [], sh = d.shodan_hosts || {}, crawl = d.crawl || {};

  // Subdomain takeover
  const takeBody = take.length
    ? take.map(t => `<div class="cr-row"><span class="cr-badge" style="background:${t.confirmed ? 'rgba(229,103,92,.18)' : t.vulnerable ? 'rgba(224,148,77,.18)' : 'var(--bg3)'};color:${t.confirmed ? 'var(--critical)' : t.vulnerable ? 'var(--high)' : 'var(--text-faint)'}">${t.confirmed ? 'CONFIRMED' : t.vulnerable ? 'VULNERABLE' : 'CNAME'}</span><span style="flex:1">${esc(t.subdomain)} → ${esc(t.service)}</span></div>`).join('')
    : '<div class="osint-empty">no dangling-CNAME takeover candidates</div>';
  grid.appendChild(_card('① Subdomain Takeover', takeBody, { wide: true, count: take.length }));

  // Cloud assets
  const cloudBody = cloud.length
    ? cloud.map(c => `<div class="cr-row"><span class="cr-badge" style="background:${c.access.includes('PUBLIC') ? 'rgba(229,103,92,.18)' : 'var(--bg3)'};color:${c.access.includes('PUBLIC') ? 'var(--critical)' : 'var(--text-dim)'}">${esc(c.provider)}</span><span style="flex:1"><a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.bucket)}</a></span><span class="cr-dist">${esc(c.access)}</span></div>`).join('')
    : '<div class="osint-empty">no cloud buckets discovered</div>';
  grid.appendChild(_card('② Cloud Asset Discovery (S3/GCS/Azure)', cloudBody, { wide: true, count: cloud.length }));

  // Shodan host intel
  let shBody;
  if (!sh.enabled) shBody = '<div class="osint-empty">Shodan key pool unavailable</div>';
  else if (!sh.hosts || !sh.hosts.length) shBody = '<div class="osint-empty">no Shodan host records</div>';
  else shBody = sh.hosts.map(h => `<div class="rp-host">
      <div class="rp-host-ip">${esc(h.host)} · ${esc(h.ip)} <span style="color:var(--text-faint);font-size:11px">${esc(h.org || '')}</span></div>
      <div class="host-meta">${h.ports.length ? `<span>PORTS <b>${h.ports.join(', ')}</b></span>` : ''}${h.products.length ? `<span>SOFTWARE <b>${esc(h.products.join(', '))}</b></span>` : ''}</div>
      ${h.vulns.length ? `<div class="chip-wrap" style="margin-top:6px">${h.vulns.map(v => `<span class="ochip" style="color:var(--critical);border-color:var(--critical)"><a href="https://nvd.nist.gov/vuln/detail/${esc(v)}" target="_blank" rel="noopener">${esc(v)}</a></span>`).join('')}</div>` : ''}
    </div>`).join('');
  grid.appendChild(_card('③ Shodan Host Intel (key pool)', shBody, { wide: true, count: (sh.hosts || []).length }));

  // Live crawl
  const cats = crawl.categories || {};
  const crawlBody = Object.keys(cats).length
    ? Object.entries(cats).map(([k, urls]) => `<div class="dork-cat"><div class="dork-cat-name">${esc(k.toUpperCase())} <span style="color:var(--text-faint)">${urls.length}</span></div>${urls.slice(0, 12).map(u => `<div class="dork-row"><a href="${esc(u)}" target="_blank" rel="noopener">${esc(u)}</a></div>`).join('')}</div>`).join('')
    : '<div class="osint-empty">no endpoints crawled</div>';
  grid.appendChild(_card('④ Live Endpoint Crawl (katana)', crawlBody, { wide: true, count: crawl.total || 0 }));
}

// ── Ransomware intelligence (ransomlook mirror) ─────────────────────────────────
let ransomLoaded = false, allGroups = [], allMarkets = [];
function ensureRansom() { if (!ransomLoaded) { ransomLoaded = true; loadRansom(); } }

async function loadRansom(force) {
  document.getElementById('ransom-recent').innerHTML = skelRows(8);
  try {
    const [rec, grp, mkt] = await Promise.all([
      (await fetch('/api/ransom/recent')).json(),
      (await fetch('/api/ransom/groups')).json(),
      (await fetch('/api/ransom/markets')).json(),
    ]);
    const recent = rec.recent || [];
    document.getElementById('ransom-stats').innerHTML =
      `<div class="td-summary"><span class="td-stat"><b>${recent.length}</b> recent posts</span>` +
      `<span class="td-stat"><b>${grp.count || 0}</b> groups tracked</span>` +
      `<span class="td-stat"><b>${mkt.count || 0}</b> markets tracked</span></div>`;
    document.getElementById('ransom-recent').innerHTML = recent.map(r =>
      `<div class="rv-row">
        <span class="rv-group">${esc(r.group)}</span>
        <span class="rv-victim">${ed(r.victim)}</span>
        <span class="rv-date">${esc(r.discovered)}</span>
      </div>`).join('') || '<div class="osint-empty">no recent posts</div>';
    allGroups = grp.groups || [];
    allMarkets = mkt.markets || [];
    document.getElementById('rg-count').textContent = allGroups.length;
    document.getElementById('rm-count').textContent = allMarkets.length;
    renderRansomList('group', allGroups);
    renderRansomList('market', allMarkets);
  } catch (e) {
    document.getElementById('ransom-recent').innerHTML = '<div class="osint-empty">ransomlook feed unavailable</div>';
  }
}
function renderRansomList(kind, list) {
  const el = document.getElementById(kind === 'group' ? 'ransom-groups' : 'ransom-markets');
  el.innerHTML = list.slice(0, 600).map(n => `<span class="ochip">${esc(n)}</span>`).join('') || '<div class="osint-empty">none</div>';
}
function filterRansomList(kind) {
  const q = document.getElementById(kind === 'group' ? 'rg-search' : 'rm-search').value.toLowerCase();
  const src = kind === 'group' ? allGroups : allMarkets;
  renderRansomList(kind, q ? src.filter(n => n.toLowerCase().includes(q)) : src);
}

// ── Scrape: live monitor of new ransomware publications ─────────────────────────
let scrapeTimer = null, scrapeSeen = new Set(), scrapeItems = [];
function startScrape() {
  refreshScrape(true);
  if (!scrapeTimer) scrapeTimer = setInterval(() => refreshScrape(false), 30000);
}
async function refreshScrape(first) {
  const el = document.getElementById('scrape-feed');
  const stat = document.getElementById('scrape-status');
  try {
    const recent = (await (await fetch('/api/ransom/recent')).json()).recent || [];
    let fresh = 0;
    for (const r of recent) {
      const key = `${r.group}|${r.victim}|${r.discovered}`;
      if (!scrapeSeen.has(key)) {
        scrapeSeen.add(key);
        scrapeItems.unshift({ ...r, isNew: !first });
        if (!first) fresh++;
      }
    }
    scrapeItems = scrapeItems.slice(0, 120);
    el.innerHTML = scrapeItems.map(r =>
      `<div class="scrape-row${r.isNew ? ' fresh' : ''}">
        <span class="sc-dot"></span>
        <span class="rv-group">${esc(r.group)}</span>
        <span class="rv-victim">published: ${ed(r.victim)}</span>
        <span class="rv-date">${esc(r.discovered)}</span>
      </div>`).join('');
    scrapeItems.forEach(r => r.isNew = false);
    stat.innerHTML = `<span class="ticker-pulse"></span> live · ${scrapeItems.length} tracked${fresh ? ` · ${fresh} new` : ''} · ${new Date().toLocaleTimeString()}`;
  } catch (e) {
    stat.textContent = 'feed unavailable';
  }
}

// ── attack paths & remediation (intensive operation) ────────────────────────────
const ATTACK_KB = {
  infostealer: ['Stolen session cookies & plaintext credentials from info-stealer malware (RedLine/Lumma) let attackers log into corporate SSO/VPN/email — often bypassing MFA via session replay.', 'Force org-wide password resets + session revocation, enforce phishing-resistant MFA (FIDO2), deploy EDR, continuously monitor stealer-log feeds.'],
  breach: ['Leaked credential dumps enable credential-stuffing and account takeover wherever passwords are reused.', 'Reset exposed accounts, block known-breached passwords (HIBP), enforce MFA, rate-limit and anomaly-detect logins.'],
  ransomware: ['A ransomware leak-site listing implies a completed intrusion — initial access via phishing, exposed RDP/VPN or an unpatched edge device, then lateral movement, encryption & extortion.', 'Engage incident response, isolate affected hosts, patch edge/VPN, segment the network, keep offline backups, and hunt for persistence.'],
  exposure: ['Internet-exposed services, open ports and known CVEs hand attackers a direct remote-exploitation path (RCE, auth bypass, info leak).', 'Patch the CVEs, close unused ports, place services behind a VPN/WAF, and restrict access by source IP.'],
  phishing: ['Registered look-alike domains are used to phish employees & customers — credential capture, business-email-compromise and malware delivery.', 'Monitor and take down lookalikes, publish DMARC p=reject, deploy brand protection and run user-awareness training.'],
  posture: ['Missing SPF/DMARC lets attackers spoof your domain in phishing and business-email-compromise.', 'Publish SPF, a DMARC p=reject policy, DKIM signing and MTA-STS.'],
  github: ['Leaked code or secrets in public repositories expose API keys, credentials and internal logic for direct abuse.', 'Rotate every leaked secret, enable push-protection & secret-scanning, and request takedowns of the repos.'],
  google: ['Search-indexed sensitive paths — admin panels, configs, backups — are directly reachable by anyone.', 'De-index them, require authentication, and block sensitive paths at the WAF and in robots.txt.'],
  paste: ['Credentials and configs pasted to paste sites are harvested by attackers for immediate reuse.', 'Request removal, rotate any exposed secrets, and monitor paste sites continuously.'],
};
const ATTACK_LABEL = { infostealer: 'Infostealer credential theft', breach: 'Credential dump / stuffing', ransomware: 'Ransomware intrusion', exposure: 'Exposed-service exploitation', phishing: 'Look-alike phishing', posture: 'Email spoofing', github: 'Source / secret leak', google: 'Indexed sensitive path', paste: 'Paste-site leak' };

function renderAttackPaths(findings) {
  const el = document.getElementById('op-attack');
  const cats = {};
  for (const f of findings) {
    const c = f.category;
    if (!ATTACK_KB[c]) continue;
    cats[c] = cats[c] || { n: 0, worst: 'info' };
    cats[c].n++;
    if (SEV_ORDER[f.severity] < SEV_ORDER[cats[c].worst]) cats[c].worst = f.severity;
  }
  const order = Object.keys(cats).sort((a, b) => SEV_ORDER[cats[a].worst] - SEV_ORDER[cats[b].worst]);
  if (!order.length) { el.innerHTML = ''; return; }
  el.innerHTML = `<div class="section-label" style="margin:28px 0 14px;border-color:var(--critical)">⚔ ATTACK PATHS &amp; REMEDIATION — how an attacker gets in, and how to fix it</div>` +
    order.map(c => {
      const [vector, fix] = ATTACK_KB[c];
      return `<div class="ap-card sev-${cats[c].worst}">
        <div class="ap-head"><span class="badge badge-${cats[c].worst}">${cats[c].worst.toUpperCase()}</span><span class="ap-name">${esc(ATTACK_LABEL[c] || c)}</span><span class="ap-count">${cats[c].n} finding(s)</span></div>
        <div class="ap-row"><span class="ap-tag attack">⚔ ACCESS</span><span>${esc(vector)}</span></div>
        <div class="ap-row"><span class="ap-tag fix">🛡 FIX</span><span>${esc(fix)}</span></div>
      </div>`;
    }).join('');
}

// ── 10 advanced intelligence modules ────────────────────────────────────────────
let lastIntel = null;

async function runIntel() {
  const target = currentTarget || document.getElementById('search-input').value.trim();
  if (!target) { showError('Designate a target — run an Operation or Scan first.'); return; }
  const btn = document.getElementById('btn-intel'); btn.disabled = true;
  document.getElementById('intel-label').textContent = 'COMPUTING MODULES';
  document.getElementById('intel-spinner').classList.remove('hidden');
  const stat = document.getElementById('intel-status');
  try {
    stat.textContent = '⏳ ensuring breach + recon data…';
    if (!lastResult || lastResult.domain.replace(/^www\./, '') !== target.replace(/^www\./, '')) {
      lastResult = await (await fetch('/api/scan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ target }) })).json();
      renderResults(lastResult); showPage('intel');
    }
    currentTarget = lastResult.domain;
    if (!lastOsint || reconTarget !== currentTarget) {
      const uname = document.getElementById('osint-username').value.trim();
      lastOsint = await (await fetch('/api/osint', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ target: currentTarget, username: uname }) })).json();
      reconTarget = currentTarget; renderWebsite(lastOsint); renderOsint(lastOsint); buildMindmap(lastOsint);
    }
    stat.textContent = '⏳ Shodan footprint · ASN threat cross-ref · email grade · typosquat triage…';
    const hosts = (lastOsint.subdomains || []).slice(0, 40);
    const asn = (lastOsint.ip_profile || {}).asn || '';
    const lookalikes = (lastResult.findings || []).filter(f => f.category === 'phishing').map(f => {
      try { return new URL(f.url).hostname; } catch (e) { const m = (f.title || '').match(/:\s*([a-z0-9.-]+\.[a-z]{2,})/i); return m ? m[1] : ''; }
    }).filter(Boolean);
    lastIntel = await (await fetch('/api/advanced', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ target: currentTarget, hosts, asn, lookalikes }) })).json();
    renderIntel(lastIntel, lastResult, lastOsint);
    stat.textContent = '';
    document.getElementById('intel-label').textContent = '↻ RE-RUN 10 MODULES';
  } catch (e) {
    stat.textContent = 'Module error: ' + e;
    document.getElementById('intel-label').textContent = '▶ RUN 10 MODULES';
  } finally {
    btn.disabled = false;
    document.getElementById('intel-spinner').classList.add('hidden');
  }
}

function _num(s, re) { const m = (s || '').match(re); return m ? parseInt(m[1].replace(/,/g, '')) || 0 : 0; }

function renderIntel(adv, R, O) {
  const grid = document.getElementById('intel-grid');
  grid.innerHTML = '';
  const s = adv.shodan || {}, em = adv.email || {}, at = adv.asn_threat || {}, tp = adv.typosquat || [];
  const F = R.findings || [], c = O.counts || {};

  // ① Shodan footprint
  grid.appendChild(_card('① Shodan Footprint — whole IP estate', `
    <dl class="kv">${_kvRows([['IPs resolved', s.ip_count], ['Responded', s.responded], ['Open ports', s.port_count], ['Software (CPE)', s.service_count], ['Tags', (s.tags || []).join(', ')]])}</dl>
    ${(s.ports || []).length ? `<div class="chip-wrap" style="margin-top:10px">${s.ports.map(p => `<span class="ochip">${p}</span>`).join('')}</div>` : ''}`,
    { count: `${s.ip_count || 0} IP` }));

  // ② Passive CVE inventory
  const cves = s.cves || [];
  grid.appendChild(_card('② Passive CVE Inventory (Shodan)', cves.length
    ? `<div class="chip-wrap">${cves.map(v => `<span class="ochip" style="color:var(--critical);border-color:var(--critical)"><a href="https://nvd.nist.gov/vuln/detail/${esc(v)}" target="_blank" rel="noopener">${esc(v)}</a></span>`).join('')}</div>`
    : '<div class="osint-empty">no CVEs on Shodan-indexed services — hardened / CDN-fronted</div>', { count: cves.length }));

  // ③ Email security scorecard
  const checkRows = (em.checks || []).map(([k, st, d]) => `<div class="em-row"><span class="em-dot ${st}"></span><b>${esc(k)}</b><span class="em-desc">${esc(d)}</span></div>`).join('');
  grid.appendChild(_card('③ Email Security Scorecard', `
    <div class="em-grade gr-${em.grade || 'F'}">${em.grade || '?'}<span class="em-score">${em.score || 0}/100</span></div>
    <div class="em-checks">${checkRows}</div>`));

  // ④ ASN bad-neighborhood
  grid.appendChild(_card('④ ASN Bad-Neighborhood', `
    <dl class="kv">${_kvRows([['ASN', at.asn], ['Live malicious hosts in ASN', at.threats]])}</dl>
    ${(at.samples || []).length ? `<div class="chip-wrap" style="margin-top:8px">${at.samples.map(x => `<span class="ochip">${esc(x.ip)} · ${esc(x.malware || x.type)}</span>`).join('')}</div>` : '<div class="osint-empty" style="margin-top:8px">no malicious hosts share this ASN in the live feed</div>'}`,
    { count: at.threats || 0 }));

  // ⑤ Typosquat triage
  const tprows = tp.map(t => {
    const bad = t.risk === 'phishing-ready';
    return `<div class="cr-row"><span class="cr-badge" style="background:${bad ? 'rgba(229,103,92,.18)' : 'rgba(76,175,120,.16)'};color:${bad ? 'var(--critical)' : '#4caf78'}">${t.risk.toUpperCase()}</span><span style="flex:1">${esc(t.domain)}</span><span class="cr-dist">${t.mx ? 'MX✓ ' : ''}${esc(t.ip || '')}</span></div>`;
  }).join('');
  grid.appendChild(_card('⑤ Typosquat Threat Triage', tp.length ? tprows : '<div class="osint-empty">no registered lookalikes</div>', { wide: true, count: tp.length }));

  // ⑪ Favicon-hash pivot (fav-up / Cloudflare-origin technique)
  const fav = adv.favicon || {};
  if (fav.found) {
    const pivots = Object.entries(fav.pivots || {}).map(([k, u]) => `<a class="ochip tag-on" href="${esc(u)}" target="_blank" rel="noopener">${esc(k)} ↗</a>`).join('');
    grid.appendChild(_card('⑪ Favicon-Hash Pivot — clone &amp; Cloudflare-origin finder', `
      <dl class="kv">${_kvRows([['mmh3 hash', fav.mmh3], ['md5', fav.md5], ['size', fav.size + ' bytes']])}</dl>
      <div class="chip-wrap" style="margin-top:8px">${pivots}</div>
      <div class="osint-empty" style="margin-top:6px">${esc(fav.note)}</div>`, { wide: true }));
  }

  // ⑥ Exposure timeline
  const dated = F.filter(f => f.date && /^\d{4}/.test(f.date)).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 18);
  grid.appendChild(_card('⑥ Exposure Timeline', dated.length
    ? `<div class="tl">${dated.map(f => `<div class="tl-row"><span class="tl-date">${esc(f.date.slice(0, 10))}</span><span class="tl-dot sev-${f.severity}"></span><span class="tl-txt">${ed(f.title)}</span></div>`).join('')}</div>`
    : '<div class="osint-empty">no dated events</div>', { wide: true, count: dated.length }));

  // ⑦ Credential exposure index
  let creds = 0, emps = 0, users = 0;
  for (const f of F) {
    if (f.category === 'breach' || f.category === 'infostealer') {
      creds += _num(f.title, /([\d,]+)\+?\s*(?:credential|account|plaintext)/i);
      emps += _num(f.title, /([\d,]+)\s*employees/i);
      users += _num(f.title, /([\d,]+)\s*users/i);
    }
  }
  grid.appendChild(_kvCard('⑦ Credential Exposure Index', [
    ['Exposed credentials', creds ? creds.toLocaleString() : '0'],
    ['Employees in stealer logs', emps ? emps.toLocaleString() : '0'],
    ['Users in stealer logs', users ? users.toLocaleString() : '0'],
  ]));

  // ⑧ Attack-surface index
  const phish = F.filter(f => f.category === 'phishing').length;
  const metrics = [['Subdomains', c.subdomains || 0, 1000], ['Open ports', s.port_count || 0, 30],
    ['Exposed services', s.service_count || 0, 40], ['CVEs', s.cve_count || 0, 20],
    ['Lookalikes', phish, 20], ['Reverse-IP neighbours', c.neighbours || 0, 40]];
  grid.appendChild(_card('⑧ Attack-Surface Index', `<div class="as">${metrics.map(([n, v, mx]) =>
    `<div class="as-row"><span class="as-name">${n}</span><span class="as-bar"><span class="as-fill" style="width:${Math.min(100, v / mx * 100)}%"></span></span><span class="as-val">${v}</span></div>`).join('')}</div>`, { wide: true }));

  // ⑨ Breach data-class breakdown
  const classes = {};
  for (const f of F) {
    const m = (f.detail || '').match(/Types?:\s*([^|]+)/i);
    if (m) m[1].split(',').forEach(t => { t = t.trim(); if (t) classes[t] = (classes[t] || 0) + 1; });
  }
  const cls = Object.entries(classes).sort((a, b) => b[1] - a[1]);
  grid.appendChild(_card('⑨ Breach Data-Class Breakdown', cls.length
    ? `<div class="chip-wrap">${cls.map(([k, n]) => `<span class="ochip">${esc(k)} <b style="color:var(--accent)">${n}</b></span>`).join('')}</div>`
    : '<div class="osint-empty">no data-class detail in breach records</div>', { count: cls.length }));

  // ⑩ Monitoring diff
  const key = 'bi-snap-' + currentTarget;
  let prev = null; try { prev = JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) {}
  const snap = { subs: O.subdomains || [], finds: F.map(f => f.source + '|' + f.title), ts: new Date().toISOString() };
  let diffHtml;
  if (!prev) diffHtml = '<div class="osint-empty">baseline saved — re-run later to see what changed since now</div>';
  else {
    const ns = snap.subs.filter(x => !prev.subs.includes(x));
    const nf = snap.finds.filter(x => !prev.finds.includes(x));
    diffHtml = `<dl class="kv">${_kvRows([['Baseline', (prev.ts || '').slice(0, 16).replace('T', ' ')], ['New subdomains', ns.length], ['New findings', nf.length]])}</dl>
      ${ns.length ? `<div class="chip-wrap" style="margin-top:8px">${ns.slice(0, 24).map(x => `<span class="ochip tag-on">+ ${esc(x)}</span>`).join('')}</div>` : ''}`;
  }
  try { localStorage.setItem(key, JSON.stringify(snap)); } catch (e) {}
  grid.appendChild(_card('⑩ Monitoring Diff — since last scan', diffHtml, { wide: true }));
}

// ── takedown intelligence ─────────────────────────────────────────────────────
function resetTakedown() {
  lastTakedown = null;
  const grid = document.getElementById('takedown-grid');
  grid.classList.add('hidden');
  grid.innerHTML = '';
  document.getElementById('btn-report').classList.add('hidden');
  document.getElementById('td-label').textContent = '▸ TRACE HOSTING & ABUSE CONTACTS';
  document.getElementById('btn-takedown').disabled = false;
  clearHostMarkers();
}

async function runTakedown() {
  if (!lastResult) return;
  const btn = document.getElementById('btn-takedown');
  btn.disabled = true;
  document.getElementById('td-label').textContent = 'TRACING INFRASTRUCTURE';
  document.getElementById('td-spinner').classList.remove('hidden');

  try {
    const res = await fetch('/api/takedown', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target: lastResult.domain,
        findings: lastResult.findings,
        scanned_at: lastResult.scanned_at,
      }),
    });
    const data = await res.json();
    lastTakedown = data;
    renderTakedown(data);
    plotHostingMarkers(data.records || []);
    document.getElementById('btn-report').classList.remove('hidden');
    document.getElementById('td-label').textContent = '↻ RE-TRACE';
  } catch (e) {
    showError('Takedown trace failed: ' + e);
    document.getElementById('td-label').textContent = '▸ TRACE HOSTING & ABUSE CONTACTS';
  } finally {
    btn.disabled = false;
    document.getElementById('td-spinner').classList.add('hidden');
  }
}

function renderTakedown(data) {
  const grid = document.getElementById('takedown-grid');
  grid.innerHTML = '';
  const records = data.records || [];

  // summary
  const summary = document.createElement('div');
  summary.className = 'td-summary';
  const tor = records.filter(r => r.tor).length;
  const withAbuse = records.filter(r => r.abuse_email || r.registrar_abuse).length;
  summary.innerHTML =
    `<span class="td-stat"><b>${records.length}</b> hosting node(s)</span>` +
    `<span class="td-stat"><b>${withAbuse}</b> with abuse contact</span>` +
    `<span class="td-stat"><b>${tor}</b> Tor hidden service(s)</span>` +
    `<span class="td-stat"><b>${(data.abuse_contacts || []).length}</b> unique abuse email(s)</span>`;
  grid.appendChild(summary);

  if (!records.length) {
    const none = document.createElement('div');
    none.className = 'abuse-none';
    none.textContent = 'No hostable exposures resolved — findings are news/aggregator references only.';
    grid.appendChild(none);
  }

  for (const r of records) {
    grid.appendChild(makeHostCard(r));
  }
  grid.classList.remove('hidden');
}

function makeHostCard(r) {
  const div = document.createElement('div');
  const sev = (r.severity || 'info').toLowerCase();
  div.className = `host-card sev-${sev}${r.tor ? ' tor' : ''}`;

  const flag = r.tor ? '🧅' : (flagEmoji(r.country_code) || '🌐');

  let meta = '';
  if (r.tor) {
    meta = `<span class="host-tor-tag">TOR HIDDEN SERVICE</span> <b>no clearnet host — requires seizure / Tor abuse</b>`;
  } else {
    meta =
      (r.ip ? `<span>IP <b>${esc(r.ip)}</b></span>` : '<span>IP <b>unresolved</b></span>') +
      (r.country ? `<span>LOC <b>${esc(r.country)}</b></span>` : '') +
      (r.asn ? `<span>ASN <b>${esc(r.asn)}</b></span>` : (r.isp ? `<span>NET <b>${esc(r.isp)}</b></span>` : '')) +
      (r.network ? `<span>OWNER <b>${esc(r.network)}</b></span>` : '');
  }

  let abuse = '';
  if (r.abuse_email) {
    abuse += `<span class="abuse-pill" onclick="copyText('${esc(r.abuse_email)}',this)" title="click to copy">✉ ${esc(r.abuse_email)} <span class="copy-ico">⧉</span></span>`;
  }
  if (r.registrar_abuse && r.registrar_abuse !== r.abuse_email) {
    abuse += `<span class="abuse-pill registrar" onclick="copyText('${esc(r.registrar_abuse)}',this)" title="registrar abuse — click to copy">⚖ ${esc(r.registrar_abuse)} <span class="copy-ico">⧉</span></span>`;
  }
  if (!abuse && !r.tor) {
    abuse = `<span class="abuse-none">No published abuse contact — escalate via local CERT / ICANN</span>`;
  } else if (!abuse && r.tor) {
    abuse = `<span class="abuse-none">Report to law-enforcement cybercrime unit for seizure</span>`;
  }

  const sources = (r.sources || []).join(', ');
  div.innerHTML = `
    <div class="host-flag">${flag}</div>
    <div class="host-body">
      <div class="host-name">${esc(r.host)} <span style="font-size:11px;color:var(--text-dim);font-weight:400">· ${r.exposure_count} exposure(s) · ${esc(sources)}</span></div>
      <div class="host-meta">${meta}</div>
      <div class="abuse-row">${abuse}</div>
      ${r.sample_url ? `<div class="host-evidence">↳ <a href="${esc(r.sample_url)}" target="_blank" rel="noopener">${esc(r.sample_url)}</a></div>` : ''}
    </div>
  `;
  return div;
}

async function downloadReport() {
  if (!lastResult) return;
  const btn = document.getElementById('btn-report');
  const orig = btn.textContent;
  btn.textContent = 'BUILDING…';
  try {
    const res = await fetch('/api/takedown/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target: lastResult.domain,
        findings: lastResult.findings,
        scanned_at: lastResult.scanned_at,
      }),
    });
    const text = await res.text();
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `takedown-dossier-${lastResult.domain}.txt`;
    a.click();
  } catch (e) {
    showError('Report generation failed: ' + e);
  } finally {
    btn.textContent = orig;
  }
}

function plotHostingMarkers(records) {
  clearHostMarkers();
  for (const r of records) {
    if (r.tor || !r.lat || !r.lon) continue;
    const color = SEV_COLORS[r.severity] || '#ff3333';
    const icon = L.divIcon({
      html: `<div style="color:${color};font-size:18px;line-height:1;text-shadow:0 0 6px ${color}">⌖</div>`,
      className: '', iconAnchor: [9, 9],
    });
    const m = L.marker([r.lat, r.lon], { icon })
      .addTo(map)
      .bindPopup(`<b>${esc(r.host)}</b><br>${esc(r.country)} · ${esc(r.ip || '')}<br>${esc(r.isp || r.network || '')}<br>${r.abuse_email ? 'Abuse: ' + esc(r.abuse_email) : 'No abuse contact'}`);
    hostMarkers.push(m);
  }
}

function clearHostMarkers() {
  hostMarkers.forEach(m => m.remove());
  hostMarkers = [];
}

function flagEmoji(cc) {
  if (!cc || cc.length !== 2) return '';
  return cc.toUpperCase().replace(/./g, c => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

function copyText(text, el) {
  navigator.clipboard.writeText(text).then(() => {
    const ico = el.querySelector('.copy-ico');
    if (ico) { const o = ico.textContent; ico.textContent = '✓'; setTimeout(() => ico.textContent = o, 1200); }
  });
}

// ── status dot ───────────────────────────────────────────────────────────────
function setStatus(state) {
  const dot = document.getElementById('status-dot');
  const txt = document.getElementById('status-text');
  dot.className = 'status-dot';
  if (state === 'scanning') { dot.classList.add('scanning'); txt.textContent = 'Scanning'; }
  else if (state === 'error') { dot.classList.add('error'); txt.textContent = 'Error'; }
  else { txt.textContent = 'Ready'; }
}

function showError(msg) {
  setStatus('error');
  const el = document.getElementById('error-banner');
  el.textContent = `ERROR: ${msg}`;
  el.classList.remove('hidden');
}

// ── theme ─────────────────────────────────────────────────────────────────────
function applyTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  document.getElementById('theme-ico').textContent = theme === 'light' ? '☀' : '☾';
  setTiles(theme);
  try { localStorage.setItem('bi-theme', theme); } catch (e) {}
}
function toggleTheme() {
  applyTheme(currentTheme() === 'light' ? 'dark' : 'light');
}

// ── sidebar collapse ────────────────────────────────────────────────────────────
function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  sb.classList.toggle('collapsed');
  try { localStorage.setItem('bi-sidebar', sb.classList.contains('collapsed') ? '1' : '0'); } catch (e) {}
  if (map) setTimeout(() => map.invalidateSize(), 220);
}
(function initSidebar() {
  let c = '0';
  try { c = localStorage.getItem('bi-sidebar') || '0'; } catch (e) {}
  if (c === '1') { const sb = document.getElementById('sidebar'); if (sb) sb.classList.add('collapsed'); }
})();
(function initTheme() {
  let saved = 'dark';
  try { saved = localStorage.getItem('bi-theme') || 'dark'; } catch (e) {}
  document.body.setAttribute('data-theme', saved);
  const ico = document.getElementById('theme-ico');
  if (ico) ico.textContent = saved === 'light' ? '☀' : '☾';
})();

renderRecent();   // map inits lazily when the Radar tab is first opened
ensureOpBoard();  // Operation is the default landing page

// ── keyboard ──────────────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.getElementById('error-banner').classList.add('hidden');
    setStatus('ready');
  }
});
