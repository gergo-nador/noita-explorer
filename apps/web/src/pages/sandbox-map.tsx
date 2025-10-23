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
