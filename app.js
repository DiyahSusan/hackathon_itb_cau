/* GIL prototype: transparent rule-based route comparison, no ML or safety guarantee. */
const AREAS = {
  bandung: {
    label: 'Bandung · ITB', center: [-6.8915, 107.6107], zoom: 15,
    start: { labelKey: 'itbGate', lat: -6.8915, lon: 107.6107 },
    end: { labelKey: 'dagoJunction', lat: -6.8791, lon: 107.6137 },
    emergency: '110', country: 'Indonesia'
  },
  seoul: {
    label: 'Seoul · Chung-Ang Univ.', center: [37.5054, 126.9570], zoom: 15,
    start: { labelKey: 'cau', lat: 37.5054, lon: 126.9570 },
    end: { labelKey: 'sangdo', lat: 37.5028, lon: 126.9488 },
    emergency: '112', country: 'Korea'
  }
};
const ROUTING_BASE = 'https://routing.openstreetmap.de/routed-foot/route/v1/driving';
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const STORAGE_KEY = 'gil-community-reports-v1';
const CACHE_KEY = 'gil-osm-cache-v1';
const LANGUAGE_KEY = 'gil-language-v1';
const WEIGHTS = { lighting: 0.30, facilities: 0.25, road: 0.20, reports: 0.25 };
const COPY = {
  id: {
    languageLabel:'Bahasa', tagline:'guide · inform · locate', demoData:'DATA DEMO', eyebrow:'RUTE AMAN UNTUK PONSEL', heroTitle:'Pulang dengan <em>lebih banyak informasi.</em>', heroDesc:'Bandingkan rute jalan kaki dari data OpenStreetMap dan laporan komunitas.', metaDescription:'GIL membandingkan rute jalan kaki menggunakan data peta dan laporan komunitas.', itbGate:'Gerbang ITB', dagoJunction:'Simpang Dago', cau:'Universitas Chung-Ang', sangdo:'Stasiun Sangdo',
    routeSettings:'Pengaturan rute', pilotArea:'Area demo', areaBandung:'Bandung · ITB', areaSeoul:'Seoul · Universitas Chung-Ang', start:'Mulai', destination:'Tujuan', myLocation:'Lokasi saya', pickMap:'Pilih peta', compareRoutes:'Bandingkan rute', pickDestinationHint:'Ketuk peta untuk memilih titik tujuan.',
    routeMap:'Peta rute', mapArea:'PETA AREA', mapTitle:'Rute dan kondisi sekitar', centerMap:'Pusatkan peta', interactiveMap:'Peta interaktif', fastest:'Tercepat', bestScore:'Skor terbaik', comparisonResults:'HASIL PERBANDINGAN', chooseRoute:'Pilih rute yang cocok', estimate:'ESTIMASI', safetyNote:'<b>Skor bukan jaminan keamanan.</b> Nilai bergantung pada data OSM dan laporan yang tersedia untuk area ini.',
    helpOthers:'BANTU PENGGUNA LAIN', reportRoad:'Laporkan kondisi jalan', reportDesc:'Tambahkan titik gelap, sepi, atau kondisi yang perlu diketahui pengguna berikutnya.', reportDark:'Gelap', reportIsolated:'Sepi', reportHarassment:'Pelecehan', reportDefault:'Pilih kategori laporan, lalu ketuk lokasinya di peta.', cancel:'Batal',
    needHelp:'Butuh bantuan segera?', callPolice:'Panggil layanan polisi setempat', call:'Hubungi', sourcesMethod:'SUMBER & METODE', dataEstimate:'Data yang membentuk estimasi', osmInfo:'<b>OSM live:</b> jalan, status penerangan yang ditandai, toko 24/7, kantor polisi, halte, dan lampu jalan.', communityInfo:'<b>Laporan komunitas:</b> disimpan lokal di perangkat demo ini dan tidak dikirim ke server.', scoreInfo:'<b>Skor berbobot:</b> penerangan 30%, fasilitas buka 25%, jalan utama 20%, laporan aktif 25%. Faktor tanpa data tidak dianggap aman atau gelap; cakupan data ditampilkan terpisah.', seoulInfo:'<b>Seoul:</b> layer jalur aman/fasilitas resmi bisa dimuat sebagai GeoJSON di bawah. Data resmi yang ditemukan terakhir diperbarui pada 2023.', seoulRouteLink:'Data jalur aman Seoul ↗', seoulFacilityLink:'Fasilitas jalur aman Seoul ↗', loadGeoJSON:'Muat layer resmi GeoJSON', disclaimer:'OSM © OpenStreetMap contributors · Tile © OSMF. Data komunitas dapat kosong atau kedaluwarsa. Rute adalah estimasi, bukan jaminan.', footer:'GIL · Prototipe Hackathon ITB × CAU',
    statusReady:'Peta siap · OSM', statusOSMLive:'Data OSM live · area rute', statusOSMCache:'Data OSM dari cache · maks. 6 jam', statusFetching:'Menghitung rute jalan kaki…', statusFeatures:'Mengambil fitur OSM di sekitar rute…', statusRoutesConnected:'Data rute belum terhubung', statusLayer:'Layer lokal dimuat · {count} fitur', statusRoadCount:'OSM live · {count} ruas jalan terbaca',
    mapStart:'Mulai', mapEnd:'Tujuan', mapPoint:'Titik pilihan peta', mapPointKo:'Titik pilihan peta', routeUpdated:'Tujuan diperbarui.', chooseDestination:'Ketuk titik tujuan di peta.', locationSearching:'Mencari…', locationDenied:'Izin lokasi ditolak.', locationUnavailable:'Lokasi tidak dapat ditemukan.', noGeolocation:'Browser ini tidak menyediakan lokasi.', locationUpdated:'Lokasi awal diperbarui.',
    reportTapFirst:'Ketuk peta untuk menempatkan laporan ini.', reportTapPrompt:'Sekarang ketuk lokasi laporan di peta.', reportChosen:'Titik dipilih ({lat}, {lon}).', reportSaved:'Laporan tersimpan di perangkat demo ini.', reportAdded:'Laporan ditambahkan di perangkat ini.', reportUnverified:'Laporan komunitas · belum terverifikasi',
    routeFast:'Rute tercepat', routeBest:'Rute teraman (estimasi)', sameRouteNote:'Layanan rute hanya mengembalikan satu kandidat, jadi kedua pilihan memakai jalur yang sama.', scoreEstimate:'skor estimasi', factorsAvailable:'{percent}% faktor tersedia', minutes:'{n} menit', litSamples:'{percent}% sampel jalan bertanda penerangan', lightingUnknown:'data penerangan belum tersedia', shops24:'{n} toko bertanda buka 24/7 dalam 90 m', nearbyFacilities:'{n} halte/pos polisi dekat rute', activeReports:'{n} laporan komunitas aktif', noReports:'belum ada laporan aktif', officialOverlap:'{percent}% dekat koridor resmi pada layer',
    scoreFactorLighting:'Penerangan', scoreFactorFacilities:'Fasilitas sekitar', scoreFactorRoad:'Tipe jalan', scoreFactorReports:'Laporan komunitas',
    errorRouting:'Layanan rute gagal ({status})', errorNoRoute:'Rute jalan kaki tidak ditemukan untuk titik ini.', errorOSM:'Data OSM gagal dimuat ({status})', errorRetry:'Coba lagi atau gunakan lokasi lain.', errorGeoJSON:'File GeoJSON tidak valid.', geoJSONLoaded:'Layer GeoJSON dimuat; jalankan perbandingan lagi untuk melihat irisan koridor.', geoJSONShown:'Layer GeoJSON ditampilkan.',
    choosingMap:'Ketuk peta…', locationIsMe:'Lokasi saya', callStatus:'Hubungi {number}', routeButtonBusy:'Mengambil rute & data…'
  },
  en: {
    languageLabel:'Language', tagline:'guide · inform · locate', demoData:'DEMO DATA', eyebrow:'MOBILE SAFETY ROUTES', heroTitle:'Get home with <em>more information.</em>', heroDesc:'Compare walking routes using OpenStreetMap data and community reports.', metaDescription:'GIL compares walking routes using map data and community reports.', itbGate:'ITB Main Gate', dagoJunction:'Dago Junction', cau:'Chung-Ang University', sangdo:'Sangdo Station',
    routeSettings:'Route settings', pilotArea:'Demo area', areaBandung:'Bandung · ITB', areaSeoul:'Seoul · Chung-Ang University', start:'Start', destination:'Destination', myLocation:'My location', pickMap:'Pick on map', compareRoutes:'Compare routes', pickDestinationHint:'Tap the map to choose a destination.',
    routeMap:'Route map', mapArea:'AREA MAP', mapTitle:'Routes and nearby context', centerMap:'Center map', interactiveMap:'Interactive map', fastest:'Fastest', bestScore:'Best score', comparisonResults:'ROUTE COMPARISON', chooseRoute:'Choose a route', estimate:'ESTIMATE', safetyNote:'<b>Scores are not a safety guarantee.</b> They depend on available OSM data and reports for this area.',
    helpOthers:'HELP OTHER WALKERS', reportRoad:'Report a road condition', reportDesc:'Mark a dark, isolated, or concerning spot for the next person.', reportDark:'Dark', reportIsolated:'Isolated', reportHarassment:'Harassment', reportDefault:'Choose a report category, then tap its location on the map.', cancel:'Cancel',
    needHelp:'Need help now?', callPolice:'Call local police', call:'Call', sourcesMethod:'SOURCES & METHOD', dataEstimate:'Data behind the estimate', osmInfo:'<b>Live OSM:</b> roads, mapped lighting, 24/7 shops, police stations, bus stops, and street lamps.', communityInfo:'<b>Community reports:</b> stored locally in this demo browser, not sent to a server.', scoreInfo:'<b>Weighted score:</b> lighting 30%, open facilities 25%, major-road proxy 20%, active reports 25%. Missing data does not mean safe or dark; data coverage is shown separately.', seoulInfo:'<b>Seoul:</b> official safe-route and facility layers can be loaded as GeoJSON below. The official files found were last updated in 2023.', seoulRouteLink:'Seoul safe route data ↗', seoulFacilityLink:'Seoul safe route facilities ↗', loadGeoJSON:'Load official GeoJSON layer', disclaimer:'OSM © OpenStreetMap contributors · Tiles © OSMF. Community data may be missing or outdated. Routes are estimates, not guarantees.', footer:'GIL · Hackathon prototype ITB × CAU',
    statusReady:'Map ready · OSM', statusOSMLive:'Live OSM data · route area', statusOSMCache:'OSM data from cache · up to 6 hours old', statusFetching:'Finding walking routes…', statusFeatures:'Loading OSM features around routes…', statusRoutesConnected:'Route data is not connected', statusLayer:'Local layer loaded · {count} features', statusRoadCount:'Live OSM · {count} road segments read',
    mapStart:'Start', mapEnd:'Destination', mapPoint:'Map-selected point', mapPointKo:'Map-selected point', routeUpdated:'Destination updated.', chooseDestination:'Tap the map to choose a destination.', locationSearching:'Locating…', locationDenied:'Location permission was denied.', locationUnavailable:'Could not get your location.', noGeolocation:'This browser does not provide geolocation.', locationUpdated:'Starting point updated.',
    reportTapFirst:'Tap the map to place this report.', reportTapPrompt:'Now tap the report location on the map.', reportChosen:'Point selected ({lat}, {lon}).', reportSaved:'Report saved in this demo browser.', reportAdded:'Report added on this device.', reportUnverified:'Community report · unverified',
    routeFast:'Fastest route', routeBest:'Safest route (estimate)', sameRouteNote:'The routing service returned one candidate, so both options follow the same path.', scoreEstimate:'estimated score', factorsAvailable:'{percent}% of factors available', minutes:'{n} min', litSamples:'{percent}% of sampled roads tagged as lit', lightingUnknown:'lighting data unavailable', shops24:'{n} shops tagged open 24/7 within 90 m', nearbyFacilities:'{n} nearby bus stops/police stations', activeReports:'{n} active community reports', noReports:'no active reports', officialOverlap:'{percent}% near an official corridor in the layer',
    scoreFactorLighting:'Lighting', scoreFactorFacilities:'Nearby facilities', scoreFactorRoad:'Road type', scoreFactorReports:'Community reports',
    errorRouting:'Routing service failed ({status})', errorNoRoute:'No walking route found for these points.', errorOSM:'Could not load OSM data ({status})', errorRetry:'Try again or choose another location.', errorGeoJSON:'Invalid GeoJSON file.', geoJSONLoaded:'GeoJSON layer loaded. Compare routes again to see corridor overlap.', geoJSONShown:'GeoJSON layer displayed.',
    choosingMap:'Tap the map…', locationIsMe:'My location', callStatus:'Call {number}', routeButtonBusy:'Loading routes & data…'
  },
  ko: {
    languageLabel:'언어', tagline:'안내 · 정보 · 위치', demoData:'데모 데이터', eyebrow:'모바일 안심 경로', heroTitle:'더 많은 정보를 가지고 <em>안전하게 귀가하세요.</em>', heroDesc:'OpenStreetMap 데이터와 커뮤니티 제보를 바탕으로 도보 경로를 비교해 보세요.', metaDescription:'GIL은 지도 데이터와 커뮤니티 제보를 활용해 도보 경로를 비교합니다.', itbGate:'ITB 정문', dagoJunction:'다고 교차로', cau:'중앙대학교', sangdo:'상도역',
    routeSettings:'경로 설정', pilotArea:'데모 지역', areaBandung:'반둥 · ITB', areaSeoul:'서울 · 중앙대학교', start:'출발', destination:'도착', myLocation:'내 위치', pickMap:'지도에서 선택', compareRoutes:'경로 비교', pickDestinationHint:'지도에서 도착 지점을 선택하세요.',
    routeMap:'경로 지도', mapArea:'지역 지도', mapTitle:'경로 및 주변 정보', centerMap:'지도 중심으로 이동', interactiveMap:'대화형 지도', fastest:'최단 시간', bestScore:'최고 점수', comparisonResults:'경로 비교 결과', chooseRoute:'원하는 경로를 선택하세요', estimate:'추정치', safetyNote:'<b>점수는 안전을 보장하지 않습니다.</b> 이 지역에서 이용 가능한 OSM 데이터와 제보를 바탕으로 계산합니다.',
    helpOthers:'다른 이용자 돕기', reportRoad:'도로 상황 제보', reportDesc:'어둡거나 외진 곳, 또는 다른 이용자에게 알릴 상황을 지도에 표시하세요.', reportDark:'어두움', reportIsolated:'외진 곳', reportHarassment:'성희롱·괴롭힘', reportDefault:'제보 유형을 선택한 뒤 지도에서 위치를 탭하세요.', cancel:'취소',
    needHelp:'긴급한 도움이 필요하신가요?', callPolice:'현지 경찰에 전화하기', call:'전화', sourcesMethod:'데이터 및 계산 방식', dataEstimate:'추정치에 사용된 데이터', osmInfo:'<b>실시간 OSM:</b> 도로, 조명이 표시된 구간, 24시간 영업 상점, 경찰서, 버스 정류장, 가로등.', communityInfo:'<b>커뮤니티 제보:</b> 이 데모 브라우저에만 저장되며 서버로 전송되지 않습니다.', scoreInfo:'<b>가중치 점수:</b> 조명 30%, 영업 중인 시설 25%, 주요 도로 대리 지표 20%, 최근 제보 25%. 데이터가 없다고 안전하거나 어둡다는 뜻은 아닙니다. 데이터 범위는 별도로 표시됩니다.', seoulInfo:'<b>서울:</b> 아래에서 공식 안심 귀갓길/시설 레이어를 GeoJSON으로 불러올 수 있습니다. 확인된 공식 파일은 2023년에 마지막으로 갱신되었습니다.', seoulRouteLink:'서울 안심 귀갓길 데이터 ↗', seoulFacilityLink:'서울 안심 귀갓길 시설 데이터 ↗', loadGeoJSON:'공식 GeoJSON 레이어 불러오기', disclaimer:'OSM © OpenStreetMap contributors · 지도 타일 © OSMF. 커뮤니티 데이터는 누락되거나 오래되었을 수 있습니다. 경로 정보는 추정치이며 안전을 보장하지 않습니다.', footer:'GIL · ITB × CAU 해커톤 프로토타입',
    statusReady:'지도 준비 완료 · OSM', statusOSMLive:'실시간 OSM 데이터 · 경로 주변', statusOSMCache:'캐시된 OSM 데이터 · 최대 6시간 전', statusFetching:'도보 경로 계산 중…', statusFeatures:'경로 주변 OSM 정보 불러오는 중…', statusRoutesConnected:'경로 데이터에 연결할 수 없습니다', statusLayer:'로컬 레이어 불러옴 · {count}개 항목', statusRoadCount:'실시간 OSM · 도로 구간 {count}개 확인',
    mapStart:'출발', mapEnd:'도착', mapPoint:'지도에서 선택한 지점', mapPointKo:'지도에서 선택한 지점', routeUpdated:'도착 지점을 변경했습니다.', chooseDestination:'지도에서 도착 지점을 선택하세요.', locationSearching:'위치 확인 중…', locationDenied:'위치 권한이 거부되었습니다.', locationUnavailable:'현재 위치를 가져올 수 없습니다.', noGeolocation:'이 브라우저에서는 위치 기능을 사용할 수 없습니다.', locationUpdated:'출발 지점을 변경했습니다.',
    reportTapFirst:'지도에서 이 제보를 등록할 위치를 탭하세요.', reportTapPrompt:'지도에서 제보 위치를 탭하세요.', reportChosen:'선택한 위치 ({lat}, {lon}).', reportSaved:'이 데모 브라우저에 제보를 저장했습니다.', reportAdded:'이 기기에 제보를 추가했습니다.', reportUnverified:'커뮤니티 제보 · 미확인',
    routeFast:'최단 시간 경로', routeBest:'가장 안전한 경로 (추정)', sameRouteNote:'경로 서비스가 후보를 하나만 반환해 두 선택지가 같은 경로를 사용합니다.', scoreEstimate:'추정 점수', factorsAvailable:'데이터가 있는 항목 {percent}%', minutes:'{n}분', litSamples:'조명이 있다고 표시된 도로 표본 {percent}%', lightingUnknown:'조명 데이터 없음', shops24:'90m 내 24시간 영업으로 표시된 상점 {n}곳', nearbyFacilities:'인근 버스 정류장/경찰서 {n}곳', activeReports:'최근 커뮤니티 제보 {n}건', noReports:'최근 제보 없음', officialOverlap:'공식 레이어 경로와 가까운 구간 {percent}%',
    scoreFactorLighting:'조명', scoreFactorFacilities:'주변 시설', scoreFactorRoad:'도로 유형', scoreFactorReports:'커뮤니티 제보',
    errorRouting:'경로 서비스를 사용할 수 없습니다 ({status})', errorNoRoute:'선택한 지점 사이의 도보 경로를 찾을 수 없습니다.', errorOSM:'OSM 데이터를 불러오지 못했습니다 ({status})', errorRetry:'다시 시도하거나 다른 위치를 선택하세요.', errorGeoJSON:'GeoJSON 파일 형식이 올바르지 않습니다.', geoJSONLoaded:'GeoJSON 레이어를 불러왔습니다. 경로를 다시 비교하면 공식 경로와의 겹침을 확인할 수 있습니다.', geoJSONShown:'GeoJSON 레이어를 표시했습니다.',
    choosingMap:'지도를 탭하세요…', locationIsMe:'내 위치', callStatus:'{number} 전화하기', routeButtonBusy:'경로 및 데이터 불러오는 중…'
  }
};
let activeArea = 'bandung';
let startPoint, endPoint;
let map, routeLayers = [], reportLayers = [], sourceLayer = null, userMarker = null;
let officialData = null;
let currentLanguage = localStorage.getItem(LANGUAGE_KEY) || 'id';
if (!COPY[currentLanguage]) currentLanguage = 'id';
let currentStatus = { key: 'statusReady', vars: {} };
let latestScoredRoutes = null;
let pickingDestination = false, reportMode = null;
let toastTimer;
const $ = (id) => document.getElementById(id);
const fmtDistance = (m) => m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;
const escapeHtml = (str) => String(str).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function t(key, vars = {}) {
  const text = COPY[currentLanguage]?.[key] ?? COPY.en[key] ?? key;
  return text.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? '');
}
function applyLocale() {
  document.documentElement.lang = currentLanguage;
  document.title = currentLanguage === 'ko' ? 'GIL — 안심 귀갓길' : currentLanguage === 'en' ? 'GIL — Informed walking routes' : 'GIL — Rute jalan kaki yang lebih terinformasi';
  document.querySelector('meta[name="description"]').content = t('metaDescription');
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-html]').forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
  $('hero-title').innerHTML = t('heroTitle'); $('safety-note').innerHTML = t('safetyNote');
  $('pilot-city').options[0].textContent = t('areaBandung'); $('pilot-city').options[1].textContent = t('areaSeoul');
  $('language-select').value = currentLanguage;
  setPointLabels(); $('sos-call').textContent = `${t('call')} ${AREAS[activeArea].emergency}`;
  if (pickingDestination) $('pick-destination').textContent = t('choosingMap');
  if (reportMode) $('report-placement').textContent = t('reportTapPrompt');
  $('cancel-report').textContent = t('cancel');
  setStatus(currentStatus.key, currentStatus.vars);
  drawReports();
  if (map) drawEndpoints();
  if (latestScoredRoutes) renderRoutes(latestScoredRoutes, false);
}

function toast(message) {
  const el = $('toast'); el.textContent = message; el.classList.add('visible');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('visible'), 2800);
}
function setStatus(key, vars = {}) { currentStatus = { key, vars }; $('map-status').textContent = t(key, vars); }
function saveReports(reports) { localStorage.setItem(STORAGE_KEY, JSON.stringify(reports)); }
function loadReports() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; } }
function setPointLabels() { $('start-label').textContent = startPoint.labelKey ? t(startPoint.labelKey) : startPoint.label; $('end-label').textContent = endPoint.labelKey ? t(endPoint.labelKey) : endPoint.label; }

function initMap() {
  map = L.map('map', { zoomControl: false, preferCanvas: true }).setView(AREAS[activeArea].center, AREAS[activeArea].zoom);
  L.control.zoom({ position: 'bottomright' }).addTo(map);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
  }).addTo(map);
  map.on('click', (event) => {
    const point = { lat: event.latlng.lat, lon: event.latlng.lng };
    if (reportMode) { createReport(reportMode, point); return; }
    if (pickingDestination) {
      endPoint = { ...point, labelKey: 'mapPoint' }; setPointLabels(); pickingDestination = false;
      $('pick-hint').hidden = true; $('pick-destination').textContent = t('pickMap'); toast(t('routeUpdated')); return;
    }
  });
  drawReports(); setStatus('statusReady');
}

function clearRoutes() { routeLayers.forEach((layer) => map.removeLayer(layer)); routeLayers = []; }
function drawEndpoints() {
  if (window.endpointLayer) map.removeLayer(window.endpointLayer);
  window.endpointLayer = L.layerGroup([
    L.circleMarker([startPoint.lat, startPoint.lon], { radius: 7, color: '#17301d', weight: 2, fillColor: '#b6f36b', fillOpacity: 1 }).bindTooltip(t('mapStart')),
    L.circleMarker([endPoint.lat, endPoint.lon], { radius: 7, color: '#38291d', weight: 2, fillColor: '#f2a56d', fillOpacity: 1 }).bindTooltip(t('mapEnd'))
  ]).addTo(map);
}

function reportsForArea() { return loadReports().filter((r) => r.area === activeArea); }
function drawReports() {
  reportLayers.forEach((layer) => map.removeLayer(layer)); reportLayers = [];
  const reports = reportsForArea();
  reports.forEach((report) => {
    const icon = L.divIcon({ className: '', html: '<div class="report-pin"></div>', iconSize: [17,17], iconAnchor: [8,8] });
    const reportKey = `report${report.type[0].toUpperCase()}${report.type.slice(1)}`;
    const marker = L.marker([report.lat, report.lon], { icon }).bindPopup(`<b>${escapeHtml(t(reportKey))}</b><br><small>${new Date(report.createdAt).toLocaleString(currentLanguage === 'ko' ? 'ko-KR' : currentLanguage === 'en' ? 'en-US' : 'id-ID')}</small><br><small>${escapeHtml(t('reportUnverified'))}</small>`).addTo(map);
    reportLayers.push(marker);
  });
  $('report-count').textContent = reports.length;
}

function haversine(a, b) {
  const R = 6371000, rad = Math.PI / 180;
  const dLat = (b[1] - a[1]) * rad, dLon = (b[0] - a[0]) * rad;
  const x = Math.sin(dLat/2)**2 + Math.cos(a[1]*rad)*Math.cos(b[1]*rad)*Math.sin(dLon/2)**2;
  return 2 * R * Math.asin(Math.sqrt(x));
}
function distanceToSegment(point, a, b) {
  const latScale = 111320, lonScale = 111320 * Math.cos(point[1] * Math.PI / 180);
  const px = point[0] * lonScale, py = point[1] * latScale;
  const ax = a[0] * lonScale, ay = a[1] * latScale, bx = b[0] * lonScale, by = b[1] * latScale;
  const dx = bx - ax, dy = by - ay, denom = dx*dx + dy*dy;
  const t = denom ? Math.max(0, Math.min(1, ((px-ax)*dx + (py-ay)*dy) / denom)) : 0;
  return Math.hypot(px - (ax + t*dx), py - (ay + t*dy));
}
function pointToRouteDistance(point, coords) {
  let min = Infinity;
  for (let i = 1; i < coords.length; i++) min = Math.min(min, distanceToSegment(point, coords[i-1], coords[i]));
  return min;
}
function sampleLine(coords, targetMeters = 60) {
  const samples = [];
  let nextAt = 0, walked = 0;
  for (let i = 1; i < coords.length; i++) {
    const seg = haversine(coords[i-1], coords[i]);
    const count = Math.max(1, Math.ceil(seg / targetMeters));
    for (let j = 0; j < count; j++) {
      if (walked + seg * j / count >= nextAt) {
        const t = j / count;
        samples.push([coords[i-1][0] + (coords[i][0]-coords[i-1][0])*t, coords[i-1][1] + (coords[i][1]-coords[i-1][1])*t]);
        nextAt += targetMeters;
      }
    }
    walked += seg;
  }
  samples.push(coords[coords.length - 1]);
  return samples;
}
function routeBbox(coords, pad = 0.004) {
  const lons = coords.map((p) => p[0]), lats = coords.map((p) => p[1]);
  return { south: Math.min(...lats)-pad, west: Math.min(...lons)-pad, north: Math.max(...lats)+pad, east: Math.max(...lons)+pad };
}
function bboxKey(b) { return [b.south,b.west,b.north,b.east].map((v) => v.toFixed(3)).join(':'); }
function getCachedOSM(key) {
  try { const all = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}'); const row = all[key]; return row && Date.now()-row.time < 6*60*60*1000 ? row.data : null; } catch { return null; }
}
function cacheOSM(key, data) {
  try { const all = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}'); all[key] = { time: Date.now(), data }; localStorage.setItem(CACHE_KEY, JSON.stringify(all)); } catch { /* local cache is an optimization */ }
}

async function loadOSMForRoutes(routes) {
  const allCoords = routes.flatMap((route) => route.geometry.coordinates);
  const b = routeBbox(allCoords); const key = bboxKey(b); const cached = getCachedOSM(key);
  if (cached) { setStatus('statusOSMCache'); return cached; }
  const bbox = `${b.south},${b.west},${b.north},${b.east}`;
  const query = `[out:json][timeout:25];(way["highway"](${bbox});node["shop"="convenience"](${bbox});way["shop"="convenience"](${bbox});node["amenity"="police"](${bbox});way["amenity"="police"](${bbox});node["highway"="bus_stop"](${bbox});node["public_transport"="platform"](${bbox});node["highway"="street_lamp"](${bbox}););out body geom;`;
  const response = await fetch(OVERPASS_URL, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }, body: `data=${encodeURIComponent(query)}` });
  if (!response.ok) throw new Error(t('errorOSM', { status: response.status }));
  const data = await response.json(); cacheOSM(key, data); setStatus('statusOSMLive'); return data;
}

function coordinatesForElement(element) {
  if (element.type === 'node') return [element.lon, element.lat];
  if (element.geometry && element.geometry.length) return element.geometry.map((p) => [p.lon, p.lat]);
  return [];
}
function classifyData(elements) {
  const roads = [], shops = [], facilities = [];
  for (const el of elements || []) {
    const tags = el.tags || {}, coords = coordinatesForElement(el);
    if (tags.highway && coords.length > 1) roads.push({ coords, lit: tags.lit, highway: tags.highway });
    if (tags.shop === 'convenience' && coords.length) {
      const p = coords[0], hours = tags.opening_hours || '';
      shops.push({ point: p, hours, alwaysOpen: hours.trim() === '24/7', name: tags.name || 'Toko convenience' });
    }
    const kind = tags.amenity === 'police' ? 'Kantor polisi' : (tags.highway === 'bus_stop' || tags.public_transport === 'platform' ? 'Halte' : tags.highway === 'street_lamp' ? 'Lampu jalan' : null);
    if (kind && coords.length) facilities.push({ point: coords[0], kind });
  }
  return { roads, shops, facilities };
}
function scoreRoute(route, osm) {
  const routeCoords = route.geometry.coordinates, samples = sampleLine(routeCoords);
  let known = 0, litPositive = 0, major = 0;
  for (const sample of samples) {
    let nearest = null, dist = 35;
    for (const road of osm.roads) {
      const d = pointToRouteDistance(sample, road.coords);
      if (d < dist) { dist = d; nearest = road; }
    }
    if (nearest) {
      if (nearest.lit === 'yes' || nearest.lit === '24/7' || nearest.lit === 'automatic') { known++; litPositive++; }
      else if (nearest.lit === 'no' || nearest.lit === 'disused') { known++; }
      if (['primary','secondary','tertiary','trunk'].includes(nearest.highway)) major++;
    }
  }
  const lighting = known ? litPositive / known : null;
  const road = samples.length ? major / samples.length : null;
  const nearbyShops = osm.shops.filter((s) => s.alwaysOpen && pointToRouteDistance(s.point, routeCoords) < 90).length;
  const nearbyFacilities = osm.facilities.filter((f) => ['Halte','Kantor polisi'].includes(f.kind) && pointToRouteDistance(f.point, routeCoords) < 90).length;
  const facility = Math.min(1, (nearbyShops * 0.5 + nearbyFacilities) / Math.max(1, route.distance / 700));
  const reports = reportsForArea().filter((r) => Date.now() - r.createdAtMs < 30*24*60*60*1000 && pointToRouteDistance([r.lon,r.lat], routeCoords) < 80);
  const officialLines = (officialData?.features || []).flatMap((feature) => {
    const geometry = feature.geometry;
    if (!geometry) return [];
    if (geometry.type === 'LineString') return [geometry.coordinates];
    if (geometry.type === 'MultiLineString') return geometry.coordinates;
    return [];
  });
  let officialOverlap = null;
  if (officialLines.length) {
    const hit = samples.filter((sample) => officialLines.some((line) => pointToRouteDistance(sample, line) < 30)).length;
    officialOverlap = samples.length ? hit / samples.length : 0;
  }
  const reportScore = Math.max(0, 1 - reports.reduce((sum, r) => sum + (r.severity || 1), 0) * 0.30);
  const factors = [
    { key: 'lighting', value: lighting, label: t('scoreFactorLighting'), weight: WEIGHTS.lighting },
    { key: 'facilities', value: (osm.shops.length || osm.facilities.length) ? facility : null, label: t('scoreFactorFacilities'), weight: WEIGHTS.facilities },
    { key: 'road', value: osm.roads.length ? road : null, label: t('scoreFactorRoad'), weight: WEIGHTS.road },
    { key: 'reports', value: reportScore, label: t('scoreFactorReports'), weight: WEIGHTS.reports }
  ];
  const available = factors.filter((f) => f.value !== null);
  const weightSum = available.reduce((sum, f) => sum + f.weight, 0);
  const raw = weightSum ? available.reduce((sum, f) => sum + f.value*f.weight, 0) / weightSum : null;
  const score = raw === null ? null : Math.max(1, Math.min(5, Math.round(1 + raw*4)));
  const coverage = Math.round(available.reduce((sum, f) => sum + f.weight, 0) * 100);
  const reasonData = { lighting: lighting === null ? null : Math.round(lighting*100), nearbyShops, nearbyFacilities, reports: reports.length, officialOverlap: officialOverlap === null ? null : Math.round(officialOverlap*100) };
  return { ...route, score, coverage, reasonData, reports: reports.length, factors };
}

async function fetchRoutes() {
  const start = `${startPoint.lon},${startPoint.lat}`, end = `${endPoint.lon},${endPoint.lat}`;
  const url = `${ROUTING_BASE}/${start};${end}?alternatives=2&overview=full&geometries=geojson&steps=false`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(t('errorRouting', { status: response.status }));
  const data = await response.json();
  if (data.code !== 'Ok' || !data.routes || !data.routes.length) throw new Error(t('errorNoRoute'));
  return data.routes;
}
function routeReasons(route) {
  const d = route.reasonData;
  const reasons = [d.lighting === null ? t('lightingUnknown') : t('litSamples', { percent: d.lighting }), t('shops24', { n: d.nearbyShops })];
  if (d.nearbyFacilities) reasons.push(t('nearbyFacilities', { n: d.nearbyFacilities }));
  reasons.push(d.reports ? t('activeReports', { n: d.reports }) : t('noReports'));
  if (d.officialOverlap > 0) reasons.push(t('officialOverlap', { percent: d.officialOverlap }));
  return reasons;
}
function renderRoutes(routes, fitMap = true) {
  clearRoutes();
  const fastest = [...routes].sort((a,b) => a.duration-b.duration)[0];
  const safest = [...routes].filter((r) => r.score !== null).sort((a,b) => b.score-a.score)[0] || fastest;
  const samePath = safest === fastest || JSON.stringify(safest.geometry.coordinates) === JSON.stringify(fastest.geometry.coordinates);
  const ordered = [{ ...fastest, role: 'fastest', samePath }, { ...safest, role: 'safest', samePath }];
  ordered.forEach((route, idx) => {
    const line = L.geoJSON(route.geometry, { style: { color: route.role === 'fastest' ? '#f2a56d' : '#53c98c', weight: route.role === 'fastest' ? 5 : 6, opacity: route.role === 'fastest' ? .83 : .96, dashArray: route.role === 'fastest' ? '8 7' : null } }).addTo(map);
    line.bindPopup(`<b>${route.role === 'fastest' ? t('routeFast') : t('routeBest')}</b><br>${fmtDistance(route.distance)} · ${escapeHtml(t('minutes', { n: Math.round(route.duration/60) }))}${route.score === null ? '' : `<br>${escapeHtml(t('scoreEstimate'))} ${route.score}/5`}`);
    routeLayers.push(line);
  });
  drawEndpoints();
  const bounds = L.featureGroup([...routeLayers]).getBounds(); if (fitMap && bounds.isValid()) map.fitBounds(bounds.pad(.16), { maxZoom: 17 });
  $('route-results').hidden = false;
  $('route-cards').innerHTML = ordered.map((route, idx) => {
    const isSafe = route.role === 'safest';
    const scoreText = route.score === null ? '—' : `${route.score}/5`;
    const roleLabel = isSafe ? t('routeBest') : t('routeFast');
    const reasonText = routeReasons(route).map(escapeHtml).join(' · ');
    return `<article class="route-card ${isSafe ? 'selected' : ''}" data-route-index="${idx}"><div class="route-card-top"><div class="route-name"><span class="route-icon ${isSafe ? '' : 'fast'}">${isSafe ? '✦' : '↗'}</span>${escapeHtml(roleLabel)}</div><div class="route-score"><strong>${scoreText}</strong><small>${escapeHtml(t('scoreEstimate'))}</small></div></div><div class="route-metrics"><strong>${escapeHtml(t('minutes', { n: Math.round(route.duration/60) }))}</strong><span>${fmtDistance(route.distance)}</span><span class="route-score"><small>${escapeHtml(t('factorsAvailable', { percent: route.coverage }))}</small></span></div><div class="route-reasons">${reasonText}</div>${route.samePath && isSafe ? `<div class="same-route-note">${escapeHtml(t('sameRouteNote'))}</div>` : ''}<div class="coverage-bar"><span style="width:${route.coverage}%"></span></div></article>`;
  }).join('');
  document.querySelectorAll('.route-card').forEach((card, idx) => card.addEventListener('click', () => {
    document.querySelectorAll('.route-card').forEach((c) => c.classList.remove('selected')); card.classList.add('selected');
    routeLayers.forEach((layer, layerIdx) => layer.setStyle({ weight: idx === layerIdx ? 7 : 4, opacity: idx === layerIdx ? 1 : .55 }));
  }));
}

async function compareRoutes() {
  const button = $('find-routes'); button.disabled = true; button.querySelector('span:first-child').textContent = t('routeButtonBusy');
  $('route-results').hidden = true; setStatus('statusFetching');
  try {
    const candidates = await fetchRoutes(); setStatus('statusFeatures');
    const raw = await loadOSMForRoutes(candidates); const classified = classifyData(raw.elements);
    const scored = candidates.map((route) => scoreRoute(route, classified));
    latestScoredRoutes = scored; renderRoutes(scored); setStatus('statusRoadCount', { count: classified.roads.length });
    $('route-results').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    console.error(error); setStatus('statusRoutesConnected'); toast(`${error.message} ${t('errorRetry')}`);
  } finally { button.disabled = false; button.querySelector('span:first-child').textContent = t('compareRoutes'); }
}

function updateReportPrompt() {
  $('report-placement').textContent = reportMode ? t('reportTapPrompt') : t('reportDefault');
}
function createReport(type, point = null) {
  if (!point) { reportMode = type; map.getContainer().classList.add('placing-report'); updateReportPrompt(); $('cancel-report').hidden = false; toast(t('reportTapFirst')); map.getContainer().scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
  const reportKey = `report${type[0].toUpperCase()}${type.slice(1)}`;
  const report = { id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), title: t(reportKey), type, severity: type === 'harassment' ? 1.4 : 1, lat: point.lat, lon: point.lon, area: activeArea, createdAt: new Date().toISOString(), createdAtMs: Date.now() };
  const rows = loadReports(); rows.push(report); saveReports(rows); reportMode = null; map.getContainer().classList.remove('placing-report'); $('cancel-report').hidden = true; $('report-placement').textContent = t('reportSaved'); drawReports(); toast(t('reportAdded'));
}

function changeArea(area) {
  activeArea = area; const preset = AREAS[area]; startPoint = { ...preset.start }; endPoint = { ...preset.end }; setPointLabels();
  $('sos-call').href = `tel:${preset.emergency}`; $('sos-call').textContent = t('callStatus', { number: preset.emergency });
  clearRoutes(); latestScoredRoutes = null; $('route-results').hidden = true; map.setView(preset.center, preset.zoom); drawEndpoints(); drawReports(); setStatus('statusReady');
}
function chooseDestination() { pickingDestination = !pickingDestination; $('pick-hint').hidden = !pickingDestination; $('pick-destination').textContent = pickingDestination ? t('choosingMap') : t('pickMap'); if (pickingDestination) toast(t('chooseDestination')); }
function useMyLocation() {
  if (!navigator.geolocation) { toast(t('noGeolocation')); return; }
  $('use-location').textContent = t('locationSearching');
  navigator.geolocation.getCurrentPosition((position) => {
    startPoint = { lat: position.coords.latitude, lon: position.coords.longitude, labelKey: 'locationIsMe' }; setPointLabels();
    map.setView([startPoint.lat, startPoint.lon], 16); if (userMarker) map.removeLayer(userMarker);
    userMarker = L.circleMarker([startPoint.lat,startPoint.lon], { radius: 7,color:'#17301d',weight:2,fillColor:'#81d9f1',fillOpacity:1 }).addTo(map).bindTooltip(t('locationIsMe'));
    $('use-location').textContent = t('myLocation'); drawEndpoints(); toast(t('locationUpdated'));
  }, (error) => { $('use-location').textContent = t('myLocation'); toast(error.code === 1 ? t('locationDenied') : t('locationUnavailable')); }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 });
}

function loadGeoJSONFile(file) {
  if (!file) return;
  const reader = new FileReader(); reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data || !Array.isArray(data.features)) throw new Error('Expected FeatureCollection');
      officialData = data;
      if (sourceLayer) map.removeLayer(sourceLayer);
      sourceLayer = L.geoJSON(data, { style: { color: '#b6f36b', weight: 3, opacity: .75 }, pointToLayer: (_, latlng) => L.circleMarker(latlng, { radius: 5, color: '#254329', fillColor: '#b6f36b', fillOpacity: .9 }) });
      sourceLayer.addTo(map); if (sourceLayer.getBounds().isValid()) map.fitBounds(sourceLayer.getBounds().pad(.1));
      setStatus('statusLayer', { count: data.features.length }); toast(t('geoJSONLoaded'));
    } catch { toast(t('errorGeoJSON')); }
  }; reader.readAsText(file);
}

function boot() {
  startPoint = { ...AREAS[activeArea].start }; endPoint = { ...AREAS[activeArea].end };
  initMap(); setPointLabels(); drawEndpoints();
  $('find-routes').addEventListener('click', compareRoutes);
  $('pick-destination').addEventListener('click', chooseDestination);
  $('use-location').addEventListener('click', useMyLocation);
  $('pilot-city').addEventListener('change', (e) => changeArea(e.target.value));
  $('center-map').addEventListener('click', () => map.setView(AREAS[activeArea].center, AREAS[activeArea].zoom));
  document.querySelectorAll('[data-report]').forEach((button) => button.addEventListener('click', () => createReport(button.dataset.report)));
  $('cancel-report').addEventListener('click', () => { reportMode = null; map.getContainer().classList.remove('placing-report'); $('cancel-report').hidden = true; $('report-placement').textContent = t('reportDefault'); });
  $('geojson-upload').addEventListener('change', (e) => loadGeoJSONFile(e.target.files[0]));
  $('language-select').addEventListener('change', (e) => {
    currentLanguage = e.target.value;
    localStorage.setItem(LANGUAGE_KEY, currentLanguage);
    applyLocale();
  });
  applyLocale();
}
document.addEventListener('DOMContentLoaded', boot);
