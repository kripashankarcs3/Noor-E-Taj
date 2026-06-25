import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, Download, ChevronRight, MessageCircle, Circle, X } from 'lucide-react';

export default function BookingDetails({ onBack, onNavigate, bookingStatus = 4 }) {
  const [copied, setCopied] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [showAddServices, setShowAddServices] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [toast, setToast] = useState('');
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [cancelled, setCancelled] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('NOOR12512');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const JOURNEY_LABELS = [
    { label: 'Booking Confirmed', date: '10 Dec' },
    { label: 'Payment Done', date: '11 Dec' },
    { label: 'Details Shared', date: '11 Dec' },
    { label: 'Reminder', date: '12 Dec' },
    { label: 'Appointment Day', date: '12 Dec' },
  ];

  const journeySteps = JOURNEY_LABELS.map((j, i) => ({
    ...j,
    done: i < bookingStatus,
  }));

  const included = [
    'HD Makeup', 'Airbrush Finish', 'Hair Styling',
    'Saree Draping', 'False Lashes', 'Touch-up', 'Premium Products',
  ];

  const changes = [
    { label: 'Reschedule Booking', action: 'reschedule' },
    { label: 'Change Time', action: 'time' },
    { label: 'Add More Services', action: 'addservices' },
    { label: 'Cancel Booking', action: 'cancel' },
  ];

  const addonServices = [
    { name: 'Hair Extensions', price: '₹3,000' },
    { name: 'Professional Photography', price: '₹5,000' },
    { name: 'Touch-up Kit', price: '₹1,500' },
    { name: 'Bridal Trial Session', price: '₹4,000' },
  ];

  const [selectedAddons, setSelectedAddons] = useState([]);

  const toggleAddon = (name) => {
    setSelectedAddons(prev => prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]);
  };

  const handleCancelBooking = () => {
    if (!cancelReason) return;
    setShowCancelModal(false);
    setCancelReason('');
    setCancelled(true);
    showToast('Booking cancelled successfully. Refund will be processed within 5-7 business days.');
  };

  const handleConfirmTime = () => {
    if (!selectedTime) return;
    setShowTimeModal(false);
    setSelectedTime('');
    showToast(`Booking time changed to ${selectedTime}`);
  };

  const handleReschedule = () => {
    if (!rescheduleDate || !rescheduleTime) return;
    setShowRescheduleModal(false);
    showToast(`Booking rescheduled to ${rescheduleDate} at ${rescheduleTime}`);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0 0 40px 0' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <button className="planner-back-btn" onClick={onBack} style={{ marginBottom: '10px' }}>
          <ArrowLeft size={16} /> Back to Bookings
        </button>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.9rem', color: 'var(--sidebar-bg)', fontWeight: 700, marginBottom: '4px' }}>
          Booking Details ✨
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          View your complete booking information and upcoming schedule
        </p>
      </div>

      {cancelled && (
        <div style={{ background: `linear-gradient(135deg, var(--danger), #c0392b)`, borderRadius: 'var(--radius-md)', padding: '14px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: 'var(--text-white)', fontSize: '1.2rem' }}>✕</span>
          <div>
            <strong style={{ color: 'var(--text-white)', fontSize: '0.9rem', fontFamily: 'var(--font-heading)' }}>Booking Cancelled</strong>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.78rem', margin: 0 }}>This booking has been cancelled. Refund will be processed within 5-7 business days.</p>
          </div>
        </div>
      )}

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', alignItems: 'start' }}>

        {/* ── LEFT COLUMN ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Artist Card */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid rgba(196,159,87,0.18)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }} onClick={() => { if (onNavigate) onNavigate('marketplace'); }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              {/* Image with badge */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <img
                  src="/digital_twin_portrait.png"
                  alt="Poonam Rawat"
                  style={{ width: '100px', height: '100px', borderRadius: 'var(--radius-md)', objectFit: 'cover', border: '2px solid rgba(196,159,87,0.25)' }}
                />
                <span style={{ position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)', background: 'var(--success)', color: 'var(--text-white)', fontSize: '0.65rem', fontWeight: 700, padding: '2px 10px', borderRadius: '20px', whiteSpace: 'nowrap', fontFamily: 'var(--font-btn)' }}>
                  ✓ Confirmed
                </span>
              </div>

              {/* Details */}
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--sidebar-bg)', fontWeight: 700, margin: 0 }}>
                    Poonam Rawat
                  </h2>
                  <span className="artist-verified">✓ Verified</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>Premium Bridal Artist • South Delhi</p>

                <div style={{ display: 'flex', gap: '16px', fontSize: '0.78rem', color: 'var(--text-dark)', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <span>⭐ <strong>4.9</strong> (248 reviews)</span>
                  <span>💼 <strong>8+</strong> Years Exp</span>
                  <span><MapPin size={12} style={{ color: 'var(--maroon-btn)', display: 'inline' }} /> South Delhi, Delhi</span>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
                  {['Bridal Makeup', 'HD Makeup', 'Airbrush', 'Hair Styling'].map(tag => (
                    <span key={tag} className="artist-tag">{tag}</span>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dark)' }}>
                    <Calendar size={14} style={{ color: 'var(--gold-accent)' }} />
                    <strong>Date:</strong> Friday, 12 December 2025
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dark)' }}>
                    <Clock size={14} style={{ color: 'var(--gold-accent)' }} />
                    <strong>Time:</strong> 6:00 AM – 10:00 AM
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dark)' }}>
                    <MapPin size={14} style={{ color: 'var(--gold-accent)' }} />
                    <strong>Location:</strong> The Leela Palace, New Delhi
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Journey */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid rgba(196,159,87,0.18)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--sidebar-bg)', fontWeight: 700, marginBottom: '20px' }}>
              Your Booking Journey
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
              {/* connecting line */}
              <div style={{ position: 'absolute', top: '16px', left: '10%', right: '10%', height: '2px', background: 'rgba(196,159,87,0.2)', zIndex: 0 }} />
              {journeySteps.map((step, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, flex: 1 }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: step.done ? 'var(--success)' : 'var(--card-bg)',
                    border: step.done ? '2px solid var(--success)' : '2px solid var(--card-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: step.done ? 'var(--text-white)' : 'var(--text-muted)',
                    fontSize: '0.75rem', fontWeight: 700,
                  }}>
                    {step.done ? '✓' : <Circle size={12} />}
                  </div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 600, color: step.done ? 'var(--sidebar-bg)' : 'var(--text-muted)', marginTop: '6px', textAlign: 'center', fontFamily: 'var(--font-btn)' }}>
                    {step.label}
                  </span>
                  <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '2px' }}>{step.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Details + What's Included */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid rgba(196,159,87,0.18)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--sidebar-bg)', fontWeight: 700, marginBottom: '20px' }}>
              Booking Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Left: Bride info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Bride Name', value: 'Priya Sharma' },
                  { label: 'Contact', value: '+91 98765 43210' },
                  { label: 'Email', value: 'priya.sharma@email.com' },
                  { label: 'Wedding Date', value: '12 December 2025' },
                  { label: 'Wedding Venue', value: 'The Leela Palace, New Delhi' },
                  { label: 'Skin Type', value: 'Normal / Wheatish' },
                ].map(item => (
                  <div key={item.label} style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-btn)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>{item.label}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-dark)', fontWeight: 500 }}>{item.value}</div>
                  </div>
                ))}
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-btn)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Notes to Artist</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dark)', background: 'var(--bg-color)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', border: '1px solid var(--card-border)', lineHeight: 1.5 }}>
                    Please use soft glam for Sangeet and classic bridal for Wedding. Prefer nude lips with bold eyes. No heavy contouring.
                  </div>
                </div>
              </div>

              {/* Right: What's included */}
              <div>
                <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-btn)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>What's Included</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {included.map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', color: 'var(--text-dark)' }}>
                      <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(46,204,113,0.12)', border: '1.5px solid var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)', fontSize: '0.65rem', flexShrink: 0 }}>✓</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{ background: 'linear-gradient(135deg, var(--sidebar-bg) 0%, #3d1820 100%)', borderRadius: 'var(--radius-md)', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem', fontFamily: 'var(--font-btn)' }}>
              🔒 Secure Booking — Protected by Noor AI
            </span>
            <button onClick={handleCopy} style={{ background: 'rgba(196,159,87,0.15)', border: '1px solid rgba(196,159,87,0.35)', borderRadius: 'var(--radius-sm)', padding: '6px 14px', color: 'var(--gold-accent)', fontSize: '0.78rem', fontFamily: 'var(--font-btn)', fontWeight: 600, cursor: 'pointer' }}>
              {copied ? '✓ Copied!' : 'Booking ID: NOOR12512 📋'}
            </button>
          </div>
        </div>

        {/* ── RIGHT COLUMN (Sticky Summary Panel) ── */}
        <div style={{ position: 'sticky', top: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Booking Summary */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid rgba(196,159,87,0.18)', borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: 'var(--sidebar-bg)', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              📅 Booking Summary
            </h3>
            {[
              { label: 'Service', value: 'Premium Bridal Package' },
              { label: 'Date', value: '12 Dec 2025' },
              { label: 'Time', value: '6:00 AM – 10:00 AM' },
              { label: 'Location', value: 'The Leela Palace, Delhi' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-btn)' }}>{row.label}</span>
                <span style={{ color: 'var(--text-dark)', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{row.value}</span>
              </div>
            ))}

            <div style={{ borderTop: '1px solid rgba(196,159,87,0.15)', margin: '14px 0', paddingTop: '14px' }}>
              {[
                { label: 'Package Price', value: '₹35,000' },
                { label: 'Travel Charges', value: '₹2,000' },
                { label: 'GST (18%)', value: '₹6,660' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                  <span style={{ color: 'var(--text-dark)', fontWeight: 500 }}>{row.value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', background: 'linear-gradient(135deg, var(--sidebar-bg), #3d1820)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', marginTop: '10px' }}>
                <span style={{ color: 'var(--text-white)', fontFamily: 'var(--font-btn)', fontWeight: 600, fontSize: '0.82rem' }}>Total Amount</span>
                <span style={{ color: 'var(--gold-accent)', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem' }}>₹43,660</span>
              </div>
            </div>

            <button onClick={() => setShowInvoice(true)} style={{ width: '100%', background: 'var(--maroon-btn)', color: 'var(--text-white)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '10px', fontFamily: 'var(--font-btn)', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'opacity 0.2s' }}
              onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
              onMouseOut={e => e.currentTarget.style.opacity = '1'}
            >
              <Download size={14} /> Download Invoice
            </button>
          </div>

          {/* Need Changes Card */}
          <div style={{ background: 'linear-gradient(160deg, var(--sidebar-bg) 0%, #3d1820 100%)', borderRadius: 'var(--radius-lg)', padding: '18px', border: '1px solid rgba(196,159,87,0.15)' }}>
            {cancelled ? (
              <>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', color: 'var(--gold-accent)', fontWeight: 700, marginBottom: '4px' }}>
                  Booking Cancelled
                </h4>
                <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.65)', marginBottom: '0', lineHeight: 1.4 }}>
                  This booking has been cancelled. No further changes can be made.
                </p>
              </>
            ) : (
              <>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', color: 'var(--gold-accent)', fontWeight: 700, marginBottom: '4px' }}>
                  Need to Make Changes?
                </h4>
                <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.65)', marginBottom: '14px', lineHeight: 1.4 }}>
                  We're here to help you with your booking.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {changes.map(item => (
                    <button key={item.label}
                      onClick={() => {
                        if (item.action === 'cancel') setShowCancelModal(true);
                        else if (item.action === 'reschedule') setShowRescheduleModal(true);
                        else if (item.action === 'addservices') setShowAddServices(true);
                        else if (item.action === 'time') setShowTimeModal(true);
                      }}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', color: 'rgba(255,255,255,0.85)', fontSize: '0.78rem', fontFamily: 'var(--font-btn)', cursor: 'pointer', transition: 'background 0.2s' }}
                      onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                      onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    >
                      {item.label} <ChevronRight size={14} style={{ color: 'var(--gold-accent)' }} />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Need Help */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid rgba(196,159,87,0.18)', borderRadius: 'var(--radius-lg)', padding: '16px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '10px', fontFamily: 'var(--font-heading)' }}>Need Help?</p>
            <button onClick={() => { if (onNavigate) onNavigate('messages'); }} style={{ width: '100%', background: 'var(--maroon-light)', color: 'var(--maroon-btn)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '9px', fontFamily: 'var(--font-btn)', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <MessageCircle size={14} /> Chat with Support
            </button>
          </div>
        </div>
      </div>
      {/* ── CANCEL MODAL ── */}
      {showCancelModal && (
        <div onClick={() => setShowCancelModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', padding: '28px', width: 420, maxWidth: '90vw', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--sidebar-bg)', margin: 0 }}>Cancel Booking</h3>
              <button onClick={() => setShowCancelModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
            </div>
            <div style={{ background: 'var(--maroon-light)', border: '1px solid rgba(132,35,44,0.12)', borderRadius: 'var(--radius-sm)', padding: '12px', marginBottom: '16px', fontSize: '0.75rem', color: 'var(--maroon-btn)', fontFamily: 'var(--font-btn)', lineHeight: 1.4 }}>
              ⚠️ Cancellation Policy: Non-refundable after 24 hours before the event. A cancellation fee may apply.
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)', display: 'block', marginBottom: '6px' }}>Reason for Cancellation</label>
              <select value={cancelReason} onChange={e => setCancelReason(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--card-border)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-btn)', fontSize: '0.82rem', outline: 'none', background: 'var(--card-bg)' }}>
                <option value="">Select a reason</option>
                <option value="Date changed">Date changed</option>
                <option value="Found another artist">Found another artist</option>
                <option value="Budget constraints">Budget constraints</option>
                <option value="Wedding postponed">Wedding postponed</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowCancelModal(false)} style={{ flex: 1, background: 'transparent', color: 'var(--text-dark)', border: '1.5px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '10px', fontFamily: 'var(--font-btn)', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>Go Back</button>
              <button onClick={handleCancelBooking} style={{ flex: 1, background: 'var(--maroon-btn)', color: 'var(--text-white)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '10px', fontFamily: 'var(--font-btn)', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', opacity: cancelReason ? 1 : 0.5 }}>Confirm Cancellation</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TIME MODAL ── */}
      {showTimeModal && (
        <div onClick={() => setShowTimeModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', padding: '28px', width: 420, maxWidth: '90vw', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--sidebar-bg)', margin: 0 }}>Change Time</h3>
              <button onClick={() => setShowTimeModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
            </div>
            <div style={{ background: 'var(--bg-color)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', marginBottom: '16px', display: 'flex', gap: '12px', fontSize: '0.75rem' }}>
              <div><span style={{ color: 'var(--text-muted)' }}>Current:</span> <strong style={{ color: 'var(--text-dark)' }}>6:00 AM – 10:00 AM</strong></div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)', display: 'block', marginBottom: '10px' }}>Select New Time Slot</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['6:00 AM', '8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM', '8:00 PM'].map(t => (
                  <button key={t} onClick={() => setSelectedTime(t)} style={{ padding: '10px 16px', border: '1px solid', borderColor: selectedTime === t ? 'var(--maroon-btn)' : 'var(--card-border)', borderRadius: 'var(--radius-sm)', background: selectedTime === t ? 'var(--maroon-btn)' : 'transparent', color: selectedTime === t ? 'var(--text-white)' : 'var(--text-dark)', fontFamily: 'var(--font-btn)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', flex: '1 0 calc(50% - 4px)' }}>{t}</button>
                ))}
              </div>
            </div>
            <button onClick={handleConfirmTime} style={{ width: '100%', background: 'var(--maroon-btn)', color: 'var(--text-white)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '11px', fontFamily: 'var(--font-btn)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', opacity: selectedTime ? 1 : 0.5 }}>
              Confirm New Time
            </button>
          </div>
        </div>
      )}

      {/* ── RESCHEDULE MODAL ── */}
      {showRescheduleModal && (
        <div onClick={() => setShowRescheduleModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', padding: '28px', width: 420, maxWidth: '90vw', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--sidebar-bg)', margin: 0 }}>Reschedule Booking</h3>
              <button onClick={() => setShowRescheduleModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
            </div>
            <div style={{ background: 'var(--bg-color)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', marginBottom: '16px', display: 'flex', gap: '12px', fontSize: '0.75rem' }}>
              <div><span style={{ color: 'var(--text-muted)' }}>Current:</span> <strong style={{ color: 'var(--text-dark)' }}>12 Dec 2025 — 10:00 AM</strong></div>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)', display: 'block', marginBottom: '6px' }}>New Date</label>
              <input type="date" value={rescheduleDate} onChange={e => setRescheduleDate(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--card-border)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-btn)', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)', display: 'block', marginBottom: '6px' }}>New Time</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['6:00 AM', '10:00 AM', '1:00 PM', '4:00 PM', '7:00 PM'].map(t => (
                  <button key={t} onClick={() => setRescheduleTime(t)} style={{ flex: 1, padding: '8px 4px', border: '1px solid', borderColor: rescheduleTime === t ? 'var(--maroon-btn)' : 'var(--card-border)', borderRadius: 'var(--radius-sm)', background: rescheduleTime === t ? 'var(--maroon-btn)' : 'transparent', color: rescheduleTime === t ? 'var(--text-white)' : 'var(--text-dark)', fontFamily: 'var(--font-btn)', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}>{t}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)', display: 'block', marginBottom: '6px' }}>Reason</label>
              <select value={rescheduleReason} onChange={e => setRescheduleReason(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--card-border)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-btn)', fontSize: '0.82rem', outline: 'none', background: 'var(--card-bg)' }}>
                <option value="">Select a reason</option>
                <option value="Schedule conflict">Schedule conflict</option>
                <option value="Wedding date changed">Wedding date changed</option>
                <option value="Venue change">Venue change</option>
              </select>
            </div>
            <button onClick={handleReschedule} style={{ width: '100%', background: 'var(--maroon-btn)', color: 'var(--text-white)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '11px', fontFamily: 'var(--font-btn)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', opacity: rescheduleDate && rescheduleTime ? 1 : 0.5 }}>
              Confirm Reschedule
            </button>
          </div>
        </div>
      )}

      {/* ── ADD SERVICES MODAL ── */}
      {showAddServices && (
        <div onClick={() => setShowAddServices(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', padding: '28px', width: 420, maxWidth: '90vw', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--sidebar-bg)', margin: 0 }}>Add More Services</h3>
              <button onClick={() => setShowAddServices(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {addonServices.map(s => (
                <div key={s.name} onClick={() => toggleAddon(s.name)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', border: '1.5px solid', borderColor: selectedAddons.includes(s.name) ? 'var(--maroon-btn)' : 'var(--card-border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: selectedAddons.includes(s.name) ? 'var(--maroon-light)' : 'var(--card-bg-elevated)' }}>
                  <div style={{ width: 20, height: 20, borderRadius: 4, border: '2px solid', borderColor: selectedAddons.includes(s.name) ? 'var(--maroon-btn)' : 'var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {selectedAddons.includes(s.name) && <span style={{ color: 'var(--maroon-btn)', fontSize: '0.7rem', fontWeight: 700 }}>✓</span>}
                  </div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)' }}>{s.name}</div>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--maroon-btn)', fontFamily: 'var(--font-btn)' }}>{s.price}</div>
                </div>
              ))}
            </div>
            <button onClick={() => { setShowAddServices(false); showToast(`${selectedAddons.length} service(s) added successfully!`); setSelectedAddons([]); }} style={{ width: '100%', background: 'var(--maroon-btn)', color: 'var(--text-white)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '11px', fontFamily: 'var(--font-btn)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
              Add Selected ({selectedAddons.length})
            </button>
          </div>
        </div>
      )}

      {/* ── INVOICE MODAL ── */}
      {showInvoice && (
        <div onClick={() => setShowInvoice(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', padding: '32px', width: 480, maxWidth: '90vw', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>🧾</div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--sidebar-bg)', margin: '0 0 4px' }}>Invoice — NOOR12512</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Issued on 11 Dec 2025</p>
            </div>
            <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '16px', marginBottom: '16px' }}>
              {[
                { label: 'Premium Bridal Package', value: '₹35,000' },
                { label: 'Travel Charges', value: '₹2,000' },
                { label: 'GST (18%)', value: '₹6,660' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.82rem' }}>
                  <span style={{ color: 'var(--text-dark)' }}>{row.label}</span>
                  <span style={{ color: 'var(--text-dark)', fontWeight: 600 }}>{row.value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid var(--sidebar-bg)', paddingTop: '10px', marginTop: '8px' }}>
                <span style={{ fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-heading)', fontSize: '0.95rem' }}>Total Paid</span>
                <span style={{ fontWeight: 700, color: 'var(--maroon-btn)', fontFamily: 'var(--font-heading)', fontSize: '1.1rem' }}>₹43,660</span>
              </div>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '16px' }}>
              Poonam Rawat · South Delhi · GST: 07AABCU9603R1Z7<br />
              Thank you for choosing Noor AI!
            </div>
            <button onClick={() => { const invoiceText = `INVOICE - NOOR12512\nIssued on 11 Dec 2025\n\nPremium Bridal Package: ₹35,000\nTravel Charges: ₹2,000\nGST (18%): ₹6,660\nTotal Paid: ₹43,660\n\nPoonam Rawat · South Delhi · GST: 07AABCU9603R1Z7\nThank you for choosing Noor AI!`; const blob = new Blob([invoiceText], { type: 'text/plain' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'invoice-NOOR12512.txt'; a.click(); URL.revokeObjectURL(url); showToast('Invoice downloaded!'); }} style={{ width: '100%', background: 'var(--maroon-btn)', color: 'var(--text-white)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '11px', fontFamily: 'var(--font-btn)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Download size={14} /> Download PDF
            </button>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: 'var(--sidebar-bg)', color: 'var(--text-white)', padding: '10px 24px', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-btn)', fontSize: '0.82rem', zIndex: 2000, boxShadow: 'var(--shadow-md)' }}>
          {toast}
        </div>
      )}
    </div>
  );
}
