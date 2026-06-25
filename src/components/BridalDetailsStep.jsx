import { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, Plus, Upload } from 'lucide-react';
import VenueDetailsStep from './VenueDetailsStep';

const OCCASIONS = [
  { id: 'wedding', label: 'Wedding', icon: '💍' },
  { id: 'engagement', label: 'Engagement', icon: '💎' },
  { id: 'reception', label: 'Reception', icon: '🥂' },
  { id: 'mehendi', label: 'Mehendi', icon: '🌿' },
  { id: 'other', label: 'Other', icon: '✨' },
];

const SKIN_TYPES = [
  { id: 'dry', label: 'Dry', icon: '💧' },
  { id: 'oily', label: 'Oily', icon: '✨' },
  { id: 'combination', label: 'Combination', icon: '🌿' },
  { id: 'sensitive', label: 'Sensitive', icon: '🌸' },
  { id: 'normal', label: 'Normal', icon: '😊' },
];

const HAIR_TYPES = [
  { id: 'straight', label: 'Straight', icon: '📏' },
  { id: 'wavy', label: 'Wavy', icon: '〰️' },
  { id: 'curly', label: 'Curly', icon: '🌀' },
];

const OUTFIT_COLORS = [
  { id: 'red', hex: '#8B1A1A' },
  { id: 'pink', hex: '#D4547A', label: 'Pink' },
  { id: 'maroon', hex: '#6B1020', label: 'Maroon' },
  { id: 'nude', hex: '#E8C4A0', label: 'Nude' },
  { id: 'gold', hex: '#C49F57', label: 'Gold' },
  { id: 'peach', hex: '#F4B08A', label: 'Peach' },
];

const REQUIREMENTS = ['HD Makeup', 'Airbrush Makeup', 'Mineral Makeup', 'Sensitive Skin Products', 'Other +'];

const STEPS = [
  { n: '1', label: 'Date & Time', done: true },
  { n: '2', label: 'Bridal Details', active: true },
  { n: '3', label: 'Venue Details', done: false },
  { n: '4', label: 'Payment', done: false },
];

const PACKAGE_INCLUDES = [
  'HD Airbrush Makeup', 'Hairstyling', 'Saree Draping',
  'Premium Products', 'Trial Session', 'Touch-up & Retouch',
  'Lashes Included', 'On-location Service',
];

const PREVIEW_IMGS = [
  '/digital_twin_portrait.png', '/bridal_lehenga.png',
  '/mood_eye.png', '/recommend_salon1.png',
];

export default function BridalDetailsStep({ onBack, onNext }) {
  const [occasion, setOccasion] = useState('wedding');
  const [skinType, setSkinType] = useState('oily');
  const [hairType, setHairType] = useState('straight');
  const [outfitColor, setOutfitColor] = useState('red');
  const [requirements, setRequirements] = useState(['HD Makeup']);
  const [notes, setNotes] = useState('');
  const [showVenue, setShowVenue] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const fileInputRef = useRef(null);

  if (showVenue) return (
    <VenueDetailsStep onBack={() => setShowVenue(false)} onNext={onNext} />
  );

  const toggleReq = (r) => {
    setRequirements(prev =>
      prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]
    );
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0 0 40px' }}>

      {/* Top step bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <button className="planner-back-btn" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Package
        </button>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
          {STEPS.map((s, i) => (
            <div key={s.n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: s.done ? 'var(--success)' : s.active ? 'var(--maroon-btn)' : 'var(--card-bg-elevated)', border: s.active ? '2px solid var(--maroon-btn)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.done || s.active ? 'var(--text-white)' : 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 700, zIndex: 2 }}>
                  {s.done ? '✓' : s.n}
                </div>
                {i < STEPS.length - 1 && <div style={{ width: 60, height: 2, background: s.done ? 'var(--success)' : 'var(--card-border)' }} />}
              </div>
              <span style={{ fontSize: '0.65rem', color: s.active ? 'var(--maroon-btn)' : 'var(--text-muted)', fontFamily: 'var(--font-btn)', fontWeight: s.active ? 700 : 500, marginTop: 5, whiteSpace: 'nowrap' }}>
                {i + 1}. {s.label}
              </span>
            </div>
          ))}
        </div>
        <div style={{ width: 140 }} />
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px', alignItems: 'start' }}>

        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Heading */}
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--sidebar-bg)', fontWeight: 700, marginBottom: '4px' }}>
              Bridal Details <span style={{ color: 'var(--gold-accent)' }}>✨</span>
            </h1>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Help us personalize your experience</p>
          </div>

          {/* Info bar */}
          <div style={{ background: 'rgba(196,159,87,0.06)', border: '1px solid rgba(196,159,87,0.2)', borderRadius: 'var(--radius-sm)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '1rem' }}>📋</span>
            Your details help the artist prepare better and give you the perfect look!
          </div>

          {/* Occasion + Skin Type row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Occasion */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', padding: '18px' }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '12px' }}>What's the occasion?</h4>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {OCCASIONS.map(o => (
                  <div key={o.id} onClick={() => setOccasion(o.id)} style={{ textAlign: 'center', cursor: 'pointer', position: 'relative' }}>
                    <div style={{ width: 52, height: 52, borderRadius: 10, border: `2px solid ${occasion === o.id ? 'var(--maroon-btn)' : 'var(--card-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', background: occasion === o.id ? 'var(--maroon-light)' : 'var(--card-bg-elevated)', transition: 'all 0.2s', marginBottom: 4 }}>
                      {o.icon}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-btn)' }}>{o.label}</div>
                    {occasion === o.id && <div style={{ position: 'absolute', bottom: 16, right: 2, width: 14, height: 14, borderRadius: '50%', background: 'var(--maroon-btn)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-white)', fontSize: '0.5rem', fontWeight: 700 }}>✓</div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Skin Type */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', padding: '18px' }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '12px' }}>Your Skin Type</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {SKIN_TYPES.map(s => (
                  <div key={s.id} onClick={() => setSkinType(s.id)} style={{ textAlign: 'center', cursor: 'pointer', position: 'relative' }}>
                    <div style={{ height: 44, borderRadius: 8, border: `2px solid ${skinType === s.id ? 'var(--maroon-btn)' : 'var(--card-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', background: skinType === s.id ? 'var(--maroon-light)' : 'var(--card-bg-elevated)', transition: 'all 0.2s', marginBottom: 3 }}>
                      {s.icon}
                    </div>
                    <div style={{ fontSize: '0.63rem', color: 'var(--text-muted)', fontFamily: 'var(--font-btn)' }}>{s.label}</div>
                    {skinType === s.id && <div style={{ position: 'absolute', bottom: 14, right: 4, width: 13, height: 13, borderRadius: '50%', background: 'var(--maroon-btn)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-white)', fontSize: '0.48rem', fontWeight: 700 }}>✓</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Outfit Color + Hair Type row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Outfit Color */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', padding: '18px' }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '4px' }}>Your Outfit Color</h4>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '12px' }}>Select primary color of your outfit</p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                {OUTFIT_COLORS.map(c => (
                  <div key={c.id} onClick={() => setOutfitColor(c.id)} style={{ textAlign: 'center', cursor: 'pointer', position: 'relative' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: c.hex, border: `3px solid ${outfitColor === c.id ? 'var(--maroon-btn)' : 'var(--card-bg)'}`, boxShadow: outfitColor === c.id ? '0 0 0 2px var(--maroon-btn)' : 'var(--shadow-sm)', transition: 'all 0.2s', marginBottom: 4 }} />
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontFamily: 'var(--font-btn)' }}>{c.label || ''}</div>
                    {outfitColor === c.id && <div style={{ position: 'absolute', bottom: 14, right: 0, width: 13, height: 13, borderRadius: '50%', background: 'var(--maroon-btn)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-white)', fontSize: '0.48rem', fontWeight: 700 }}>✓</div>}
                  </div>
                ))}
                <div style={{ textAlign: 'center', cursor: 'pointer' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', border: '2px dashed rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 4 }}><Plus size={14} /></div>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontFamily: 'var(--font-btn)' }}>Other</div>
                </div>
              </div>
            </div>

            {/* Hair Type */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', padding: '18px' }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '12px' }}>Your Hair Type</h4>
              <div style={{ display: 'flex', gap: '12px' }}>
                {HAIR_TYPES.map(h => (
                  <div key={h.id} onClick={() => setHairType(h.id)} style={{ flex: 1, textAlign: 'center', cursor: 'pointer', position: 'relative' }}>
                    <div style={{ height: 52, borderRadius: 10, border: `2px solid ${hairType === h.id ? 'var(--maroon-btn)' : 'var(--card-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', background: hairType === h.id ? 'var(--maroon-light)' : 'var(--card-bg-elevated)', transition: 'all 0.2s', marginBottom: 4 }}>
                      {h.icon}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-btn)' }}>{h.label}</div>
                    {hairType === h.id && <div style={{ position: 'absolute', bottom: 14, right: 4, width: 14, height: 14, borderRadius: '50%', background: 'var(--maroon-btn)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-white)', fontSize: '0.5rem', fontWeight: 700 }}>✓</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', padding: '18px' }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '10px' }}>Any Specific Requirements?</h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
              {REQUIREMENTS.map(r => (
                <button key={r} onClick={() => toggleReq(r)} style={{ padding: '7px 14px', borderRadius: '20px', border: `1.5px solid ${requirements.includes(r) ? 'var(--maroon-btn)' : 'var(--card-border)'}`, background: requirements.includes(r) ? 'var(--maroon-light)' : 'transparent', color: requirements.includes(r) ? 'var(--maroon-btn)' : 'var(--text-dark)', fontFamily: 'var(--font-btn)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                  {requirements.includes(r) && '✦'} {r}
                </button>
              ))}
            </div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '8px' }}>Tell us more about your preferences</h4>
            <div style={{ position: 'relative' }}>
              <textarea value={notes} onChange={e => setNotes(e.target.value.slice(0, 300))} placeholder="E.g. I prefer subtle eye makeup, dewy base, minimal contour..." rows={3}
                style={{ width: '100%', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', fontSize: '0.8rem', fontFamily: 'var(--font-body)', resize: 'none', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box', background: 'var(--input-bg)' }}
                onFocus={e => e.target.style.borderColor = 'var(--gold-accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--card-border)'}
              />
              <span style={{ position: 'absolute', bottom: 8, right: 10, fontSize: '0.63rem', color: 'var(--text-muted)' }}>{notes.length}/300</span>
            </div>
          </div>

          {/* Inspiration Images */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', padding: '18px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)', marginBottom: '4px' }}>Have inspiration images?</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>Share your moodboard or reference looks with the artist</div>
            </div>
            <button onClick={() => fileInputRef.current?.click()} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', border: '1.5px solid var(--card-border)', borderRadius: 'var(--radius-sm)', background: 'var(--card-bg)', fontFamily: 'var(--font-btn)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dark)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <Upload size={14} /> Upload Images
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 400 }}>PNG, JPG up to 10MB</div>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={(e) => { const files = Array.from(e.target.files || []); const newImages = []; files.forEach(file => { const reader = new FileReader(); reader.onload = (ev) => { newImages.push(ev.target.result); if (newImages.length === files.length) setUploadedImages(prev => [...prev, ...newImages]); }; reader.readAsDataURL(file); }); }} />
            <div style={{ display: 'flex', gap: '6px' }}>
              {(uploadedImages.length > 0 ? uploadedImages : PREVIEW_IMGS).slice(0, 4).map((img, i) => (
                <img key={i} src={img} alt="ref" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', border: '1px solid rgba(196,159,87,0.2)' }} />
              ))}
              {(uploadedImages.length > 0 ? uploadedImages : PREVIEW_IMGS).length > 4 && (
                <div style={{ width: 48, height: 48, borderRadius: 8, background: 'rgba(34,24,25,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-white)', fontWeight: 700, fontSize: '0.72rem' }}>+{(uploadedImages.length > 0 ? uploadedImages : PREVIEW_IMGS).length - 4}<br />more</div>
              )}
            </div>
          </div>

          {/* Footer nav */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px' }}>
            <button className="planner-prev-btn" onClick={onBack}><ArrowLeft size={15} /> Previous Step</button>
            <button className="planner-next-btn" onClick={() => setShowVenue(true)}>Next Step <ArrowRight size={15} /></button>
          </div>

          {/* Trust bar */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '14px 20px', display: 'flex', justifyContent: 'space-between' }}>
            {[
              { icon: '🔒', t: 'Secure Payments', s: '100% secure & protected' },
              { icon: '👩‍🎨', t: 'Trusted Professionals', s: 'Verified & experienced artists' },
              { icon: '⏰', t: 'On-time Guarantee', s: 'We value your time' },
              { icon: '✅', t: 'Hassle-free Cancellation', s: 'Easy reschedule & refund' },
            ].map(x => (
              <div key={x.t} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', marginBottom: 3 }}>{x.icon}</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)' }}>{x.t}</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{x.s}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Booking Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: 20 }}>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: 6 }}>
              Your Booking Summary <span style={{ color: 'var(--gold-accent)' }}>✨</span>
            </h3>
            {/* Artist */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px', paddingBottom: '14px', borderBottom: '1px solid var(--card-border)' }}>
              <img src="/digital_twin_portrait.png" alt="Riya" style={{ width: 50, height: 50, borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1px solid rgba(196,159,87,0.25)' }} />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  Poonam Rawat <span style={{ background: 'var(--gold-accent)', color: 'var(--sidebar-bg)', fontSize: '0.5rem', fontWeight: 700, padding: '1px 5px', borderRadius: 10 }}>✓</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Celebrity Bridal Artist</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dark)' }}>★ 4.9 (1200+) | South Delhi</div>
              </div>
            </div>
            {/* Package */}
            <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--card-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: '0.8rem' }}>👑</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-btn)' }}>Selected Package</span>
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--sidebar-bg)' }}>Royal Bridal Package</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--maroon-btn)' }}>₹50,000</div>
              <button style={{ background: 'none', border: 'none', color: 'var(--maroon-btn)', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer', padding: 0, fontFamily: 'var(--font-btn)' }}>View Details</button>
            </div>
            {/* Date */}
            <div style={{ marginBottom: '14px', paddingBottom: '14px', borderBottom: '1px solid var(--card-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: '0.8rem' }}>📅</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-btn)' }}>Selected Date &amp; Time</span>
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)' }}>12 Dec 2025, Friday</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>10:00 AM</div>
            </div>
            {/* Included */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)', marginBottom: '8px' }}>What's Included in this Package</div>
              {PACKAGE_INCLUDES.slice(0, 8).map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.72rem', color: 'var(--text-dark)', marginBottom: 5 }}>
                  <span style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(196,159,87,0.12)', color: 'var(--gold-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', fontWeight: 700, flexShrink: 0 }}>✓</span>
                  {item}
                </div>
              ))}
              <div style={{ fontSize: '0.7rem', color: 'var(--maroon-btn)', fontWeight: 600, marginTop: 4 }}>+ 3 more services</div>
            </div>
          </div>

          {/* Need Help */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.88rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '4px' }}>Need Help?</div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '10px' }}>Our wedding experts are here for you.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              {['/priya_profile.png', '/digital_twin_portrait.png', '/priya_profile.png'].map((src, i) => (
                <img key={i} src={src} alt="Expert" style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--card-bg)', marginLeft: i > 0 ? -8 : 0 }} />
              ))}
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginLeft: 4 }}>+12 Experts</span>
            </div>
            <button style={{ width: '100%', background: 'var(--maroon-light)', color: 'var(--maroon-btn)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px', fontFamily: 'var(--font-btn)', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              💬 Chat with Expert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
