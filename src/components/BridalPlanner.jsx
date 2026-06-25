import { useState } from 'react';
import { ChevronLeft, ArrowRight, ArrowLeft, MapPin, Sparkles, Users, Calendar, Star, UserCheck, Headset, ChevronDown } from 'lucide-react';

/* ── Step 1 data ── */
const WEDDING_TYPES = [
  { id: 'traditional', label: 'Traditional',           icon: '🪔', image: '/bridal_lehenga.png' },
  { id: 'destination', label: 'Destination',            icon: '✈️', image: '/luxury_salon.png' },
  { id: 'modern',      label: 'Modern / Contemporary',  icon: '💫', image: '/digital_twin_portrait.png' },
  { id: 'court',       label: 'Court / Intimate',       icon: '💍', image: '/faceshape_profile.png' },
  { id: 'prewedding',  label: 'Pre-Wedding Events',     icon: '🎊', image: '/exclusive_banner.png' },
];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const VENUES = ['South Delhi','North Delhi','East Delhi','West Delhi','Gurgaon','Noida','Faridabad','Ghaziabad'];

/* ── Step 2 data ── */
const STYLES = [
  { id: 'classic',  label: 'Classic',  icon: '👗', image: '/mood_walk.png' },
  { id: 'royal',    label: 'Royal',    icon: '👑', image: '/bridal_lehenga.png' },
  { id: 'minimal',  label: 'Minimal',  icon: '🌿', image: '/faceshape_profile.png' },
  { id: 'modern',   label: 'Modern',   icon: '✨', image: '/digital_twin_portrait.png' },
  { id: 'boho',     label: 'Boho',     icon: '🌸', image: '/mood_henna.png' },
  { id: 'glam',     label: 'Glam',     icon: '💎', image: '/mood_jewelry.png' },
];

const COLOR_OPTIONS = [
  { id: 'red',       label: 'Red',       hex: '#8B1A1A' },
  { id: 'maroon',    label: 'Maroon',    hex: '#6B1020' },
  { id: 'pink',      label: 'Pink',      hex: '#D4547A' },
  { id: 'peach',     label: 'Peach',     hex: '#F4A97A' },
  { id: 'gold',      label: 'Gold',      hex: '#C49F57' },
  { id: 'champagne', label: 'Champagne', hex: '#F0E0C0' },
  { id: 'green',     label: 'Green',     hex: '#3A7A5A' },
  { id: 'blue',      label: 'Blue',      hex: '#2A5A9F' },
  { id: 'lavender',  label: 'Lavender',  hex: '#B89DC8' },
  { id: 'white',     label: 'White',     hex: '#F5F0EA' },
];

const BUDGET_OPTIONS = [
  '₹50,000 - ₹1,00,000',
  '₹1,00,000 - ₹2,00,000',
  '₹2,00,000 - ₹5,00,000',
  '₹5,00,000 - ₹10,00,000',
  '₹10,00,000+',
];

const STEPS = [
  { num: '01', label: 'Wedding Type' },
  { num: '02', label: 'Preferences' },
  { num: '03', label: 'Style Match' },
  { num: '04', label: 'Results' },
];

const STATS_DEFAULT = [
  { icon: Users,     value: '10,000+', label: 'Happy Brides' },
  { icon: UserCheck, value: '500+',    label: 'Verified Artists' },
  { icon: Calendar,  value: '50,000+', label: 'Bookings Done' },
  { icon: Star,      value: '4.9 ★',   label: 'Average Rating' },
  { icon: Headset,   value: '24/7',    label: 'Premium Support' },
];

const STATS_STEP3 = [
  { icon: Users,     value: 'Trusted by 10,000+', label: 'Happy Brides' },
  { icon: UserCheck, value: '500+ Verified',       label: 'Artists & Salons' },
  { icon: Calendar,  value: 'Secure & Easy',       label: 'Bookings' },
  { icon: Star,      value: 'Best Price',          label: 'Guarantee' },
  { icon: Headset,   value: '24/7 Premium',        label: 'Support' },
];

const StepsBar = ({ step, onBack, onStepChange }) => (
  <div className="planner-steps-bar">
    <button className="planner-back-btn" onClick={step === 1 ? onBack : () => onStepChange(s => s - 1)}>
      <ChevronLeft size={16} /> {step === 1 ? 'Back to Dashboard' : 'Previous Step'}
    </button>

    <div className="planner-steps">
      {STEPS.map((s, i) => (
        <div key={s.num} className="planner-step-item" style={{ cursor: step > i + 1 ? 'pointer' : 'default' }} onClick={() => { if (step > i + 1) onStepChange(i + 1); }}>
          <div className={`planner-step-circle ${step === i + 1 ? 'active' : step > i + 1 ? 'done' : ''}`}>
            {step > i + 1
              ? <span style={{ fontSize: '0.7rem' }}>✓</span>
              : <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>{s.num}</span>
            }
          </div>
          {i < 3 && <div className={`planner-step-line ${step > i + 1 ? 'done' : ''}`} />}
          <span className={`planner-step-label ${step === i + 1 ? 'active' : ''}`}>{s.label}</span>
        </div>
      ))}
    </div>

    <div style={{ width: '160px' }} />
  </div>
);

const StatsRibbon = ({ step3 = false }) => {
  const stats = step3 ? STATS_STEP3 : STATS_DEFAULT;
  return (
    <div className="stats-ribbon" style={{ margin: '24px 0 0 0' }}>
      {stats.map(({ icon: Icon, value, label }) => (
        <div key={label} className="stats-item">
          <Icon className="stats-icon-box" size={22} />
          <div>
            <div className="stats-title">{value}</div>
            <div className="stats-lbl">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function BridalPlanner({ onBack, onNavigate, darkMode }) {
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  /* Step 1 state */
  const [selectedType,  setSelectedType]  = useState('traditional');
  const [selectedMonth, setSelectedMonth] = useState('Feb');
  const [selectedVenue, setSelectedVenue] = useState('South Delhi');
  const [venueOpen,     setVenueOpen]     = useState(false);

  /* Step 2 state */
  const [selectedStyle,   setSelectedStyle]   = useState('royal');
  const [selectedColors,  setSelectedColors]  = useState(['red', 'maroon', 'gold']);
  const [selectedBudget,  setSelectedBudget]  = useState('₹2,00,000 - ₹5,00,000');
  const [budgetOpen,      setBudgetOpen]      = useState(false);
  const [functions,       setFunctions]       = useState(3);
  const [requirements,    setRequirements]    = useState('');
  const [showCostEstimate, setShowCostEstimate] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('noor_planner_wishlist') || '[]'); } catch { return []; }
  });

  const toggleWishlist = (id) => {
    setWishlist(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('noor_planner_wishlist', JSON.stringify(next));
      return next;
    });
  };

  const toggleColor = (id) => {
    setSelectedColors(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : prev.length < 5 ? [...prev, id] : prev
    );
  };

  /* ══════════════════════════════
       STEP 1
     ══════════════════════════════ */
  if (step === 1) return (
    <div className="planner-page animate-fade-in">
      <StepsBar step={step} onBack={onBack} onStepChange={setStep} />
      <div className="planner-layout">
        {/* Form */}
        <div className="planner-form-area">
          <div className="planner-heading">
            <h1>AI Bridal Planner <span style={{ color: 'var(--gold-accent)' }}>✨</span></h1>
            <p>Answer a few questions and let our AI curate the perfect bridal look &amp; experts for you.</p>
          </div>

          {/* Wedding Type */}
          <div className="planner-section">
            <div className="planner-section-label">📅 <strong>What type of wedding are you planning?</strong></div>
            <p className="planner-section-hint">Select one option</p>
            <div className="wedding-type-grid">
              {WEDDING_TYPES.map(type => (
                <div key={type.id} className={`wedding-type-card ${selectedType === type.id ? 'selected' : ''}`} onClick={() => setSelectedType(type.id)}>
                  <div className="wedding-type-icon">{type.icon}</div>
                  <span className="wedding-type-label">{type.label}</span>
                  <div className="wedding-type-img-wrap"><img src={type.image} alt={type.label} /></div>
                  {selectedType === type.id && <div className="wedding-type-check">✓</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Month */}
          <div className="planner-section">
            <div className="planner-section-label">📍 <strong>When is your wedding?</strong></div>
            <p className="planner-section-hint">Select the month</p>
            <div className="month-selector">
              {MONTHS.map(m => (
                <button key={m} className={`month-btn ${selectedMonth === m ? 'active' : ''}`} onClick={() => setSelectedMonth(m)}>{m}</button>
              ))}
            </div>
          </div>

          {/* Venue */}
          <div className="planner-section">
            <div className="planner-section-label">
              <MapPin size={16} style={{ color: 'var(--gold-accent)' }} />
              <strong>Where is your wedding venue?</strong>
            </div>
            <p className="planner-section-hint">Select the area</p>
            <div className="venue-dropdown-wrap">
              <div className="venue-dropdown-trigger" onClick={() => setVenueOpen(!venueOpen)}>
                <span>{selectedVenue}</span>
                <ChevronDown size={16} style={{ color: 'var(--text-muted)', transition: '0.2s', transform: venueOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </div>
              {venueOpen && (
                <div className="venue-dropdown-menu">
                  {VENUES.map(v => (
                    <div key={v} className={`venue-option ${selectedVenue === v ? 'selected' : ''}`} onClick={() => { setSelectedVenue(v); setVenueOpen(false); }}>{v}</div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="planner-footer">
            <button className="planner-next-btn" onClick={() => setStep(2)}>
              Next Step <ArrowRight size={16} />
            </button>
            <div className="planner-progress">
              <span>Step 1 of 4</span>
              <div className="planner-progress-bar"><div className="planner-progress-fill" style={{ width: '25%' }} /></div>
            </div>
          </div>
        </div>

        {/* AI Sidebar Step 1 */}
        <div className="planner-ai-sidebar">
          <div className="planner-ai-header">
            <h3>AI Magic in Progress <Sparkles size={14} style={{ color: 'var(--gold-accent)' }} /></h3>
            <p>Your dream bridal look is just a few steps away...</p>
          </div>
          <div className="planner-ai-img-wrap">
            <img src="/countdown_bride.png" alt="Bridal AI" />
            <div className="planner-ai-img-ring" />
          </div>
          <div className="planner-ai-features">
            {[
              { icon: '✨', title: 'Personalized Recommendations', sub: 'Based on your answers' },
              { icon: '👑', title: 'Top Bridal Experts',           sub: 'Curated just for you' },
              { icon: '🎯', title: 'Style & Trend Match',          sub: 'AI matched to your vibe' },
              { icon: '💰', title: 'Smart Budget Planning',        sub: 'Best options in your range' },
            ].map(f => (
              <div key={f.title} className="planner-ai-feature-item">
                <span className="planner-ai-feature-icon">{f.icon}</span>
                <div>
                  <div className="planner-ai-feature-title">{f.title}</div>
                  <div className="planner-ai-feature-sub">{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="planner-ai-quote">
            <span className="planner-quote-mark">"</span>
            Every bride deserves to feel like royalty on her special day.
            <span className="planner-quote-mark">"</span>
          </div>
        </div>
      </div>
      <StatsRibbon />
    </div>
  );

  /* ══════════════════════════════
       STEP 2 — Wedding Preferences
     ══════════════════════════════ */
  const styleLabel = STYLES.find(s => s.id === selectedStyle)?.label || 'Royal';
  const OTHER_MATCHES = [
    { id: 'modern-elegant', title: 'Modern Elegant',  score: 78, image: '/digital_twin_portrait.png', desc: 'Sleek, sophisticated and perfect for modern celebrations.' },
    { id: 'minimal-chic',   title: 'Minimal Chic',    score: 71, image: '/faceshape_profile.png',      desc: 'Understated beauty with subtle instruments & accessories.' },
    { id: 'boho-romance',   title: 'Boho Romance',    score: 65, image: '/mood_henna.png',             desc: 'Effortless, dreamy and nature inspired looks.' },
  ];

  if (step === 2) return (
    <div className="planner-page animate-fade-in">
      <StepsBar step={step} onBack={onBack} onStepChange={setStep} />
      <div className="planner-layout">

        {/* Form */}
        <div className="planner-form-area">
          <div className="planner-heading">
            <h1>Wedding Preferences <span style={{ color: 'var(--gold-accent)' }}>✨</span></h1>
            <p>Help us understand your style and preferences better.</p>
          </div>

          {/* Style */}
          <div className="planner-section">
            <div className="planner-section-label">📅 <strong>Tell us about your style</strong></div>
            <p className="planner-section-hint">Select all that you love</p>
            <div className="style-grid">
              {STYLES.map(s => (
                <div key={s.id} className={`style-card ${selectedStyle === s.id ? 'selected' : ''}`} onClick={() => setSelectedStyle(s.id)}>
                  <div className="style-card-icon">{s.icon}</div>
                  <span className="style-card-label">{s.label}</span>
                  <div className="style-card-img"><img src={s.image} alt={s.label} /></div>
                  {selectedStyle === s.id && <div className="wedding-type-check">✓</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="planner-section">
            <div className="planner-section-label">📅 <strong>Pick your favorite colors</strong></div>
            <p className="planner-section-hint">Choose up to 5 colors</p>
            <div className="color-picker-row">
              {COLOR_OPTIONS.map(c => (
                <div key={c.id} className="color-swatch-wrap" onClick={() => toggleColor(c.id)}>
                  <div
                    className={`color-swatch ${selectedColors.includes(c.id) ? 'selected' : ''}`}
                    style={{ background: c.hex, border: c.id === 'white' ? '1px solid rgba(0,0,0,0.1)' : 'none' }}
                  >
                    {selectedColors.includes(c.id) && <span className="color-check">✓</span>}
                  </div>
                  <span className="color-label">{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Budget + Functions — side by side */}
          <div className="planner-section">
            <div className="planner-two-col">

              {/* Budget */}
              <div>
                <div className="planner-section-label">📅 <strong>Choose your budget range</strong></div>
                <p className="planner-section-hint">Select your approximate budget</p>
                <div className="venue-dropdown-wrap">
                  <div className="venue-dropdown-trigger" onClick={() => setBudgetOpen(!budgetOpen)}>
                    <span style={{ fontSize: '0.82rem' }}>{selectedBudget}</span>
                    <ChevronDown size={16} style={{ color: 'var(--text-muted)', transition: '0.2s', transform: budgetOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                  </div>
                  {budgetOpen && (
                    <div className="venue-dropdown-menu">
                      {BUDGET_OPTIONS.map(b => (
                        <div key={b} className={`venue-option ${selectedBudget === b ? 'selected' : ''}`} onClick={() => { setSelectedBudget(b); setBudgetOpen(false); }}>{b}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Functions */}
              <div>
                <div className="planner-section-label" style={{ marginBottom: '4px' }}>
                  <span style={{ color: 'var(--gold-accent)', fontSize: '0.9rem' }}>•••</span>
                  <strong>How many functions?</strong>
                </div>
                <p className="planner-section-hint">Select number of events</p>
                <div className="functions-selector">
                  {[1, 2, 3, 4, '5+'].map(n => (
                    <button
                      key={n}
                      className={`function-btn ${functions === n ? 'active' : ''}`}
                      onClick={() => setFunctions(n)}
                    >{n}</button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Requirements */}
          <div className="planner-section">
            <div className="planner-section-label">📝 <strong>Any specific requirements?</strong></div>
            <p className="planner-section-hint">Tell us about your priorities, must-haves or any special requests</p>
            <div className="requirements-wrap">
              <textarea
                className="requirements-textarea"
                placeholder="E.g. I want a lightweight look for my wedding day..."
                value={requirements}
                onChange={e => setRequirements(e.target.value.slice(0, 500))}
                rows={3}
              />
              <span className="requirements-count">{requirements.length}/500</span>
            </div>
          </div>

          {/* Footer */}
          <div className="planner-footer">
            <button className="planner-prev-btn" onClick={() => setStep(1)}>
              <ArrowLeft size={16} /> Previous Step
            </button>
            <div className="planner-progress">
              <span>Step 2 of 4</span>
              <div className="planner-progress-bar"><div className="planner-progress-fill" style={{ width: '50%' }} /></div>
            </div>
            <button className="planner-next-btn" onClick={() => setStep(3)}>
              Next Step <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Right: Your Selections sidebar */}
        <div className="planner-ai-sidebar">
          {/* Vision header */}
          <div className="planner-vision-header">
            <h3>Your Wedding Vision <Sparkles size={13} style={{ color: 'var(--gold-accent)' }} /></h3>
            <p>We are crafting the perfect matches for you</p>
          </div>

          {/* Bride image */}
          <div className="planner-vision-img">
            <img src="/countdown_bride.png" alt="Wedding Vision" />
          </div>

          {/* Selections */}
          <div className="planner-selections">
            <h4 className="planner-selections-title">Your Selections</h4>
            {[
              { icon: '🪔', key: 'Wedding Type', val: WEDDING_TYPES.find(t => t.id === selectedType)?.label || 'Traditional' },
              { icon: '📅', key: 'Month',        val: selectedMonth },
              { icon: '📍', key: 'Venue',        val: selectedVenue },
              { icon: '✨', key: 'Style',        val: STYLES.find(s => s.id === selectedStyle)?.label || 'Royal' },
              { icon: '🎨', key: 'Colors',       val: null, colors: selectedColors },
              { icon: '💰', key: 'Budget',       val: selectedBudget },
              { icon: '🎊', key: 'Functions',    val: String(functions) },
            ].map(row => (
              <div key={row.key} className="planner-selection-row">
                <span className="planner-sel-icon">{row.icon}</span>
                <span className="planner-sel-key">{row.key}</span>
                {row.colors
                  ? <div className="planner-sel-colors">
                      {row.colors.map(cid => {
                        const c = COLOR_OPTIONS.find(x => x.id === cid);
                        return <span key={cid} style={{ width: 12, height: 12, borderRadius: '50%', background: c?.hex, display: 'inline-block', border: cid === 'white' ? '1px solid #ccc' : 'none' }} />;
                      })}
                    </div>
                  : <span className="planner-sel-val">{row.val}</span>
                }
              </div>
            ))}
          </div>

          {/* Tip */}
          <div className="planner-tip">
            <span>💡</span>
            <div>
              <strong>Tip</strong>
              <p>The more details you share, the better our AI recommendations!</p>
            </div>
          </div>
        </div>

      </div>
      <StatsRibbon />
    </div>
  );

  /* ══════════════════════════════
       STEP 3 — Style Match
     ══════════════════════════════ */
  if (step === 3) return (
    <div className="planner-page animate-fade-in">
      <StepsBar step={step} onBack={onBack} onStepChange={setStep} />
      <div className="planner-layout">

        {/* Left: Style Match Content */}
        <div className="planner-form-area">
          <div className="planner-heading">
            <h1>Style Match <span style={{ color: 'var(--gold-accent)' }}>✨</span></h1>
            <p>We've matched you with the perfect bridal styles based on your preferences.</p>
          </div>

          {/* Top Match Card */}
          <div className="match-hero-card">
            <div className="match-hero-img">
              <img src="/bridal_lehenga.png" alt="Top Match" />
            </div>
            <div className="match-hero-details">
              <div className="match-hero-top-row">
                <span className="match-hero-label">Your Top Style Match 🏆</span>
                <span className="match-score-badge-lg">92% Match</span>
              </div>
              <h2 className="match-hero-title">Royal Traditional</h2>
              <p className="match-hero-desc">Timeless elegance with rich fabrics, intricate embroidery and regal jewelry.</p>
              <div className="match-hero-tags">
                {['Traditional','Royal','Elegant','Timeless'].map(t => (
                  <span key={t} className="match-tag">{t}</span>
                ))}
              </div>
              <div className="match-why">
                <p className="match-why-title">Why this matches you?</p>
                {[
                  `Matches your love for ${styleLabel} style`,
                  `Perfect for ${WEDDING_TYPES.find(t=>t.id===selectedType)?.label || 'Traditional'} weddings in ${selectedVenue}`,
                  'Compliments your color preferences',
                  'Fits your budget range',
                ].map(r => (
                  <div key={r} className="match-why-item">
                    <span className="match-why-check">✓</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Other Styles */}
          <div className="planner-section">
            <h3 className="match-section-title">Other Styles You Might Love</h3>
            <div className="other-matches-grid">
              {OTHER_MATCHES.map(m => (
                <div key={m.id} className="other-match-card">
                  <div className="other-match-img">
                    <img src={m.image} alt={m.title} />
                  </div>
                  <div className="other-match-body">
                    <div className="other-match-row">
                      <span className="other-match-title">{m.title}</span>
                      <span className="other-match-score">{m.score}% Match</span>
                    </div>
                    <p className="other-match-desc">{m.desc}</p>
                    <button className="other-match-btn" onClick={() => { const el = document.createElement('div'); el.textContent = `📖 Viewing "${m.title}" details...`; el.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--sidebar-bg);color:#fff;padding:10px 24px;border-radius:var(--radius-sm);font-family:var(--font-btn);font-size:0.82rem;z-index:2000;box-shadow:0 8px 24px rgba(0,0,0,0.2)'; document.body.appendChild(el); setTimeout(() => el.remove(), 2500); }}>View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Refine bar */}
          <div className="match-refine-bar">
            <div className="match-refine-left">
              <span style={{ fontSize: '1.2rem' }}>✦</span>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--sidebar-bg)' }}>These matches are personalized just for you!</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>You can fine-tune your style preferences or explore more options.</div>
              </div>
            </div>
            <button className="match-refine-btn" onClick={() => setStep(2)}>
              <span>⇄</span> Refine My Style
            </button>
          </div>

          {/* Footer */}
          <div className="planner-footer">
            <button className="planner-prev-btn" onClick={() => setStep(2)}>
              <ArrowLeft size={16} /> Previous Step
            </button>
            <div className="planner-progress">
              <span>Step 3 of 4</span>
              <div className="planner-progress-bar"><div className="planner-progress-fill" style={{ width: '75%' }} /></div>
            </div>
            <button className="planner-next-btn" onClick={() => setStep(4)}>
              Next Step <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Right: Style Match Summary — light panel */}
        <div className="match-summary-panel">
          <div className="match-summary-header">
            <Sparkles size={13} style={{ color: 'var(--gold-accent)' }} />
            <span>Your Style Match Summary</span>
          </div>

          {/* Ring chart */}
          <div className="match-ring-wrap">
            <svg width="110" height="110" viewBox="0 0 110 110">
              <circle cx="55" cy="55" r="46" fill="none" stroke={darkMode ? '#2a1e22' : '#F8E8EE'} strokeWidth="10" />
              <circle cx="55" cy="55" r="46" fill="none" stroke="var(--maroon-btn)" strokeWidth="10"
                strokeDasharray="289" strokeDashoffset="72"
                strokeLinecap="round"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '55px 55px' }} />
            </svg>
            <div className="match-ring-label">
              <span className="match-ring-pct">92%</span>
              <span className="match-ring-sub">Top Match</span>
            </div>
          </div>

          {/* Summary rows */}
          <div className="match-summary-rows">
            {[
              { key: 'Style',        val: `${styleLabel} Traditional` },
              { key: 'Wedding Type', val: WEDDING_TYPES.find(t=>t.id===selectedType)?.label || 'Traditional' },
              { key: 'Venue',        val: selectedVenue },
              { key: 'Month',        val: selectedMonth },
              { key: 'Budget',       val: selectedBudget },
            ].map(r => (
              <div key={r.key} className="match-summary-row">
                <span className="match-summary-key">{r.key}</span>
                <span className="match-summary-val">{r.val}</span>
              </div>
            ))}
          </div>

          {/* Affirmation */}
          <div className="match-affirmation">
            <span>🤍</span>
            <p>This style perfectly aligns with your preferences and personality!</p>
          </div>

          {/* What's Next */}
          <div className="match-whats-next">
            <h4>What's Next?</h4>
            <p>In the next step, we will show you:</p>
            {[
              { icon: '🏪', text: 'Recommended Artists & Salons' },
              { icon: '✨', text: 'Sample Looks & Inspirations' },
              { icon: '💰', text: 'Cost Estimates & Packages' },
              { icon: '⭐', text: 'Real Reviews & Ratings' },
            ].map(item => (
              <div key={item.text} className="match-next-item">
                <span className="match-next-icon-box">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>

          {/* Need Help */}
          <div className="match-need-help">
            <div className="match-need-help-title">Need Help?</div>
            <p>Our wedding experts are here for you.</p>
            <button className="match-chat-btn" onClick={() => { if (onNavigate) onNavigate('messages'); }}>🔔 Chat with Expert</button>
          </div>
        </div>{/* end match-summary-panel */}

      </div>
      <StatsRibbon step3={true} />
    </div>
  );

  /* ══════════════════════════════
       STEP 4a — Your Results
     ══════════════════════════════ */
  const typeLabel  = WEDDING_TYPES.find(t => t.id === selectedType)?.label || 'Traditional';

  if (step === 4) return (
    <div className="planner-page animate-fade-in">
      <StepsBar step={step} onBack={onBack} onStepChange={setStep} />
      <div className="planner-layout">

        {/* Main content */}
        <div className="planner-form-area">

          {/* Header row */}
          <div className="results-header-row">
            <div>
              <h1 className="results-title">Your Results <span style={{ color: 'var(--gold-accent)' }}>✨</span></h1>
              <p className="results-subtitle">We've created your personalized wedding plan! Review and save your plan.</p>
            </div>
            <div className="results-action-btns">
              <button className="results-download-btn" onClick={() => { const planText = `Noor AI — Bridal Plan\n\nWedding Style: ${styleLabel} Traditional\nType: ${typeLabel}\nVenue: ${selectedVenue}\nMonth: ${selectedMonth}\nBudget: ${selectedBudget}\nFunctions: ${functions}\nColors: ${selectedColors.join(', ')}\nRequirements: ${requirements || 'None'}\n\nGenerated by Noor AI ✨`; const blob = new Blob([planText], {type: 'text/plain'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'Noor_AI_Bridal_Plan.txt'; a.click(); URL.revokeObjectURL(url); const el = document.createElement('div'); el.textContent = '📄 Plan downloaded!'; el.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--sidebar-bg);color:#fff;padding:10px 24px;border-radius:var(--radius-sm);font-family:var(--font-btn);font-size:0.82rem;z-index:2000;box-shadow:0 8px 24px rgba(0,0,0,0.2)'; document.body.appendChild(el); setTimeout(() => el.remove(), 2500); }}>⬇ Download Plan</button>
              <button className="results-save-btn" onClick={() => { const plan = { style: `${styleLabel} Traditional`, type: typeLabel, venue: selectedVenue, month: selectedMonth, budget: selectedBudget, functions, colors: selectedColors, requirements, savedAt: new Date().toISOString() }; localStorage.setItem('noor_saved_plan', JSON.stringify(plan)); const el = document.createElement('div'); el.textContent = '✅ Plan saved to your account!'; el.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--sidebar-bg);color:#fff;padding:10px 24px;border-radius:var(--radius-sm);font-family:var(--font-btn);font-size:0.82rem;z-index:2000;box-shadow:0 8px 24px rgba(0,0,0,0.2)'; document.body.appendChild(el); setTimeout(() => el.remove(), 2500); }}>🔖 Save Plan</button>
            </div>
          </div>

          {/* Wedding Plan Overview */}
          <div className="results-section-title">Your Wedding Plan Overview</div>
          <div className="results-overview-card">
            <div className="results-overview-img">
              <img src="/bridal_lehenga.png" alt="Bridal Plan" />
            </div>
            <div className="results-overview-grid">
              {[
                { icon: '👗', label: 'Wedding Style',    val: `${styleLabel} Traditional` },
                { icon: '💰', label: 'Budget',           val: selectedBudget },
                { icon: '💍', label: 'Wedding Type',     val: typeLabel },
                { icon: '🎊', label: 'Functions',        val: String(functions) },
                { icon: '📍', label: 'Venue',            val: selectedVenue },
                { icon: '🎯', label: 'Top Style Match',  val: '92% Match' },
                { icon: '📅', label: 'Month',            val: selectedMonth },
                { icon: '📋', label: 'Plan Created On',  val: '12 May 2025' },
              ].map(item => (
                <div key={item.label} className="results-overview-item">
                  <span className="results-overview-icon">{item.icon}</span>
                  <div>
                    <div className="results-overview-lbl">{item.label}</div>
                    <div className="results-overview-val">{item.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What's Included */}
          <div className="results-section-title" style={{ marginTop: 24 }}>What's Included in Your Plan</div>
          <div className="results-included-grid">
            {[
              { icon: '👤', title: 'Recommended Artists', sub: '7 Categories' },
              { icon: '✨', title: 'Looks & Inspiration',  sub: '12+ Looks' },
              { icon: '💰', title: 'Detailed Cost Estimate', sub: 'Budget Breakdown' },
              { icon: '📅', title: 'Day-wise Timeline',   sub: 'Complete Schedule' },
              { icon: '📋', title: 'Tips & Checklists',   sub: 'Ready to Use' },
              { icon: '🏪', title: 'Vendor Shortlist',    sub: 'Curated for You' },
            ].map(item => (
              <div key={item.title} className="results-included-item">
                <span className="results-included-icon">{item.icon}</span>
                <div className="results-included-title">{item.title}</div>
                <div className="results-included-sub">{item.sub}</div>
              </div>
            ))}
          </div>

          {/* Recommended Next Steps */}
          <div className="results-section-title" style={{ marginTop: 24 }}>Recommended Next Steps</div>
          <div className="results-next-steps-grid">
            {[
              { icon: '👤', title: 'Explore Recommended Artists',      desc: 'Top artists curated for your style and budget.',      btn: 'View Artists →',  action: () => { if (onNavigate) onNavigate('marketplace'); } },
              { icon: '🖼️', title: 'Browse Sample Looks & Inspiration', desc: 'Discover looks that match your vibe.',               btn: 'View Looks →',    action: () => { if (onNavigate) onNavigate('moodboard'); } },
              { icon: '💰', title: 'View Detailed Cost Estimate',       desc: 'See the full breakdown of your budget.',             btn: 'View Estimate →', action: () => setShowCostEstimate(true) },
              { icon: '💬', title: 'Chat with Wedding Expert',          desc: 'Get personalized advice from our experts.',          btn: 'Chat Now →',      action: () => { if (onNavigate) onNavigate('messages'); } },
            ].map(item => (
              <div key={item.title} className="results-next-card">
                <span className="results-next-icon">{item.icon}</span>
                <div className="results-next-title">{item.title}</div>
                <div className="results-next-desc">{item.desc}</div>
                <button className="results-next-btn" onClick={item.action}>{item.btn}</button>
              </div>
            ))}
          </div>

          {/* Dream wedding banner */}
          <div className="results-dream-banner">
            <div>
              <div className="results-dream-title">Your dream wedding, perfectly planned with Noor AI ✨</div>
              <div className="results-dream-sub">We're excited to be a part of your beautiful journey</div>
            </div>
            <div className="results-dream-floral">🌸</div>
          </div>

        </div>

        {/* Right: Plan Summary */}
        <div className="match-summary-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--sidebar-bg)' }}>Your Plan Summary</span>
            <button className="results-edit-btn" onClick={() => setStep(2)}>✏ Edit Preferences</button>
          </div>

          {[
            { label: 'Style',    val: `${styleLabel} Traditional`, dot: true },
            { label: 'Type',     val: typeLabel },
            { label: 'Venue',    val: selectedVenue },
            { label: 'Month',    val: selectedMonth },
            { label: 'Budget',   val: selectedBudget },
            { label: 'Functions',val: String(functions) },
          ].map(r => (
            <div key={r.label} className="match-summary-row" style={{ padding: '7px 0' }}>
              <span className="match-summary-key">{r.label}</span>
              <span className="match-summary-val" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {r.dot && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--maroon-btn)', display: 'inline-block' }} />}
                {r.val}
              </span>
            </div>
          ))}

          {/* Score ring */}
          <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: 12 }}>Your Style Match Score</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div className="match-ring-wrap" style={{ width: 80, height: 80 }}>
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" fill="none" stroke={darkMode ? '#2a1e22' : '#F8E8EE'} strokeWidth="8" />
                  <circle cx="40" cy="40" r="32" fill="none" stroke="var(--maroon-btn)" strokeWidth="8"
                    strokeDasharray="201" strokeDashoffset="50"
                    strokeLinecap="round"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '40px 40px' }} />
                </svg>
                <div className="match-ring-label">
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-heading)' }}>92%</span>
                  <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>Excellent Match</span>
                </div>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>This plan is highly aligned with your style preferences and priorities.</p>
            </div>
            <button className="results-see-match-btn" onClick={() => { setStep(3); setTimeout(() => { document.querySelector('.match-hero-card')?.scrollIntoView({ behavior: 'smooth' }); }, 100); }}>See how we matched →</button>
          </div>

          {/* What Happens Next */}
          <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: 10 }}>What Happens Next?</div>
            {[
              { n: '1', title: 'Review your personalized plan',   sub: 'Check all the details and recommendations.' },
              { n: '2', title: 'Shortlist your favorite options', sub: 'Save artists, looks and vendors you love.' },
              { n: '3', title: 'Get expert help (Optional)',      sub: 'Chat with our wedding experts for guidance.' },
              { n: '4', title: 'Book & Plan with ease',          sub: "We'll help you every step of the way!" },
            ].map(item => (
              <div key={item.n} className="results-next-step-row">
                <span className="results-step-num">{item.n}</span>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)' }}>{item.title}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 1 }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Stats */}
      <StatsRibbon />

      {/* ── COST ESTIMATE MODAL ── */}
      {showCostEstimate && (
        <div onClick={() => setShowCostEstimate(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '28px', width: 480, maxWidth: '90vw', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--sidebar-bg)', margin: 0 }}>💰 Cost Estimate</h3>
              <button onClick={() => setShowCostEstimate(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.1rem' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: 'var(--maroon-light)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)' }}>Wedding Style</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--maroon-btn)', fontWeight: 700 }}>{styleLabel} Traditional</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1, background: 'var(--card-bg-elevated)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '10px 12px' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-btn)', marginBottom: '2px' }}>Selected Budget</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)' }}>{selectedBudget}</div>
                </div>
                <div style={{ flex: 1, background: 'var(--card-bg-elevated)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '10px 12px' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-btn)', marginBottom: '2px' }}>Functions</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)' }}>{functions}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { label: 'Makeup Artist', val: '₹35,000 - ₹80,000' },
                  { label: 'Hairstylist', val: '₹10,000 - ₹25,000' },
                  { label: 'Bridal Outfit', val: '₹50,000 - ₹2,00,000' },
                  { label: 'Jewelry', val: '₹30,000 - ₹1,50,000' },
                  { label: 'Venue Decor', val: '₹1,00,000 - ₹5,00,000' },
                  { label: 'Photography', val: '₹40,000 - ₹1,50,000' },
                  { label: 'Mehendi Artist', val: '₹5,000 - ₹20,000' },
                  { label: 'Pre-Wedding Events', val: '₹20,000 - ₹1,00,000' },
                ].map(item => (
                  <div key={item.label} style={{ background: 'var(--card-bg-elevated)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '10px 12px' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-btn)', marginBottom: '2px' }}>{item.label}</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)' }}>{item.val}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'var(--sidebar-bg)', borderRadius: 'var(--radius-sm)', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-btn)' }}>Estimated Range</span>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gold-accent)', fontFamily: 'var(--font-heading)' }}>₹2,90,000 – ₹12,25,000</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center' }}>These are estimated ranges based on your preferences and market rates in {selectedVenue}.</p>
            </div>
            <button onClick={() => setShowCostEstimate(false)} className="planner-next-btn" style={{ width: '100%', marginTop: '16px', justifyContent: 'center' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );

  /* ══════════════════════════════
       STEP 5 — AI Recommended Artists
     ══════════════════════════════ */
  const ARTISTS = [
    {
      id: 1, name: 'Poonam Rawat', badge: 'TOP MATCH', location: 'South Delhi', match: 98,
      rating: 4.9, reviews: 320, exp: '10+ Years Experience', brides: '500+ Brides',
      desc: 'Specializes in Royal & Traditional bridal looks with a flawless finish and premium products.',
      tags: ['Royal','Traditional','Airbrush Makeup','HD Makeup'],
      price: '₹25,000 - ₹45,000', date: '12 May 2025', responds: '2 Hours',
      portfolio: '20+ Portfolio', image: '/digital_twin_portrait.png',
    },
    {
      id: 2, name: 'Chandni Singh', badge: '', location: 'South Delhi', match: 95,
      rating: 4.8, reviews: 285, exp: '8+ Years Experience', brides: '350+ Brides',
      desc: 'Known for creating glamorous bridal looks with a modern touch and attention to detail.',
      tags: ['Glam','Elegant','HD Makeup','Hair Styling'],
      price: '₹20,000 - ₹40,000', date: '13 May 2025', responds: '3 Hours',
      portfolio: '15+ Portfolio', image: '/recommend_salon1.png',
    },
    {
      id: 3, name: 'Makeup By Ankita', badge: '', location: 'South Delhi', match: 93,
      rating: 4.7, reviews: 210, exp: '7+ Years Experience', brides: '260+ Brides',
      desc: 'Affordable luxury with a focus on enhancing natural beauty through soft and royal looks.',
      tags: ['Soft Glam','Traditional','Natural Finish','Airbrush'],
      price: '₹18,000 - ₹35,000', date: '14 May 2025', responds: '4 Hours',
      portfolio: '18+ Portfolio', image: '/recommend_salon2.png',
    },
  ];

  return (
    <div className="planner-page animate-fade-in">
      <StepsBar step={step} onBack={onBack} onStepChange={setStep} />
      <div className="planner-layout">

        {/* Left: Artist listings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

          {/* Header */}
          <div className="artists-header-row">
            <div>
              <h1 className="artists-page-title">AI Recommended Artists <span style={{ color: 'var(--gold-accent)' }}>✨</span></h1>
              <p className="artists-page-sub">Curated just for your {styleLabel} Traditional wedding in {selectedVenue}.</p>
            </div>
            <button className="artists-plan-btn" onClick={() => setStep(4)}>📋 View Plan Summary</button>
          </div>

          {/* Info bar */}
          <div className="artists-info-bar">
            <span style={{ fontSize: '1rem' }}>✦</span>
            <span>Based on your style match, preferences, budget &amp; location, we've handpicked the best artists for you.</span>
          </div>

          {/* Top Matches header */}
          <div className="artists-list-header">
            <span className="artists-list-title">📍 Top Matches for You</span>
            <button className="artists-filter-btn" onClick={() => setShowFilterPanel(!showFilterPanel)}>⚡ {showFilterPanel ? 'Hide Filters' : 'Filter'}</button>
          </div>

          {showFilterPanel && (
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', padding: '14px 16px', marginBottom: 14, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)' }}>Sort by:</span>
              {['Match %','Price','Rating','Experience'].map(s => (
                <button key={s} onClick={() => showToast(`⚡ Sorted by ${s}`)} style={{ background: 'rgba(196,159,87,0.1)', border: '1px solid rgba(196,159,87,0.2)', borderRadius: 'var(--radius-sm)', padding: '6px 14px', cursor: 'pointer', fontFamily: 'var(--font-btn)', fontSize: '0.75rem', color: 'var(--sidebar-bg)', fontWeight: 600 }}>{s}</button>
              ))}
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)', marginLeft: 8 }}>Category:</span>
              {['All','Makeup','Hair','Outfit'].map(c => (
                <button key={c} onClick={() => showToast(`⚡ Filtered: ${c}`)} style={{ background: 'var(--card-bg-elevated)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '6px 14px', cursor: 'pointer', fontFamily: 'var(--font-btn)', fontSize: '0.75rem', color: 'var(--text-dark)' }}>{c}</button>
              ))}
            </div>
          )}

          {/* Artist cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {ARTISTS.map(artist => (
              <div key={artist.id} className="artist-card">
                <div className="artist-card-img-wrap">
                  <img src={artist.image} alt={artist.name} />
                  {artist.badge && <span className="artist-top-badge">{artist.badge}</span>}
                  <button className="artist-heart-btn" onClick={() => toggleWishlist(artist.id)}>{wishlist.includes(artist.id) ? '❤️' : '🤍'}</button>
                  <span className="artist-portfolio-tag">{artist.portfolio}</span>
                </div>
                <div className="artist-card-body">
                  <div className="artist-card-top">
                    <div>
                      <div className="artist-name-row">
                        <h3 className="artist-name">{artist.name}</h3>
                        <span className="artist-verified">✔</span>
                      </div>
                      <div className="artist-location">📍 {artist.location}</div>
                      <div className="artist-meta-row">
                        <span>★ {artist.rating} ({artist.reviews} Reviews)</span>
                        <span>⏱ {artist.exp}</span>
                        <span>👥 {artist.brides}</span>
                      </div>
                      <p className="artist-desc">{artist.desc}</p>
                      <div className="artist-tags">
                        {artist.tags.map(t => <span key={t} className="artist-tag">{t}</span>)}
                      </div>
                    </div>
                    <span className="artist-match-badge">{artist.match}% Match</span>
                  </div>
                  <div className="artist-card-footer">
                    <div className="artist-footer-item">
                      <span className="artist-footer-icon">💰</span>
                      <div>
                        <div className="artist-footer-lbl">Price Range</div>
                        <div className="artist-footer-val">{artist.price}</div>
                      </div>
                    </div>
                    <div className="artist-footer-item">
                      <span className="artist-footer-icon">📅</span>
                      <div>
                        <div className="artist-footer-lbl">Available On</div>
                        <div className="artist-footer-val">{artist.date}</div>
                      </div>
                    </div>
                    <div className="artist-footer-item">
                      <span className="artist-footer-icon">⚡</span>
                      <div>
                        <div className="artist-footer-lbl">Responds in</div>
                        <div className="artist-footer-val">{artist.responds}</div>
                      </div>
                    </div>
                    <button className="artist-view-btn" onClick={() => showToast(`👩‍🎨 Opening ${artist.name}'s profile...`)}>View Profile</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="planner-footer" style={{ marginTop: 20 }}>
            <button className="planner-prev-btn" onClick={() => setStep(4)}>
              <ArrowLeft size={16} /> Previous Step
            </button>
            <div className="planner-progress">
              <span>Step 4 of 4</span>
              <div className="planner-progress-bar"><div className="planner-progress-fill" style={{ width: '100%' }} /></div>
            </div>
            <button className="planner-next-btn" style={{ background: 'transparent', border: '1.5px solid rgba(0,0,0,0.1)', color: 'var(--text-dark)' }} onClick={() => setShowCompareModal(true)}>
              ⇄ Compare Artists
            </button>
          </div>

          {showCompareModal && (
            <div onClick={() => setShowCompareModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div onClick={e => e.stopPropagation()} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '28px', width: 720, maxWidth: '90vw', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--sidebar-bg)', margin: 0 }}>⇄ Compare Artists</h3>
                  <button onClick={() => setShowCompareModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.1rem' }}>✕</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                  {ARTISTS.slice(0, 3).map(a => (
                    <div key={a.id} style={{ background: 'var(--card-bg-elevated)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', padding: '16px', textAlign: 'center' }}>
                      <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 10px', background: '#f0e0d0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>👩‍🎨</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)', marginBottom: 4 }}>{a.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 6 }}>{a.location}</div>
                      <div style={{ background: 'var(--maroon-light)', borderRadius: 'var(--radius-sm)', padding: '4px 10px', display: 'inline-block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--maroon-btn)', marginBottom: 8 }}>{a.match}% Match</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dark)', marginBottom: 4 }}>★ {a.rating} ({a.reviews} reviews)</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dark)', marginBottom: 4 }}>💰 {a.price}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dark)', marginBottom: 4 }}>⏱ {a.exp}</div>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
                        {a.tags.slice(0, 3).map(t => <span key={t} style={{ background: 'rgba(196,159,87,0.08)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>{t}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setShowCompareModal(false)} className="planner-next-btn" style={{ width: '100%', marginTop: '16px', justifyContent: 'center' }}>Close Comparison</button>
              </div>
            </div>
          )}

          {/* Bottom offer bar */}
          <div className="artists-offer-bar">
            <span style={{ fontSize: '1.2rem' }}>🎁</span>
            <div>
              <div className="artists-offer-title">Book through Noor AI &amp; get exclusive benefits!</div>
              <div className="artists-offer-sub">Priority booking • Special discounts • Free makeup trial*</div>
            </div>
            <button className="artists-offer-btn" onClick={() => { if (onNavigate) onNavigate('wallet'); }}>View Offers</button>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="match-summary-panel" style={{ alignSelf: 'start' }}>

          {/* Why these artists */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={13} style={{ color: 'var(--gold-accent)' }} /> Why these artists?
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 10 }}>They are the best match because:</p>
            {[
              'Specialize in Royal Traditional styles',
              'Highly rated by brides in South Delhi',
              'Fit perfectly within your budget',
              'Available on your wedding date',
              'Top reviews for quality & professionalism',
            ].map(r => (
              <div key={r} className="match-why-item" style={{ marginBottom: 7 }}>
                <span className="match-why-check">✓</span>
                <span style={{ fontSize: '0.73rem', color: 'var(--text-dark)' }}>{r}</span>
              </div>
            ))}
          </div>

          {/* Plan summary compact */}
          <div style={{ paddingTop: 14, borderTop: '1px solid rgba(0,0,0,0.06)', marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--sidebar-bg)' }}>Your Plan Summary</span>
              <button className="results-edit-btn" onClick={() => setStep(2)}>✏ Edit</button>
            </div>
            {[
              { icon: '👗', label: 'Wedding Style', val: `${styleLabel} Traditional` },
              { icon: '💍', label: 'Wedding Type',  val: typeLabel },
              { icon: '📍', label: 'Venue',         val: selectedVenue },
              { icon: '📅', label: 'Month',         val: selectedMonth },
              { icon: '💰', label: 'Budget',        val: selectedBudget },
              { icon: '🎊', label: 'Functions',     val: String(functions) },
            ].map(r => (
              <div key={r.label} className="match-summary-row" style={{ padding: '5px 0' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.73rem', fontFamily: 'var(--font-btn)' }}>
                  <span>{r.icon}</span>{r.label}
                </span>
                <span className="match-summary-val">{r.val}</span>
              </div>
            ))}
          </div>

          {/* Style match ring small */}
          <div style={{ background: 'rgba(196,159,87,0.05)', border: '1px solid rgba(196,159,87,0.15)', borderRadius: 10, padding: '12px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="match-ring-wrap" style={{ width: 64, height: 64, flexShrink: 0 }}>
              <svg width="64" height="64" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="26" fill="none" stroke={darkMode ? '#2a1e22' : '#F8E8EE'} strokeWidth="6" />
                <circle cx="32" cy="32" r="26" fill="none" stroke="var(--maroon-btn)" strokeWidth="6"
                  strokeDasharray="163" strokeDashoffset="41"
                  strokeLinecap="round"
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '32px 32px' }} />
              </svg>
              <div className="match-ring-label">
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-heading)' }}>92%</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)', marginBottom: 3 }}>Top Style Match</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>Timeless elegance with rich fabrics and regal jewelry</div>
            </div>
          </div>

          {/* Need Help Choosing */}
          <div style={{ paddingTop: 12, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: 4 }}>Need Help Choosing?</div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 10 }}>Chat with our wedding expert and get personalized recommendations.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              {['/priya_profile.png', '/digital_twin_portrait.png', '/priya_profile.png'].map((src, i) => (
                <img key={i} src={src} alt="Expert" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff', marginLeft: i > 0 ? -8 : 0 }} />
              ))}
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: 4 }}>+12 Experts</span>
            </div>
            <button className="match-chat-btn" onClick={() => { if (onNavigate) onNavigate('messages'); }}>🔔 Chat with Expert</button>
          </div>

        </div>
      </div>

      {/* ── TOAST ── */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 30, left: '50%', transform: 'translateX(-50%)', background: 'var(--sidebar-bg)', color: '#fff', padding: '12px 24px', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-btn)', fontWeight: 600, fontSize: '0.85rem', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', zIndex: 1001 }}>
          {toast}
        </div>
      )}

      {/* ── COST ESTIMATE MODAL ── */}
      {showCostEstimate && (
        <div onClick={() => setShowCostEstimate(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: '28px', width: 480, maxWidth: '90vw', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--sidebar-bg)', margin: 0 }}>💰 Cost Estimate</h3>
              <button onClick={() => setShowCostEstimate(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.1rem' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: 'var(--maroon-light)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)' }}>Wedding Style</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--maroon-btn)', fontWeight: 700 }}>{styleLabel} Traditional</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1, background: 'var(--card-bg-elevated)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '10px 12px' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-btn)', marginBottom: '2px' }}>Selected Budget</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)' }}>{selectedBudget}</div>
                </div>
                <div style={{ flex: 1, background: 'var(--card-bg-elevated)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '10px 12px' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-btn)', marginBottom: '2px' }}>Functions</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)' }}>{functions}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { label: 'Makeup Artist', val: '₹35,000 - ₹80,000' },
                  { label: 'Hairstylist', val: '₹10,000 - ₹25,000' },
                  { label: 'Bridal Outfit', val: '₹50,000 - ₹2,00,000' },
                  { label: 'Jewelry', val: '₹30,000 - ₹1,50,000' },
                  { label: 'Venue Decor', val: '₹1,00,000 - ₹5,00,000' },
                  { label: 'Photography', val: '₹40,000 - ₹1,50,000' },
                  { label: 'Mehendi Artist', val: '₹5,000 - ₹20,000' },
                  { label: 'Pre-Wedding Events', val: '₹20,000 - ₹1,00,000' },
                ].map(item => (
                  <div key={item.label} style={{ background: '#fafafa', border: '1px solid rgba(0,0,0,0.05)', borderRadius: 'var(--radius-sm)', padding: '10px 12px' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-btn)', marginBottom: '2px' }}>{item.label}</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)' }}>{item.val}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'var(--sidebar-bg)', borderRadius: 'var(--radius-sm)', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-btn)' }}>Estimated Range</span>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gold-accent)', fontFamily: 'var(--font-heading)' }}>₹2,90,000 – ₹12,25,000</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center' }}>These are estimated ranges based on your preferences and market rates in {selectedVenue}.</p>
            </div>
            <button onClick={() => setShowCostEstimate(false)} className="planner-next-btn" style={{ width: '100%', marginTop: '16px', justifyContent: 'center' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
