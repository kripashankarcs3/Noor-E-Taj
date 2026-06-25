import { useState } from 'react';
import { ArrowLeft, Heart, ChevronDown, ArrowRight, Plus } from 'lucide-react';
import BridalDetailsStep from './BridalDetailsStep';
import PaymentStep from './PaymentStep';
import BookingConfirmed from './BookingConfirmed';

const PACKAGES = [
  {
    id: 'premium',
    name: 'Premium Package',
    icon: '💎',
    price: '₹32,000',
    desc: 'Perfect for intimate functions',
    popular: false,
    features: ['HD Makeup', 'Hairstyling', 'Saree Draping', 'Premium Products', 'Touch-up', '2 Hours Service'],
  },
  {
    id: 'royal',
    name: 'Royal Package',
    icon: '👑',
    price: '₹50,000',
    desc: 'Our signature royal experience',
    popular: true,
    features: ['HD Airbrush Makeup', 'Hairstyling', 'Saree Draping', 'Premium Products', 'Trial Session', 'Touch-up & Retouch', 'Lashes Included', 'On-location Service'],
  },
  {
    id: 'luxury',
    name: 'Luxury Package',
    icon: '✨',
    price: '₹80,000',
    desc: 'For the ultimate bridal experience',
    popular: false,
    features: ['HD Airbrush Makeup', 'Advanced Hairstyling', 'Saree & Lehenga Draping', 'Luxury Premium Products', 'Trial Session', 'Touch-up & Retouch', 'Lashes Included', 'On-location Service', 'Assistant Support'],
  },
];

const ADDONS = [
  { name: 'Extra Touch-up', price: '₹1,000', image: '/mood_eye.png' },
  { name: 'Guest Makeup', price: '₹2,000', image: '/digital_twin_portrait.png' },
  { name: 'Hair Extensions', price: '₹4,000', image: '/mood_hair.png' },
  { name: 'Nail Artist', price: '₹2,500', image: '/mood_walk.png' },
  { name: 'Premium Lashes', price: '₹1,500', image: '/mood_jewelry.png' },
];

const INCLUDED = [
  { icon: '💄', title: 'Skin Preparation', sub: 'Premium skincare for glowing base' },
  { icon: '✨', title: 'Airbrush Makeup', sub: 'Long lasting, sweat & smudge proof' },
  { icon: '💇', title: 'Hairstyling', sub: 'Customized hairstyle that lasts all day' },
  { icon: '🥻', title: 'Saree Draping', sub: 'Perfect draping for all saree types' },
  { icon: '💎', title: 'Premium Jewellery', sub: 'Jewellery setting assistance' },
  { icon: '📋', title: 'Pre-Bridal Consultation', sub: 'Personalized consultation before the big day' },
];

const HIGHLIGHTS = [
  { icon: '💄', title: 'HD Airbrush Makeup', sub: 'Long lasting & camera ready' },
  { icon: '💇', title: 'Hairstyling', sub: 'Premium hairstyling by experts' },
  { icon: '🥻', title: 'Saree Draping', sub: 'Perfect draping assistance' },
  { icon: '✨', title: 'Premium Products', sub: 'High-end branded products' },
  { icon: '🌸', title: 'Trial Session', sub: 'Makeup & hair trial included' },
  { icon: '📍', title: 'On-location Service', sub: 'Available at your venue' },
  { icon: '🔄', title: 'Touch-up & Retouch', sub: 'Complete touch-up and retouch' },
  { icon: '👁', title: 'Lashes Included', sub: 'Premium lashes for perfect look' },
];

const TABS_TOP = ['Overview', 'Packages', 'Portfolio', 'Reviews (1200+)', 'FAQs'];

export default function PackageDetails({ onBack, onNavigate }) {
  const [selectedPkg, setSelectedPkg] = useState('royal');
  const [selectedDate] = useState('12 Dec 2025');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [wishlist, setWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState('Packages');
  const [showBridalDetails, setShowBridalDetails] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showConfirmed, setShowConfirmed] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [showMoreSlots, setShowMoreSlots] = useState(false);

  if (showConfirmed) return (
    <BookingConfirmed 
      onBack={() => { setShowConfirmed(false); setShowBridalDetails(true); }} 
      onViewBooking={onBack} 
      onDashboard={onBack} 
    />
  );

  if (showPayment) return (
    <PaymentStep 
      onBack={() => { setShowPayment(false); setShowBridalDetails(true); }} 
      onPaymentSuccess={() => { setShowPayment(false); setShowConfirmed(true); }} 
    />
  );

  if (showBridalDetails) return (
    <BridalDetailsStep onBack={() => setShowBridalDetails(false)} onNext={() => { setShowBridalDetails(false); setShowPayment(true); }} />
  );

  const pkg = PACKAGES.find(p => p.id === selectedPkg);

  return (
    <div className="animate-fade-in" style={{ padding: '0 0 40px 0' }}>

      {/* Top nav bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <button className="planner-back-btn" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Artist Profile
        </button>
        {/* Page tabs */}
        <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid var(--card-border)' }}>
          {TABS_TOP.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 16px', background: 'transparent', border: 'none', borderBottom: activeTab === tab ? '2px solid var(--maroon-btn)' : '2px solid transparent', marginBottom: '-2px', fontFamily: 'var(--font-btn)', fontSize: '0.8rem', fontWeight: 600, color: activeTab === tab ? 'var(--maroon-btn)' : 'var(--text-muted)', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'color 0.2s' }}>
              {tab}
            </button>
          ))}
        </div>
        <div style={{ width: 140 }} />
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px', alignItems: 'start' }}>

        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* ── OVERVIEW TAB ── */}
          {activeTab === 'Overview' && (
            <>

              {/* Hero featured package card */}
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '0' }}>
                  <div style={{ position: 'relative' }}>
                    <img src="/bridal_lehenga.png" alt="Royal Bridal Package" style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 240, display: 'block' }} />
                    <span style={{ position: 'absolute', top: 12, left: 12, background: 'var(--maroon-btn)', color: 'var(--text-white)', fontSize: '0.62rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20, fontFamily: 'var(--font-btn)' }}>Most Booked</span>
                  </div>
                  <div style={{ padding: '22px 22px 22px 22px', textAlign: 'left', position: 'relative' }}>
                    <button onClick={() => setWishlist(!wishlist)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer' }}>
                      <Heart size={18} style={{ color: wishlist ? 'var(--maroon-btn)' : 'var(--text-muted)', fill: wishlist ? 'var(--maroon-btn)' : 'none' }} />
                    </button>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--sidebar-bg)', fontWeight: 700, marginBottom: '4px' }}>Royal Bridal Package 👑</h2>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px' }}>Our signature package for a timeless royal look</p>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', color: 'var(--text-dark)', marginBottom: '12px', alignItems: 'center' }}>
                      <span style={{ color: 'var(--gold-accent)', fontWeight: 700 }}>★ 4.9 (1200+ Reviews)</span>
                      <span>|</span>
                      <span>👥 500+ Brides</span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '2px' }}>₹50,000</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '12px' }}>Inclusive of all taxes</div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                      A complete bridal beauty experience with premium products and personalized care for your special day.
                    </p>
                    <div style={{ display: 'flex', gap: '20px' }}>
                      {[{ icon: '💄', label: 'HD Makeup' }, { icon: '✨', label: 'Premium Products' }, { icon: '👥', label: 'Experienced Team' }, { icon: '🌸', label: 'Trial Included' }].map(f => (
                        <div key={f.label} style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '1.3rem', marginBottom: '4px' }}>{f.icon}</div>
                          <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontFamily: 'var(--font-btn)', fontWeight: 500 }}>{f.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* What's Included */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '14px' }}>
                  What's Included in {pkg?.name || 'Royal Package'}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
                  {INCLUDED.map(item => (
                    <div key={item.title} style={{ textAlign: 'center', padding: '8px 4px' }}>
                      <div style={{ fontSize: '1.6rem', marginBottom: '6px' }}>{item.icon}</div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)', marginBottom: '4px', lineHeight: 1.3 }}>{item.title}</div>
                      <div style={{ fontSize: '0.63rem', color: 'var(--text-muted)', lineHeight: 1.35 }}>{item.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom trust bar */}
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {[
                  { icon: '✅', label: '100% Satisfaction', sub: 'We ensure you look perfect' },
                  { icon: '👩‍🎨', label: 'Expert Professionals', sub: 'Trained & certified artists' },
                  { icon: '✨', label: 'Premium Products', sub: 'Only high-end brands' },
                  { icon: '⏰', label: 'On-time Guarantee', sub: 'We value your time' },
                  { icon: '🔒', label: 'Secure Booking', sub: 'Safe & secure payments' },
                ].map(t => (
                  <div key={t.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{t.icon}</div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)', marginBottom: '2px' }}>{t.label}</div>
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>{t.sub}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── PACKAGES TAB ── */}
          {activeTab === 'Packages' && (
            <>
              {/* Choose Your Package */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '16px' }}>Choose Your Package</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                  {PACKAGES.map(p => (
                    <div key={p.id} style={{ position: 'relative', border: selectedPkg === p.id ? '2px solid var(--maroon-btn)' : '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', padding: '18px', background: selectedPkg === p.id ? 'var(--card-bg)' : 'var(--card-bg-elevated)', cursor: 'pointer', transition: 'all 0.2s', boxShadow: selectedPkg === p.id ? 'var(--shadow-md)' : 'none' }}
                      onClick={() => setSelectedPkg(p.id)}
                    >
                      {p.popular && (
                        <div style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', background: 'var(--maroon-btn)', color: 'var(--text-white)', fontSize: '0.62rem', fontWeight: 700, padding: '3px 12px', borderRadius: 20, whiteSpace: 'nowrap', fontFamily: 'var(--font-btn)' }}>Most Popular</div>
                      )}
                      <div style={{ fontSize: '1.4rem', marginBottom: '6px' }}>{p.icon}</div>
                      <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '2px' }}>{p.name}</h4>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--maroon-btn)', marginBottom: '4px' }}>{p.price}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{p.desc}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
                        {p.features.map(f => (
                          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.73rem', color: 'var(--text-dark)' }}>
                            <span style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(196,159,87,0.12)', color: 'var(--gold-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', fontWeight: 700, flexShrink: 0 }}>✓</span>
                            {f}
                          </div>
                        ))}
                      </div>
                      {selectedPkg === p.id ? (
                        <button style={{ width: '100%', background: 'var(--maroon-btn)', color: 'var(--text-white)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '9px', fontFamily: 'var(--font-btn)', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                          Selected ✓
                        </button>
                      ) : (
                        <button style={{ width: '100%', background: 'transparent', color: 'var(--text-dark)', border: '1.5px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '9px', fontFamily: 'var(--font-btn)', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s' }}
                          onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--maroon-btn)'; e.currentTarget.style.color = 'var(--maroon-btn)'; }}
                          onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.color = 'var(--text-dark)'; }}
                        >
                          Select Package
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Add-on Services */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  Add-on Services <span style={{ color: 'var(--gold-accent)', fontSize: '0.9rem' }}>✨</span>
                </h3>
                <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {ADDONS.map(addon => (
                    <div key={addon.name} style={{ flexShrink: 0, width: 110, border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--card-bg)', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
                      onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(64,16,23,0.08)'}
                      onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
                    >
                      <div style={{ height: 70, overflow: 'hidden' }}>
                        <img src={addon.image} alt={addon.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      </div>
                      <div style={{ padding: '8px 8px 10px', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)', marginBottom: '4px', lineHeight: 1.3 }}>{addon.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--maroon-btn)', fontWeight: 700, fontFamily: 'var(--font-btn)', marginBottom: '6px' }}>{addon.price}</div>
                        <button onClick={() => setSelectedAddons(prev => prev.includes(addon.name) ? prev.filter(a => a !== addon.name) : [...prev, addon.name])} style={{ width: '100%', background: selectedAddons.includes(addon.name) ? 'var(--maroon-btn)' : 'rgba(196,159,87,0.1)', color: selectedAddons.includes(addon.name) ? 'var(--text-white)' : 'var(--gold-accent)', border: selectedAddons.includes(addon.name) ? '1px solid var(--maroon-btn)' : '1px solid rgba(196,159,87,0.3)', borderRadius: 6, padding: '4px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                          <Plus size={12} /> {selectedAddons.includes(addon.name) ? 'Added' : 'Add'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── PORTFOLIO TAB ── */}
          {activeTab === 'Portfolio' && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '16px' }}>Portfolio</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {[
                  '/bridal_lehenga.png', '/countdown_bride.png', '/digital_twin_portrait.png', '/recommend_salon1.png',
                  '/mood_jewelry.png', '/mood_henna.png', '/mood_walk.png', '/recommend_salon2.png',
                  '/mood_eye.png', '/mood_hair.png', '/luxury_salon.png', '/faceshape_profile.png',
                ].map((img, i) => (
                  <div key={i} style={{ aspectRatio: '1', borderRadius: 'var(--radius-md)', overflow: 'hidden', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>
                    <img src={img} alt={`Portfolio ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s' }}
                      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── REVIEWS TAB ── */}
          {activeTab === 'Reviews (1200+)' && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '16px' }}>What Brides Say</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { name: 'Ananya Sharma', rating: 5, text: 'Absolutely stunning work! She understood exactly what I wanted. The makeup was flawless and lasted all night. Highly recommend! 🌟', date: '12 Dec 2025' },
                  { name: 'Meera Kapoor', rating: 5, text: 'Best bridal artist I have ever worked with. Professional, punctual, and incredibly talented!', date: '28 Nov 2025' },
                  { name: 'Priya Patel', rating: 4, text: 'Great experience overall. The trial session was very helpful in finalizing the look.', date: '15 Oct 2025' },
                ].map((r, i) => (
                  <div key={i} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', padding: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)' }}>{r.name}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{r.date}</div>
                      </div>
                      <div style={{ color: 'var(--gold-accent)', fontSize: '0.82rem' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-dark)', lineHeight: 1.5, margin: 0 }}>"{r.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── FAQs TAB ── */}
          {activeTab === 'FAQs' && (
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '16px' }}>Frequently Asked Questions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {[
                  { q: 'What is included in the bridal package?', a: 'Our packages include HD/airbrush makeup, hairstyling, saree draping, premium products, trial session, touch-up, and on-location service.' },
                  { q: 'How long does the bridal makeup take?', a: 'Bridal makeup typically takes 2-3 hours. We recommend starting early morning to ensure ample time for a flawless look.' },
                  { q: 'Do you offer trial sessions?', a: 'Yes, complimentary trial sessions are included with all packages. Book your trial at least 2 weeks before the wedding.' },
                  { q: 'What products do you use?', a: 'We use premium international brands like MAC, Huda Beauty, Charlotte Tilbury, and Kryolan for long-lasting results.' },
                  { q: 'Can I customize my package?', a: 'Absolutely! You can add services like hair extensions, guest makeup, nail art, and more. Contact our team for a custom quote.' },
                ].map((faq, i) => (
                  <details key={i} style={{ borderBottom: '1px solid var(--card-border)', padding: '12px 0' }}>
                    <summary style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: 'var(--gold-accent)', fontSize: '0.7rem' }}>▸</span> {faq.q}
                    </summary>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: '8px 0 0', paddingLeft: 20 }}>{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL — always visible */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: 20 }}>

          {/* Book This Package */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              📅 Book This Package
            </h3>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)', display: 'block', marginBottom: '6px' }}>Select Date</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--card-border)', borderRadius: 8, padding: '9px 12px', cursor: 'pointer' }}>
                <span style={{ fontSize: '0.9rem' }}>📅</span>
                <span style={{ flex: 1, fontSize: '0.83rem', fontFamily: 'var(--font-btn)', fontWeight: 600 }}>{selectedDate}</span>
                <ChevronDown size={15} style={{ color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)', display: 'block', marginBottom: '6px' }}>Select Time</label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                {['10:00 AM', '01:00 PM', '04:00 PM'].map(t => (
                  <button key={t} onClick={() => setSelectedTime(t)} style={{ flex: 1, padding: '8px 4px', border: '1px solid', borderColor: selectedTime === t ? 'var(--maroon-btn)' : 'var(--card-border)', borderRadius: 6, background: selectedTime === t ? 'var(--maroon-btn)' : 'transparent', color: selectedTime === t ? 'var(--text-white)' : 'var(--text-dark)', fontFamily: 'var(--font-btn)', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                    {t}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowMoreSlots(prev => !prev)} style={{ background: 'none', border: 'none', fontSize: '0.72rem', color: 'var(--maroon-btn)', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-btn)', display: 'flex', alignItems: 'center', gap: 4 }}>
                {showMoreSlots ? 'Less Slots' : 'More Slots'} <ChevronDown size={12} style={{ transform: showMoreSlots ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {showMoreSlots && (
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  {['6:00 AM', '7:00 AM', '8:00 AM', '11:00 AM', '2:00 PM'].map(t => (
                    <button key={t} onClick={() => setSelectedTime(t)} style={{ flex: 1, padding: '8px 4px', border: '1px solid', borderColor: selectedTime === t ? 'var(--maroon-btn)' : 'var(--card-border)', borderRadius: 6, background: selectedTime === t ? 'var(--maroon-btn)' : 'transparent', color: selectedTime === t ? 'var(--text-white)' : 'var(--text-dark)', fontFamily: 'var(--font-btn)', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button style={{ width: '100%', background: 'var(--maroon-btn)', color: 'var(--text-white)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '12px', fontFamily: 'var(--font-btn)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8, transition: 'opacity 0.2s' }}
              onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
              onMouseOut={e => e.currentTarget.style.opacity = '1'}
              onClick={() => setShowBridalDetails(true)}
            >
              Proceed to Book <ArrowRight size={16} />
            </button>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center', fontFamily: 'var(--font-btn)' }}>
              🔥 100 people booked this package this month
            </div>
          </div>

          {/* Package Highlights */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '18px', boxShadow: 'var(--shadow-sm)' }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '12px' }}>Package Highlights</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {HIGHLIGHTS.map(h => (
                <div key={h.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ fontSize: '0.9rem', flexShrink: 0, marginTop: 1 }}>{h.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)' }}>{h.title}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>{h.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Need Custom Package */}
          <div style={{ background: 'linear-gradient(135deg, #fff9f5 0%, #fef3ea 100%)', border: '1px solid rgba(196,159,87,0.25)', borderRadius: 'var(--radius-md)', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '4px' }}>Need Custom Package?</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '12px' }}>Let's create a package that's perfect for you.</div>
            <button onClick={() => { if (onNavigate) onNavigate('messages'); }} style={{ background: 'var(--maroon-light)', color: 'var(--maroon-btn)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '9px 20px', fontFamily: 'var(--font-btn)', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              💬 Chat with Expert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
