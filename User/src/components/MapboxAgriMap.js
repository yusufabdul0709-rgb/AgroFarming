import React, { useMemo } from 'react';
import { StyleSheet, View, Text, Platform, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';

const MAPBOX_TOKEN = 
  process.env.EXPO_PUBLIC_MAPBOX_TOKEN || 
  process.env.VITE_MAPBOX_TOKEN || 
  process.env.MAPBOX_TOKEN || '';

export default function MapboxAgriMap({ 
  latitude = 17.6868, 
  longitude = 83.2185, 
  title = "Registered Farm Location",
  locationName = "",
  height = 220,
  interactive = true,
  onExpand = null
}) {
  // Construct self-contained Mapbox GL JS HTML payload with 3D Terrain and 3D Buildings
  const htmlContent = useMemo(() => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
      <title>ApnaKissan Agriculture Map</title>
      <script src="https://api.mapbox.com/mapbox-gl-js/v3.1.0/mapbox-gl.js"></script>
      <link href="https://api.mapbox.com/mapbox-gl-js/v3.1.0/mapbox-gl.css" rel="stylesheet" />
      <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #111; color: #fff; }
        #map { position: absolute; top: 0; bottom: 0; width: 100%; height: 100%; }
        
        .map-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(16, 37, 24, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(76, 175, 80, 0.3);
          color: #e8f5e9;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .controls-panel {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 10;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .btn-style {
          background: rgba(0, 0, 0, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          padding: 5px 10px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-style:hover, .btn-style.active {
          background: #2e7d32;
          border-color: #4caf50;
        }

        .mapboxgl-popup-content {
          background: rgba(15, 23, 18, 0.95) !important;
          color: #fff !important;
          border-radius: 14px !important;
          padding: 10px 14px !important;
          border: 1px solid rgba(76, 175, 80, 0.4);
          box-shadow: 0 8px 24px rgba(0,0,0,0.4) !important;
        }
        .mapboxgl-popup-anchor-top .mapboxgl-popup-tip { border-bottom-color: rgba(15, 23, 18, 0.95) !important; }
        .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip { border-top-color: rgba(15, 23, 18, 0.95) !important; }
        
        .pulse-marker {
          width: 22px;
          height: 22px;
          background: rgba(76, 175, 80, 0.9);
          border: 2px solid #ffffff;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 15px rgba(76, 175, 80, 0.8);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
          70% { box-shadow: 0 0 0 14px rgba(76, 175, 80, 0); }
          100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      
      <div class="map-badge">
        <span>🌱</span>
        <span>ApnaKissan 3D Satellite Map</span>
      </div>

      <div class="controls-panel">
        <button class="btn-style active" id="btn-sat" onclick="switchStyle('mapbox://styles/mapbox/satellite-streets-v12', 'btn-sat')">Satellite 3D</button>
        <button class="btn-style" id="btn-out" onclick="switchStyle('mapbox://styles/mapbox/outdoors-v12', 'btn-out')">Outdoors</button>
        <button class="btn-style" onclick="recenterMap()">Center 📍</button>
      </div>

      <script>
        const MAPBOX_TOKEN = "${MAPBOX_TOKEN}";
        mapboxgl.accessToken = MAPBOX_TOKEN;

        const centerCoords = [${longitude}, ${latitude}];

        const map = new mapboxgl.Map({
          container: "map",
          style: "mapbox://styles/mapbox/satellite-streets-v12",
          center: centerCoords,
          zoom: 16.2,
          pitch: 70,
          bearing: -20,
          antialias: true
        });

        // Add 3D Terrain & 3D Buildings on Load
        map.on('load', () => {
          // Step 9: Add 3D Terrain
          if (!map.getSource('mapbox-dem')) {
            map.addSource('mapbox-dem', {
              'type': 'raster-dem',
              'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
              'tileSize': 512,
              'maxzoom': 14
            });
            map.setTerrain({
              'source': 'mapbox-dem',
              'exaggeration': 1.5
            });
          }

          // Step 10: Add 3D Buildings
          const layers = map.getStyle().layers;
          const labelLayerId = layers ? layers.find(layer => layer.type === 'symbol')?.id : undefined;

          if (!map.getLayer('3d-buildings')) {
            map.addLayer({
              'id': '3d-buildings',
              'source': 'composite',
              'source-layer': 'building',
              'filter': ['==', 'extrude', 'true'],
              'type': 'fill-extrusion',
              'minzoom': 15,
              'paint': {
                'fill-extrusion-color': '#a5d6a7',
                'fill-extrusion-height': ['get', 'height'],
                'fill-extrusion-base': ['get', 'min_height'],
                'fill-extrusion-opacity': 0.6
              }
            }, labelLayerId);
          }

          // Add Custom Animated Marker for User Farm Location
          const el = document.createElement('div');
          el.className = 'pulse-marker';

          const popupContent = \`
            <div style="font-size:12px; font-weight:800; color:#81c784; margin-bottom:4px;">🌾 ${title}</div>
            <div style="font-size:11px; color:#e0e0e0;">${locationName ? locationName + '<br/>' : ''}Lat: ${latitude.toFixed(5)}° N, Lon: ${longitude.toFixed(5)}° E</div>
          \`;

          new mapboxgl.Marker(el)
            .setLngLat(centerCoords)
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent))
            .addTo(map);
        });

        function switchStyle(styleUrl, btnId) {
          map.setStyle(styleUrl);
          document.querySelectorAll('.btn-style').forEach(b => b.classList.remove('active'));
          if (document.getElementById(btnId)) {
            document.getElementById(btnId).classList.add('active');
          }
          map.once('style.load', () => {
            // Re-apply terrain after style change
            if (!map.getSource('mapbox-dem')) {
              map.addSource('mapbox-dem', {
                'type': 'raster-dem',
                'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
                'tileSize': 512,
                'maxzoom': 14
              });
            }
            map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
          });
        }

        function recenterMap() {
          map.flyTo({
            center: centerCoords,
            zoom: 16.5,
            pitch: 70,
            bearing: -20,
            duration: 1500
          });
        }
      </script>
    </body>
    </html>
    `;
  }, [latitude, longitude, title, locationName]);

  return (
    <View style={[styles.container, { height }]}>
      {Platform.OS === 'web' ? (
        <iframe
          title="Mapbox Agriculture Map"
          srcDoc={htmlContent}
          style={styles.iframe}
          frameBorder="0"
          scrolling="no"
        />
      ) : (
        <WebView
          originWhitelist={['*']}
          source={{ html: htmlContent }}
          style={styles.webview}
          scrollEnabled={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      )}

      {onExpand && (
        <TouchableOpacity style={styles.expandBtn} onPress={onExpand}>
          <Text style={styles.expandBtnText}>⤢ Expand Map</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1b2e1b',
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.2)'
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
    borderRadius: 20
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  expandBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(27, 46, 27, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.4)'
  },
  expandBtnText: {
    color: '#a5d6a7',
    fontSize: 11,
    fontWeight: '700'
  }
});
