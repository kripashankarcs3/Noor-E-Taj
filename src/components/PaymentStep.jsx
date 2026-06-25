import { useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronDown, Sparkles, Check } from 'lucide-react';

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icons: ['📱'], desc: 'Google Pay, PhonePe, Paytm' },
  { id: 'card', label: 'Debit/Credit Card', icons: ['💳'], desc: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', label: 'Net Banking', icons: ['🏦'], desc: 'All major banks' },
  { id: 'wallet', label: 'Noor Wallet', icons: ['🪙'], desc: 'Balance: ₹18,750' },
];

const STEPS = [
  { n: '1', label: 'Date & Time', done: true },
  { n: '2', label: 'Bridal Details', done: true },
  { n: '3', label: 'Venue Details', done: true },
  { n: '4', label: 'Payment', active: true },
];

export default function PaymentStep({ onBack, onPaymentSuccess }) {
  const [method, setMethod] = useState('upi');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [upiVerified, setUpiVerified] = useState(false);
  const [showTnc, setShowTnc] = useState(false);
  const [showCancelPolicy, setShowCancelPolicy] = useState(false);
  const [toast, setToast] = useState('');

  const total = 60416;
  const discount = promoApplied ? 3000 : 0;
  const finalTotal = total - discount;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'NOOR15') {
      setPromoApplied(true);
    }
  };

  const handlePay = () => {
    if (!agreeTerms) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onPaymentSuccess();
    }, 1500);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0 0 40px' }}>
      {/* Step bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <button className="planner-back-btn" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Venue Details
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', alignItems: 'start' }}>

        {/* LEFT — Payment Form */}
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--sidebar-bg)', fontWeight: 700, marginBottom: '4px' }}>
            Complete Your Booking <span style={{ color: 'var(--gold-accent)' }}>✨</span>
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '28px' }}>Choose your preferred payment method</p>

          {/* Payment Method Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
            {PAYMENT_METHODS.map(m => (
              <div key={m.id} onClick={() => setMethod(m.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', border: `2px solid ${method === m.id ? 'var(--maroon-btn)' : 'var(--card-border)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', background: method === m.id ? 'var(--maroon-light)' : 'var(--card-bg)', transition: 'all 0.2s' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${method === m.id ? 'var(--maroon-btn)' : 'var(--text-muted)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {method === m.id && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--maroon-btn)' }} />}
                </div>
                <span style={{ fontSize: '1.2rem' }}>{m.icons[0]}</span>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)' }}>{m.label}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{m.desc}</div>
                </div>
                <ChevronDown size={16} style={{ color: 'var(--text-muted)', opacity: method === m.id ? 1 : 0.3 }} />
              </div>
            ))}
          </div>

          {/* UPI Input (conditional) */}
          {method === 'upi' && (
            <div style={{ marginBottom: '24px', padding: '18px', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(196,159,87,0.12)' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-btn)', display: 'block', marginBottom: '8px' }}>Enter your UPI ID</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input value={upiId} onChange={e => { setUpiId(e.target.value); setUpiVerified(false); }} placeholder="example@upi" style={{ flex: 1, border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: '0.85rem', outline: 'none', fontFamily: 'var(--font-body)' }} />
                <button className="planner-next-btn" style={{ padding: '10px 20px', fontSize: '0.8rem' }} onClick={() => { if (upiId.includes('@') && upiId.length > 3) { setUpiVerified(true); setToast('✅ UPI ID verified!'); setTimeout(() => setToast(''), 2500); } else { setToast('⚠️ Please enter a valid UPI ID'); setTimeout(() => setToast(''), 2500); } }}>{upiVerified ? '✓ Verified' : 'Verify'}</button>
              </div>
            </div>
          )}

          {/* Promo Code */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-btn)', display: 'block', marginBottom: '8px' }}>Have a promo code?</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input value={promoCode} onChange={e => setPromoCode(e.target.value)} placeholder="Enter promo code" disabled={promoApplied}
                style={{ flex: 1, border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: '0.85rem', outline: 'none', fontFamily: 'var(--font-body)', textTransform: 'uppercase' }} />
              {promoApplied ? (
                <div style={{ padding: '10px 18px', background: 'var(--maroon-light)', border: '1px solid var(--success)', borderRadius: 'var(--radius-sm)', color: 'var(--success)', fontWeight: 700, fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-btn)', whiteSpace: 'nowrap' }}>
                  <Check size={16} /> Applied!
                </div>
              ) : (
                <button onClick={handleApplyPromo} style={{ padding: '10px 20px', border: '1.5px solid var(--maroon-btn)', borderRadius: 'var(--radius-sm)', background: 'transparent', color: 'var(--maroon-btn)', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'var(--font-btn)', whiteSpace: 'nowrap' }}>
                  Apply
                </button>
              )}
            </div>
            {promoApplied && <div style={{ fontSize: '0.72rem', color: 'var(--success)', marginTop: '6px', fontWeight: 600 }}>Promo NOOR15 applied! You saved ₹3,000 🎉</div>}
          </div>

          {/* T&C Checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', cursor: 'pointer' }} onClick={() => setAgreeTerms(!agreeTerms)}>
            <div style={{ width: 20, height: 20, borderRadius: '4px', border: `2px solid ${agreeTerms ? 'var(--maroon-btn)' : 'var(--text-muted)'}`, background: agreeTerms ? 'var(--maroon-btn)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {agreeTerms && <span style={{ color: 'var(--text-white)', fontSize: '0.65rem', fontWeight: 700 }}>✓</span>}
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-btn)' }}>
              I agree to the <span style={{ color: 'var(--maroon-btn)', fontWeight: 600, cursor: 'pointer' }} onClick={e => { e.stopPropagation(); setShowTnc(true); }}>Terms & Conditions</span> and <span style={{ color: 'var(--maroon-btn)', fontWeight: 600, cursor: 'pointer' }} onClick={e => { e.stopPropagation(); setShowCancelPolicy(true); }}>Cancellation Policy</span>
            </span>
          </div>

          {/* Pay Button */}
          <button onClick={handlePay} disabled={!agreeTerms || processing}
            style={{ width: '100%', padding: '14px', background: !agreeTerms ? 'var(--text-muted)' : 'var(--maroon-btn)', color: 'var(--text-white)', border: 'none', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-btn)', fontWeight: 700, fontSize: '1rem', cursor: !agreeTerms ? 'not-allowed' : 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {processing ? (
              <>⏳ Processing Payment...</>
            ) : (
              <>Pay ₹{finalTotal.toLocaleString()} <ArrowRight size={18} /></>
            )}
          </button>

          {/* Security badges */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: '20px', padding: '16px 0 0', borderTop: '1px solid var(--card-border)' }}>
            {[
              { icon: '🔒', text: '100% Secure' },
              { icon: '🔐', text: 'Encrypted' },
              { icon: '🛡️', text: 'Protected' },
            ].map(x => (
              <div key={x.text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-btn)' }}>
                <span>{x.icon}</span> {x.text}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Order Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: 20 }}>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={15} style={{ color: 'var(--gold-accent)' }} /> Order Summary
            </h3>
            {/* Artist Info */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px', paddingBottom: '14px', borderBottom: '1px solid var(--card-border)' }}>
              <img src="/digital_twin_portrait.png" alt="Riya" style={{ width: 46, height: 46, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)' }}>Poonam Rawat</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Royal Bridal Package</div>
              </div>
            </div>
            {/* Price breakdown */}
            {[
              { label: 'Base Package', amount: 50000 },
              { label: 'Travel Charges', amount: 1200 },
              { label: 'GST (18%)', amount: 9216 },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-btn)' }}>{item.label}</span>
                <span style={{ fontWeight: 600, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)' }}>₹{item.amount.toLocaleString()}</span>
              </div>
            ))}
            {discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--success)', fontFamily: 'var(--font-btn)' }}>Promo Discount</span>
                <span style={{ fontWeight: 600, color: 'var(--success)' }}>-₹{discount.toLocaleString()}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', marginTop: '8px', borderTop: '2px solid var(--sidebar-bg)', fontSize: '0.9rem' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--sidebar-bg)' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--maroon-btn)', fontSize: '1.1rem' }}>₹{finalTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div style={{ background: 'var(--gold-light)', border: '1px solid rgba(196,159,87,0.2)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.88rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '6px' }}>Cancellation Policy</h4>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Free cancellation up to 48 hours before the appointment.<br />
              50% charge for cancellation within 24-48 hours.<br />
              No refund for cancellation within 24 hours.
            </div>
          </div>

          {/* Need Help */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.88rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '4px' }}>Need Help?</div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '10px' }}>Chat with our payment support team</p>
            <button onClick={() => { setToast('💬 Opening payment support chat...'); setTimeout(() => setToast(''), 2500); }} style={{ width: '100%', background: 'var(--maroon-light)', color: 'var(--maroon-btn)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px', fontFamily: 'var(--font-btn)', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}>
              💬 Chat with Support
            </button>
          </div>
        </div>
      </div>
      {toast && (
        <div style={{ position: 'fixed', bottom: 30, left: '50%', transform: 'translateX(-50%)', background: 'var(--sidebar-bg)', color: 'var(--text-white)', padding: '12px 24px', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-btn)', fontWeight: 600, fontSize: '0.85rem', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', zIndex: 1000 }}>
          {toast}
        </div>
      )}
      {/* T&C Modal */}
      {showTnc && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }} onClick={() => setShowTnc(false)}>
          <div style={{ background: 'var(--card-bg)', maxWidth: 500, width: '90%', borderRadius: 'var(--radius-lg)', padding: '28px', maxHeight: '80vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--sidebar-bg)', marginBottom: '16px' }}>Terms & Conditions</h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
              <p>1. Booking confirmation is subject to artist availability.</p>
              <p>2. Full payment is required to confirm your booking.</p>
              <p>3. Rescheduling requests must be made at least 48 hours in advance.</p>
              <p>4. Noor AI may use anonymized booking data for service improvement.</p>
              <p>5. Promotional codes are non-transferable and cannot be combined.</p>
            </div>
            <button onClick={() => setShowTnc(false)} style={{ marginTop: '16px', padding: '10px 24px', background: 'var(--maroon-btn)', color: 'var(--text-white)', border: 'none', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-btn)', fontWeight: 700, cursor: 'pointer' }}>Got it</button>
          </div>
        </div>
      )}
      {/* Cancellation Policy Modal */}
      {showCancelPolicy && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }} onClick={() => setShowCancelPolicy(false)}>
          <div style={{ background: 'var(--card-bg)', maxWidth: 500, width: '90%', borderRadius: 'var(--radius-lg)', padding: '28px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--sidebar-bg)', marginBottom: '16px' }}>Cancellation Policy</h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
              <p>🟢 <strong>Free cancellation</strong> — up to 48 hours before the appointment.</p>
              <p>🟡 <strong>50% charge</strong> — cancellation within 24-48 hours.</p>
              <p>🔴 <strong>No refund</strong> — cancellation within 24 hours.</p>
            </div>
            <button onClick={() => setShowCancelPolicy(false)} style={{ marginTop: '16px', padding: '10px 24px', background: 'var(--maroon-btn)', color: 'var(--text-white)', border: 'none', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-btn)', fontWeight: 700, cursor: 'pointer' }}>Got it</button>
          </div>
        </div>
      )}
    </div>
  );
}
