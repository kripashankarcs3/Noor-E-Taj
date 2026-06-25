/* eslint-disable react-refresh/only-export-components */
const UNSPLASH_BASE = 'https://images.unsplash.com';

/* ----- Premium Image URLs from Unsplash ----- */
export const IMAGES = {
  bride: `${UNSPLASH_BASE}/photo-1519699047748-de8e457a634e?w=600&h=700&fit=crop&auto=format`,
  portrait1: `${UNSPLASH_BASE}/photo-1524504388940-b1c1722653e1?w=600&h=700&fit=crop&auto=format`,
  salon1: `${UNSPLASH_BASE}/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop&auto=format`,
  salon2: `${UNSPLASH_BASE}/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop&auto=format`,
  salon3: `${UNSPLASH_BASE}/photo-1633681924186-98b68a3d5bf0?w=400&h=300&fit=crop&auto=format`,
  salon4: `${UNSPLASH_BASE}/photo-1540555708125-c0a991ed36f1?w=400&h=300&fit=crop&auto=format`,
  salon5: `${UNSPLASH_BASE}/photo-1559599101-f09722fb4948?w=400&h=300&fit=crop&auto=format`,
  lehenga: `${UNSPLASH_BASE}/photo-1599643478677-23e54e1f2a6e?w=400&h=500&fit=crop&auto=format`,
  wedding: `${UNSPLASH_BASE}/photo-1519748774658-2b44ae6c0b1e?w=400&h=300&fit=crop&auto=format`,
  skincare: `${UNSPLASH_BASE}/photo-1570172619644-dfd03be5f2d0?w=400&h=300&fit=crop&auto=format`,
  salon6: `${UNSPLASH_BASE}/photo-1634304444551-b7df4a8196d2?w=400&h=300&fit=crop&auto=format`,
};

/* ----- Premium Image Wrapper Component ----- */
export function PremiumImage({ src, alt, overlay = true, height, style, objectFit = 'cover', children }) {
  return (
    <div style={{ position: 'relative', width: '100%', height, overflow: 'hidden', ...style }}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ width: '100%', height: '100%', objectFit, transition: 'transform 0.6s ease, opacity 0.5s ease' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        onLoad={e => e.currentTarget.style.opacity = '1'}
        onError={e => { e.currentTarget.style.display = 'none'; }}
      />
      {overlay && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.3) 100%)',
          pointerEvents: 'none'
        }} />
      )}
      {children}
    </div>
  );
}

/* ----- Salon Preview Card Component ----- */
export function SalonPreview({ src, name, style: extStyle }) {
  return (
    <div style={{
      width: '120px', height: '120px', borderRadius: '12px', overflow: 'hidden',
      boxShadow: '0 4px 15px rgba(183, 110, 121, 0.15)', position: 'relative', ...extStyle
    }}>
      <img src={src} alt={name} loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement.style.background = 'linear-gradient(135deg, var(--accent), var(--bg-color))'; }}
      />
    </div>
  );
}

/* ----- Stylised SVGs (keep as-is - they look great as tech graphics) ----- */
export function DigitalTwinAvatar({ size = 280 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dtg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#B76E79" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
        <linearGradient id="dtg2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B76E79" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <circle cx="200" cy="200" r="180" stroke="url(#dtg1)" strokeWidth="1" strokeDasharray="6 4" opacity="0.15" />
      <circle cx="200" cy="200" r="150" stroke="url(#dtg1)" strokeWidth="1.5" strokeDasharray="3 6" opacity="0.2" />
      <circle cx="200" cy="200" r="120" stroke="url(#dtg1)" strokeWidth="2" strokeDasharray="8 3" opacity="0.25" />
      <circle cx="200" cy="200" r="90" stroke="url(#dtg2)" strokeWidth="2" opacity="0.3" />
      <path d="M200 110 Q240 110 260 140 Q280 170 275 210 Q270 240 250 260 Q240 270 200 275 Q160 270 150 260 Q130 240 125 210 Q120 170 140 140 Q160 110 200 110Z" fill="url(#dtg2)" opacity="0.4" />
      <circle cx="172" cy="195" r="8" fill="#B76E79" opacity="0.3" />
      <circle cx="172" cy="195" r="3" fill="#B76E79" opacity="0.5" />
      <circle cx="228" cy="195" r="8" fill="#B76E79" opacity="0.3" />
      <circle cx="228" cy="195" r="3" fill="#B76E79" opacity="0.5" />
      <path d="M200 200 L195 220 L205 220 Z" fill="#B76E79" opacity="0.15" />
      <path d="M185 235 Q200 245 215 235 Q200 240 185 235Z" fill="#B76E79" opacity="0.25" />
      {[60, 120, 180, 240, 300].map(x => (
        <circle key={x} cx={x} cy="200" r="3" fill="#D4AF37" opacity="0.4" />
      ))}
      {[80, 160, 240, 320].map(y => (
        <circle key={y} cx="200" cy={y} r="3" fill="#D4AF37" opacity="0.4" />
      ))}
      <line x1="100" y1="200" x2="300" y2="200" stroke="#B76E79" strokeWidth="0.5" opacity="0.1" />
      <line x1="200" y1="100" x2="200" y2="300" stroke="#B76E79" strokeWidth="0.5" opacity="0.1" />
    </svg>
  );
}

export function FaceShapeGrid({ size = 260 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fsg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#B76E79" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
      </defs>
      <rect x="40" y="40" width="320" height="320" rx="16" fill="#F8E8EE" opacity="0.15" />
      <line x1="40" y1="200" x2="360" y2="200" stroke="#B76E79" strokeWidth="0.5" opacity="0.15" />
      <line x1="200" y1="40" x2="200" y2="360" stroke="#B76E79" strokeWidth="0.5" opacity="0.15" />
      <path d="M200 80 Q250 80 270 120 Q290 160 285 200 Q280 240 260 270 Q240 300 200 310 Q160 300 140 270 Q120 240 115 200 Q110 160 130 120 Q150 80 200 80Z" stroke="url(#fsg1)" strokeWidth="2" fill="url(#fsg1)" fillOpacity="0.08" />
      <circle cx="200" cy="80" r="4" fill="#B76E79" opacity="0.5" />
      <circle cx="200" cy="310" r="4" fill="#B76E79" opacity="0.5" />
      <circle cx="115" cy="200" r="4" fill="#B76E79" opacity="0.5" />
      <circle cx="285" cy="200" r="4" fill="#B76E79" opacity="0.5" />
      <line x1="100" y1="200" x2="115" y2="200" stroke="#D4AF37" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
      <line x1="285" y1="200" x2="300" y2="200" stroke="#D4AF37" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
      <line x1="200" y1="60" x2="200" y2="80" stroke="#D4AF37" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
      <line x1="200" y1="310" x2="200" y2="340" stroke="#D4AF37" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
    </svg>
  );
}

export function BudgetChart({ size = 200 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="200" cy="200" r="160" stroke="#F8E8EE" strokeWidth="20" opacity="0.3" />
      <path d="M200 40 A160 160 0 0 1 340 160 L200 200 Z" fill="#B76E79" opacity="0.5" />
      <path d="M340 160 A160 160 0 0 1 240 340 L200 200 Z" fill="#D4AF37" opacity="0.4" />
      <path d="M240 340 A160 160 0 0 1 80 280 L200 200 Z" fill="#7B3F00" opacity="0.3" />
      <path d="M80 280 A160 160 0 0 1 100 100 L200 200 Z" fill="#F8E8EE" opacity="0.5" />
      <path d="M100 100 A160 160 0 0 1 200 40 L200 200 Z" fill="#B76E79" opacity="0.2" />
      <circle cx="200" cy="200" r="60" fill="#FFFDF9" opacity="0.9" />
      <text x="200" y="205" textAnchor="middle" fill="#B76E79" fontSize="14" fontWeight="600">Budget</text>
    </svg>
  );
}

export function SpotEraserSVG({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" fill="#F8E8EE" opacity="0.3" />
      <path d="M30 50 Q50 30 70 50 Q50 70 30 50Z" fill="#B76E79" opacity="0.2" />
      <circle cx="50" cy="50" r="15" fill="#B76E79" opacity="0.4" />
      <path d="M45 45 L55 55 M55 45 L45 55" stroke="#FFF" strokeWidth="2" opacity="0.6" />
    </svg>
  );
}
