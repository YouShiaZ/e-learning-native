import { useSelector } from 'react-redux';
import { colorsLight, colorsDark } from './palette';

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
function hexToRgb(hex) {
  const h = (hex || '').replace('#','');
  if (h.length !== 6) return { r:108, g:99, b:255 }; // fallback to default primary
  const r = parseInt(h.substring(0,2),16);
  const g = parseInt(h.substring(2,4),16);
  const b = parseInt(h.substring(4,6),16);
  return { r, g, b };
}
function rgbToHex({ r, g, b }) {
  const p = (n) => clamp(Math.round(n),0,255).toString(16).padStart(2,'0');
  return `#${p(r)}${p(g)}${p(b)}`;
}
function mix(hex, amt) {
  // amt range [-1,1]: negative -> darker, positive -> lighter
  const { r, g, b } = hexToRgb(hex);
  const m = (v) => v + (amt >= 0 ? (255 - v) * amt : v * amt);
  return rgbToHex({ r: m(r), g: m(g), b: m(b) });
}

export function useColors() {
  const isDark = useSelector((s) => s.ui?.darkMode);
  const primaryOverride = useSelector((s) => s.ui?.primaryColor);
  const base = isDark ? colorsDark : colorsLight;
  if (!primaryOverride) return base;
  const gradStart = mix(primaryOverride, isDark ? -0.15 : 0.0);
  const gradEnd = mix(primaryOverride, isDark ? -0.35 : -0.2);
  return {
    ...base,
    primary: primaryOverride,
    primaryDark: mix(primaryOverride, -0.2),
    primaryLight: mix(primaryOverride, 0.2),
    primaryGradientStart: gradStart,
    primaryGradientEnd: gradEnd,
  };
}
