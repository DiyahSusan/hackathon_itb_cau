# GIL prototype

Mobile-first prototype for comparing walking route candidates with an explainable, rule-based estimate.

The interface supports Bahasa Indonesia, English, and Korean. The language choice is remembered in the browser.

## Run locally

Serve this directory over localhost (browser geolocation requires a secure context):

```powershell
python -m http.server 4173
```

Open `http://localhost:4173` on the development machine. For phone access, deploy to an HTTPS static host and open its link/QR code on the phone.

## Data flow

- Walking route candidates: FOSSGIS OpenStreetMap Germany public OSRM demo, foot profile.
- Street and point features: one Overpass query for the route bounding box, cached locally for six hours.
- Community reports: browser local storage for this prototype; not synchronized between phones.
- Seoul official route / safety facility data: load a locally converted GeoJSON file from the “Sumber & metode” section. The source page provides SHP downloads; convert to WGS84 GeoJSON before loading.

## Score model

Lighting 30%, 24/7 nearby facilities 25%, major-road proxy 20%, community reports 25%. Missing OSM tags are treated as unknown, not as “dark” or “unsafe”; the card reports the proportion of scoring weight available. The “major road” and facility factors are rough prototypes, not validated safety evidence. The score is an estimate and not a guarantee of safety.

## Prototype limitations

- No user accounts or cross-device live location.
- Reports are local to the current browser and are not verified.
- Public OSM demo services have no uptime guarantee and are for reasonable demo use; a production version needs a dependable routing and data provider.
- The UI country selector changes the pilot location and emergency dial link; it does not change the current browser locale.
- SOS starts a phone call. It does not send location to police or contacts.
