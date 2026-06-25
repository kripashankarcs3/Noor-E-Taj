import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowLeft, Key, Eye, EyeOff, Check, ExternalLink, Trash2 } from 'lucide-react';
import { saveApiKey, hasApiKey } from '../services/aiService';

const SETTING_TABS = [
  { id: 'account', label: 'Account Settings', icon: '👤' },
  { id: 'apikey', label: 'API Key', icon: '🔑' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
  { id: 'privacy', label: 'Privacy & Security', icon: '🛡️' },
  { id: 'payment', label: 'Payment & Payouts', icon: '💳' },
  { id: 'preferences', label: 'Preferences', icon: '⚙️' },
];

const PREFERENCES = [
  { icon: '💍', title: 'Wedding Preferences', sub: 'Manage your wedding details and style preferences' },
  { icon: '📖', title: 'Address Book', sub: 'Manage your saved addresses' },
  { icon: '💄', title: 'Beauty Preferences', sub: 'Update your beauty and skincare preferences' },
  { icon: '🚫', title: 'Blocked Artists / Salons', sub: 'View and manage blocked profiles' },
  { icon: '📧', title: 'Communication Preferences', sub: 'Choose how you want to receive updates' },
  { icon: '❤️', title: 'Interests', sub: 'Update your style and service interests' },
];

const SECURITY_ITEMS = [
  { icon: '🔑', title: 'Change Password', sub: 'Update your password' },
  { icon: '🔐', title: 'Two-Factor Authentication', sub: 'Add extra security' },
  { icon: '🕐', title: 'Login Activity', sub: "See where you're logged in" },
  { icon: '⚠️', title: 'Delete Account', sub: 'Permanently close account' },
];

const HELP_ITEMS = [
  { icon: '❓', title: 'Help Center', sub: 'Find answers to common questions' },
  { icon: '💬', title: 'Contact Support', sub: "We're here to help you 24/7" },
  { icon: '📄', title: 'Terms & Conditions', sub: 'Read our terms and policies' },
  { icon: '🔒', title: 'Privacy Policy', sub: 'Learn how we protect your data' },
];

const NOTIFICATION_ITEMS = [
  { id: 'email', label: 'Email Notifications', sub: 'Receive updates via email', defaultOn: true },
  { id: 'push', label: 'Push Notifications', sub: 'Get real-time alerts on your device', defaultOn: true },
  { id: 'sms', label: 'SMS Notifications', sub: 'Important updates via text message', defaultOn: false },
  { id: 'booking', label: 'Booking Updates', sub: 'Confirmation, reminders, changes', defaultOn: true },
  { id: 'offers', label: 'Offers & Promotions', sub: 'Exclusive deals and discounts', defaultOn: true },
  { id: 'reminders', label: 'Wedding Reminders', sub: 'Timeline and checklist alerts', defaultOn: true },
];

const PRIVACY_ITEMS = [
  { id: 'profile', label: 'Profile Visibility', sub: 'Who can see your profile', options: ['Everyone', 'Connections Only', 'Private'], default: 'Connections Only' },
  { id: 'bookings', label: 'Booking History', sub: 'Show your past bookings', defaultOn: true },
  { id: 'reviews', label: 'Review Activity', sub: 'Display your reviews publicly', defaultOn: true },
  { id: 'data', label: 'Data Sharing', sub: 'Share data with partners for better recommendations', defaultOn: false },
];

const LS_PROFILE = 'noor_profile';
const LS_NOTIF = 'noor_notifications';
const LS_PRIVACY = 'noor_privacy';

const loadJSON = (key, fallback) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
};

export default function SettingsPage({ onBack, darkMode, toggleDarkMode, onLogout }) {
  const [activeTab, setActiveTab] = useState('account');
  const [fullName, setFullName] = useState(() => { const p = loadJSON(LS_PROFILE, {}); return p.fullName || 'Priya Sharma'; });
  const [email] = useState(() => { const p = loadJSON(LS_PROFILE, {}); return p.email || 'priya.sharma@gmail.com'; });
  const [phone, setPhone] = useState(() => { const p = loadJSON(LS_PROFILE, {}); return p.phone || '98765 43210'; });
  const [gender, setGender] = useState(() => { const p = loadJSON(LS_PROFILE, {}); return p.gender || 'Female'; });
  const [occupation, setOccupation] = useState(() => { const p = loadJSON(LS_PROFILE, {}); return p.occupation || 'Product Designer'; });
  const [dob, setDob] = useState(() => { const p = loadJSON(LS_PROFILE, {}); return p.dob || '1998-05-14'; });
  const [location, setLocation] = useState(() => { const p = loadJSON(LS_PROFILE, {}); return p.location || 'New Delhi'; });
  const [preferredLanguage, setPreferredLanguage] = useState(() => { const p = loadJSON(LS_PROFILE, {}); return p.preferredLanguage || 'English'; });
  const [avatarImg, setAvatarImg] = useState(() => { const p = loadJSON(LS_PROFILE, {}); return p.avatarImg || '/priya_profile.png'; });
  const [toast, setToast] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activeSecurityModal, setActiveSecurityModal] = useState(null);
  const [activePrefModal, setActivePrefModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  // Country Code states
  const [countryCode, setCountryCode] = useState(() => {
    const p = loadJSON(LS_PROFILE, {});
    return p.countryCode || '+91';
  });
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  // Elite Membership states
  const [membership, setMembership] = useState(() => {
    const p = loadJSON(LS_PROFILE, {});
    return p.membership || 'Standard';
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradePlan, setUpgradePlan] = useState('Elite');
  const [upgradePaymentDetails, setUpgradePaymentDetails] = useState('');
  const [isProcessingUpgrade, setIsProcessingUpgrade] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };
  
  const [notifications, setNotifications] = useState(() => loadJSON(LS_NOTIF, {
    email: true, push: true, sms: false, booking: true, offers: true, reminders: true
  }));
  const [privacy, setPrivacy] = useState(() => loadJSON(LS_PRIVACY, {
    profile: 'Connections Only', bookings: true, reviews: true, data: false
  }));

  useEffect(() => { localStorage.setItem(LS_NOTIF, JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem(LS_PRIVACY, JSON.stringify(privacy)); }, [privacy]);
  const [paymentMethods, setPaymentMethods] = useState(() => loadJSON('noor_payment', [
    { id: 1, type: 'UPI', details: 'priya@okhdfcbank', isDefault: true },
    { id: 2, type: 'Card', details: 'Visa ending in 4242', isDefault: false },
  ]));
  useEffect(() => { localStorage.setItem('noor_payment', JSON.stringify(paymentMethods)); }, [paymentMethods]);

  const [payoutInfo, setPayoutInfo] = useState(() => loadJSON('noor_payout', {
    method: 'Bank Transfer', bankName: 'HDFC Bank', accountNum: 'XXXX-XXXX-4242', ifscCode: 'HDFC0001234'
  }));
  useEffect(() => { localStorage.setItem('noor_payout', JSON.stringify(payoutInfo)); }, [payoutInfo]);

  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [paymentTypeInput, setPaymentTypeInput] = useState('UPI');
  const [paymentDetailsInput, setPaymentDetailsInput] = useState('');

  const [showPayoutEditModal, setShowPayoutEditModal] = useState(false);
  const [payoutMethodInput, setPayoutMethodInput] = useState(() => payoutInfo.method);
  const [payoutBankInput, setPayoutBankInput] = useState(() => payoutInfo.bankName);
  const [payoutAccountInput, setPayoutAccountInput] = useState(() => payoutInfo.accountNum);
  const [payoutIFSCInput, setPayoutIFSCInput] = useState(() => payoutInfo.ifscCode);

  const [weddingDate, setWeddingDate] = useState(() => { const p = loadJSON(LS_PROFILE, {}); return p.weddingDate || '2026-01-22'; });
  const [partnerName, setPartnerName] = useState(() => { const p = loadJSON(LS_PROFILE, {}); return p.partnerName || 'Rahul Verma'; });
  const [weddingLocation, setWeddingLocation] = useState(() => { const p = loadJSON(LS_PROFILE, {}); return p.weddingLocation || 'New Delhi'; });
  const [weddingBudget, setWeddingBudget] = useState(() => { const p = loadJSON(LS_PROFILE, {}); return p.weddingBudget || '₹ 4,25,000'; });

  const [skinType, setSkinType] = useState(() => { const p = loadJSON(LS_PROFILE, {}); return p.skinType || 'Combination'; });
  const [hairTexture, setHairTexture] = useState(() => { const p = loadJSON(LS_PROFILE, {}); return p.hairTexture || 'Wavy'; });
  const [faceShapeState, setFaceShapeState] = useState(() => { const p = loadJSON(LS_PROFILE, {}); return p.faceShape || 'Heart'; });
  const [specialistNotes, setSpecialistNotes] = useState(() => { const p = loadJSON(LS_PROFILE, {}); return p.specialistNotes || 'Requires gentle hydration treatments.'; });

  const [addresses, setAddresses] = useState(() => loadJSON('noor_addresses', [
    { id: 1, label: 'Home (Default)', addr: 'A-24, Greater Kailash-I, New Delhi - 110048' },
    { id: 2, label: 'Wedding Venue', addr: 'The Leela Palace, Chanakyapuri, New Delhi - 110023' }
  ]));
  useEffect(() => { localStorage.setItem('noor_addresses', JSON.stringify(addresses)); }, [addresses]);

  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressLabelInput, setAddressLabelInput] = useState('');
  const [addressValueInput, setAddressValueInput] = useState('');

  const [blockedList, setBlockedList] = useState(() => loadJSON('noor_blocked', [
    { id: 1, name: 'Sonia Makeovers', role: 'Makeup Artist' },
    { id: 2, name: 'The Groom Salon', role: 'Salon' }
  ]));
  useEffect(() => { localStorage.setItem('noor_blocked', JSON.stringify(blockedList)); }, [blockedList]);

  const [commPrefs, setCommPrefs] = useState(() => loadJSON('noor_comm_prefs', {
    email: true, sms: true, whatsapp: false
  }));
  useEffect(() => { localStorage.setItem('noor_comm_prefs', JSON.stringify(commPrefs)); }, [commPrefs]);

  const [interests, setInterests] = useState(() => loadJSON('noor_interests', ['Traditional', 'Royal']));
  useEffect(() => { localStorage.setItem('noor_interests', JSON.stringify(interests)); }, [interests]);

  const [tfaMethod, setTfaMethod] = useState(() => loadJSON('noor_2fa_method', 'SMS'));

  const [apiKeyInputVal, setApiKeyInputVal] = useState(() => localStorage.getItem('noor_api_key') || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState('');

  const saveProfileSettings = (updatedFields = {}) => {
    const existing = loadJSON(LS_PROFILE, {});
    const updated = {
      ...existing,
      fullName,
      phone,
      gender,
      occupation,
      dob,
      location,
      preferredLanguage,
      avatarImg,
      weddingDate,
      partnerName,
      weddingLocation,
      weddingBudget,
      skinType,
      hairTexture,
      faceShape: faceShapeState,
      specialistNotes,
      countryCode,
      membership,
      ...updatedFields
    };
    localStorage.setItem(LS_PROFILE, JSON.stringify(updated));
    window.dispatchEvent(new Event('profile_update'));
  };

  const updateProfileWithCountryCode = (code) => {
    const existing = loadJSON(LS_PROFILE, {});
    existing.countryCode = code;
    localStorage.setItem(LS_PROFILE, JSON.stringify(existing));
    window.dispatchEvent(new Event('profile_update'));
    showToast(`📞 Country code updated to ${code}`);
  };

  const handleUpgradeSuccess = () => {
    setIsProcessingUpgrade(true);
    setTimeout(() => {
      setIsProcessingUpgrade(false);
      setShowUpgradeModal(false);
      setMembership('Elite');
      
      const existing = loadJSON(LS_PROFILE, {});
      existing.membership = 'Elite';
      localStorage.setItem(LS_PROFILE, JSON.stringify(existing));
      window.dispatchEvent(new Event('profile_update'));
      
      showToast('👑 Success! You are now a Noor Elite member.');
    }, 1500);
  };

  const [currency, setCurrency] = useState(() => { const ap = loadJSON('noor_app_prefs', {}); return ap.currency || 'INR'; });
  const [language, setLanguage] = useState(() => { const ap = loadJSON('noor_app_prefs', {}); return ap.language || 'English'; });
  
  const updateAppPref = (key, val) => {
    const updated = { currency, language, [key]: val };
    if (key === 'currency') setCurrency(val);
    if (key === 'language') setLanguage(val);
    localStorage.setItem('noor_app_prefs', JSON.stringify(updated));
  };

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrivacyToggle = (key) => {
    if (key === 'profile') return;
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrivacySelect = (key, value) => {
    if (key === 'profile') {
      setPrivacy(prev => ({ ...prev, profile: value }));
    }
  };

  const renderNotifications = () => (
    <div style={{ background: 'var(--card-bg)', border: '1px solid rgba(196,159,87,0.18)', borderRadius: 'var(--radius-lg)', padding: '28px', boxShadow: 'var(--shadow-sm)' }}>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '4px' }}>Notification Preferences</h3>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Choose how you want to receive notifications</p>
      {NOTIFICATION_ITEMS.map(item => (
        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--card-border)' }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)' }}>{item.label}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{item.sub}</div>
          </div>
          <div
            onClick={() => handleNotificationToggle(item.id)}
            style={{
              width: 44, height: 24, borderRadius: 12, cursor: 'pointer',
              background: notifications[item.id] ? 'var(--maroon-btn)' : 'var(--toggle-off)',
              position: 'relative', transition: 'background 0.2s', flexShrink: 0
            }}
          >
            <div style={{
              width: 20, height: 20, borderRadius: '50%', background: 'var(--text-white)',
              position: 'absolute', top: 2,
              left: notifications[item.id] ? 22 : 2,
              transition: 'left 0.2s', boxShadow: 'var(--shadow-sm)'
            }} />
          </div>
        </div>
      ))}
    </div>
  );

  const renderPrivacy = () => (
    <div style={{ background: 'var(--card-bg)', border: '1px solid rgba(196,159,87,0.18)', borderRadius: 'var(--radius-lg)', padding: '28px', boxShadow: 'var(--shadow-sm)' }}>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '4px' }}>Privacy & Security</h3>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Control your privacy and security settings</p>
      {PRIVACY_ITEMS.map(item => (
        <div key={item.id} style={{ padding: '14px 0', borderBottom: '1px solid var(--card-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)' }}>{item.label}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{item.sub}</div>
            </div>
            {item.options ? (
              <div style={{ display: 'flex', gap: '4px' }}>
                {item.options.map(opt => (
                  <button key={opt} onClick={() => handlePrivacySelect(item.id, opt)}
                    style={{
                      padding: '5px 10px', borderRadius: '6px', border: '1px solid',
                      borderColor: privacy[item.id] === opt ? 'var(--maroon-btn)' : 'var(--card-border)',
                      background: privacy[item.id] === opt ? 'var(--maroon-light)' : 'transparent',
                      color: privacy[item.id] === opt ? 'var(--maroon-text)' : 'var(--text-muted)',
                      fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-btn)'
                    }}
                  >{opt}</button>
                ))}
              </div>
            ) : (
              <div onClick={() => handlePrivacyToggle(item.id)}
                style={{
                  width: 44, height: 24, borderRadius: 12, cursor: 'pointer',
                  background: privacy[item.id] ? 'var(--maroon-btn)' : 'var(--toggle-off)',
                  position: 'relative', transition: 'background 0.2s', flexShrink: 0
                }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', background: 'var(--text-white)',
                  position: 'absolute', top: 2,
                  left: privacy[item.id] ? 22 : 2,
                  transition: 'left 0.2s', boxShadow: 'var(--shadow-sm)'
                }} />
              </div>
            )}
          </div>
        </div>
      ))}
      <div style={{ marginTop: 20, background: 'var(--maroon-light)', borderRadius: 'var(--radius-sm)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>🛡️</span>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-dark)', margin: 0 }}>Your data is encrypted and secure. We never share your personal information without consent.</p>
      </div>
    </div>
  );

  const renderPayment = () => (
    <>
      <div style={{ background: 'var(--card-bg)', border: '1px solid rgba(196,159,87,0.18)', borderRadius: 'var(--radius-lg)', padding: '28px', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '4px' }}>Saved Payment Methods</h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '18px' }}>Manage your payment methods for quick checkout</p>
        {paymentMethods.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', border: '1.5px dashed var(--card-border)', borderRadius: 'var(--radius-md)', marginBottom: '10px' }}>No saved payment methods. Add one below!</div>
        ) : (
          paymentMethods.map(pm => (
            <div key={pm.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', border: '1px solid rgba(196,159,87,0.18)', borderRadius: 'var(--radius-md)', marginBottom: '10px', background: pm.isDefault ? 'var(--gold-light)' : 'var(--card-bg)' }}>
              <span style={{ fontSize: '1.5rem' }}>{pm.type === 'UPI' ? '📱' : '💳'}</span>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {pm.type} — {pm.details}
                  {pm.isDefault && <span style={{ fontSize: '0.6rem', background: 'var(--gold-accent)', color: '#221819', padding: '1px 8px', borderRadius: '10px', fontWeight: 700 }}>Default</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {!pm.isDefault && (
                  <button onClick={() => {
                    setPaymentMethods(prev => prev.map(p => ({ ...p, isDefault: p.id === pm.id })));
                    showToast('✅ Default payment method updated');
                  }} style={{ background: 'transparent', border: '1px solid var(--card-border)', borderRadius: '6px', padding: '5px 12px', fontSize: '0.7rem', cursor: 'pointer', fontFamily: 'var(--font-btn)', color: 'var(--text-muted)' }}>Make Default</button>
                )}
                <button onClick={() => {
                  setPaymentMethods(prev => prev.filter(p => p.id !== pm.id));
                  showToast('🗑️ Payment method removed');
                }} style={{ background: 'transparent', border: '1px solid rgba(231,76,60,0.3)', borderRadius: '6px', padding: '5px 12px', fontSize: '0.7rem', cursor: 'pointer', fontFamily: 'var(--font-btn)', color: '#e74c3c' }}>Delete</button>
              </div>
            </div>
          ))
        )}
        <button onClick={() => { setPaymentDetailsInput(''); setShowAddPaymentModal(true); }} style={{ marginTop: '10px', width: '100%', padding: '10px', border: '1.5px dashed rgba(196,159,87,0.3)', borderRadius: 'var(--radius-md)', background: 'transparent', fontSize: '0.82rem', fontWeight: 600, color: 'var(--gold-accent)', cursor: 'pointer', fontFamily: 'var(--font-btn)' }}>
          + Add Payment Method
        </button>
      </div>
      <div style={{ background: 'var(--card-bg)', border: '1px solid rgba(196,159,87,0.18)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '14px' }}>Payout Settings</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { label: 'Default Payout Method', value: payoutInfo.method },
            { label: 'Bank Name', value: payoutInfo.bankName },
            { label: 'Account Number', value: payoutInfo.accountNum },
            { label: 'IFSC Code', value: payoutInfo.ifscCode },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--card-border)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-btn)' }}>{r.label}</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)' }}>{r.value}</span>
            </div>
          ))}
        </div>
        <button onClick={() => {
          setPayoutMethodInput(payoutInfo.method);
          setPayoutBankInput(payoutInfo.bankName);
          setPayoutAccountInput(payoutInfo.accountNum);
          setPayoutIFSCInput(payoutInfo.ifscCode);
          setShowPayoutEditModal(true);
        }} style={{ marginTop: '14px', padding: '8px 18px', border: '1px solid var(--card-border)', borderRadius: '6px', background: 'transparent', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dark)', cursor: 'pointer', fontFamily: 'var(--font-btn)' }}>
          Edit Payout Info
        </button>
      </div>
    </>
  );

  const renderPreferences = () => (
    <>
      <div style={{ background: 'var(--card-bg)', border: '1px solid rgba(196,159,87,0.18)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '4px' }}>Your Preferences</h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '18px' }}>Customize your experience on Noor AI</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {PREFERENCES.map(pref => (
            <button key={pref.title} className="settings-pref-btn" onClick={() => setActivePrefModal(pref.title)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', background: 'var(--card-bg-elevated)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(196,159,87,0.35)'; e.currentTarget.style.background = 'var(--card-bg)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.background = 'var(--card-bg-elevated)'; }}
            >
              <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{pref.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)', marginBottom: '2px' }}>{pref.title}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>{pref.sub}</div>
              </div>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', flexShrink: 0 }}>›</span>
            </button>
          ))}
        </div>
      </div>
      <div style={{ background: 'var(--card-bg)', border: '1px solid rgba(196,159,87,0.18)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '14px' }}>App Preferences</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div onClick={() => { toggleDarkMode(); showToast(`🎨 Switched to ${darkMode ? 'Light' : 'Dark'} Mode!`); }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '4px 0' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)' }}>Theme</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Choose light or dark theme</div>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dark)', fontWeight: 600 }}>{darkMode ? 'Dark Mode 🌙' : 'Light Mode ☀️'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)' }}>Currency</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Display prices in</div>
            </div>
            <select value={currency} onChange={e => { updateAppPref('currency', e.target.value); showToast(`💰 Currency updated to ${e.target.value}`); }} style={{ border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-dark)', padding: '6px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-btn)', outline: 'none' }}>
              <option value="INR">₹ INR</option>
              <option value="USD">$ USD</option>
              <option value="GBP">£ GBP</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)' }}>Language</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>App display language</div>
            </div>
            <select value={language} onChange={e => { updateAppPref('language', e.target.value); showToast(`🌐 Language updated to ${e.target.value}`); }} style={{ border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-dark)', padding: '6px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-btn)', outline: 'none' }}>
              <option value="English">English</option>
              <option value="Hindi">हिन्दी</option>
              <option value="Punjabi">ਪੰਜਾਬੀ</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );

  const renderApiKey = () => {
    const currentKey = localStorage.getItem('noor_api_key') || '';

    const handleSave = () => {
      const trimmed = apiKeyInputVal.trim();
      if (!trimmed) { setApiKeyStatus('error'); return; }
      saveApiKey(trimmed);
      setApiKeyStatus('saved');
      setTimeout(() => setApiKeyStatus(''), 2000);
    };

    const handleRemove = () => {
      localStorage.removeItem('noor_api_key');
      setApiKeyInputVal('');
      setApiKeyStatus('removed');
      setTimeout(() => setApiKeyStatus(''), 2000);
    };

    return (
      <div style={{ background: 'var(--card-bg)', border: '1px solid rgba(196,159,87,0.18)', borderRadius: 'var(--radius-lg)', padding: '28px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--sidebar-bg)', margin: 0 }}>
            <Key size={16} style={{ color: 'var(--gold-accent)', display: 'inline', marginRight: 6 }} />
            OpenRouter API Key
          </h3>
          {currentKey && (
            <span style={{ fontSize: '0.65rem', padding: '3px 10px', borderRadius: 20, background: 'rgba(46,204,113,0.1)', color: '#2ecc71', fontWeight: 600, border: '1px solid rgba(46,204,113,0.2)' }}>
              <Check size={10} style={{ display: 'inline' }} /> Connected
            </span>
          )}
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Enter your OpenRouter API key to enable all AI features. One key works across the entire platform.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--card-bg-elevated)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', padding: '4px 4px 4px 14px', marginBottom: 12 }}>
          <input
            type={showApiKey ? 'text' : 'password'}
            value={apiKeyInputVal}
            onChange={e => setApiKeyInputVal(e.target.value)}
            placeholder="sk-or-v1-..."
            style={{ flex: 1, border: 'none', background: 'transparent', color: 'var(--text-dark)', fontSize: '0.82rem', fontFamily: 'var(--font-btn)', outline: 'none', padding: '10px 0' }}
          />
          <button onClick={() => setShowApiKey(!showApiKey)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <motion.button
            onClick={handleSave}
            style={{ flex: 1, background: 'var(--maroon-btn)', color: 'var(--text-white)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '10px 20px', fontFamily: 'var(--font-btn)', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
          >
            {apiKeyStatus === 'saved' ? '✓ Saved!' : <><Key size={14} /> Save API Key</>}
          </motion.button>
          {currentKey && (
            <motion.button
              onClick={handleRemove}
              style={{ background: 'rgba(231,76,60,0.08)', color: '#e74c3c', border: '1px solid rgba(231,76,60,0.2)', borderRadius: 'var(--radius-sm)', padding: '10px 16px', fontFamily: 'var(--font-btn)', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            >
              <Trash2 size={14} /> Remove
            </motion.button>
          )}
        </div>

        {apiKeyStatus === 'error' && (
          <div style={{ marginTop: 10, fontSize: '0.75rem', color: '#e74c3c' }}>Please enter a valid API key.</div>
        )}
        {apiKeyStatus === 'removed' && (
          <div style={{ marginTop: 10, fontSize: '0.75rem', color: '#e74c3c' }}>API key removed. AI features will prompt for a key when used.</div>
        )}

        <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(196,159,87,0.06)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(196,159,87,0.15)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <ExternalLink size={14} style={{ color: 'var(--gold-accent)', flexShrink: 0 }} />
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            Don't have an API key?{' '}
            <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-accent)', fontWeight: 600 }}>
              Get your free OpenRouter key →
            </a>
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0 0 40px 0' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <button className="planner-back-btn" onClick={onBack} style={{ marginBottom: '10px' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.9rem', color: 'var(--sidebar-bg)', fontWeight: 700, marginBottom: '4px' }}>
          Settings ⚙️
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Manage your account settings, notifications and preferences.
        </p>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px', alignItems: 'start' }}>
        {/* LEFT COLUMN: Tab content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Tabs Bar */}
          <div className="settings-tabs-container" style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--card-border)', marginBottom: '20px', overflowX: 'auto', paddingBottom: '8px' }}>
            {SETTING_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`settings-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                style={{
                  padding: '8px 16px',
                  background: activeTab === tab.id ? 'var(--maroon-light)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--maroon-text)' : 'var(--text-muted)',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '2px solid var(--maroon-btn)' : '2px solid transparent',
                  borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-btn)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Active Tab Panel */}
          {activeTab === 'account' && (
            <div style={{ background: 'var(--card-bg)', border: '1px solid rgba(196,159,87,0.18)', borderRadius: 'var(--radius-lg)', padding: '28px', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '20px' }}>Account Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '24px', alignItems: 'flex-start' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img src={avatarImg} alt="Priya" style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(196,159,87,0.3)' }} />
                    <button onClick={() => {
                      let e = document.createElement('input');
                      e.type = 'file';
                      e.accept = 'image/*';
                      e.onchange = (event) => {
                        const file = event.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (readerEvent) => {
                            setAvatarImg(readerEvent.target.result);
                            showToast('📸 Profile photo updated!');
                          };
                          reader.readAsDataURL(file);
                        }
                      };
                      e.click();
                    }} style={{ position: 'absolute', bottom: 2, right: 2, background: 'var(--maroon-btn)', border: '2px solid var(--text-white)', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.6rem', color: 'var(--text-white)' }}>✏</button>
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '0.88rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)' }}>{fullName}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--gold-accent)', fontFamily: 'var(--font-btn)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <span style={{ fontSize: '0.7rem' }}>💍</span> Bride-to-be
                  </div>
                </div>
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-btn)', display: 'block', marginBottom: '6px' }}>Full Name</label>
                      <input value={fullName} onChange={e => setFullName(e.target.value)} className="form-input-field" style={{ width: '100%', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', fontSize: '0.82rem', fontFamily: 'var(--font-body)', outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-btn)', display: 'block', marginBottom: '6px' }}>Email Address</label>
                      <div style={{ position: 'relative' }}>
                        <input value={email} readOnly className="form-input-field" style={{ width: '100%', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', fontSize: '0.82rem', fontFamily: 'var(--font-body)', outline: 'none', background: 'var(--card-bg-elevated)', color: 'var(--text-muted)', paddingRight: '80px' }} />
                        <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: '0.65rem', fontWeight: 700, color: '#2ecc71', background: 'rgba(46, 204, 113, 0.08)', padding: '2px 7px', borderRadius: 10, border: '1px solid #2ecc71' }}>✓ Verified</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-btn)', display: 'block', marginBottom: '6px' }}>Phone Number</label>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          <div onClick={() => setShowCountryDropdown(!showCountryDropdown)} style={{ display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '9px 10px', fontSize: '0.78rem', color: 'var(--text-dark)', cursor: 'pointer', flexShrink: 0 }}>
                            {countryCode} <ChevronDown size={12} />
                          </div>
                          {showCountryDropdown && (
                            <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '4px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', zIndex: 10, display: 'flex', flexDirection: 'column', width: '100px', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
                              {[
                                { code: '+91', label: '🇮🇳 IN' },
                                { code: '+1', label: '🇺🇸 US' },
                                { code: '+44', label: '🇬🇧 UK' },
                                { code: '+971', label: '🇦🇪 AE' },
                                { code: '+1 ', label: '🇨🇦 CA' }
                              ].map(item => (
                                <div key={item.code} onClick={() => { setCountryCode(item.code.trim()); updateProfileWithCountryCode(item.code.trim()); setShowCountryDropdown(false); }} style={{ padding: '8px 12px', fontSize: '0.78rem', color: 'var(--text-dark)', cursor: 'pointer', textAlign: 'left', borderBottom: '1px solid var(--card-border)' }}
                                  onMouseEnter={e => e.currentTarget.style.background = 'var(--maroon-light)'}
                                  onMouseLeave={e => e.currentTarget.style.background = ''}
                                >
                                  {item.label} {item.code}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div style={{ position: 'relative', flex: 1 }}>
                          <input value={phone} onChange={e => setPhone(e.target.value)} className="form-input-field" style={{ width: '100%', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', fontSize: '0.82rem', fontFamily: 'var(--font-body)', outline: 'none', paddingRight: '72px' }} />
                          <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: '0.62rem', fontWeight: 700, color: '#2ecc71', background: 'rgba(46, 204, 113, 0.08)', padding: '2px 6px', borderRadius: 10, border: '1px solid #2ecc71' }}>✓ verified</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-btn)', display: 'block', marginBottom: '6px' }}>Date of Birth</label>
                      <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="form-input-field" style={{ width: '100%', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', fontSize: '0.82rem', fontFamily: 'var(--font-body)', outline: 'none', background: 'var(--card-bg)', color: 'var(--text-dark)', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-btn)', display: 'block', marginBottom: '6px' }}>Gender</label>
                      <div style={{ position: 'relative' }}>
                        <select value={gender} onChange={e => setGender(e.target.value)} className="form-input-field" style={{ width: '100%', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', fontSize: '0.82rem', fontFamily: 'var(--font-body)', outline: 'none', background: 'var(--card-bg)', color: 'var(--text-dark)', appearance: 'none', boxSizing: 'border-box' }}>
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                          <option value="Other">Other</option>
                        </select>
                        <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-btn)', display: 'block', marginBottom: '6px' }}>Occupation</label>
                      <input value={occupation} onChange={e => setOccupation(e.target.value)} className="form-input-field" style={{ width: '100%', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', fontSize: '0.82rem', fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-btn)', display: 'block', marginBottom: '6px' }}>Location</label>
                      <div style={{ position: 'relative' }}>
                        <select value={location} onChange={e => setLocation(e.target.value)} className="form-input-field" style={{ width: '100%', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', fontSize: '0.82rem', fontFamily: 'var(--font-body)', outline: 'none', background: 'var(--card-bg)', color: 'var(--text-dark)', appearance: 'none', boxSizing: 'border-box' }}>
                          <option value="New Delhi">New Delhi, India</option>
                          <option value="Mumbai">Mumbai, India</option>
                          <option value="Jaipur">Jaipur, India</option>
                          <option value="Udaipur">Udaipur, India</option>
                          <option value="Bengaluru">Bengaluru, India</option>
                        </select>
                        <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-btn)', display: 'block', marginBottom: '6px' }}>Preferred Language</label>
                      <div style={{ position: 'relative' }}>
                        <select value={preferredLanguage} onChange={e => setPreferredLanguage(e.target.value)} className="form-input-field" style={{ width: '100%', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', fontSize: '0.82rem', fontFamily: 'var(--font-body)', outline: 'none', background: 'var(--card-bg)', color: 'var(--text-dark)', appearance: 'none', boxSizing: 'border-box' }}>
                          <option value="English">English</option>
                          <option value="Hindi">Hindi (हिन्दी)</option>
                          <option value="Punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
                        </select>
                        <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <button onClick={() => {
                      saveProfileSettings();
                      showToast(`✅ Profile updated!`);
                    }} style={{ background: 'var(--maroon-btn)', color: 'var(--text-white)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '10px 28px', fontFamily: 'var(--font-btn)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>Save Changes</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Panel */}
          {activeTab === 'account' && (
            <div style={{ background: 'var(--card-bg)', border: '1px solid rgba(196,159,87,0.18)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)', marginTop: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '4px' }}>Security</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '18px' }}>Keep your account safe and secure</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                {SECURITY_ITEMS.filter(item => item.title !== 'Delete Account').map(item => (
                  <button key={item.title} className="settings-sec-btn" onClick={() => setActiveSecurityModal(item.title)} style={{ padding: '14px 12px', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', background: 'var(--card-bg-elevated)', cursor: 'pointer', textAlign: 'left' }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(132,35,44,0.25)'; e.currentTarget.style.background = 'var(--card-bg)'; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.background = 'var(--card-bg-elevated)'; }}
                  >
                    <div style={{ fontSize: '1.3rem', marginBottom: '8px' }}>{item.icon}</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)', marginBottom: '2px' }}>{item.title}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{item.sub}</div>
                  </button>
                ))}
                <button key="Delete Account" className="settings-sec-btn" onClick={() => setActiveSecurityModal('Delete Account')} style={{ padding: '14px 12px', border: '1px solid rgba(231,76,60,0.3)', borderRadius: 'var(--radius-md)', background: 'rgba(231,76,60,0.06)', cursor: 'pointer', textAlign: 'left' }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(231,76,60,0.5)'; e.currentTarget.style.background = 'rgba(231,76,60,0.1)'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(231,76,60,0.3)'; e.currentTarget.style.background = 'rgba(231,76,60,0.06)'; }}
                >
                  <div style={{ fontSize: '1.3rem', marginBottom: '8px' }}>⚠️</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e74c3c', fontFamily: 'var(--font-btn)', marginBottom: '2px' }}>Delete Account</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Permanently close account</div>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'account' && renderNotifications()}
          {activeTab === 'apikey' && renderApiKey()}
          {activeTab === 'notifications' && renderNotifications()}
          {activeTab === 'privacy' && renderPrivacy()}
          {activeTab === 'payment' && renderPayment()}
          {activeTab === 'preferences' && renderPreferences()}
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Upgrade Elite */}
          <div className="settings-upgrade-card" style={{ background: 'linear-gradient(135deg, #15080c 0%, #250B12 100%)', border: '1px solid rgba(196,159,87,0.18)', borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: 'var(--shadow-sm)', color: 'var(--text-white)' }}>
            {membership === 'Elite' ? (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--gold-accent)', marginBottom: '8px', marginTop: 0 }}>NOOR ELITE 👑</h4>
                <div style={{ fontSize: '0.7rem', color: '#2ecc71', background: 'rgba(46,204,113,0.12)', border: '1px solid #2ecc71', borderRadius: '12px', padding: '4px 8px', display: 'inline-block', fontWeight: 700, fontFamily: 'var(--font-btn)' }}>Active Member</div>
                <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.7)', marginTop: '8px', lineHeight: 1.3, marginBottom: 0 }}>You have unlocked priority bookings, VIP support, and exclusive rewards!</p>
              </div>
            ) : (
              <>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--gold-accent)', marginBottom: '10px', marginTop: 0 }}>NOOR ELITE 👑</h4>
                {['Priority Bookings', 'Exclusive Discounts', 'VIP Support', 'Early Access to Offers'].map(b => (
                  <div key={b} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-btn)', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--gold-accent)', fontWeight: 700 }}>✓</span> {b}
                  </div>
                ))}
                <button onClick={() => { setUpgradePaymentDetails(''); setShowUpgradeModal(true); }} style={{ marginTop: '12px', width: '100%', background: 'var(--maroon-btn)', color: 'var(--text-white)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '10px', fontFamily: 'var(--font-btn)', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
                  Upgrade Now
                </button>
              </>
            )}
          </div>

          {/* Help & Support */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid rgba(196,159,87,0.18)', borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '12px' }}>Help &amp; Support</h4>
            {HELP_ITEMS.map(h => (
              <button key={h.title} className="settings-help-btn" onClick={() => showToast(`📄 Opening ${h.title}...`)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', background: 'transparent', border: 'none', borderBottom: '1px solid var(--card-border)', cursor: 'pointer', textAlign: 'left', transition: 'color 0.2s' }}
                onMouseOver={e => e.currentTarget.style.color = 'var(--maroon-text)'}
                onMouseOut={e => e.currentTarget.style.color = ''}
              >
                <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>{h.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)' }}>{h.title}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{h.sub}</div>
                </div>
              </button>
            ))}

            {/* Logout */}
            <button onClick={() => setShowLogoutModal(true)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0 0', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', marginTop: '4px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--maroon-text)' }}>🚪</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--maroon-text)', fontFamily: 'var(--font-btn)' }}>Logout</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Sign out from your account</div>
              </div>
              <span style={{ fontSize: '0.9rem', color: 'var(--maroon-text)' }}>›</span>
            </button>
          </div>
        </div>
      </div>
      {/* ── LOGOUT CONFIRM MODAL ── */}
      {showLogoutModal && (
        <div onClick={() => setShowLogoutModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', padding: '28px', width: 360, maxWidth: '90vw', boxShadow: 'var(--shadow-md)', textAlign: 'center' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '12px' }}>🚪</span>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--sidebar-bg)', margin: '0 0 8px' }}>Logout?</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '20px' }}>Are you sure you want to sign out from your account?</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowLogoutModal(false)} style={{ flex: 1, padding: '10px', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', background: 'var(--card-bg)', fontFamily: 'var(--font-btn)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dark)', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => { setShowLogoutModal(false); showToast('🚪 Logged out successfully!'); if (onLogout) { setTimeout(onLogout, 800); } }} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: 'var(--radius-sm)', background: 'var(--maroon-btn)', fontFamily: 'var(--font-btn)', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-white)', cursor: 'pointer' }}>Yes, Logout</button>
            </div>
          </div>
        </div>
      )}

      {/* ── SECURITY MODAL ── */}
      {activeSecurityModal && (
        <div onClick={() => setActiveSecurityModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', padding: '28px', width: 400, maxWidth: '90vw', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--sidebar-bg)', margin: 0 }}>{activeSecurityModal}</h3>
              <button onClick={() => setActiveSecurityModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.1rem' }}>✕</button>
            </div>
            {activeSecurityModal === 'Change Password' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div><label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-btn)', display: 'block', marginBottom: '4px' }}>Current Password</label><input type="password" placeholder="Enter current password" className="form-input-field" style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box', background: 'var(--input-bg)', color: 'var(--text-dark)' }} /></div>
                <div><label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-btn)', display: 'block', marginBottom: '4px' }}>New Password</label><input type="password" placeholder="Enter new password" className="form-input-field" style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box', background: 'var(--input-bg)', color: 'var(--text-dark)' }} /></div>
                <div><label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-btn)', display: 'block', marginBottom: '4px' }}>Confirm New Password</label><input type="password" placeholder="Re-enter new password" className="form-input-field" style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box', background: 'var(--input-bg)', color: 'var(--text-dark)' }} /></div>
                <button onClick={() => { setActiveSecurityModal(null); showToast('🔑 Password changed successfully!'); }} style={{ width: '100%', padding: '10px', background: 'var(--maroon-btn)', color: 'var(--text-white)', border: 'none', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-btn)', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', marginTop: '4px' }}>Update Password</button>
              </div>
            )}
            {activeSecurityModal === 'Two-Factor Authentication' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>Add an extra layer of security to your account. Choose your preferred 2FA method:</p>
                {[
                  { icon: '📱', label: 'SMS Authentication', sub: 'Receive codes via text message', value: 'SMS' },
                  { icon: '🔑', label: 'Authenticator App', sub: 'Use Google Authenticator or similar', value: 'Authenticator' },
                  { icon: '✉️', label: 'Email OTP', sub: 'Get one-time passwords via email', value: 'Email' }
                ].map(m => (
                  <label key={m.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: tfaMethod === m.value ? 'var(--maroon-light)' : 'transparent' }}>
                    <input type="radio" name="2fa" checked={tfaMethod === m.value} onChange={() => setTfaMethod(m.value)} style={{ accentColor: 'var(--maroon-btn)' }} />
                    <span style={{ fontSize: '1rem' }}>{m.icon}</span>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)' }}>{m.label}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{m.sub}</div>
                    </div>
                  </label>
                ))}
                <button onClick={() => {
                  localStorage.setItem('noor_2fa_method', JSON.stringify(tfaMethod));
                  setActiveSecurityModal(null);
                  showToast(`🔐 Two-Factor Authentication (${tfaMethod}) enabled!`);
                }} style={{ width: '100%', padding: '10px', background: 'var(--maroon-btn)', color: 'var(--text-white)', border: 'none', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-btn)', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', marginTop: '4px' }}>Enable 2FA</button>
              </div>
            )}
            {activeSecurityModal === 'Login Activity' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { device: 'Chrome on Windows', location: 'New Delhi, India', time: 'Today at 10:30 AM', active: true },
                  { device: 'Safari on iPhone', location: 'New Delhi, India', time: 'Yesterday at 8:15 PM', active: false },
                  { device: 'Chrome on Android', location: 'Mumbai, India', time: '3 days ago', active: false },
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: s.active ? 'rgba(46,204,113,0.06)' : 'var(--card-bg-elevated)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ fontSize: '1.2rem' }}>{s.active ? '🟢' : '⚪'}</span>
                    <div style={{ textAlign: 'left', flex: 1 }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)' }}>{s.device}{s.active && <span style={{ color: '#2ecc71', fontSize: '0.65rem', marginLeft: 6 }}>Current</span>}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{s.location} · {s.time}</div>
                    </div>
                  </div>
                ))}
                <button onClick={() => { setActiveSecurityModal(null); showToast('🔐 Logged out from other devices'); }} style={{ background: 'none', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '8px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--maroon-text)', cursor: 'pointer', fontFamily: 'var(--font-btn)' }}>Logout from other devices</button>
              </div>
            )}
            {activeSecurityModal === 'Delete Account' && (
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '8px' }}>⚠️</span>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>This action is permanent and cannot be undone. All your data will be deleted.</p>
                <div style={{ marginBottom: '12px' }}><input value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} type="text" placeholder="Type 'DELETE' to confirm" className="form-input-field" style={{ width: '100%', padding: '9px 12px', border: `1px solid ${deleteConfirm === 'DELETE' ? '#2ecc71' : 'var(--card-border)'}`, borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box', background: 'var(--input-bg)', color: 'var(--text-dark)' }} /></div>
                <button onClick={() => {
                  if (deleteConfirm !== 'DELETE') { showToast('⚠️ Please type DELETE to confirm'); return; }
                  setActiveSecurityModal(null); setDeleteConfirm(''); showToast('⚠️ Account deletion request submitted');
                }} style={{ width: '100%', padding: '10px', background: deleteConfirm === 'DELETE' ? '#e74c3c' : 'var(--card-border)', color: deleteConfirm === 'DELETE' ? 'var(--text-white)' : 'var(--text-muted)', border: 'none', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-btn)', fontWeight: 700, fontSize: '0.82rem', cursor: deleteConfirm === 'DELETE' ? 'pointer' : 'not-allowed' }}>Delete My Account</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── PREFERENCE MODALS ── */}
      {activePrefModal && (
        <div onClick={() => setActivePrefModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--card-bg)', border: '1px solid rgba(196,159,87,0.18)', borderRadius: 'var(--radius-lg)', padding: '28px', width: activePrefModal === 'Wedding Preferences' ? '680px' : '480px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-md)', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--card-border)', paddingBottom: '10px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--sidebar-bg)', margin: 0 }}>{activePrefModal}</h3>
              <button onClick={() => setActivePrefModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.2rem', padding: '4px' }}>✕</button>
            </div>

            {/* Wedding Preferences Modal */}
            {activePrefModal === 'Wedding Preferences' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Wedding Date</label>
                    <input type="date" value={weddingDate} onChange={e => setWeddingDate(e.target.value)} className="form-input-field" style={{ width: '100%', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', fontSize: '0.82rem', boxSizing: 'border-box', background: 'var(--card-bg)', color: 'var(--text-dark)' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Partner's Name</label>
                    <input type="text" value={partnerName} onChange={e => setPartnerName(e.target.value)} className="form-input-field" style={{ width: '100%', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', fontSize: '0.82rem', boxSizing: 'border-box', background: 'var(--card-bg)', color: 'var(--text-dark)' }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Wedding Location</label>
                    <input type="text" value={weddingLocation} onChange={e => setWeddingLocation(e.target.value)} className="form-input-field" style={{ width: '100%', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', fontSize: '0.82rem', boxSizing: 'border-box', background: 'var(--card-bg)', color: 'var(--text-dark)' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Est. Total Budget</label>
                    <input type="text" value={weddingBudget} onChange={e => setWeddingBudget(e.target.value)} className="form-input-field" style={{ width: '100%', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', fontSize: '0.82rem', boxSizing: 'border-box', background: 'var(--card-bg)', color: 'var(--text-dark)' }} />
                  </div>
                </div>

                {/* Copied visual cards from UserProfile.jsx */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px', marginTop: '10px', borderTop: '1px dashed var(--card-border)', paddingTop: '20px' }}>
                  {/* Circular progress card */}
                  <div style={{ background: 'var(--card-bg-elevated)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '12px' }}>Wedding Journey</div>
                    <div style={{ position: 'relative', width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                        <circle cx="50" cy="50" r="40" fill="none" stroke="var(--card-border)" strokeWidth="6" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="var(--maroon-btn)" strokeWidth="6" strokeDasharray="251.2" strokeDashoffset="87.9" strokeLinecap="round" />
                      </svg>
                      <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-dark)' }}>65%</span>
                        <span style={{ fontSize: '0.5rem', color: 'var(--text-muted)' }}>Done</span>
                      </div>
                    </div>
                    <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '4px', width: '100%', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tasks Done:</span><strong style={{ color: 'var(--text-dark)' }}>4/6</strong></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Booked:</span><strong style={{ color: 'var(--text-dark)' }}>12</strong></div>
                    </div>
                  </div>

                  {/* Bridal personality style card */}
                  <div style={{ background: 'var(--card-bg-elevated)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '8px' }}>Style Personality</div>
                    <img src="/bridal_lehenga.png" alt="Royal Glam" style={{ width: 54, height: 54, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--gold-accent)' }} />
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--gold-accent)', marginTop: '8px' }}>Royal Glam</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'flex', gap: '4px', marginTop: '4px' }}>
                      <span>Elegant</span>·<span>Traditional</span>·<span>Timeless</span>
                    </div>
                    <button onClick={() => showToast('✨ Starting Style Quiz...')} style={{ marginTop: '12px', background: 'var(--maroon-btn)', color: 'var(--text-white)', border: 'none', borderRadius: '4px', padding: '6px 12px', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}>Retake Quiz</button>
                  </div>
                </div>

                <div style={{ textAlign: 'right', marginTop: '10px' }}>
                  <button onClick={() => {
                    saveProfileSettings();
                    setActivePrefModal(null);
                    showToast('✅ Wedding preferences saved!');
                  }} style={{ background: 'var(--maroon-btn)', color: 'var(--text-white)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '10px 24px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>Save Settings</button>
                </div>
              </div>
            )}

            {/* Beauty Preferences Modal */}
            {activePrefModal === 'Beauty Preferences' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Skin Profile</label>
                  <select value={skinType} onChange={e => setSkinType(e.target.value)} className="form-input-field" style={{ width: '100%', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', fontSize: '0.82rem', background: 'var(--card-bg)', color: 'var(--text-dark)' }}>
                    <option value="Combination">Combination</option>
                    <option value="Oily">Oily</option>
                    <option value="Dry">Dry</option>
                    <option value="Sensitive">Sensitive</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Hair Texture</label>
                  <select value={hairTexture} onChange={e => setHairTexture(e.target.value)} className="form-input-field" style={{ width: '100%', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', fontSize: '0.82rem', background: 'var(--card-bg)', color: 'var(--text-dark)' }}>
                    <option value="Straight">Straight</option>
                    <option value="Wavy">Wavy</option>
                    <option value="Curly">Curly</option>
                    <option value="Coily">Coily</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Face Shape Contour</label>
                  <select value={faceShapeState} onChange={e => setFaceShapeState(e.target.value)} className="form-input-field" style={{ width: '100%', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', fontSize: '0.82rem', background: 'var(--card-bg)', color: 'var(--text-dark)' }}>
                    <option value="Oval">Oval</option>
                    <option value="Round">Round</option>
                    <option value="Heart">Heart</option>
                    <option value="Square">Square</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Beauty Specialist Notes</label>
                  <textarea value={specialistNotes} onChange={e => setSpecialistNotes(e.target.value)} rows="3" className="form-input-field" style={{ width: '100%', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', fontSize: '0.82rem', fontFamily: 'var(--font-body)', resize: 'vertical', boxSizing: 'border-box', background: 'var(--card-bg)', color: 'var(--text-dark)' }} />
                </div>
                <div style={{ textAlign: 'right', marginTop: '8px' }}>
                  <button onClick={() => {
                    saveProfileSettings();
                    setActivePrefModal(null);
                    showToast('✅ Beauty preferences saved!');
                  }} style={{ background: 'var(--maroon-btn)', color: 'var(--text-white)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '10px 24px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>Save Settings</button>
                </div>
              </div>
            )}

            {/* Address Book Modal */}
            {activePrefModal === 'Address Book' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {showAddAddressForm || editingAddressId ? (
                  <div style={{ background: 'var(--card-bg-elevated)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--sidebar-bg)', fontWeight: 700 }}>
                      {editingAddressId ? 'Edit Address' : 'Add New Address'}
                    </h4>
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Address Label</label>
                      <input type="text" placeholder="e.g. Home, Wedding Venue" value={addressLabelInput} onChange={e => setAddressLabelInput(e.target.value)} className="form-input-field" style={{ width: '100%', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', fontSize: '0.82rem', boxSizing: 'border-box', background: 'var(--card-bg)', color: 'var(--text-dark)' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Full Address</label>
                      <textarea rows="2" placeholder="Enter complete address" value={addressValueInput} onChange={e => setAddressValueInput(e.target.value)} className="form-input-field" style={{ width: '100%', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', fontSize: '0.82rem', fontFamily: 'var(--font-body)', resize: 'vertical', boxSizing: 'border-box', background: 'var(--card-bg)', color: 'var(--text-dark)' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
                      <button onClick={() => { setShowAddAddressForm(false); setEditingAddressId(null); }} style={{ padding: '6px 14px', border: '1px solid var(--card-border)', borderRadius: '4px', background: 'transparent', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', color: 'var(--text-dark)' }}>Cancel</button>
                      <button onClick={() => {
                        if (!addressLabelInput.trim() || !addressValueInput.trim()) {
                          showToast('⚠️ Both fields are required');
                          return;
                        }
                        if (editingAddressId) {
                          setAddresses(prev => prev.map(a => a.id === editingAddressId ? { ...a, label: addressLabelInput.trim(), addr: addressValueInput.trim() } : a));
                          showToast('✅ Address updated');
                        } else {
                          setAddresses(prev => [...prev, { id: Date.now(), label: addressLabelInput.trim(), addr: addressValueInput.trim() }]);
                          showToast('✅ Address added');
                        }
                        setShowAddAddressForm(false);
                        setEditingAddressId(null);
                        setAddressLabelInput('');
                        setAddressValueInput('');
                      }} style={{ padding: '6px 14px', border: 'none', borderRadius: '4px', background: 'var(--maroon-btn)', color: 'var(--text-white)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>Save</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {addresses.length === 0 ? (
                        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', border: '1.5px dashed var(--card-border)', borderRadius: 'var(--radius-md)' }}>No saved addresses. Add one below!</div>
                      ) : (
                        addresses.map(a => (
                          <div key={a.id} style={{ background: 'var(--card-bg-elevated)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ textAlign: 'left', flex: 1, paddingRight: '12px' }}>
                              <strong style={{ fontSize: '0.82rem', color: 'var(--sidebar-bg)', display: 'block' }}>{a.label}</strong>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>{a.addr}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button onClick={() => {
                                setEditingAddressId(a.id);
                                setAddressLabelInput(a.label);
                                setAddressValueInput(a.addr);
                              }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.78rem', color: 'var(--gold-accent)', fontWeight: 600 }}>Edit</button>
                              <button onClick={() => {
                                setAddresses(prev => prev.filter(item => item.id !== a.id));
                                showToast('🗑️ Address removed');
                              }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.78rem', color: '#e74c3c', fontWeight: 600 }}>Delete</button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <button onClick={() => { setShowAddAddressForm(true); setAddressLabelInput(''); setAddressValueInput(''); }} style={{ width: '100%', padding: '10px', border: '1.5px dashed rgba(196,159,87,0.3)', borderRadius: 'var(--radius-md)', background: 'transparent', fontSize: '0.8rem', fontWeight: 600, color: 'var(--gold-accent)', cursor: 'pointer' }}>
                      + Add New Address
                    </button>
                  </>
                )}
                <div style={{ textAlign: 'right', marginTop: '8px' }}>
                  <button onClick={() => setActivePrefModal(null)} style={{ background: 'var(--maroon-btn)', color: 'var(--text-white)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '10px 24px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>Done</button>
                </div>
              </div>
            )}

            {/* Blocked Profiles Modal */}
            {activePrefModal === 'Blocked Artists / Salons' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 4px' }}>
                  Artists and salons in this list cannot send you messages or view your wedding details.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {blockedList.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--card-border)', borderRadius: 'var(--radius-md)' }}>
                      No blocked profiles.
                    </div>
                  ) : (
                    blockedList.map(b => (
                      <div key={b.id} style={{ background: 'var(--card-bg-elevated)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ textAlign: 'left' }}>
                          <strong style={{ fontSize: '0.82rem', color: 'var(--sidebar-bg)', display: 'block' }}>{b.name}</strong>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>{b.role}</span>
                        </div>
                        <button onClick={() => {
                          setBlockedList(prev => prev.filter(item => item.id !== b.id));
                          showToast(`🔓 Unblocked ${b.name}`);
                        }} style={{ padding: '6px 14px', border: '1px solid var(--card-border)', borderRadius: '4px', background: 'transparent', fontSize: '0.72rem', fontWeight: 600, color: 'var(--maroon-text)', cursor: 'pointer' }}>
                          Unblock
                        </button>
                      </div>
                    ))
                  )}
                </div>
                <div style={{ textAlign: 'right', marginTop: '8px' }}>
                  <button onClick={() => setActivePrefModal(null)} style={{ background: 'var(--maroon-btn)', color: 'var(--text-white)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '10px 24px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>Close</button>
                </div>
              </div>
            )}

            {/* Communication Preferences Modal */}
            {activePrefModal === 'Communication Preferences' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 4px' }}>
                  Select channels you'd like to receive updates, booking reminders, and recommendations on.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { id: 'email', label: 'Email Updates', desc: 'Newsletters, recommendations, and platform updates' },
                    { id: 'sms', label: 'SMS Notifications', desc: 'One-time pins, order updates, booking confirmations' },
                    { id: 'whatsapp', label: 'WhatsApp Alerts', desc: 'Direct chat updates and chat notifications with artists' }
                  ].map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', background: 'var(--card-bg-elevated)' }}>
                      <input
                        type="checkbox"
                        checked={commPrefs[item.id]}
                        onChange={() => {
                          setCommPrefs(prev => ({ ...prev, [item.id]: !prev[item.id] }));
                        }}
                        style={{ width: 18, height: 18, accentColor: 'var(--maroon-btn)', cursor: 'pointer' }}
                      />
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dark)' }}>{item.label}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: 'right', marginTop: '8px' }}>
                  <button onClick={() => { setActivePrefModal(null); showToast('✅ Communication preferences updated!'); }} style={{ background: 'var(--maroon-btn)', color: 'var(--text-white)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '10px 24px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>Save &amp; Close</button>
                </div>
              </div>
            )}

            {/* Interests Modal */}
            {activePrefModal === 'Interests' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 4px' }}>
                  Select style and service tags to customize your AI recommendations and homepage feed.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '10px 0' }}>
                  {['Traditional', 'Royal', 'Contemporary', 'Minimal', 'Fusion', 'Glam', 'Bohemian', 'Vintage', 'Airbrush', 'HD Makeup'].map(tag => {
                    const isSelected = interests.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => {
                          if (isSelected) {
                            setInterests(prev => prev.filter(t => t !== tag));
                          } else {
                            setInterests(prev => [...prev, tag]);
                          }
                        }}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '20px',
                          border: '1px solid',
                          borderColor: isSelected ? 'var(--maroon-btn)' : 'var(--card-border)',
                          background: isSelected ? 'var(--maroon-light)' : 'var(--card-bg-elevated)',
                          color: isSelected ? 'var(--maroon-text)' : 'var(--text-dark)',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontFamily: 'var(--font-btn)',
                          transition: 'all 0.2s'
                        }}
                      >
                        {tag} {isSelected ? '✓' : '+'}
                      </button>
                    );
                  })}
                </div>
                <div style={{ textAlign: 'right', marginTop: '8px' }}>
                  <button onClick={() => { setActivePrefModal(null); showToast('✅ Interests updated!'); }} style={{ background: 'var(--maroon-btn)', color: 'var(--text-white)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '10px 24px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>Save Interests</button>
                </div>
              </div>
            )}

            {/* Other preferences fallback */}
            {activePrefModal !== 'Wedding Preferences' &&
             activePrefModal !== 'Beauty Preferences' &&
             activePrefModal !== 'Address Book' &&
             activePrefModal !== 'Blocked Artists / Salons' &&
             activePrefModal !== 'Communication Preferences' &&
             activePrefModal !== 'Interests' && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '12px' }}>⚙️</span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{activePrefModal} options and preferences will be manageable here soon.</p>
                <button onClick={() => setActivePrefModal(null)} style={{ marginTop: '16px', background: 'var(--maroon-btn)', color: 'var(--text-white)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 20px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── ADD PAYMENT METHOD MODAL ── */}
      {showAddPaymentModal && (
        <div onClick={() => setShowAddPaymentModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', padding: '28px', width: 380, maxWidth: '90vw', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--sidebar-bg)', margin: 0 }}>Add Payment Method</h3>
              <button onClick={() => setShowAddPaymentModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.1rem' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Payment Type</label>
                <select value={paymentTypeInput} onChange={e => setPaymentTypeInput(e.target.value)} className="form-input-field" style={{ width: '100%', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', fontSize: '0.82rem', background: 'var(--card-bg)', color: 'var(--text-dark)' }}>
                  <option value="UPI">UPI (Google Pay / PhonePe)</option>
                  <option value="Card">Credit or Debit Card</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  {paymentTypeInput === 'UPI' ? 'UPI ID (e.g. name@okhdfcbank)' : 'Card Number / Details'}
                </label>
                <input type="text" placeholder={paymentTypeInput === 'UPI' ? 'priya@okaxis' : 'Visa ending in XXXX'} value={paymentDetailsInput} onChange={e => setPaymentDetailsInput(e.target.value)} className="form-input-field" style={{ width: '100%', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', fontSize: '0.82rem', boxSizing: 'border-box' }} />
              </div>
              <button onClick={() => {
                if (!paymentDetailsInput.trim()) { showToast('⚠️ Please enter details'); return; }
                const newItem = {
                  id: Date.now(),
                  type: paymentTypeInput,
                  details: paymentDetailsInput.trim(),
                  isDefault: paymentMethods.length === 0
                };
                setPaymentMethods(prev => [...prev, newItem]);
                setShowAddPaymentModal(false);
                showToast('✅ Payment method added!');
              }} style={{ width: '100%', padding: '10px', background: 'var(--maroon-btn)', color: 'var(--text-white)', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', marginTop: '4px' }}>Add Method</button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT PAYOUT INFO MODAL ── */}
      {showPayoutEditModal && (
        <div onClick={() => setShowPayoutEditModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', padding: '28px', width: 400, maxWidth: '90vw', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--sidebar-bg)', margin: 0 }}>Edit Payout Details</h3>
              <button onClick={() => setShowPayoutEditModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.1rem' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Payout Method</label>
                <input type="text" value={payoutMethodInput} onChange={e => setPayoutMethodInput(e.target.value)} className="form-input-field" style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Bank Name</label>
                <input type="text" value={payoutBankInput} onChange={e => setPayoutBankInput(e.target.value)} className="form-input-field" style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Account Number</label>
                <input type="text" value={payoutAccountInput} onChange={e => setPayoutAccountInput(e.target.value)} className="form-input-field" style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>IFSC Code</label>
                <input type="text" value={payoutIFSCInput} onChange={e => setPayoutIFSCInput(e.target.value)} className="form-input-field" style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', boxSizing: 'border-box' }} />
              </div>
              <button onClick={() => {
                if (!payoutBankInput.trim() || !payoutAccountInput.trim() || !payoutIFSCInput.trim()) {
                  showToast('⚠️ All bank fields are required');
                  return;
                }
                setPayoutInfo({
                  method: payoutMethodInput.trim(),
                  bankName: payoutBankInput.trim(),
                  accountNum: payoutAccountInput.trim(),
                  ifscCode: payoutIFSCInput.trim()
                });
                setShowPayoutEditModal(false);
                showToast('✅ Payout details updated!');
              }} style={{ width: '100%', padding: '10px', background: 'var(--maroon-btn)', color: 'var(--text-white)', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', marginTop: '4px' }}>Update Details</button>
            </div>
          </div>
        </div>
      )}

      {/* Noor Elite Upgrade Modal */}
      {showUpgradeModal && (
        <div onClick={() => setShowUpgradeModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', maxWidth: 460, width: '90%', borderRadius: 'var(--radius-lg)', padding: '28px', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-md)', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--sidebar-bg)', margin: '0 0 4px 0' }}>👑 Upgrade to Noor Elite</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>Select your tier and unlock premium bridal benefits</p>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              {[
                { name: 'Bronze', price: '₹2,500/mo', desc: 'Priority Trials' },
                { name: 'Gold', price: '₹6,000/mo', desc: 'Gold Matcher' },
                { name: 'Elite', price: '₹15,000/mo', desc: 'Full AI Suite & VIP Support' }
              ].map(plan => (
                <div key={plan.name} onClick={() => setUpgradePlan(plan.name)} style={{ flex: 1, padding: '14px 10px', border: upgradePlan === plan.name ? '2px solid var(--gold-accent)' : '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', background: upgradePlan === plan.name ? 'var(--gold-light)' : 'var(--card-bg-elevated)', transition: 'all 0.2s' }}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-dark)', display: 'block' }}>{plan.name}</strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--maroon-btn)', fontWeight: 700, display: 'block', margin: '4px 0' }}>{plan.price}</span>
                  <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', display: 'block', lineHeight: 1.2 }}>{plan.desc}</span>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--card-bg-elevated)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', textAlign: 'left', marginBottom: '20px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Benefits Included</span>
              {[
                'Access to all AI Beauty Suite models & tools',
                'Priority slots booking with Delhi\'s top 50+ artists',
                '24/7 emergency concierge phone consultant dialer',
                'Free premium bridal style lookbook exports (PDF/PNG)',
                '15% flat wallet cashback offers on gold-certified packages'
              ].map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-dark)', marginBottom: 4 }}>
                  <span style={{ color: 'var(--gold-accent)', fontWeight: 700 }}>✓</span> {b}
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'left', marginBottom: '20px' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Payment Method Details (Card or UPI)</label>
              <input type="text" placeholder="e.g. card number or UPI ID" value={upgradePaymentDetails} onChange={e => setUpgradePaymentDetails(e.target.value)} style={{ width: '100%', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', fontSize: '0.82rem', fontFamily: 'var(--font-body)', outline: 'none', background: 'var(--card-bg)', color: 'var(--text-dark)' }} />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowUpgradeModal(false)} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1.5px solid var(--card-border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-dark)', fontFamily: 'var(--font-btn)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleUpgradeSuccess} disabled={isProcessingUpgrade || !upgradePaymentDetails.trim()} style={{ flex: 1, padding: '10px', background: 'var(--maroon-btn)', color: 'var(--text-white)', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', opacity: upgradePaymentDetails.trim() ? 1 : 0.5 }}>
                {isProcessingUpgrade ? 'Authorizing Payment...' : 'Unlock Noor Elite'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="noor-toast" style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', padding: '10px 24px', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-btn)', fontSize: '0.82rem', zIndex: 2000, boxShadow: 'var(--shadow-md)' }}>
          {toast}
        </div>
      )}
    </div>
  );
}
