// src/components/NoitaMap.tsx
import { MapContainer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default icon issue with webpack/vite
// This ensures the marker icons are loaded correctly.
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41], // Half of icon width, full height
});

L.Marker.prototype.options.icon = DefaultIcon;

export function NoitaMap() {
  // The Noita world is huge, so you'll adjust this center point later.
  // Using [0, 0] as a starting default.
  const mapCenter: L.LatLngExpression = [0, 0];

  return (
    <MapContainer
      center={mapCenter}
      zoom={3} // Start with a zoom level that shows a good area
      scrollWheelZoom={true}
      style={{ height: '100vh', width: '100%' }} // Important: Map needs a defined size
      crs={L.CRS.Simple} // Use a simple coordinate system for a game map
    >
      {/* HERE is the change! We use our custom layer now.
       */}
      <CustomNoitaLayer />

      {/* You can still have other layers like markers on top */}
      <Marker position={[0, 0]}>
        <Popup>Test Marker</Popup>
      </Marker>

      {/* Example marker */}
      <Marker position={[0, 0]}>
        <Popup>
          The Holy Mountain <br /> (This is a test marker)
        </Popup>
      </Marker>
    </MapContainer>
  );
}

/**
 * MOCK FUNCTION: Simulates decompressing a Noita chunk.
 * * @param coords - The {x, y, z} coordinates of the chunk from Leaflet.
 * @returns A Promise that resolves with a Uint8ClampedArray of RGBA pixel data.
 */
export async function decompressChunk(coords: {
  x: number;
  y: number;
  z: number;
}): Promise<Uint8ClampedArray> {
  const chunkSize = 512;
  const pixelData = new Uint8ClampedArray(chunkSize * chunkSize * 4); // RGBA

  // Generate a unique color based on chunk coordinates to see that it's working
  const r = (coords.x * 3000) % 255;
  const g = (coords.y * 3000) % 255;
  const b = (coords.x * coords.y * 500) % 255;

  for (let i = 0; i < pixelData.length; i += 4) {
    pixelData[i + 0] = r; // R
    pixelData[i + 1] = g; // G
    pixelData[i + 2] = b; // B
    pixelData[i + 3] = 255; // A (fully opaque)
  }

  // Simulate a network/processing delay
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));

  return pixelData;
}

export const NoitaGridLayer = L.GridLayer.extend({
  // The createTile method is the heart of our custom layer.
  // Leaflet calls this for each tile it needs to display.
  createTile: function (coords: L.Coords, done: L.DoneCallback): HTMLElement {
    // 1. Create a container for our tile.
    // We use a div because we will place a canvas inside it.
    const tile = L.DomUtil.create('div', 'leaflet-tile');

    // 2. Display a loading indicator immediately.
    // This is a simple div we will style with CSS.
    const loader = L.DomUtil.create('div', 'loader', tile);

    // 3. Start the asynchronous decompression.
    decompressChunk(coords)
      .then((pixelData) => {
        // 4. Once decompression is complete, render the data to a canvas.
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = this.options.tileSize as number;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          const imageData = ctx.createImageData(canvas.width, canvas.height);
          imageData.data.set(pixelData);
          ctx.putImageData(imageData, 0, 0);
        }

        // 5. Replace the loading spinner with the rendered canvas.
        tile.innerHTML = ''; // Clear the loader
        tile.appendChild(canvas);

        // 6. Signal to Leaflet that the tile is ready.
        done(null, tile);
      })
      .catch((error) => {
        // Optional: Handle errors, e.g., show an error tile.
        console.error('Failed to decompress and render chunk:', error);
        tile.innerHTML = 'Error';
        done(error, tile);
      });

    // 7. IMPORTANT: Return the tile element with the loader immediately.
    // Leaflet will place this on the map while the async operation runs.
    return tile;
  },
});

// src/components/CustomNoitaLayer.tsx
import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

export function CustomNoitaLayer() {
  const map = useMap();
  const layerRef = useRef<L.GridLayer | null>(null);

  useEffect(() => {
    if (!layerRef.current) {
      // Instantiate our custom layer class
      layerRef.current = new NoitaGridLayer({
        tileSize: 512, // Match your chunk size
        minZoom: -2,
        maxZoom: 5, // Adjust as needed

        noWrap: true, // Prevents the map from repeating horizontally

        // --- THE KEY CHANGE IS HERE ---
        // Tell Leaflet that our chunks only exist at zoom level 0.
        minNativeZoom: 0,
        maxNativeZoom: 0,
      });

      // Add the layer to the map
      map.addLayer(layerRef.current);
    }

    // The cleanup function for when the component unmounts
    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [map]); // Re-run effect if the map instance changes

  // This component does not render any JSX itself.
  return null;
}
