import { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, Search, MapPin } from 'lucide-react';

const STEPS = [
  { n: '1', label: 'Date & Time', done: true },
  { n: '2', label: 'Bridal Details', done: true },
  { n: '3', label: 'Venue Details', active: true },
  { n: '4', label: 'Payment', done: false },
];

const PACKAGE_INCLUDES = [
  'HD Airbrush Makeup', 'Hairstyling', 'Saree Draping',
  'Premium Products', 'Trial Session', 'Touch-up & Retouch',
  'Lashes Included', 'On-location Service',
];

const inputStyle = {
  width: '100%', border: '1px solid var(--card-border)',
  borderRadius: 'var(--radius-sm)', padding: '9px 12px',
  fontSize: '0.8rem', fontFamily: 'var(--font-body)',
  outline: 'none', boxSizing: 'border-box',
  background: 'var(--input-bg)', color: 'var(--text-dark)',
};

const VENUE_SUGGESTIONS = [
  { name: 'The Leela Palace, Chanakyapuri', addr: 'Diplomatic Enclave, New Delhi, Delhi 110023' },
  { name: 'Taj Mahal Hotel, Lutyens', addr: 'Man Singh Road, New Delhi, Delhi 110011' },
  { name: 'ITC Maurya, Chanakyapuri', addr: 'Sardar Patel Marg, New Delhi, Delhi 110021' },
  { name: 'The Oberoi, Gurgaon', addr: '443, Udyog Vihar, Gurgaon, Haryana 122016' },
  { name: 'JW Marriott, Aerocity', addr: 'Asset Area 4, Hospitality District, New Delhi 110037' },
];

export default function VenueDetailsStep({ onBack, onNext }) {
  const [search, setSearch] = useState('');
  const [floor, setFloor] = useState('');
  const [entry, setEntry] = useState('');
  const [landmark, setLandmark] = useState('');
  const [notes, setNotes] = useState('');
  const [venueName, setVenueName] = useState('The Leela Palace, Chanakyapuri');
  const [venueAddr, setVenueAddr] = useState('Diplomatic Enclave, New Delhi, Delhi 110023');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  return (
    <div className="animate-fade-in" style={{ padding: '0 0 40px' }}>

      {/* Step bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <button className="planner-back-btn" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Package
        </button>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          {STEPS.map((s, i) => (
            <div key={s.n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: s.done ? 'var(--success)' : s.active ? 'var(--maroon-btn)' : 'var(--card-bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: (s.done || s.active) ? 'var(--text-white)' : 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 700 }}>
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
              Venue Details <span style={{ color: 'var(--gold-accent)' }}>✨</span>
            </h1>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Help us reach you on your special day</p>
          </div>

          {/* Info bar */}
          <div style={{ background: 'rgba(196,159,87,0.06)', border: '1px solid rgba(196,159,87,0.2)', borderRadius: 'var(--radius-sm)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <MapPin size={15} style={{ color: 'var(--gold-accent)', flexShrink: 0 }} />
            Accurate location helps the artist plan travel &amp; reach on time.
          </div>

          {/* Event Location */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: 7 }}>
              <MapPin size={15} style={{ color: 'var(--gold-accent)' }} /> Event Location
            </h4>

            {/* Search bar */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input ref={searchRef} value={search} onChange={e => { setSearch(e.target.value); setShowSuggestions(true); }} placeholder="Search for your venue / location"
                  style={{ ...inputStyle, paddingRight: '36px' }}
                  onFocus={e => { e.target.style.borderColor = 'var(--gold-accent)'; setShowSuggestions(true); }}
                  onBlur={e => { setTimeout(() => setShowSuggestions(false), 200); e.target.style.borderColor = 'var(--card-border)'; }}
                />
                <Search size={15} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                {showSuggestions && search.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-md)', zIndex: 10, maxHeight: 200, overflowY: 'auto' }}>
                    {VENUE_SUGGESTIONS.filter(v => v.name.toLowerCase().includes(search.toLowerCase()) || v.addr.toLowerCase().includes(search.toLowerCase())).map(v => (
                      <div key={v.name} onMouseDown={() => { setVenueName(v.name); setVenueAddr(v.addr); setSearch(v.name); setShowSuggestions(false); }} style={{ padding: '10px 14px', cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'var(--font-btn)', borderBottom: '1px solid var(--card-border)', transition: 'background 0.15s' }}
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(196,159,87,0.06)'}
                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ fontWeight: 600, color: 'var(--sidebar-bg)' }}>{v.name}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{v.addr}</div>
                      </div>
                    ))}
                    {VENUE_SUGGESTIONS.filter(v => v.name.toLowerCase().includes(search.toLowerCase())).length === 0 && (
                      <div style={{ padding: '10px 14px', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>No venues found. Type a custom location.</div>
                    )}
                  </div>
                )}
              </div>
              <button onClick={() => { if (navigator.geolocation) { navigator.geolocation.getCurrentPosition(pos => { setVenueName(`Location: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`); setVenueAddr('Using GPS location'); const el = document.createElement('div'); el.className = 'noor-toast'; el.textContent = '📍 Location detected!'; el.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);padding:10px 24px;border-radius:var(--radius-sm);font-family:var(--font-btn);font-size:0.82rem;z-index:2000;box-shadow:0 8px 24px rgba(0,0,0,0.2)'; document.body.appendChild(el); setTimeout(() => el.remove(), 2500); }, () => { const el = document.createElement('div'); el.textContent = '⚠️ Could not get location. Please type manually.'; el.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#e74c3c;color:#fff;padding:10px 24px;border-radius:var(--radius-sm);font-family:var(--font-btn);font-size:0.82rem;z-index:2000;box-shadow:0 8px 24px rgba(0,0,0,0.2)'; document.body.appendChild(el); setTimeout(() => el.remove(), 3000); }); } else { const el = document.createElement('div'); el.textContent = '⚠️ Geolocation not supported by your browser.'; el.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#e74c3c;color:#fff;padding:10px 24px;border-radius:var(--radius-sm);font-family:var(--font-btn);font-size:0.82rem;z-index:2000;box-shadow:0 8px 24px rgba(0,0,0,0.2)'; document.body.appendChild(el); setTimeout(() => el.remove(), 3000); } }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', background: 'var(--maroon-light)', color: 'var(--maroon-btn)', border: '1px solid rgba(132,35,44,0.2)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-btn)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                <MapPin size={13} /> Use My Location
              </button>
            </div>

            {/* Selected location */}
            <div style={{ marginBottom: '4px' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-btn)', marginBottom: '4px' }}>Selected Location</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-btn)', fontWeight: 700, color: 'var(--sidebar-bg)', fontSize: '0.85rem' }}>{venueName}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{venueAddr}</div>
                </div>
                <button onClick={() => { setVenueName('The Leela Palace, Chanakyapuri'); setVenueAddr('Diplomatic Enclave, New Delhi, Delhi 110023'); setSearch(''); if (searchRef.current) searchRef.current.focus(); }} style={{ background: 'none', border: 'none', color: 'var(--maroon-btn)', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-btn)', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                  ✏ Change Location
                </button>
              </div>
            </div>

            {/* Map placeholder with interactive pins */}
            <div style={{ height: 200, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--card-border)', marginTop: '10px', position: 'relative', background: 'linear-gradient(135deg, #e8f0e8 0%, #d4e8d4 50%, #c8dcc8 100%)' }}>
              {/* Simulated map background */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gridTemplateRows: 'repeat(4, 1fr)', width: '100%', height: '100%', opacity: 0.3 }}>
                  {Array(24).fill(0).map((_, i) => (
                    <div key={i} style={{ border: '1px solid rgba(0,100,0,0.15)', background: i % 7 === 0 ? 'rgba(180,220,180,0.6)' : i % 5 === 0 ? 'rgba(200,230,200,0.4)' : 'transparent' }} />
                  ))}
                </div>
                <div style={{ position: 'absolute', top: '40%', left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.8)' }} />
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '45%', width: 3, background: 'rgba(255,255,255,0.8)' }} />
                <div style={{ position: 'absolute', top: '65%', left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.6)' }} />
              </div>
              {/* Nearby venue pins */}
              {[
                { name: 'The Leela Palace', top: '45%', left: '50%', selected: true },
                { name: 'Taj Mahal Hotel', top: '30%', left: '30%' },
                { name: 'ITC Maurya', top: '55%', left: '70%' },
                { name: 'The Oberoi', top: '70%', left: '25%' },
              ].map((pin, i) => (
                <div key={i} style={{ position: 'absolute', top: pin.top, left: pin.left, transform: 'translate(-50%, -100%)', cursor: 'pointer', zIndex: 5 }}
                  onClick={() => { const v = VENUE_SUGGESTIONS[i] || VENUE_SUGGESTIONS[0]; setVenueName(v.name); setVenueAddr(v.addr); setSearch(v.name); }}
                >
                  {pin.selected ? (
                    <>
                      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '4px 10px', boxShadow: 'var(--shadow-sm)', textAlign: 'center', marginBottom: 4, whiteSpace: 'nowrap' }}>
                        <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)' }}>{pin.name}</div>
                      </div>
                      <div style={{ width: 24, height: 24, background: 'var(--maroon-btn)', borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', margin: '0 auto', boxShadow: '0 2px 8px rgba(132,35,44,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ transform: 'rotate(45deg)', width: 8, height: 8, background: 'var(--text-white)', borderRadius: '50%' }} />
                      </div>
                    </>
                  ) : (
                    <div style={{ width: 14, height: 14, background: 'rgba(132,35,44,0.6)', borderRadius: '50%', border: '2px solid var(--text-white)', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }} />
                  )}
                </div>
              ))}
              <div style={{ position: 'absolute', bottom: 6, right: 8, fontSize: '0.6rem', color: 'rgba(0,0,0,0.4)', fontFamily: 'var(--font-btn)' }}>📍 Click pins to select venue</div>
            </div>
          </div>

          {/* Additional Venue Details */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: 7 }}>
              🏨 Additional Venue Details
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-btn)', display: 'block', marginBottom: '5px' }}>Floor / Room <span style={{ opacity: 0.6 }}>(Optional)</span></label>
                <input value={floor} onChange={e => setFloor(e.target.value)} placeholder="e.g. Banquet Hall - 2nd Floor" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--gold-accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--card-border)'}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-btn)', display: 'block', marginBottom: '5px' }}>Entry Details <span style={{ opacity: 0.6 }}>(Optional)</span></label>
                <input value={entry} onChange={e => setEntry(e.target.value)} placeholder="e.g. Near Main Gate, Left Side Entry" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--gold-accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--card-border)'}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-btn)', display: 'block', marginBottom: '5px' }}>Landmark <span style={{ opacity: 0.6 }}>(Optional)</span></label>
                <input value={landmark} onChange={e => setLandmark(e.target.value)} placeholder="e.g. Opposite to India Gate" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--gold-accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--card-border)'}
                />
              </div>
              <div style={{ position: 'relative' }}>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-btn)', display: 'block', marginBottom: '5px' }}>Notes for the Artist <span style={{ opacity: 0.6 }}>(Optional)</span></label>
                <textarea value={notes} onChange={e => setNotes(e.target.value.slice(0, 200))} placeholder="Any special instructions for the artist" rows={3}
                  style={{ ...inputStyle, resize: 'none', paddingBottom: '18px' }}
                  onFocus={e => e.target.style.borderColor = 'var(--gold-accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--card-border)'}
                />
                <span style={{ position: 'absolute', bottom: 8, right: 10, fontSize: '0.6rem', color: 'var(--text-muted)' }}>{notes.length}/200</span>
              </div>
            </div>
          </div>

          {/* Travel & Logistics */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: 7 }}>
              🚗 Travel &amp; Logistics
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>📍</span>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-btn)', marginBottom: 2 }}>Travel Distance</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)' }}>12.4 km <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>from artist's location</span></div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>⏱</span>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-btn)', marginBottom: 2 }}>Estimated Travel Time</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)' }}>35 - 40 mins</div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(196,159,87,0.04)', border: '1px solid rgba(196,159,87,0.15)', borderRadius: 'var(--radius-sm)', padding: '12px 14px' }}>
              <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>💰</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-btn)', marginBottom: 1 }}>Travel Charges</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Applicable as per location</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--sidebar-bg)' }}>₹1,200</div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>(Included in total)</div>
              </div>
              <span style={{ background: 'var(--maroon-light)', color: 'var(--success)', border: '1px solid var(--success)', borderRadius: 20, padding: '3px 10px', fontSize: '0.65rem', fontWeight: 700, fontFamily: 'var(--font-btn)', whiteSpace: 'nowrap', marginLeft: 8 }}>FREE for Noor Elite</span>
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button className="planner-prev-btn" onClick={onBack}><ArrowLeft size={15} /> Previous Step</button>
            <button className="planner-next-btn" onClick={onNext}>Next Step <ArrowRight size={15} /></button>
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
            <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--card-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: '0.8rem' }}>👑</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-btn)' }}>Selected Package</span>
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.92rem', fontWeight: 700, color: 'var(--sidebar-bg)' }}>Royal Bridal Package</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--maroon-btn)' }}>₹50,000</div>
                <button onClick={() => { const el = document.createElement('div'); el.className = 'noor-toast'; el.innerHTML = '<strong>🎁 Royal Bridal Package Includes:</strong><ul style="margin:5px 0 0 15px;padding:0;text-align:left;list-style-type:disc;"><li>HD Airbrush Makeup</li><li>Hairstyling & Draping</li><li>Trial Session Included</li><li>Premium Products Only</li></ul>'; el.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);padding:12px 24px;border-radius:var(--radius-sm);font-family:var(--font-btn);font-size:0.78rem;z-index:2000;box-shadow:0 8px 24px rgba(0,0,0,0.2);line-height:1.4;'; document.body.appendChild(el); setTimeout(() => el.remove(), 4000); }} style={{ background: 'none', border: 'none', color: 'var(--maroon-btn)', fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-btn)' }}>View Details</button>
              </div>
            </div>
            <div style={{ marginBottom: '14px', paddingBottom: '14px', borderBottom: '1px solid var(--card-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: '0.8rem' }}>📅</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-btn)' }}>Selected Date &amp; Time</span>
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)' }}>12 Dec 2025, Friday</div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>10:00 AM</div>
                <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--maroon-btn)', fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-btn)' }}>Change</button>
              </div>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)', marginBottom: '8px' }}>What's Included in this Package</div>
              {PACKAGE_INCLUDES.map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.72rem', color: 'var(--text-dark)', marginBottom: 5 }}>
                  <span style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(196,159,87,0.12)', color: 'var(--gold-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', fontWeight: 700, flexShrink: 0 }}>✓</span>
                  {item}
                </div>
              ))}
              <div style={{ fontSize: '0.7rem', color: 'var(--maroon-btn)', fontWeight: 600, marginTop: 4 }}>+ 3 more services</div>
            </div>
          </div>
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
