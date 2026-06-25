import { useState } from 'react';
import { ArrowLeft, Calendar, Check } from 'lucide-react';

export default function BookingConfirmed({ onViewBooking, onDashboard }) {
  const [confetti] = useState(true);
  const [calToast, setCalToast] = useState('');

  const handleAddToCalendar = () => {
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      'SUMMARY:Royal Bridal Package - Poonam Rawat',
      'DESCRIPTION:Bridal makeup appointment at The Leela Palace',
      `DTSTART:20251212T100000`,
      `DTEND:20251212T140000`,
      'LOCATION:The Leela Palace, New Delhi',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'noor_booking.ics';
    a.click();
    URL.revokeObjectURL(url);
    setCalToast('📅 Calendar event downloaded!');
    setTimeout(() => setCalToast(''), 3000);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0 0 40px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>
        {/* Confetti decoration */}
        {confetti && (
          <div style={{ position: 'relative', height: 80, marginBottom: 10 }}>
            <span style={{ position: 'absolute', left: '15%', top: 10, fontSize: '1.4rem', animation: 'none', opacity: 0.7 }}>🎉</span>
            <span style={{ position: 'absolute', right: '15%', top: 20, fontSize: '1.2rem', opacity: 0.6 }}>✨</span>
            <span style={{ position: 'absolute', left: '30%', top: 30, fontSize: '1rem', opacity: 0.5 }}>🌟</span>
            <span style={{ position: 'absolute', right: '30%', top: 5, fontSize: '1.3rem', opacity: 0.7 }}>🎊</span>
            <span style={{ position: 'absolute', left: '10%', bottom: 0, fontSize: '1.1rem', opacity: 0.6 }}>💫</span>
            <span style={{ position: 'absolute', right: '10%', bottom: 5, fontSize: '1.2rem', opacity: 0.5 }}>🌸</span>
          </div>
        )}

        {/* Green Check Circle */}
        <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 30px rgba(46, 204, 113, 0.3)' }}>
          <Check size={44} style={{ color: 'var(--text-white)' }} />
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--sidebar-bg)', fontWeight: 700, marginBottom: '6px' }}>
          Booking Confirmed! <span style={{ color: 'var(--gold-accent)' }}>🎉</span>
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '28px' }}>
          Your bridal appointment is all set. Get ready to shine! ✨
        </p>

        {/* Booking ID Card */}
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '28px', boxShadow: 'var(--shadow-md)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: '16px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-btn)', fontWeight: 600 }}>Booking ID:</span>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--gold-accent)', letterSpacing: '1px' }}>NOOR12512</span>
          </div>

          <div style={{ width: '100%', height: '1px', background: 'var(--card-border)', marginBottom: '16px' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { icon: '👩‍🎨', label: 'Artist', value: 'Poonam Rawat' },
              { icon: '📅', label: 'Date', value: '12 Dec 2025' },
              { icon: '⏰', label: 'Time', value: '10:00 AM' },
              { icon: '📍', label: 'Venue', value: 'The Leela Palace' },
              { icon: '👑', label: 'Package', value: 'Royal Bridal Package' },
              { icon: '💰', label: 'Amount Paid', value: '₹60,416', amount: true },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--card-border)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-btn)' }}>
                  <span>{row.icon}</span> {row.label}
                </span>
                <span style={{ fontWeight: row.amount ? 700 : 600, color: row.amount ? 'var(--maroon-btn)' : 'var(--text-dark)', fontFamily: 'var(--font-btn)', fontSize: row.amount ? '0.85rem' : '0.78rem' }}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {/* Add to Calendar */}
          <button onClick={handleAddToCalendar} style={{ width: '100%', marginTop: '18px', padding: '10px', border: '1.5px solid var(--card-border)', borderRadius: 'var(--radius-sm)', background: 'transparent', fontFamily: 'var(--font-btn)', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-dark)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Calendar size={16} /> Add to Calendar
          </button>
        </div>

        {/* Success Message */}
        <div style={{ background: 'linear-gradient(135deg, #fff9f5, #fef3ea)', border: '1px solid rgba(196,159,87,0.2)', borderRadius: 'var(--radius-md)', padding: '18px 24px', marginBottom: '24px' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dark)', lineHeight: 1.6, margin: 0 }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem' }}>💕 Your dream wedding journey begins now!</span><br />
            We'll send you a confirmation email with all the details. The artist will reach out to you within 24 hours.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="planner-next-btn" onClick={onViewBooking} style={{ padding: '12px 28px' }}>
            View Booking Details <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
          </button>
          <button className="planner-next-btn" onClick={onDashboard} style={{ background: 'transparent', border: '1.5px solid var(--card-border)', color: 'var(--text-dark)', padding: '12px 28px' }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
        </div>
      </div>
      {calToast && (
        <div style={{ position: 'fixed', bottom: 30, left: '50%', transform: 'translateX(-50%)', background: 'var(--success)', color: 'var(--text-white)', padding: '12px 24px', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-btn)', fontWeight: 600, fontSize: '0.85rem', boxShadow: '0 8px 24px rgba(46,204,113,0.3)', zIndex: 1000 }}>
          {calToast}
        </div>
      )}
    </div>
  );
}
