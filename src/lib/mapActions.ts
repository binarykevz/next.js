import L from "leaflet";
import { CONFIG } from "./config";
import { useVoyageStore } from "./store";
import { fetchCountryMedia, removeDuplicates } from "./api";

let worldMap: L.Map | null = null;
let countriesLayer: L.GeoJSON | null = null;
let selectedLayer: L.Layer | null = null;
let shipMarker: L.Marker | null = null;
let routeLine: L.Polyline | null = null;
let destinationMarker: L.CircleMarker | null = null;
let voyageAnimation: number | null = null;
let countries: any[] = [];

const toRad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

function haversine(a: L.LatLng, b: L.LatLng) {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function interpolateGreatCircle(start: L.LatLng, end: L.LatLng, t: number): L.LatLng {
  const lat1 = toRad(start.lat), lon1 = toRad(start.lng);
  const lat2 = toRad(end.lat), lon2 = toRad(end.lng);
  const x1 = Math.cos(lat1) * Math.cos(lon1), y1 = Math.cos(lat1) * Math.sin(lon1), z1 = Math.sin(lat1);
  const x2 = Math.cos(lat2) * Math.cos(lon2), y2 = Math.cos(lat2) * Math.sin(lon2), z2 = Math.sin(lat2);
  const dot = Math.max(-1, Math.min(1, x1 * x2 + y1 * y2 + z1 * z2));
  const angle = Math.acos(dot);
  if (Math.abs(angle) < 1e-6) return L.latLng(start.lat + (end.lat - start.lat) * t, start.lng + (end.lng - start.lng) * t);
  const sinA = Math.sin(angle);
  const a = Math.sin((1 - t) * angle) / sinA;
  const b = Math.sin(t * angle) / sinA;
  const x = a * x1 + b * x2, y = a * y1 + b * y2, z = a * z1 + b * z2;
  return L.latLng(toDeg(Math.atan2(z, Math.sqrt(x * x + y * y))), toDeg(Math.atan2(y, x)));
}

function createShipIcon() {
  return L.divIcon({
    className: "ancient-ship-marker",
    html: `
      <div style="position:relative;width:82px;height:82px;transform:translate(-50%,-50%);pointer-events:none;">
        <div style="position:absolute;left:9px;right:9px;bottom:20px;height:17px;background:linear-gradient(#75411e,#2e1609);border:2px solid #d2a153;border-radius:0 0 50% 50%;box-shadow:0 3px 5px rgba(0,0,0,.55);"></div>
        <div style="position:absolute;left:39px;bottom:32px;width:4px;height:38px;background:#6e431d;box-shadow:1px 0 0 #d1a154;"></div>
        <div style="position:absolute;left:22px;bottom:46px;width:37px;height:25px;background:linear-gradient(145deg,#ead294,#a87434);clip-path:polygon(50% 0,100% 100%,0 100%);border:1px solid #684018;transform-origin:bottom center;animation:shipSail 2.8s ease-in-out infinite;"></div>
        <div style="position:absolute;left:42px;top:8px;width:17px;height:10px;background:#a63325;clip-path:polygon(0 0,100% 20%,75% 80%,0 100%);"></div>
        <div style="position:absolute;left:4px;right:4px;bottom:11px;height:8px;background:radial-gradient(ellipse,rgba(190,230,231,.65),transparent 70%);animation:wakePulse 1.5s ease-in-out infinite;"></div>
      </div>`,
    iconSize: [82, 82],
    iconAnchor: [41, 41],
  });
}

async function openDiscoveryFor(countryName: string, latlng: L.LatLng) {
  try {
    const [images, videos] = await Promise.allSettled([
      fetchCountryMedia("image", countryName),
      fetchCountryMedia("video", countryName),
    ]);
    const combined = [
      ...(images.status === "fulfilled" ? images.value : []),
      ...(videos.status === "fulfilled" ? videos.value : []),
    ];
    const unique = removeDuplicates(combined);
    useVoyageStore.getState().openDiscovery(countryName, unique, [latlng.lat, latlng.lng]);
  } catch (e) {
    console.error(e);
  }
}

function selectCountry(countryName: string, layer: L.Layer, latlng: L.LatLng) {
  if (selectedLayer) (selectedLayer as any).setStyle(countryStyle());
  selectedLayer = layer;
  (layer as any).setStyle(selectedStyle());
  useVoyageStore.getState().setSelectedCountry(countryName);
  if (worldMap) worldMap.flyTo(latlng, Math.max(worldMap.getZoom(), 3), { duration: 1.1 });
  openDiscoveryFor(countryName, latlng);
  startVoyage(latlng, countryName);
}

const countryStyle = () => ({ color: "#765124", weight: 1, opacity: 0.85, fillColor: "#c7a766", fillOpacity: 0.34 });
const hoverStyle = () => ({ color: "#ffe3a0", weight: 2, fillColor: "#dcb96e", fillOpacity: 0.58 });
const selectedStyle = () => ({ color: "#6ee9ff", weight: 2.5, fillColor: "#3d8f99", fillOpacity: 0.55, dashArray: "5 4" });

function startVoyage(destination: L.LatLng, countryName: string) {
  if (!worldMap || !shipMarker) return;
  const start = shipMarker.getLatLng();
  const end = destination;
  if (voyageAnimation) cancelAnimationFrame(voyageAnimation);
  if (routeLine) routeLine.remove();
  if (destinationMarker) destinationMarker.remove();

  const distance = haversine(start, end);
  if (distance < 1) return;

  useVoyageStore.getState().incrementVoyage(distance);

  routeLine = L.polyline([], { color: "#62e9ff", weight: 2, opacity: 0.82, dashArray: "7 9" }).addTo(worldMap);
  destinationMarker = L.circleMarker(end, { radius: 7, color: "#ffe29b", weight: 2, fillColor: "#5de5ff", fillOpacity: 0.75 })
    .bindTooltip(countryName)
    .addTo(worldMap);

  const startedAt = performance.now();
  const duration = Math.min(CONFIG.SHIP_SPEED, Math.max(2500, distance * 3.5));

  function animate(now: number) {
    const elapsed = now - startedAt;
    const raw = Math.min(elapsed / duration, 1);
    const t = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
    const pos = interpolateGreatCircle(start, end, t);
    shipMarker!.setLatLng(pos);
    const points: L.LatLng[] = [];
    const segments = Math.max(2, Math.ceil(t * 80));
    for (let i = 0; i <= segments; i++) {
      const segT = t * (i / segments);
      points.push(interpolateGreatCircle(start, end, segT));
    }
    routeLine!.setLatLngs(points);
    if (raw < 1) voyageAnimation = requestAnimationFrame(animate);
    else {
      voyageAnimation = null;
      destinationMarker?.setStyle({ radius: 9, fillOpacity: 0.95 });
    }
  }
  voyageAnimation = requestAnimationFrame(animate);
}

export const mapActions = {
  initMap(container: HTMLElement) {
    if (worldMap) return worldMap;
    worldMap = L.map(container, {
      center: CONFIG.MAP_CENTER,
      zoom: CONFIG.INITIAL_ZOOM,
      minZoom: CONFIG.MIN_ZOOM,
      maxZoom: CONFIG.MAX_ZOOM,
      worldCopyJump: true,
      zoomControl: true,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(worldMap);

    shipMarker = L.marker(CONFIG.MAP_CENTER, { icon: createShipIcon(), zIndexOffset: 1000 }).addTo(worldMap);

    // Load countries
    fetch(CONFIG.GEOJSON_URL)
      .then((r) => r.json())
      .catch(() => fetch(CONFIG.GEOJSON_FALLBACK_URL).then((r) => r.json()))
      .then((geojson) => {
        countries = geojson.features
          .map((f: any) => ({ feature: f, name: f.properties?.NAME || f.properties?.ADMIN || "Unknown" }))
          .filter((c: any) => c.name !== "Unknown");

        countriesLayer = L.geoJSON(geojson, {
          style: countryStyle,
          onEachFeature: (feature, layer: any) => {
            const name = feature.properties?.NAME || "Unknown Land";
            layer.bindTooltip(name, { sticky: true, direction: "top", className: "country-tooltip" });
            layer.on({
              mouseover: () => { if (selectedLayer !== layer) layer.setStyle(hoverStyle()); },
              mouseout: () => { if (selectedLayer !== layer) layer.setStyle(countryStyle()); },
              click: (e: any) => selectCountry(name, layer, e.latlng),
            });
          },
        }).addTo(worldMap!);
        useVoyageStore.getState().setCountriesCount(countries.length);
      })
      .catch((e) => console.error("GeoJSON failed:", e));

    setTimeout(() => worldMap?.invalidateSize(true), 100);
    return worldMap;
  },

  searchCountry(query: string) {
    const normalized = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    if (!normalized) return;
    const match =
      countries.find((c) => c.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(normalized));
    if (!match) return;
    const layer = countriesLayer?.getLayers().find((l: any) => l.feature === match.feature) as any;
    if (!layer) return;
    const bounds = L.geoJSON(match.feature).getBounds();
    selectCountry(match.name, layer, bounds.getCenter());
  },

  resetVoyage() {
    if (voyageAnimation) { cancelAnimationFrame(voyageAnimation); voyageAnimation = null; }
    if (routeLine) { routeLine.remove(); routeLine = null; }
    if (destinationMarker) { destinationMarker.remove(); destinationMarker = null; }
    if (selectedLayer) { (selectedLayer as any).setStyle(countryStyle()); selectedLayer = null; }
    shipMarker?.setLatLng(CONFIG.MAP_CENTER);
    worldMap?.flyTo(CONFIG.MAP_CENTER, CONFIG.INITIAL_ZOOM, { duration: 1 });
    useVoyageStore.getState().resetVoyage();
  },

  getMap: () => worldMap,
};
