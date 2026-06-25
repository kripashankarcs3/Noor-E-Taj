import { useState } from 'react';
import { ArrowLeft, Copy, MessageCircle } from 'lucide-react';

const OFFER_TABS = ['All Offers', 'Bank Offers', 'Noor AI Offers', 'Seasonal Offers', 'Referral Offers'];

const OFFERS = [
  { id: 1, category: 'All', badge: '20%\nOFF', badgeColor: '#fef0f1', badgeText: '#84232c', title: '20% OFF on Premium Bridal Package', desc: 'Get 20% off on all premium bridal packages.', validity: 'Valid till 31 May 2025  |  Min. order ₹20,000', code: 'NOOR20', autoApplied: false },
  { id: 2, category: 'All', badge: '₹2000\nOFF', badgeColor: '#fff8ec', badgeText: '#c49f57', title: 'Flat ₹2000 OFF on Bookings', desc: 'Use this code and get flat ₹2000 off on your booking.', validity: 'Valid till 15 Jun 2025  |  Min. order ₹25,000', code: 'FLAT2000', autoApplied: false },
  { id: 3, category: 'Bank', badge: '🏦', badgeColor: '#f0f4ff', badgeText: '#3a5ab8', title: '10% Instant Discount with HDFC Cards', desc: 'Get 10% instant discount up to ₹3000 on HDFC Credit Cards.', validity: 'Valid till 30 Jun 2025', code: null, autoApplied: true },
  { id: 4, category: 'Bank', badge: '₹500\nCASHBACK', badgeColor: '#edfdf5', badgeText: '#2ecc71', title: '₹500 Cashback on SBI Debit Cards', desc: 'Get ₹500 cashback on your first booking with SBI Debit Cards.', validity: 'Valid till 31 Jul 2025  |  Min. order ₹15,000', code: 'SBICB500', autoApplied: false },
  { id: 5, category: 'Bank', badge: '15%\nOFF', badgeColor: '#fff0f0', badgeText: '#e74c3c', title: '15% OFF with ICICI Credit Cards', desc: 'Avail 15% off up to ₹5000 on ICICI Bank Credit Cards.', validity: 'Valid till 15 Aug 2025  |  Min. order ₹30,000', code: 'ICICI15', autoApplied: false },
  { id: 6, category: 'Noor AI', badge: '✨AI', badgeColor: '#fef7e8', badgeText: '#c49f57', title: 'AI Recommended — 10% OFF', desc: 'Exclusive AI-recommended discount based on your preferences.', validity: 'Valid till 30 Jun 2025  |  Personalized', code: 'AI10', autoApplied: false },
  { id: 7, category: 'Noor AI', badge: '🆓', badgeColor: '#f0e6ff', badgeText: '#8b5cf6', title: 'Free Trial Session', desc: 'Complimentary trial makeup session with any premium package.', validity: 'Valid on bookings above ₹40,000', code: null, autoApplied: true },
  { id: 8, category: 'Seasonal', badge: '🌸', badgeColor: '#fce4ec', badgeText: '#e91e63', title: 'Summer Bridal Special — 25% OFF', desc: 'Beat the heat with our summer bridal special discount.', validity: 'Valid till 15 Jul 2025  |  Min. order ₹25,000', code: 'SUMMER25', autoApplied: false },
  { id: 9, category: 'Seasonal', badge: '🎉', badgeColor: '#fff3e0', badgeText: '#ff9800', title: 'Monsoon Wedding Offer — ₹3000 OFF', desc: 'Celebrate monsoon weddings with flat ₹3000 off on all packages.', validity: 'Valid till 31 Aug 2025  |  Min. order ₹35,000', code: 'MONSOON3K', autoApplied: false },
  { id: 10, category: 'Referral', badge: '🎁', badgeColor: '#e8f5e9', badgeText: '#4caf50', title: 'Refer a Friend — Earn ₹1000', desc: 'Refer your friends and earn ₹1000 in Noor Coins on their first booking.', validity: 'No expiry  |  Unlimited referrals', code: 'REFER1000', autoApplied: false },
  { id: 11, category: 'Referral', badge: '2x\n🪙', badgeColor: '#fff8e1', badgeText: '#f9a825', title: 'Double Noor Coins This Month', desc: 'Earn double Noor Coins on all your bookings this month.', validity: 'Valid till 30 Jun 2025', code: '2XCOINS', autoApplied: false },
];

const TRANSACTIONS = [
  { id: 1, icon: '↓', iconBg: '#fef0f1', iconColor: '#84232c', title: 'Payment to Poonam Rawat', date: '12 Dec 2025', amount: '- ₹43,660', amountColor: '#84232c', status: 'Completed', statusColor: '#2ecc71' },
  { id: 2, icon: '+', iconBg: '#edfdf5', iconColor: '#2ecc71', title: 'Added Money', date: '05 Dec 2025', amount: '+ ₹20,000', amountColor: '#2ecc71', status: 'Success', statusColor: '#2ecc71' },
  { id: 3, icon: '↑', iconBg: '#fff8ec', iconColor: '#c49f57', title: 'Refund from Anu Kaushik', date: '28 Nov 2025', amount: '+ ₹5,000', amountColor: '#2ecc71', status: 'Refunded', statusColor: '#c49f57' },
  { id: 4, icon: '↓', iconBg: '#fef0f1', iconColor: '#84232c', title: 'Payment to Chandni Singh', date: '18 Nov 2025', amount: '- ₹15,000', amountColor: '#84232c', status: 'Completed', statusColor: '#2ecc71' },
  { id: 5, icon: '+', iconBg: '#edfdf5', iconColor: '#2ecc71', title: 'Added Money', date: '10 Nov 2025', amount: '+ ₹10,000', amountColor: '#2ecc71', status: 'Success', statusColor: '#2ecc71' },
];

export default function WalletOffers({ onBack }) {
  const [activeTab, setActiveTab] = useState('All Offers');
  const [showAll, setShowAll] = useState(false);
  const [copied, setCopied] = useState('');
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [showRefunds, setShowRefunds] = useState(false);
  const [showAllTx, setShowAllTx] = useState(false);
  const [toast, setToast] = useState('');

  const allTransactions = [...TRANSACTIONS,
    { id: 6, icon: '↓', iconBg: '#fef0f1', iconColor: '#84232c', title: 'Payment to Shruti Sharma', date: '05 Nov 2025', amount: '- ₹20,000', amountColor: '#84232c', status: 'Completed', statusColor: '#2ecc71' },
    { id: 7, icon: '+', iconBg: '#edfdf5', iconColor: '#2ecc71', title: 'Added Money', date: '01 Nov 2025', amount: '+ ₹25,000', amountColor: '#2ecc71', status: 'Success', statusColor: '#2ecc71' },
    { id: 8, icon: '↑', iconBg: '#fff8ec', iconColor: '#c49f57', title: 'Cashback — Referral Bonus', date: '28 Oct 2025', amount: '+ ₹1,000', amountColor: '#2ecc71', status: 'Cashback', statusColor: '#c49f57' },
    { id: 9, icon: '↓', iconBg: '#fef0f1', iconColor: '#84232c', title: 'Payment to The Leela Palace', date: '15 Oct 2025', amount: '- ₹25,000', amountColor: '#84232c', status: 'Completed', statusColor: '#2ecc71' },
    { id: 10, icon: '🪙', iconBg: '#f0f4ff', iconColor: '#3a5ab8', title: 'Noor Coins Redeemed', date: '10 Oct 2025', amount: '- ₹500', amountColor: '#84232c', status: 'Redeemed', statusColor: '#3a5ab8' },
  ];

  const displayedTx = showAllTx ? allTransactions : TRANSACTIONS;

  const getCategory = (tab) => {
    if (tab === 'All Offers') return 'All';
    if (tab === 'Bank Offers') return 'Bank';
    if (tab === 'Noor AI Offers') return 'Noor AI';
    if (tab === 'Seasonal Offers') return 'Seasonal';
    if (tab === 'Referral Offers') return 'Referral';
    return 'All';
  };

  const filteredOffers = OFFERS.filter(o => {
    const cat = getCategory(activeTab);
    return cat === 'All' || o.category === cat;
  });

  const displayedOffers = showAll ? filteredOffers : filteredOffers.slice(0, 3);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(''), 1500);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const refundsData = [
    { id: 1, artist: 'Anu Kaushik', amount: '₹5,000', status: 'Completed', date: '28 Nov 2025', eta: '3-5 business days' },
    { id: 2, artist: 'Chandni Singh', amount: '₹2,000', status: 'Processing', date: '10 Dec 2025', eta: '2-3 business days' },
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '0 0 40px 0' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <button className="planner-back-btn" onClick={onBack} style={{ marginBottom: '10px' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.9rem', color: 'var(--sidebar-bg)', fontWeight: 700, marginBottom: '4px' }}>
          Wallet &amp; Offers ✨
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Manage your payments, rewards and exclusive offers.
        </p>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px', alignItems: 'start' }}>

        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* My Wallet */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '1.1rem' }}>💳</span>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--sidebar-bg)', margin: 0 }}>My Wallet</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '20px', alignItems: 'center' }}>
              {/* Balance card */}
              <div style={{ background: 'linear-gradient(135deg, #401017 0%, #3d1820 100%)', borderRadius: 'var(--radius-md)', padding: '20px', color: 'var(--text-white)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(196,159,87,0.1)' }} />
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-btn)', marginBottom: '4px' }}>Total Balance</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-white)', marginBottom: '12px' }}>₹18,750.00</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-btn)', marginBottom: '4px' }}>Noor Coins</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ background: 'var(--gold-accent)', borderRadius: '50%', width: 16, height: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: 'var(--sidebar-bg)', fontWeight: 700 }}>N</span>
                  <span style={{ fontFamily: 'var(--font-btn)', fontWeight: 700, color: 'var(--gold-accent)', fontSize: '0.85rem' }}>1,250</span>
                </div>
              </div>

              {/* Quick actions */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {[
                  { icon: '💳', label: 'Add Money', sub: 'Add funds to your wallet', action: 'addmoney' },
                  { icon: '📋', label: 'Payment Methods', sub: 'Manage cards & UPI', action: 'paymentmethods' },
                  { icon: '🕐', label: 'Transaction History', sub: 'View all transactions', action: 'history' },
                  { icon: '↺', label: 'Refunds', sub: 'Check your refunds', action: 'refunds' },
                ].map(a => (
                  <div key={a.label} onClick={() => {
                    if (a.action === 'addmoney') setShowAddMoney(true);
                    else if (a.action === 'paymentmethods') setShowPaymentMethods(true);
                    else if (a.action === 'refunds') setShowRefunds(true);
                    else if (a.action === 'history') { setShowAllTx(prev => !prev); showToast(showAllTx ? '📄 Showing recent transactions' : '📄 Showing all transactions'); }
                  }} style={{ textAlign: 'center', cursor: 'pointer', padding: '10px 6px', borderRadius: 'var(--radius-sm)', transition: 'background 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(196,159,87,0.06)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ fontSize: '1.4rem', marginBottom: '6px' }}>{a.icon}</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)', marginBottom: '3px' }}>{a.label}</div>
                    <div style={{ fontSize: '0.63rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>{a.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Exclusive Offers */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '1.1rem' }}>🎁</span>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--sidebar-bg)', margin: 0 }}>Exclusive Offers for You</h3>
            </div>

            {/* Offer tabs */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '18px', flexWrap: 'wrap' }}>
              {OFFER_TABS.map(t => (
                <button key={t} onClick={() => setActiveTab(t)} className={`offer-tab-btn ${activeTab === t ? 'active' : ''}`}>
                  {t}
                </button>
              ))}
            </div>

            {/* Offer cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {displayedOffers.map(offer => (
                <div key={offer.id} style={{ border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--card-bg-elevated)', transition: 'box-shadow 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                  onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
                >
                  {/* Badge */}
                  <div style={{ width: 52, height: 52, borderRadius: 'var(--radius-sm)', background: 'rgba(196,159,87,0.12)', border: '1px solid rgba(196,159,87,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, textAlign: 'center' }}>
                    <span style={{ color: offer.badgeText, fontWeight: 700, fontSize: offer.badge.length > 3 ? '0.7rem' : '1.2rem', fontFamily: 'var(--font-btn)', whiteSpace: 'pre-line', lineHeight: 1.2 }}>{offer.badge}</span>
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)', marginBottom: '3px' }}>{offer.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '5px' }}>{offer.desc}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{offer.validity}</div>
                  </div>

                  {/* Code / Auto Applied */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end', flexShrink: 0 }}>
                    {offer.autoApplied ? (
                      <div style={{ background: 'rgba(46,204,113,0.12)', border: '1px solid rgba(46,204,113,0.4)', borderRadius: 6, padding: '6px 12px', fontSize: '0.75rem', fontWeight: 700, color: '#2ecc71', fontFamily: 'var(--font-btn)', display: 'flex', alignItems: 'center', gap: 5 }}>
                        ✓ Auto Applied
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ border: '1.5px dashed var(--gold-accent)', borderRadius: 6, padding: '6px 12px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--gold-accent)', fontFamily: 'var(--font-btn)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                          onClick={() => copyCode(offer.code)}
                        >
                          {copied === offer.code ? '✓ Copied!' : offer.code}
                          <Copy size={12} />
                        </div>
                        <button onClick={() => showToast(`✅ Coupon ${offer.code} applied!`)} style={{ background: 'var(--maroon-btn)', color: 'var(--text-white)', border: 'none', borderRadius: 6, padding: '7px 16px', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-btn)', cursor: 'pointer', transition: 'opacity 0.2s' }}
                          onMouseOver={e => e.currentTarget.style.opacity = '0.88'}
                          onMouseOut={e => e.currentTarget.style.opacity = '1'}
                        >Apply Now</button>
                      </div>
                    )}
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>*T&amp;C Apply</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '18px' }}>
              <button onClick={() => { if (getCategory(activeTab) === 'All' && !showAll) { setActiveTab('Bank Offers'); } setShowAll(prev => !prev); showToast(showAll ? '📋 Showing top offers' : `📋 Showing all ${filteredOffers.length} offers`); }} style={{ background: 'none', border: 'none', color: 'var(--maroon-btn)', fontFamily: 'var(--font-btn)', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {showAll ? 'Show Less −' : `View All ${filteredOffers.length} Offers →`}
              </button>
            </div>
          </div>

          {/* Secure Payments bar */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', padding: '18px 24px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
              <span style={{ fontSize: '2rem' }}>🛡️</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)', marginBottom: '2px' }}>Secure Payments</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Your payments are safe and secure with Noor AI.</div>
              </div>
            </div>
            {[
              { icon: '🔒', label: '100% Secure', sub: 'SSL Encrypted' },
              { icon: '💳', label: 'Multiple Payment', sub: 'Options' },
              { icon: '↺', label: 'Instant Refunds', sub: 'Hassle-free' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center', minWidth: 80 }}>
                <div style={{ fontSize: '1.1rem', marginBottom: '3px' }}>{s.icon}</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)' }}>{s.label}</div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '20px' }}>

          {/* Refer & Earn */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '4px' }}>Refer &amp; Earn</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '10px', lineHeight: 1.4 }}>Refer your friends and earn</p>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--sidebar-bg)' }}>₹1,000 Noor Coins</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>on their first booking.</div>
              </div>
              <span style={{ fontSize: '2rem', flexShrink: 0 }}>🎁</span>
            </div>
            <button onClick={() => { navigator.clipboard.writeText('https://noorai.app/refer/NOORPRIYA'); showToast('🔗 Referral link copied!'); }} style={{ background: 'var(--maroon-btn)', color: 'var(--text-white)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '9px 20px', fontFamily: 'var(--font-btn)', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', marginBottom: '14px', transition: 'opacity 0.2s' }}
              onMouseOver={e => e.currentTarget.style.opacity = '0.88'}
              onMouseOut={e => e.currentTarget.style.opacity = '1'}
            >Refer Now</button>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-color)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '8px 12px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-btn)' }}>Your Referral Code</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontFamily: 'var(--font-btn)', fontWeight: 700, color: 'var(--sidebar-bg)', fontSize: '0.82rem' }}>NOORPRIYA</span>
                <Copy size={13} style={{ color: 'var(--maroon-btn)', cursor: 'pointer' }} onClick={() => copyCode('NOORPRIYA')} />
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--sidebar-bg)', margin: 0 }}>Transaction History</h4>
              <button onClick={() => { setShowAllTx(prev => !prev); showToast(showAllTx ? '📄 Showing recent transactions' : '📄 Showing all transactions'); }} style={{ background: 'none', border: 'none', fontSize: '0.72rem', color: 'var(--maroon-btn)', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-btn)' }}>{showAllTx ? 'Show Less' : 'View All'}</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {displayedTx.map(tx => (
                <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${tx.iconColor}22`, border: `1px solid ${tx.iconColor}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: tx.iconColor, fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
                    {tx.icon}
                  </div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)' }}>{tx.title}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{tx.date}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: tx.amount.startsWith('+') ? '#2ecc71' : 'var(--maroon-btn)', fontFamily: 'var(--font-btn)' }}>{tx.amount}</div>
                    <div style={{ fontSize: '0.62rem', color: tx.statusColor, fontWeight: 600 }}>{tx.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Need Help */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '4px' }}>Need Help?</h4>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '10px' }}>Our support team is available 24/7 to assist you.</p>
            <button onClick={() => showToast('💬 Connecting you to support...')} style={{ width: '100%', background: 'var(--maroon-light)', color: 'var(--maroon-btn)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '9px', fontFamily: 'var(--font-btn)', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <MessageCircle size={14} /> Chat with Support
            </button>
          </div>
        </div>
      </div>
      {/* ── ADD MONEY MODAL ── */}
      {showAddMoney && (
        <div onClick={() => setShowAddMoney(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', padding: '28px', width: 400, maxWidth: '90vw', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--sidebar-bg)', margin: 0 }}>💳 Add Money</h3>
              <button onClick={() => setShowAddMoney(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.1rem' }}>✕</button>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)', display: 'block', marginBottom: '6px' }}>Enter Amount</label>
              <input type="number" value={addAmount} onChange={e => setAddAmount(e.target.value)} placeholder="₹500" style={{ width: '100%', padding: '12px', border: '1.5px solid var(--card-border)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-btn)', fontSize: '1.1rem', fontWeight: 700, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {['500', '1000', '2000', '5000'].map(amt => (
                <button key={amt} onClick={() => setAddAmount(amt)} style={{ flex: 1, padding: '8px', border: '1.5px solid', borderColor: addAmount === amt ? 'var(--maroon-btn)' : 'var(--card-border)', borderRadius: 'var(--radius-sm)', background: addAmount === amt ? 'var(--maroon-light)' : 'transparent', color: addAmount === amt ? 'var(--maroon-btn)' : 'var(--text-dark)', fontFamily: 'var(--font-btn)', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>₹{amt}</button>
              ))}
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)', display: 'block', marginBottom: '6px' }}>Payment Method</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[{ icon: '📱', label: 'UPI', sub: 'Google Pay, PhonePe, Paytm' }, { icon: '💳', label: 'Debit / Credit Card', sub: 'Visa, Mastercard, RuPay' }, { icon: '🏦', label: 'Net Banking', sub: 'All major banks' }].map(m => (
                  <label key={m.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
                    <input type="radio" name="paymentMethod" style={{ accentColor: 'var(--maroon-btn)' }} />
                    <span style={{ fontSize: '1rem' }}>{m.icon}</span>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)' }}>{m.label}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{m.sub}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <button onClick={() => { setShowAddMoney(false); showToast(`₹${addAmount || '500'} added to wallet!`); }} style={{ width: '100%', background: 'var(--maroon-btn)', color: 'var(--text-white)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '12px', fontFamily: 'var(--font-btn)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
              Add ₹{addAmount || '500'}
            </button>
          </div>
        </div>
      )}

      {/* ── PAYMENT METHODS MODAL ── */}
      {showPaymentMethods && (
        <div onClick={() => setShowPaymentMethods(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', padding: '28px', width: 420, maxWidth: '90vw', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--sidebar-bg)', margin: 0 }}>📋 Payment Methods</h3>
              <button onClick={() => setShowPaymentMethods(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.1rem' }}>✕</button>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)', marginBottom: '10px' }}>Saved Cards</div>
              <div style={{ border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>💳</span>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dark)' }}>HDFC Credit Card</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>•••• 4582</div>
                </div>
                <span style={{ color: '#2ecc71', fontSize: '0.7rem', fontWeight: 600 }}>Default</span>
              </div>
              <div style={{ border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>📱</span>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dark)' }}>Google Pay (UPI)</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>priya@okhdfc</div>
                </div>
              </div>
            </div>
            <button onClick={() => { showToast('New payment method added!'); }} style={{ width: '100%', background: 'transparent', color: 'var(--maroon-btn)', border: '1.5px dashed var(--maroon-btn)', borderRadius: 'var(--radius-sm)', padding: '10px', fontFamily: 'var(--font-btn)', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              + Add New Payment Method
            </button>
          </div>
        </div>
      )}

      {/* ── REFUNDS MODAL ── */}
      {showRefunds && (
        <div onClick={() => setShowRefunds(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', padding: '28px', width: 420, maxWidth: '90vw', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--sidebar-bg)', margin: 0 }}>↺ Refunds</h3>
              <button onClick={() => setShowRefunds(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.1rem' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {refundsData.map(r => (
                <div key={r.id} style={{ border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)' }}>{r.artist}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--maroon-btn)' }}>{r.amount}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    <span>{r.date} · ETA: {r.eta}</span>
                    <span style={{ color: r.status === 'Completed' ? '#2ecc71' : 'var(--gold-accent)', fontWeight: 600 }}>{r.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div className="noor-toast" style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', padding: '10px 24px', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-btn)', fontSize: '0.82rem', zIndex: 2000, boxShadow: 'var(--shadow-md)' }}>
          {toast}
        </div>
      )}
    </div>
  );
}
