# Map Guide

The map is the home page of GEO-TREES (`/`). It is a full-screen interactive geospatial map powered by MapLibre GL. No login is required to view the map; however, downloading data requires authentication.

## Navigating to the Map

Click the **Geo Trees** logo or the **Map** link in the top navigation bar from any page. The map fills the entire browser window.

## Panning and Zooming

- **Pan**: Click and drag anywhere on the map to move it.
- **Zoom in**: Click the **+** button in the bottom-left corner, scroll up with the mouse wheel, or pinch out on a touchpad.
- **Zoom out**: Click the **-** button in the bottom-left corner, scroll down with the mouse wheel, or pinch in on a touchpad.

## Map Controls

Four icon buttons appear on the right side of the map and three utility controls appear on the bottom-left.

### Top-right controls (panels)

Clicking any of these buttons opens a panel. Clicking the same button again, or opening a different panel, closes the current panel.

| Icon | Title | What it does |
|------|-------|--------------|
| Map icon | Base Maps | Switch the background basemap |
| Layers icon | Overlay Layers | Show or hide data layers and adjust their opacity |
| Download icon | Download Data | Download plot data (requires login) |

### Bottom-right control

| Icon | Title | What it does |
|------|-------|--------------|
| Book icon | Legend | Shows the legend for currently visible layers (open by default) |

### Bottom-left controls

| Control | What it does |
|---------|--------------|
| + | Zoom in |
| - | Zoom out |
| Globe | Toggle 3D globe view / flat 2D Mercator view |
| Scale bar | Displays the current map scale (display only) |

## Switching Basemaps

1. Click the **Map** icon button (top-right).
2. A panel opens showing a 3x2 grid of basemap thumbnails with labels.
3. Click any thumbnail to switch the background map. Available basemaps are:

| Label | Source |
|-------|--------|
| Light | Carto Positron |
| Dark | Carto Dark Matter |
| Streets | OpenStreetMap |
| Satellite | Esri World Imagery |
| Google | Google Roads |
| Google Sat | Google Satellite |

The default basemap when you first open the map is **Satellite**. Your 3D/2D preference is saved across sessions in your browser.

## Overlay Layers Panel

1. Click the **Layers** icon button (top-right).
2. The **Overlay Layers** panel appears showing all available data layers grouped by category.
3. Check the checkbox next to a layer name to show it on the map. Uncheck it to hide it.
4. When a layer is checked, an opacity slider appears beneath it. Drag the slider from 0 (invisible) to 100 (fully opaque) to control how transparent the layer appears. The default opacity is 70.

### Supported layer types

The system supports four types of layers that an administrator can configure:

- **WMS** — raster tiles served from a Web Map Service endpoint.
- **Backend GeoJSON** — point data served from the GEO-TREES backend. The three built-in sources are:
  - `plot-geojson` — tree plot locations (green circles).
  - `external-data-geojson` — BRM field sites (coloured by status).
  - `als-geojson` — Airborne Laser Scanning survey positions (green circles with clustering at lower zoom levels).
- **External GeoJSON** — point data fetched directly from an external URL (yellow circles).
- **TileJSON** — vector tiles from a TileJSON endpoint (blue circles).

## The Legend

The Legend panel is open by default in the bottom-right corner.

- When a BRM Sites layer is visible, the legend shows a colour-coded status count:
  - Green circle — Completed
  - Yellow circle — Ongoing
  - Grey circle — Planned
- For other visible layers, the legend shows either a custom legend image (if configured) or a default green gradient bar labelled Low to High.

## Clicking Features

Clicking on a visible data point opens a popup with information about that feature:

- For BRM sites, the popup shows the site name, status, and additional fields from the dataset.
- For other GeoJSON layers, the popup shows the feature name (or Plot ID) and up to six additional properties.

Click anywhere else on the map or click the X on the popup to dismiss it.

## 3D Globe View

Click the **Globe** button (bottom-left) to switch the map projection from flat 2D Mercator to a 3D rotating globe. Click it again to return to 2D. The current preference is saved in your browser and restored the next time you open the map.

In 3D mode you can tilt and rotate the globe by right-clicking and dragging (or using a two-finger gesture on a touchpad).

## Downloading Data

Downloading tree plot data requires you to be logged in.

1. Click the **Download** icon button (top-right). If you are not logged in, the panel shows a Login button — click it to authenticate first.
2. Fill in the required fields:
   - **Name** — your full name (pre-filled from your account if available).
   - **Email** — your email address (pre-filled if available).
   - **Country** — choose a specific country or "All Countries".
   - **Version** — select the dataset version you need.
   - **Format** — choose CSV (ZIP) or GeoJSON (ZIP).
   - **Purpose of Download** — describe why you are downloading the data (minimum 10 characters).
3. Check the acknowledgment checkbox to confirm you will cite GEO-TREES in any resulting publications.
4. Click **Download**. The file is downloaded to your computer as a ZIP archive.

## Managing Map Layers (Administrators)

Administrators can add, edit, and remove the layers that appear in the Overlay Layers panel. Navigate to **Admin > Map Layers** (`/admin/map-layers`).

### Adding a layer

1. Click **Add Layer**.
2. Optionally use a **Quick add** preset (BRM Sites or ALS Data) to pre-fill the form.
3. Fill in the required fields:
   - **Name** (required) — the label shown in the Overlay Layers panel.
   - **Type** — WMS, BackendGeoJson, ExternalGeoJson, or TileJSON.
   - **URL** — service URL (required for WMS, ExternalGeoJson, TileJSON types).
   - **Source Endpoint** — for BackendGeoJson layers, choose from `plot-geojson`, `external-data-geojson` (BRM Sites), or `als-geojson` (ALS Data).
   - **WMS Layers / Format** — WMS-specific settings (shown only for WMS type).
   - **Legend URL** — optional URL to a legend image for this layer.
   - **Group Name** (required) — layers are grouped under this heading in the panel.
   - **Order** — lower numbers appear first within their group.
   - **Visible by Default** — whether the layer is turned on when the map first loads.
   - **Attribution** — credit text shown on the map.
4. Click **Create** to save.

### Editing or deleting a layer

In the Map Layers list, click the three-dot menu on any row and choose **Edit** or **Delete**.
