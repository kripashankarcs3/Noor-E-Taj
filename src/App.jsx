import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { 
  LayoutDashboard, Sparkles, Scissors, Calendar, Image as ImageIcon, Heart, 
  MessageCircle, Star, User, Settings, Bell, ChevronDown, Search, Send, 
  CreditCard, Users, UserCheck, Headset, ArrowRight, ArrowLeft, Moon, Sun,
  MapPin, Pencil, Check, Circle, Crown, ClipboardCheck, Wallet, Key
} from 'lucide-react';
const BridalPlanner = lazy(() => import('./components/BridalPlanner'));
const ArtistsSalons = lazy(() => import('./components/ArtistsSalons'));
const BookingDetails = lazy(() => import('./components/BookingDetails'));
const MyMoodboard = lazy(() => import('./components/MyMoodboard'));
const Messages = lazy(() => import('./components/Messages'));
const WalletOffers = lazy(() => import('./components/WalletOffers'));
const SettingsPage = lazy(() => import('./components/SettingsPage'));
const AiToolsContainer = lazy(() => import('./components/AiToolsContainer'));
const LoginPage = lazy(() => import('./components/LoginPage'));
const SalonMarketplace = lazy(() => import('./components/SalonMarketplace'));
const ApiKeyModal = lazy(() => import('./components/ApiKeyModal'));
import { setApiKeyHandler } from './services/aiService';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('noor_logged_in') === 'true';
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('noor_dark_mode');
    return saved === null ? true : saved === 'true';
  });

  const [userProfile, setUserProfile] = useState(() => {
    try {
      const p = localStorage.getItem('noor_profile');
      if (p) return JSON.parse(p);
    } catch(e){}
    return { fullName: 'Priya Sharma', avatarImg: '/priya_profile.png', membership: 'Standard' };
  });

  useEffect(() => {
    const handleProfileUpdate = () => {
      try {
        const p = localStorage.getItem('noor_profile');
        if (p) setUserProfile(JSON.parse(p));
      } catch (e) {}
    };
    window.addEventListener('profile_update', handleProfileUpdate);
    handleProfileUpdate();
    return () => window.removeEventListener('profile_update', handleProfileUpdate);
  }, [isLoggedIn]);


  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('noor_dark_mode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const [aiSuiteActiveTool, setAiSuiteActiveTool] = useState('twin');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifTab, setNotifTab] = useState('All');
  const [marketplaceSubTab, setMarketplaceSubTab] = useState('artists');

  const [trialBookings, setTrialBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('noor_trial_bookings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length === 2) {
          const defaultBookings = [
            { id: 1, name: 'Elite Makeup Studio', service: 'Makeup', date: '12 Dec 2025', status: 'Confirmed', image: '/digital_twin_portrait.png' },
            { id: 2, name: "Riya's Mehendi Art", service: 'Mehendi', date: '15 Dec 2025', status: 'Pending', image: '/priya_profile.png' },
            { id: 3, name: 'Makeover by Simran', service: 'Hair', date: '18 Dec 2025', status: 'Confirmed', image: '/faceshape_profile.png' }
          ];
          localStorage.setItem('noor_trial_bookings', JSON.stringify(defaultBookings));
          return defaultBookings;
        }
        return parsed;
      }
    } catch (e) {}
    const defaultBookings = [
      { id: 1, name: 'Elite Makeup Studio', service: 'Makeup', date: '12 Dec 2025', status: 'Confirmed', image: '/digital_twin_portrait.png' },
      { id: 2, name: "Riya's Mehendi Art", service: 'Mehendi', date: '15 Dec 2025', status: 'Pending', image: '/priya_profile.png' },
      { id: 3, name: 'Makeover by Simran', service: 'Hair', date: '18 Dec 2025', status: 'Confirmed', image: '/faceshape_profile.png' }
    ];
    localStorage.setItem('noor_trial_bookings', JSON.stringify(defaultBookings));
    return defaultBookings;
  });

  const [notifList, setNotifList] = useState(() => {
    try {
      const saved = localStorage.getItem('noor_notifications');
      if (saved) return JSON.parse(saved);
    } catch(e){}
    return [
      { id: 1, icon: '🟢', title: 'Booking confirmed — Poonam Rawat', time: '2 min ago', color: '#2ecc71', category: 'Bookings', read: false },
      { id: 2, icon: '🎁', title: 'New offer: NOOR20 available!', time: '1 hour ago', color: 'var(--gold-accent)', category: 'Offers', read: false },
      { id: 3, icon: '📅', title: 'Reminder: Makeup trial in 30 days', time: 'Today', color: 'var(--maroon-btn)', category: 'Reminders', read: false },
      { id: 4, icon: '✅', title: 'Payment received for Poonam Rawat booking', time: 'Yesterday', color: '#2ecc71', category: 'Bookings', read: true },
      { id: 5, icon: '⭐', title: 'New review from Poonam Rawat', time: '2 days ago', color: 'var(--gold-accent)', category: 'Bookings', read: true },
      { id: 6, icon: '💬', title: 'Message from Chandni Singh', time: '3 days ago', color: 'var(--maroon-btn)', category: 'Reminders', read: true },
    ];
  });

  useEffect(() => {
    localStorage.setItem('noor_notifications', JSON.stringify(notifList));
  }, [notifList]);

  useEffect(() => {
    const handleBookingsUpdate = () => {
      try {
        const saved = localStorage.getItem('noor_trial_bookings');
        if (saved) {
          const bookings = JSON.parse(saved);
          setTrialBookings(bookings);
          const latest = bookings[bookings.length - 1];
          if (latest) {
            setNotifList(prev => [
              {
                id: Date.now(),
                icon: '🟢',
                title: `Booking confirmed — ${latest.name}`,
                time: 'Just now',
                color: '#2ecc71',
                category: 'Bookings',
                read: false
              },
              ...prev
            ]);
          }
        }
      } catch (e) {}
    };
    window.addEventListener('bookings_update', handleBookingsUpdate);
    return () => window.removeEventListener('bookings_update', handleBookingsUpdate);
  }, []);

  const markAsRead = (id) => {
    setNotifList(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifList(prev => prev.map(n => ({ ...n, read: true })));
  };

  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  useEffect(() => {
    setApiKeyHandler(() => setShowApiKeyModal(true));
    return () => setApiKeyHandler(null);
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [wishlistTab, setWishlistTab] = useState('All');
  const [wishlistItems, setWishlistItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('noor_wishlist') || '[]'); } catch { return []; }
  });
  const [conversations, setConversations] = useState([
    { id: 0, name: 'Poonam Rawat', verified: true, time: '10:30 AM', lastMsg: "Thank you Priya! I've received your requirements.", unread: 2, online: true, image: '/digital_twin_portrait.png', type: 'booking' },
    { id: 1, name: 'Chandni Singh', verified: true, time: 'Yesterday', lastMsg: 'Hi Priya, your booking is confirmed for 12 Dec.', unread: 1, image: '/recommend_salon1.png', type: 'booking' },
    { id: 2, name: 'Anu Kaushik', verified: true, time: 'Yesterday', lastMsg: 'We have some exciting offers for you!', image: '/recommend_salon2.png', type: 'enquiry' },
    { id: 3, name: 'Makeup by Oosh', time: '23 May', lastMsg: 'Here are some trending mehendi designs.', image: '/mood_henna.png', type: 'enquiry' },
    { id: 4, name: 'Vidya Tikari', time: '22 May', lastMsg: 'Your venue tour is confirmed for 25 May at 4 PM.', image: '/luxury_salon.png', type: 'booking' },
    { id: 5, name: 'Shruti Sharma', time: '20 May', lastMsg: "Let's schedule your makeup trial session.", image: '/faceshape_profile.png', type: 'enquiry' },
  ]);
  const totalUnreadMessages = conversations.reduce((acc, curr) => acc + (curr.unread || 0), 0);
  const [reviewsTab, setReviewsTab] = useState('Given (3)');
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({ booking: '', rating: 0, text: '', image: null });
  const [myReviews, setMyReviews] = useState(() => {
    try { return JSON.parse(localStorage.getItem('noor_my_reviews') || '[]'); } catch { return []; }
  });
  const [deletedReviewNames, setDeletedReviewNames] = useState(() => {
    try { return JSON.parse(localStorage.getItem('noor_deleted_reviews') || '[]'); } catch { return []; }
  });
  const [askNoorInput, setAskNoorInput] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('noor_my_reviews', JSON.stringify(myReviews));
  }, [myReviews]);

  useEffect(() => {
    localStorage.setItem('noor_deleted_reviews', JSON.stringify(deletedReviewNames));
  }, [deletedReviewNames]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const toggleWishlist = (artistName) => {
    setWishlistItems(prev => {
      const exists = prev.includes(artistName);
      const next = exists ? prev.filter(n => n !== artistName) : [...prev, artistName];
      localStorage.setItem('noor_wishlist', JSON.stringify(next));
      return next;
    });
  };

  const heroSlides = [
    { 
      id: 0, 
      bg: 'linear-gradient(120deg, #3d0a20 0%, #6b1535 22%, #a8204e 50%, #c4356a 72%, #7a1040 100%)',
      shimmer: 'radial-gradient(ellipse at 15% 60%, rgba(240,180,100,0.28) 0%, transparent 50%), radial-gradient(ellipse at 75% 20%, rgba(255,80,120,0.15) 0%, transparent 45%)',
      tag: '✨ AI-Powered Bridal Platform',
      badges: [
        { label: 'Smart AI', sub: 'Personalised for You', icon: '🤖' },
        { label: 'Verified Artists', sub: '500+ in Delhi', icon: '✓' },
        { label: 'Luxury First', sub: 'Premium Experience', icon: '👑' }
      ],
      title: 'Your Dream Wedding\nStarts Here.',
      subtitle: 'AI-matched makeup artists, curated looks & seamless booking — all in one place built for Indian brides.',
      cta1: { label: 'Start Planning', action: 'planner' }, 
      cta2: { label: 'Try Noor AI', action: 'ai-suite' }, 
      img: '/bridal_lehenga.png', 
      accent: '#e8c97a',
      stat: { num: '10,000+', lbl: 'Happy Brides' }
    },
    { 
      id: 1, 
      bg: 'linear-gradient(135deg, #0a0a1a 0%, #12122e 40%, #1e1a4a 75%, #2a2060 100%)',
      shimmer: 'radial-gradient(ellipse at 80% 30%, rgba(180,140,255,0.15) 0%, transparent 55%)',
      tag: '🏷️ Limited Time Offer',
      badges: [
        { label: 'Up to 30% Off', sub: 'Bridal Lehengas', icon: '💰' },
        { label: 'Couture Labels', sub: 'Exclusive Collection', icon: '✨' }
      ],
      title: 'Bridal Couture\nSale is Live.',
      subtitle: 'Dreaming of the perfect lehenga? Shop handpicked luxury bridal couture — discounted exclusively for Noor brides.',
      cta1: { label: 'Shop the Sale', action: 'marketplace' }, 
      img: '/countdown_bride.png', 
      accent: '#b89fff',
      stat: { num: '30% Off', lbl: 'On Select Labels' }
    },
    { 
      id: 2, 
      bg: 'linear-gradient(135deg, #071510 0%, #0e2a1c 40%, #15422c 75%, #1c5538 100%)',
      shimmer: 'radial-gradient(ellipse at 70% 60%, rgba(100,220,150,0.12) 0%, transparent 55%)',
      tag: '⭐ Top Rated in Delhi',
      badges: [
        { label: 'Certified Artists', sub: 'Background Verified', icon: '🎨' },
        { label: 'Luxury Studios', sub: 'Delhi NCR\'s Best', icon: '🏛️' }
      ],
      title: 'Book Delhi\'s Best\nMakeup Artists.',
      subtitle: 'From soft glam to heavy bridal — find, preview & instantly book the most sought-after artists in the city.',
      cta1: { label: 'Browse Artists', action: 'marketplace' }, 
      img: '/luxury_salon.png', 
      accent: '#5ee89a',
      stat: { num: '4.9★', lbl: 'Average Rating' }
    },
    { 
      id: 3, 
      bg: 'linear-gradient(135deg, #0e0818 0%, #1c1030 40%, #2e1850 75%, #3d2265 100%)',
      shimmer: 'radial-gradient(ellipse at 30% 40%, rgba(220,160,255,0.14) 0%, transparent 55%)',
      tag: '🤖 Powered by Noor AI',
      badges: [
        { label: 'Digital Twin', sub: 'Try Before You Book', icon: '🪞' },
        { label: 'Smart Timeline', sub: 'Auto-Scheduled', icon: '📅' }
      ],
      title: 'Your AI Bridal\nPlanner is Ready.',
      subtitle: 'Get a personalised wedding countdown, AI look previews & intelligent vendor suggestions — tailored to your style.',
      cta1: { label: 'Open Planner', action: 'planner' }, 
      img: '/digital_twin_portrait.png', 
      accent: '#d4a0ff',
      stat: { num: '3 Min', lbl: 'Setup Your Plan' }
    },
    { 
      id: 4, 
      bg: 'linear-gradient(135deg, #1a0e06 0%, #30200e 40%, #4e3318 75%, #624020 100%)',
      shimmer: 'radial-gradient(ellipse at 60% 20%, rgba(255,190,80,0.15) 0%, transparent 55%)',
      tag: '⏳ Season Special',
      badges: [
        { label: 'Flat 15% Off', sub: 'Luxury Bookings', icon: '💎' },
        { label: 'Wallet Cashback', sub: 'Instant Credits', icon: '💳' }
      ],
      title: 'Wedding Season\nOffers Are Here.',
      subtitle: 'Limited-time packages on bridal makeup, mehendi, hair & styling — crafted for the season\'s most beautiful brides.',
      cta1: { label: 'Claim Offers', action: 'wallet' }, 
      img: '/exclusive_banner.png', 
      accent: '#ffbe50',
      stat: { num: '15% Off', lbl: 'On All Packages' }
    }
  ];
  const [heroIdx, setHeroIdx] = useState(0);
  const heroTimer = useRef(null);
  useEffect(() => {
    heroTimer.current = setInterval(() => { setHeroIdx(prev => (prev + 1) % heroSlides.length); }, 4500);
    return () => clearInterval(heroTimer.current);
  }, [heroSlides.length]);
  const restartHeroTimer = () => {
    clearInterval(heroTimer.current);
    heroTimer.current = setInterval(() => { setHeroIdx(prev => (prev + 1) % heroSlides.length); }, 4500);
  };
  const handlePrevSlide = () => {
    setHeroIdx(prev => (prev - 1 + heroSlides.length) % heroSlides.length);
    restartHeroTimer();
  };
  const handleNextSlide = () => {
    setHeroIdx(prev => (prev + 1) % heroSlides.length);
    restartHeroTimer();
  };
  const handleDotClick = (idx) => {
    setHeroIdx(idx);
    restartHeroTimer();
  };
  const readinessRingTrack = darkMode ? '#2a1e22' : '#F8E8EE';
  const readinessRingProgress = darkMode ? 'var(--gold-accent)' : 'var(--sidebar-bg)';

  if (!isLoggedIn) {
    return (
      <Suspense fallback={<div className="page-loading">Loading...</div>}>
        <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />
      </Suspense>
    );
  }

  return (
    <div className="app-layout">
      {/* 1. Left Sidebar Navigation Panel */}
      <aside className="sidebar">
        <div>
          {/* Brand Logo Header */}
          <div className="sidebar-logo" style={{ padding: '24px 16px 12px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Custom Premium Logo Symbol */}
            <svg width="68" height="68" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '0px' }}>
              {/* Crown back glow */}
              <path d="M 36 28 Q 42 26 50 18 Q 58 26 64 28 C 62 33 38 33 36 28 Z" fill="#c49f57" opacity="0.15" />
              {/* Crown outline */}
              <path d="M 36 28 L 38 18 L 44 24 L 50 12 L 56 24 L 62 18 L 64 28 Z" fill="none" stroke="#c49f57" strokeWidth="1.8" strokeLinejoin="round" />
              <circle cx="38" cy="18" r="1.5" fill="#c49f57" />
              <circle cx="62" cy="18" r="1.5" fill="#c49f57" />
              <circle cx="50" cy="12" r="2" fill="#c49f57" />
              {/* Crown cross */}
              <line x1="50" y1="6" x2="50" y2="12" stroke="#c49f57" strokeWidth="1.5" />
              <line x1="47" y1="8" x2="53" y2="8" stroke="#c49f57" strokeWidth="1.5" />
              {/* Outer decorative loop circles */}
              <g transform="translate(50, 58)">
                <circle cx="0" cy="-25" r="3" fill="none" stroke="#c49f57" strokeWidth="1.2" />
                <circle cx="12.5" cy="-21.6" r="3" fill="none" stroke="#c49f57" strokeWidth="1.2" />
                <circle cx="21.6" cy="-12.5" r="3" fill="none" stroke="#c49f57" strokeWidth="1.2" />
                <circle cx="25" cy="0" r="3" fill="none" stroke="#c49f57" strokeWidth="1.2" />
                <circle cx="21.6" cy="12.5" r="3" fill="none" stroke="#c49f57" strokeWidth="1.2" />
                <circle cx="12.5" cy="21.6" r="3" fill="none" stroke="#c49f57" strokeWidth="1.2" />
                <circle cx="0" cy="25" r="3" fill="none" stroke="#c49f57" strokeWidth="1.2" />
                <circle cx="-12.5" cy="21.6" r="3" fill="none" stroke="#c49f57" strokeWidth="1.2" />
                <circle cx="-21.6" cy="12.5" r="3" fill="none" stroke="#c49f57" strokeWidth="1.2" />
                <circle cx="-25" cy="0" r="3" fill="none" stroke="#c49f57" strokeWidth="1.2" />
                <circle cx="-21.6" cy="-12.5" r="3" fill="none" stroke="#c49f57" strokeWidth="1.2" />
                <circle cx="-12.5" cy="-21.6" r="3" fill="none" stroke="#c49f57" strokeWidth="1.2" />
              </g>
              {/* Central Circles */}
              <circle cx="50" cy="58" r="25" fill="none" stroke="#c49f57" strokeWidth="1.8" />
              <circle cx="50" cy="58" r="21" fill="none" stroke="#c49f57" strokeWidth="1.2" />
              {/* Letter N */}
              <text x="50" y="66" font-family="'Playfair Display', Georgia, serif" font-size="22" font-weight="bold" fill="#c49f57" text-anchor="middle">N</text>
            </svg>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0px 0' }}>
              <span className="sidebar-logo-text" style={{ letterSpacing: '2px', fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#c49f57', fontWeight: 'bold' }}>NOOR-E-TAJ</span>
            </div>

            <span className="sidebar-logo-sub" style={{ textTransform: 'uppercase', fontSize: '0.58rem', letterSpacing: '0.8px', color: '#ffffff', opacity: 0.9, lineHeight: 1.4 }}>Delhi's Premium Bridal<br/>Beauty Marketplace</span>

            {/* Decorative ornamental divider */}
            <div className="sidebar-ornament" style={{ marginTop: '10px' }}>
              <span className="sidebar-ornament-line" />
              <span className="sidebar-ornament-icon">❧∞❧</span>
              <span className="sidebar-ornament-line" />
            </div>
          </div>

          {/* Navigation Links Grid */}
          <nav className="sidebar-menu">
            <span 
              onClick={() => setActiveTab('dashboard')} 
              className={`sidebar-link ${activeTab === 'dashboard' ? 'active' : ''}`}
            >
              <LayoutDashboard size={18} /> Dashboard
            </span>
            
            <span 
              onClick={() => setActiveTab('planner')} 
              className={`sidebar-link ${activeTab === 'planner' ? 'active' : ''}`}
            >
              <Sparkles size={18} /> AI Bridal Planner <span className="sidebar-badge-gold">New</span>
            </span>

            <span 
              onClick={() => { setActiveTab('ai-suite'); setAiSuiteActiveTool('twin'); }}
              className={`sidebar-link ${activeTab === 'ai-suite' ? 'active' : ''}`}
            >
              <Sparkles size={18} /> AI Beauty Suite <span className="sidebar-badge-gold">Live</span>
            </span>
            
            <span 
              onClick={() => setActiveTab('marketplace')} 
              className={`sidebar-link ${activeTab === 'marketplace' ? 'active' : ''}`}
            >
              <Scissors size={18} /> Artists & Salons
            </span>
            
            <span 
              onClick={() => setActiveTab('bookings')} 
              className={`sidebar-link ${activeTab === 'bookings' ? 'active' : ''}`}
            >
              <Calendar size={18} /> Bookings
            </span>
            
            <span 
              onClick={() => setActiveTab('moodboard')} 
              className={`sidebar-link ${activeTab === 'moodboard' ? 'active' : ''}`}
            >
              <ImageIcon size={18} /> Moodboard
            </span>
            
            <span 
              onClick={() => setActiveTab('wishlist')} 
              className={`sidebar-link ${activeTab === 'wishlist' ? 'active' : ''}`}
            >
              <Heart size={18} /> Wishlist
            </span>
            
            <span 
              onClick={() => setActiveTab('messages')} 
              className={`sidebar-link ${activeTab === 'messages' ? 'active' : ''}`}
            >
              <MessageCircle size={18} /> Messages {totalUnreadMessages > 0 && <span className="sidebar-badge">{totalUnreadMessages}</span>}
            </span>
            
            <span 
              onClick={() => setActiveTab('reviews')} 
              className={`sidebar-link ${activeTab === 'reviews' ? 'active' : ''}`}
            >
              <Star size={18} /> Reviews
            </span>

            <span 
              onClick={() => setActiveTab('wallet')} 
              className={`sidebar-link ${activeTab === 'wallet' ? 'active' : ''}`}
            >
              <CreditCard size={18} /> Wallet & Offers
            </span>
            
            <span 
              onClick={() => setActiveTab('settings')} 
              className={`sidebar-link ${activeTab === 'settings' ? 'active' : ''}`}
            >
              <Settings size={18} /> Settings
            </span>
          </nav>
        </div>

        {/* Upgrade Box bottom */}
        <div className="sidebar-elite-box">
          <div className="sidebar-elite-title">
            👑 Upgrade to <br />NOOR ELITE
          </div>
          <p className="sidebar-elite-desc">
            Unlock exclusive benefits, priority bookings & offers.
          </p>
          <button className="btn-elite" onClick={() => setActiveTab('settings')}>Upgrade Now</button>
        </div>
      </aside>

      {/* 2. Main content display container */}
      <main className="main-content">
        
        {/* Top Header Navigation Strip (Exactly as shown in latest screenshot) */}
        <div className="topbar">
          {/* Welcome back segment */}
          <div className="topbar-welcome">
            <h2 className="topbar-welcome-top">
              Hello, {userProfile.fullName ? userProfile.fullName.split(' ')[0] : 'Priya'}! <span className="topbar-welcome-sparkle">✨</span>
            </h2>
            <span className="topbar-welcome-sub">Let's make your bridal journey magical!</span>
          </div>

          {/* Search Capsule Input */}
          <div className="topbar-search-wrapper">
            <Search className="topbar-search-icon" size={16} />
            <input 
              type="text" 
              className="topbar-search-input" 
              placeholder="Search artists, salons, services..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && searchQuery.trim()) setShowSearchResults(true); }}
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setShowSearchResults(false); }} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem' }}>✕</button>
            )}
          </div>

          {/* Actions & Profile (Notification/Wishlist/Avatar) */}
          <div className="topbar-actions">
            <button className="topbar-btn" onClick={() => setActiveTab('wishlist')}>
              <Heart size={20} />
            </button>
            
            <button className="topbar-btn" onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={20} />
              {notifList.filter(n => !n.read).length > 0 && (
                <span className="topbar-badge-red">{notifList.filter(n => !n.read).length}</span>
              )}
            </button>

            <button className="topbar-btn" onClick={() => setActiveTab('messages')}>
              <MessageCircle size={20} />
              {totalUnreadMessages > 0 && (
                <span className="topbar-badge-red">{totalUnreadMessages}</span>
              )}
            </button>

            <button
              className="topbar-btn"
              onClick={() => setShowApiKeyModal(true)}
              title="API Key Settings"
              style={{ color: showApiKeyModal ? 'var(--gold-accent)' : '' }}
            >
              <Key size={20} />
            </button>

            <button 
              className="topbar-btn" 
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="topbar-profile-container" onClick={() => setActiveTab('profile')}>
              <img src={userProfile.avatarImg || '/priya_profile.png'} alt={userProfile.fullName} className="topbar-profile-avatar" />
              <div className="topbar-profile-info">
                <span className="topbar-profile-title" style={{ color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {userProfile.fullName}
                  {userProfile.membership === 'Elite' && <span style={{ fontSize: '0.65rem', background: 'var(--gold-accent)', color: '#221819', padding: '1px 6px', borderRadius: '10px', fontWeight: 800 }}>ELITE</span>}
                </span>
                <span className="topbar-profile-subtitle">View Profile</span>
              </div>
              <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
            </div>
          </div>
        </div>

        {/* Dynamic Pages router — scrollable content area */}
        <div className="main-scrollable">
        <Suspense fallback={<div className="page-loading" style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>Loading page...</div>}>

        {/* TAB A: THE EXACT MOCKUP DASHBOARD PAGE */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in">
            
            {/* ── ROW 1: HERO SECTION ── */}
            <div className="db-hero-row">

              {/* LEFT — Hero Carousel Section */}
              <div className="db-hero-carousel">
                {heroSlides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`db-carousel-slide ${index === heroIdx ? 'active' : ''}`}
                    style={{ background: slide.bg }}
                  >
                    {/* Shimmer overlay */}
                    <div className="db-slide-shimmer" style={{ background: slide.shimmer }} />

                    {/* Left content */}
                    <div className="db-cd-unified-left">
                      {/* Tag pill */}
                      {slide.tag && (
                        <div className="db-slide-tag" style={{ color: slide.accent, borderColor: `${slide.accent}40`, background: `${slide.accent}12` }}>
                          {slide.tag}
                        </div>
                      )}
                      {/* Badges row */}
                      {slide.badges && (
                        <div className="db-slide-badges">
                          {slide.badges.map((b, i) => (
                            <div key={i} className="db-slide-badge" style={{ borderColor: `${slide.accent}35`, background: `${slide.accent}0d` }}>
                              <span className="db-slide-badge-icon">{b.icon}</span>
                              <div>
                                <div className="db-slide-badge-label" style={{ color: slide.accent }}>{b.label}</div>
                                <div className="db-slide-badge-sub">{b.sub}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Title */}
                      <div>
                        <h2 className="db-slide-title">
                          {slide.title.split('\n').map((line, i) => (
                            <span key={i}>
                              {i === 0 ? line : <><br/><span style={{ color: slide.accent }}>{line}</span></>}
                            </span>
                          ))}
                        </h2>
                        <p className="db-slide-subtitle">{slide.subtitle}</p>
                      </div>
                      {/* Stat + CTA row */}
                      <div className="db-slide-bottom-row">
                        {slide.stat && (
                          <div className="db-slide-stat">
                            <span className="db-slide-stat-num" style={{ color: slide.accent }}>{slide.stat.num}</span>
                            <span className="db-slide-stat-lbl">{slide.stat.lbl}</span>
                          </div>
                        )}
                        <div className="db-slide-ctas">
                          {slide.cta1 && (
                            <button
                              className="db-slide-btn-primary"
                              style={{ background: `linear-gradient(135deg, ${slide.accent} 0%, ${slide.accent}bb 100%)` }}
                              onClick={() => setActiveTab(slide.cta1.action)}
                            >
                              {slide.cta1.label} →
                            </button>
                          )}
                          {slide.cta2 && (
                            <button
                              className="db-slide-btn-secondary"
                              style={{ color: slide.accent, borderColor: `${slide.accent}55` }}
                              onClick={() => { setActiveTab(slide.cta2.action); setAiSuiteActiveTool('copilot'); }}
                            >
                              {slide.cta2.label}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right image */}
                    <div className="db-cd-unified-right">
                      <img src={slide.img} alt={slide.title} className="db-cd-unified-img" />
                      <div className="db-slide-img-glow" />
                      <div className="db-slide-img-bottom-fade" />
                    </div>
                  </div>
                ))}

                {/* Left/Right Controls */}
                <button
                  className="db-carousel-arrow left"
                  onClick={handlePrevSlide}
                  aria-label="Previous slide"
                >
                  <ArrowLeft size={16} />
                </button>
                <button
                  className="db-carousel-arrow right"
                  onClick={handleNextSlide}
                  aria-label="Next slide"
                >
                  <ArrowRight size={16} />
                </button>

                {/* Pagination Indicator Dots */}
                <div className="db-carousel-dots">
                  {heroSlides.map((_, index) => (
                    <span
                      key={index}
                      className={`db-carousel-dot ${index === heroIdx ? 'active' : ''}`}
                      onClick={() => handleDotClick(index)}
                    />
                  ))}
                </div>
              </div>

              {/* RIGHT — Ask Noor AI (white card) */}
              <div className="db-hero-ai">
                <div className="db-ai-header">
                  <Sparkles size={14} className="db-ai-sparkle-gold" />
                  <span className="db-ai-title">Ask Noor AI</span>
                  <Sparkles size={12} className="db-ai-sparkle-gold" />
                </div>
                <p className="db-ai-sub">Your personal bridal assistant</p>

                <div className="db-ai-input-row">
                  <input
                    type="text"
                    className="db-ai-input"
                    placeholder="How can I help you today?"
                    value={askNoorInput}
                    onChange={e => setAskNoorInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { setActiveTab('ai-suite'); setAiSuiteActiveTool('copilot'); } }}
                  />
                  <button className="db-ai-send" onClick={() => { setActiveTab('ai-suite'); setAiSuiteActiveTool('copilot'); }}>
                    <Send size={11} />
                  </button>
                </div>

                <div className="db-ai-qs">
                  {[
                    { icon: <Sparkles size={14} />, text: 'Find my bridal style' },
                    { icon: <Users size={14} />, text: 'Match me with artists' },
                    { icon: <Calendar size={14} />, text: 'Create beauty timeline' },
                    { icon: <Wallet size={14} />, text: 'Help me plan my budget' },
                  ].map((q, i) => (
                    <div key={i} className="db-ai-q-row"
                      onClick={() => { setAskNoorInput(q.text); setActiveTab('ai-suite'); setAiSuiteActiveTool('copilot'); }}>
                      <span className="db-ai-q-icon">{q.icon}</span>
                      <span className="db-ai-q-text">{q.text}</span>
                    </div>
                  ))}
                </div>

                <button className="db-ai-chat-btn"
                  onClick={() => { setActiveTab('ai-suite'); setAiSuiteActiveTool('copilot'); }}>
                  Chat with Noor AI &rarr;
                </button>
                <div className="db-ai-powered">Powered by Advanced AI</div>
              </div>

            </div>

            {/* Row 2: AI Recommended + Bookings + Exclusive Offer */}
            <div className="dashboard-row-2">

              {/* 1. Bridal Readiness */}
              <div className="dashboard-card-sec">
                <div className="card-sec-header">
                  <h3 className="card-sec-title">Bridal Readiness</h3>
                </div>
                
                <div className="readiness-chart-sec">
                  <div className="readiness-ring">
                    <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                      <circle cx="40" cy="40" r="34" style={{ fill: 'none', stroke: readinessRingTrack, strokeWidth: '6' }}></circle>
                      <circle cx="40" cy="40" r="34" style={{ fill: 'none', stroke: readinessRingProgress, strokeWidth: '6', strokeDasharray: '213', strokeDashoffset: '30' }}></circle>
                    </svg>
                    <div className="readiness-ring-content">
                      <div className="readiness-pct">86%</div>
                      <div className="readiness-lbl-text">Ready</div>
                    </div>
                  </div>
                  <div className="readiness-checklist">
                    {[
                      { label: 'Beauty Plan', done: true },
                      { label: 'Looks Finalized', done: false },
                      { label: 'Bookings', done: true },
                      { label: 'Outfits & Styling', done: false },
                    ].map(item => (
                      <div key={item.label} className="readiness-check-item">
                        <div className="readiness-item-left">
                          <div className="readiness-item-icon-box"><ClipboardCheck size={12} /></div>
                          <span>{item.label}</span>
                        </div>
                        {item.done
                          ? <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16, background: 'var(--success)', borderRadius: '50%', color: 'var(--text-white)' }}><Check size={10} strokeWidth={3} /></span>
                          : <span style={{ display: 'inline-flex', width: 16, height: 16, border: '1.5px solid var(--warning)', borderRadius: '50%' }} />
                        }
                      </div>
                    ))}
                  </div>
                </div>
                <button className="btn-readiness-wide" onClick={() => setActiveTab('planner')}>View Full Checklist →</button>
              </div>
              <div className="dashboard-card-sec" style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '12px' }}>
                <div className="card-sec-header" style={{ marginBottom: '8px' }}>
                  <h3 className="card-sec-title" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                    <Sparkles size={14} style={{ color: 'var(--gold-accent)' }} /> AI Recommended For You
                  </h3>
                  <span onClick={() => setActiveTab('marketplace')} className="db-view-all-link">View All</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', flex: 1 }}>
                  {/* Card 1 */}
                  <div className="recommended-artist-card-new" onClick={() => setActiveTab('marketplace')}>
                    <div className="recommended-artist-img-wrapper-new">
                      <img src="/digital_twin_portrait.png" alt="Poonam Rawat" className="recommended-artist-img-new" />
                      <span className="recommended-match-badge-new">Most Booked</span>
                    </div>
                    <div className="recommended-artist-info-new">
                      <h4 className="recommended-artist-name-new">Poonam Rawat</h4>
                      <p className="recommended-artist-category-new">Celebrity Bridal Artist</p>
                      <div className="recommended-artist-meta-new">
                        <span className="recommended-artist-rating-new">★ 4.9 (125)</span>
                        <span className="recommended-artist-price-new">₹28,000 onwards</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="recommended-artist-card-new" onClick={() => setActiveTab('marketplace')}>
                    <div className="recommended-artist-img-wrapper-new">
                      <img src="/recommend_salon1.png" alt="Chandni Singh" className="recommended-artist-img-new" />
                      <span className="recommended-match-badge-new">Most Booked</span>
                    </div>
                    <div className="recommended-artist-info-new">
                      <h4 className="recommended-artist-name-new">Chandni Singh</h4>
                      <p className="recommended-artist-category-new">Minimalist Bridal Expert</p>
                      <div className="recommended-artist-meta-new">
                        <span className="recommended-artist-rating-new">★ 4.8 (105)</span>
                        <span className="recommended-artist-price-new">₹35,000 onwards</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="recommended-artist-card-new" onClick={() => setActiveTab('marketplace')}>
                    <div className="recommended-artist-img-wrapper-new">
                      <img src="/recommend_salon2.png" alt="Anu Kaushik" className="recommended-artist-img-new" />
                      <span className="recommended-match-badge-new">Most Booked</span>
                    </div>
                    <div className="recommended-artist-info-new">
                      <h4 className="recommended-artist-name-new">Anu Kaushik</h4>
                      <p className="recommended-artist-category-new">Award-Winning Studio</p>
                      <div className="recommended-artist-meta-new">
                        <span className="recommended-artist-rating-new">★ 4.9 (92)</span>
                        <span className="recommended-artist-price-new">₹30,000 onwards</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Upcoming Bookings */}
              <div className="dashboard-card-sec" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '12px' }}>
                <div>
                  <div className="card-sec-header" style={{ marginBottom: '8px' }}>
                    <h3 className="card-sec-title" style={{ fontSize: '0.85rem' }}>Upcoming Bookings</h3>
                    <span onClick={() => setActiveTab('bookings')} className="db-view-all-link">View All</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {trialBookings.slice(0, 2).map((booking, index) => (
                      <div key={booking.id} className="booking-item" style={{ borderBottom: index === 0 ? '1px solid var(--card-border)' : 'none', paddingBottom: index === 0 ? '8px' : '0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }} onClick={() => setActiveTab('bookings')}>
                        <img src={booking.image || '/recommend_salon1.png'} alt="Salon" className="booking-item-img" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                        <div className="booking-item-details" style={{ flex: 1, textAlign: 'left' }}>
                          <h4 className="booking-item-name" style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-dark)' }}>{booking.name}</h4>
                          <p className="booking-item-service" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{booking.service}</p>
                        </div>
                        <div className="booking-item-time" style={{ textAlign: 'right', fontSize: '0.68rem' }}>
                          <strong style={{ display: 'block', color: 'var(--text-dark)' }}>{booking.date}</strong>
                          <div style={{ color: booking.status === 'Confirmed' ? 'var(--success)' : 'var(--warning)', fontWeight: 600 }}>{booking.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="btn-readiness-wide" style={{ marginTop: '8px', padding: '8px' }} onClick={() => setActiveTab('marketplace')}>
                  + New Booking
                </button>
              </div>



            </div>

            {/* Row 3: Moodboard, Timeline, Exclusive Offer */}
            <div className="dashboard-row-3">

              {/* 1. My Moodboard */}
              <div className="dashboard-card-sec">
                <div className="card-sec-header">
                  <h3 className="card-sec-title">My Moodboard</h3>
                  <span 
                    onClick={() => setActiveTab('moodboard')} 
                    style={{ fontSize: '0.75rem', color: 'var(--maroon-btn)', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    View All
                  </span>
                </div>

                <div className="moodboard-grid-5col">
                  <div className="moodboard-item-square" onClick={() => setActiveTab('moodboard')}>
                    <div className="moodboard-img-box">
                      <img src="/mood_hair.png" alt="Hair" />
                    </div>
                    <span className="moodboard-item-lbl">Hair</span>
                  </div>
                  <div className="moodboard-item-square" onClick={() => setActiveTab('moodboard')}>
                    <div className="moodboard-img-box">
                      <img src="/mood_jewelry.png" alt="Jewellery" />
                    </div>
                    <span className="moodboard-item-lbl">Jewellery</span>
                  </div>
                  <div className="moodboard-item-square" onClick={() => setActiveTab('moodboard')}>
                    <div className="moodboard-img-box">
                      <img src="/digital_twin_portrait.png" alt="Makeup" />
                    </div>
                    <span className="moodboard-item-lbl">Makeup</span>
                  </div>
                  <div className="moodboard-item-square" onClick={() => setActiveTab('moodboard')}>
                    <div className="moodboard-img-box">
                      <img src="/bridal_lehenga.png" alt="Lehenga" />
                    </div>
                    <span className="moodboard-item-lbl">Lehenga</span>
                  </div>
                  <div className="moodboard-item-square" onClick={() => setActiveTab('moodboard')}>
                    <div className="moodboard-add-box-dashed">
                      <div className="moodboard-add-icon-circle">+</div>
                    </div>
                    <span className="moodboard-item-lbl">Add More</span>
                  </div>
                </div>
              </div>

              {/* 2. Wedding Timeline */}
              <div className="dashboard-card-sec">
                <div className="card-sec-header">
                  <h3 className="card-sec-title">Wedding Timeline</h3>
                  <span 
                    onClick={() => setActiveTab('planner')} 
                    style={{ fontSize: '0.75rem', color: 'var(--maroon-btn)', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    View All
                  </span>
                </div>

                <div className="timeline-horizontal-container">
                  <div className="timeline-horizontal-line"></div>
                  
                  <div className="timeline-horizontal-step" onClick={() => setActiveTab('planner')}>
                    <div className="timeline-step-icon-circle">
                      <Calendar size={14} />
                    </div>
                    <div className="timeline-step-lbl">90 Days Before</div>
                    <div className="timeline-step-sub">12 Tasks</div>
                  </div>

                  <div className="timeline-horizontal-step" onClick={() => setActiveTab('planner')}>
                    <div className="timeline-step-icon-circle">
                      <Scissors size={14} />
                    </div>
                    <div className="timeline-step-lbl">60 Days Before</div>
                    <div className="timeline-step-sub">8 Tasks</div>
                  </div>

                  <div className="timeline-horizontal-step" onClick={() => setActiveTab('planner')}>
                    <div className="timeline-step-icon-circle">
                      <Heart size={14} />
                    </div>
                    <div className="timeline-step-lbl">30 Days Before</div>
                    <div className="timeline-step-sub">10 Tasks</div>
                  </div>

                  <div className="timeline-horizontal-step" onClick={() => setActiveTab('planner')}>
                    <div className="timeline-step-icon-circle">
                      <Sparkles size={14} />
                    </div>
                    <div className="timeline-step-lbl">7 Days Before</div>
                    <div className="timeline-step-sub">6 Tasks</div>
                  </div>
                </div>
              </div>

              {/* 3. Exclusive Offer */}
              <div className="exclusive-offer-new-mockup" onClick={() => setActiveTab('wallet')}>
                <div className="exclusive-offer-details-mockup">
                  <div>
                    <span className="exclusive-offer-header-mockup">
                      <Crown size={12} style={{ color: '#c49f57' }} /> Exclusive Offer
                    </span>
                    <h4 className="exclusive-offer-title-mockup">
                      Flat 15% OFF
                      <span>on your next booking</span>
                    </h4>
                  </div>
                  <div>
                    <div className="exclusive-offer-code-mockup">
                      Use Code: <strong>NOOR15</strong>
                    </div>
                    <button className="btn-exclusive-book-mockup" onClick={(e) => { e.stopPropagation(); setActiveTab('marketplace'); }}>
                      Book Now
                    </button>
                  </div>
                </div>
                <div className="exclusive-offer-img-box-mockup">
                  <img src="/exclusive_banner.png" alt="Exclusive Offer" className="exclusive-offer-img-mockup" />
                </div>
              </div>

            </div>

            {/* Footer Stats Ribbon */}
            <div className="stats-ribbon">
              <div className="stats-item">
                <Users className="stats-icon-box" size={24} />
                <div>
                  <div className="stats-title">10,000+</div>
                  <div className="stats-lbl">Happy Brides</div>
                </div>
              </div>
              <div className="stats-item">
                <UserCheck className="stats-icon-box" size={24} />
                <div>
                  <div className="stats-title">500+</div>
                  <div className="stats-lbl">Verified Experts</div>
                </div>
              </div>
              <div className="stats-item">
                <Calendar className="stats-icon-box" size={24} />
                <div>
                  <div className="stats-title">50,000+</div>
                  <div className="stats-lbl">Bookings Completed</div>
                </div>
              </div>
              <div className="stats-item" style={{ display: 'flex', alignItems: 'center' }}>
                <Star className="stats-icon-box" size={24} style={{ fill: '#c49f57', stroke: '#c49f57' }} />
                <div>
                  <div className="stats-title">4.9 ★</div>
                  <div className="stats-lbl">Average Rating</div>
                </div>
              </div>
              <div className="stats-item">
                <Headset className="stats-icon-box" size={24} />
                <div>
                  <div className="stats-title">24/7</div>
                  <div className="stats-lbl">Customer Support</div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB B: AI BRIDAL PLANNER */}
        {activeTab === 'planner' && (
          <BridalPlanner onBack={() => setActiveTab('dashboard')} onNavigate={(tab) => setActiveTab(tab)} darkMode={darkMode} />
        )}

        {/* TAB B-2: AI BEAUTY SUITE */}
        {activeTab === 'ai-suite' && (
          <AiToolsContainer key={aiSuiteActiveTool} initialActiveTool={aiSuiteActiveTool} />
        )}

        {/* TAB C: ARTISTS & SALONS MARKETPLACE */}
        {activeTab === 'marketplace' && (
          <div className="animate-fade-in" style={{ padding: '0 0 40px 0' }}>
            <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid var(--card-border)', marginBottom: '24px', paddingBottom: '0' }}>
              <button 
                onClick={() => setMarketplaceSubTab('artists')}
                style={{
                  background: 'none', border: 'none',
                  fontSize: '1.25rem', fontWeight: 700,
                  fontFamily: 'var(--font-heading)',
                  color: marketplaceSubTab === 'artists' ? 'var(--maroon-btn)' : 'var(--text-muted)',
                  borderBottom: marketplaceSubTab === 'artists' ? '3px solid var(--maroon-btn)' : '3px solid transparent',
                  paddingBottom: '12px', cursor: 'pointer', transition: 'all 0.2s',
                  outline: 'none'
                }}
              >
                Independent Artists
              </button>
              <button 
                onClick={() => setMarketplaceSubTab('salons')}
                style={{
                  background: 'none', border: 'none',
                  fontSize: '1.25rem', fontWeight: 700,
                  fontFamily: 'var(--font-heading)',
                  color: marketplaceSubTab === 'salons' ? 'var(--maroon-btn)' : 'var(--text-muted)',
                  borderBottom: marketplaceSubTab === 'salons' ? '3px solid var(--maroon-btn)' : '3px solid transparent',
                  paddingBottom: '12px', cursor: 'pointer', transition: 'all 0.2s',
                  outline: 'none'
                }}
              >
                Luxury Studios & Salons
              </button>
            </div>
            {marketplaceSubTab === 'artists' ? (
              <ArtistsSalons onBack={() => setActiveTab('dashboard')} onNavigate={(tab) => setActiveTab(tab)} wishlistItems={wishlistItems} toggleWishlist={toggleWishlist} />
            ) : (
              <SalonMarketplace />
            )}
          </div>
        )}


        {/* TAB D: BOOKING DETAILS */}
        {activeTab === 'bookings' && (
          <BookingDetails onBack={() => setActiveTab('dashboard')} onNavigate={(tab) => setActiveTab(tab)} />
        )}

        {/* TAB E: MY MOODBOARD */}
        {activeTab === 'moodboard' && (
          <MyMoodboard onBack={() => setActiveTab('dashboard')} wishlistItems={wishlistItems} toggleWishlist={toggleWishlist} />
        )}

        {/* TAB F: MESSAGES */}
        {activeTab === 'messages' && (
          <Messages onBack={() => setActiveTab('dashboard')} onNavigate={(tab) => setActiveTab(tab)} conversations={conversations} setConversations={setConversations} />
        )}

        {/* WALLET & OFFERS */}
        {activeTab === 'wallet' && (
          <WalletOffers onBack={() => setActiveTab('dashboard')} />
        )}

        {/* SETTINGS */}
        {activeTab === 'settings' && (
          <SettingsPage onBack={() => setActiveTab('dashboard')} darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={() => setIsLoggedIn(false)} />
        )}

          {/* WISHLIST PAGE */}
          {activeTab === 'wishlist' && (
            <div className="animate-fade-in wishlist-page" style={{ padding: '0 0 40px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <button className="planner-back-btn" onClick={() => setActiveTab('dashboard')} style={{ marginBottom: '8px' }}>
                    <ArrowLeft size={16} /> Back to Dashboard
                  </button>
                  <h1 className="wishlist-page__title" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.9rem', color: 'var(--sidebar-bg)', fontWeight: 700, marginBottom: '4px' }}>
                    My Wishlist ❤️
                  </h1>
                  <p className="wishlist-page__subtitle" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Your saved artists and packages — <strong className="wishlist-page__count" style={{ color: 'var(--maroon-btn)' }}>{wishlistItems.length} saved</strong>
                  </p>
                </div>
              </div>
              <div className="wishlist-page__tabs" style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                {['All', 'Artists', 'Salons', 'Packages'].map(t => (
                  <button key={t} className="wishlist-page__tab" onClick={() => setWishlistTab(t)} style={{ padding: '6px 14px', borderRadius: '20px', border: wishlistTab === t ? '1.5px solid var(--maroon-btn)' : '1.5px solid var(--card-border)', background: wishlistTab === t ? 'var(--maroon-light)' : 'transparent', color: wishlistTab === t ? 'var(--maroon-btn)' : 'var(--text-muted)', fontFamily: 'var(--font-btn)', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer' }}>{t}</button>
                ))}
              </div>
              {wishlistItems.length === 0 ? (
                <div className="wishlist-page__empty" style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--card-border)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💔</div>
                  <h3 className="wishlist-page__empty-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--sidebar-bg)', marginBottom: '8px' }}>Your wishlist is empty!</h3>
                  <p className="wishlist-page__empty-text" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '20px' }}>Start exploring artists and save your favorites</p>
                  <button onClick={() => setActiveTab('marketplace')} className="planner-next-btn" style={{ padding: '10px 24px' }}>Explore Artists</button>
                </div>
              ) : (
                <div className="wishlist-page__grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  {[
                    { name: 'Poonam Rawat', rating: '4.9', reviews: '1250+', price: '₹28,000', location: 'South Delhi', img: '/digital_twin_portrait.png', badge: 'Most Booked', verified: true },
                    { name: 'Chandni Singh', rating: '4.9', reviews: '1050+', price: '₹35,000', location: 'South Delhi', img: '/recommend_salon1.png', badge: 'Top Rated', verified: true },
                    { name: 'Anu Kaushik', rating: '4.8', reviews: '920+', price: '₹30,000', location: 'Chattarpur, New Delhi', img: '/recommend_salon2.png', verified: true },
                  ].filter(a => wishlistItems.includes(a.name)).map(a => (
                    <div key={a.name} className="wishlist-page__card" style={{ border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--card-bg)', boxShadow: 'var(--shadow-sm)' }}>
                      <div style={{ position: 'relative', height: 140 }}>
                        <img src={a.img} alt={a.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {a.badge && <span className="wishlist-page__badge" style={{ position: 'absolute', top: 10, left: 10, background: 'var(--maroon-btn)', color: 'var(--text-white)', fontSize: '0.6rem', fontWeight: 700, padding: '2px 10px', borderRadius: 20 }}>{a.badge}</span>}
                        <button className="wishlist-page__heart" onClick={() => toggleWishlist(a.name)} style={{ position: 'absolute', top: 10, right: 10, background: 'var(--card-bg)', border: 'none', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>
                          <Heart size={14} style={{ color: 'var(--maroon-btn)', fill: 'var(--maroon-btn)' }} />
                        </button>
                      </div>
                      <div className="wishlist-page__card-body" style={{ padding: '16px', textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <h3 className="wishlist-page__card-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--sidebar-bg)', margin: 0 }}>{a.name}</h3>
                          {a.verified && <span className="artist-verified">✔ Verified</span>}
                        </div>
                        <div className="wishlist-page__card-meta" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>★ {a.rating} ({a.reviews}) · {a.location}</div>
                        <div className="wishlist-page__card-price" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--maroon-btn)', fontFamily: 'var(--font-heading)', marginBottom: '12px' }}>{a.price}</div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="wishlist-page__primary-btn" onClick={() => setActiveTab('marketplace')} style={{ flex: 1, background: 'var(--maroon-btn)', color: 'var(--text-white)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px', fontFamily: 'var(--font-btn)', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}>Quick Book</button>
                          <button className="wishlist-page__secondary-btn" onClick={() => setActiveTab('marketplace')} style={{ flex: 1, background: 'transparent', color: 'var(--text-dark)', border: '1.5px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '8px', fontFamily: 'var(--font-btn)', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}>View Profile</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        {/* REVIEWS PAGE */}
        {activeTab === 'reviews' && (
          <div className="animate-fade-in" style={{ padding: '0 0 40px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <button className="planner-back-btn" onClick={() => setActiveTab('dashboard')} style={{ marginBottom: '8px' }}>
                  <ArrowLeft size={16} /> Back to Dashboard
                </button>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.9rem', color: 'var(--sidebar-bg)', fontWeight: 700, marginBottom: '4px' }}>
                  My Reviews ⭐
                </h1>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Reviews you've given and received
                </p>
              </div>
              <button onClick={() => setShowWriteReview(true)} style={{ background: 'var(--maroon-btn)', color: 'var(--text-white)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '9px 18px', fontFamily: 'var(--font-btn)', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', marginTop: 36, display: 'flex', alignItems: 'center', gap: 6 }}>
                ✏️ Write a Review
              </button>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {['Given (3)', 'Received (1)'].map(t => (
                <button key={t} onClick={() => setReviewsTab(t)} style={{ padding: '6px 14px', borderRadius: '20px', border: reviewsTab === t ? '1.5px solid var(--maroon-btn)' : '1.5px solid var(--card-border)', background: reviewsTab === t ? 'var(--maroon-light)' : 'transparent', color: reviewsTab === t ? 'var(--maroon-btn)' : 'var(--text-muted)', fontFamily: 'var(--font-btn)', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer' }}>{t}</button>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {reviewsTab === 'Given (3)' ? (() => {
                const givenReviews = [
                  { name: 'Poonam Rawat', rating: 5, text: 'Absolutely amazing work! Poonam understood exactly what I wanted. The makeup was flawless and lasted all day. Highly recommend!', date: '12 Dec 2025', img: '/digital_twin_portrait.png' },
                  { name: 'Chandni Singh', rating: 5, text: 'Chandni created the most elegant bridal look. Her minimalist approach made me feel naturally beautiful!', date: '28 Nov 2025', img: '/recommend_salon1.png' },
                  { name: 'Anu Kaushik', rating: 5, text: 'An incredible experience with Anu! The bridal trial was amazing and the final look left everyone speechless. Thank you!', date: '15 Oct 2025', img: '/recommend_salon2.png' },
                ].filter(r => !deletedReviewNames.includes(r.name));
                const allGiven = [...givenReviews, ...myReviews];
                return allGiven.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No reviews yet.</div>
                ) : allGiven.map(r => (
                  <div key={r._id || r.name} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                      <img src={r.img} alt={r.name} style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', objectFit: 'cover', flexShrink: 0 }} />
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)' }}>{r.name}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{r.date}</div>
                          </div>
                          <div style={{ color: 'var(--gold-accent)', fontSize: '0.85rem' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                        </div>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-dark)', lineHeight: 1.5, margin: '8px 0 0' }}>{r.text}</p>
                        <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                          <button onClick={() => { setReviewForm({ ...reviewForm, booking: r.name, rating: r.rating }); setShowWriteReview(true); }} style={{ background: 'none', border: 'none', fontSize: '0.72rem', color: 'var(--maroon-btn)', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-btn)' }}>✏️ Edit</button>
                          <button onClick={() => { if (r._id) { setMyReviews(prev => prev.filter(mr => mr._id !== r._id)); } else { setDeletedReviewNames(prev => [...prev, r.name]); } }} style={{ background: 'none', border: 'none', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-btn)' }}>🗑️ Delete</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ));
              })() : (
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <img src="/digital_twin_portrait.png" alt="Poonam Rawat" style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)' }}>Poonam Rawat</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>14 Dec 2025</div>
                        </div>
                        <div style={{ color: 'var(--gold-accent)', fontSize: '0.85rem' }}>★★★★★</div>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-dark)', lineHeight: 1.5, margin: '8px 0 0' }}>Priya was a wonderful client! She was very cooperative and we loved working with her. Highly recommend her to any bridal artist!</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Write a Review Modal */}
        {showWriteReview && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }} onClick={() => setShowWriteReview(false)}>
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', maxWidth: 480, width: '90%', borderRadius: 'var(--radius-lg)', padding: '28px', maxHeight: '80vh', overflowY: 'auto', boxShadow: 'var(--shadow-md)' }} onClick={e => e.stopPropagation()}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--text-dark)', marginBottom: '20px' }}>✏️ Write a Review</h3>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-btn)', display: 'block', marginBottom: '6px' }}>Select Booking</label>
                <select value={reviewForm.booking} onChange={e => setReviewForm({ ...reviewForm, booking: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-color)', color: 'var(--text-dark)', fontFamily: 'var(--font-body)', fontSize: '0.85rem', outline: 'none' }}>
                  <option value="" style={{ background: 'var(--card-bg)' }}>— Select —</option>
                  <option value="Poonam Rawat" style={{ background: 'var(--card-bg)' }}>Poonam Rawat — 12 Dec 2025</option>
                  <option value="Chandni Singh" style={{ background: 'var(--card-bg)' }}>Chandni Singh — 28 Nov 2025</option>
                  <option value="Anu Kaushik" style={{ background: 'var(--card-bg)' }}>Anu Kaushik — 15 Oct 2025</option>
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-btn)', display: 'block', marginBottom: '6px' }}>Rating</label>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <span key={s} onClick={() => setReviewForm({ ...reviewForm, rating: s })} style={{ fontSize: '1.5rem', cursor: 'pointer', color: s <= reviewForm.rating ? 'var(--gold-accent)' : 'var(--text-muted)' }}>{s <= reviewForm.rating ? '★' : '☆'}</span>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-btn)', display: 'block', marginBottom: '6px' }}>Your Review</label>
                <textarea value={reviewForm.text} onChange={e => setReviewForm({ ...reviewForm, text: e.target.value })} placeholder="Share your experience..." style={{ width: '100%', minHeight: 100, padding: '10px 14px', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-color)', color: 'var(--text-dark)', fontFamily: 'var(--font-body)', fontSize: '0.85rem', outline: 'none', resize: 'vertical' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-btn)', display: 'block', marginBottom: '6px' }}>Add Image</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input type="file" accept="image/*" onChange={e => setReviewForm({ ...reviewForm, image: e.target.files[0] })} style={{ fontSize: '0.82rem', color: 'var(--text-dark)' }} />
                  {reviewForm.image && <span style={{ fontSize: '0.72rem', color: 'var(--maroon-btn)' }}>✓ {reviewForm.image.name}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button onClick={() => setShowWriteReview(false)} style={{ padding: '10px 20px', background: 'transparent', border: '1.5px solid var(--card-border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-dark)', fontFamily: 'var(--font-btn)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button onClick={() => { if (!reviewForm.booking || !reviewForm.rating || !reviewForm.text) return; const newReview = { ...reviewForm, _id: Date.now(), date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), img: reviewForm.image ? URL.createObjectURL(reviewForm.image) : '/priya_profile.png' }; setMyReviews(prev => [newReview, ...prev]); setReviewForm({ booking: '', rating: 0, text: '', image: null }); setShowWriteReview(false); setToastMessage('Review submitted!'); }} className="planner-next-btn" style={{ padding: '10px 20px' }}>Submit Review</button>
              </div>
            </div>
          </div>
        )}

        {/* SEARCH RESULTS PAGE */}
        {showSearchResults && searchQuery && (
          <div className="animate-fade-in" style={{ padding: '0 0 40px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--sidebar-bg)', fontWeight: 700, marginBottom: '4px' }}>
                  Search Results <span style={{ color: 'var(--gold-accent)' }}>🔍</span>
                </h1>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Showing results for "<strong style={{ color: 'var(--maroon-btn)' }}>{searchQuery}</strong>"
                </p>
              </div>
              <button onClick={() => { setSearchQuery(''); setShowSearchResults(false); }} className="planner-back-btn" style={{ padding: '8px 16px' }}>
                ← Back to Dashboard
              </button>
            </div>
<div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '16px', boxShadow: 'var(--shadow-sm)' }}>
  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '16px' }}>🎨 Artists & Salons</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(() => {
                  const filtered = [
                    { name: 'Poonam Rawat', rating: '4.9', price: '₹28,000', loc: 'South Delhi', img: '/digital_twin_portrait.png' },
                    { name: 'Chandni Singh', rating: '4.9', price: '₹35,000', loc: 'South Delhi', img: '/recommend_salon1.png' },
                  ].filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()));
                  return filtered.length > 0 ? filtered.map(a => (
                    <div key={a.name} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                      onClick={() => { setShowSearchResults(false); setActiveTab('marketplace'); }}>
                      <img src={a.img} alt={a.name} style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)' }}>{a.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>★ {a.rating} · {a.loc}</div>
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--maroon-btn)', fontFamily: 'var(--font-btn)' }}>{a.price}</div>
                      <button className="artist-view-btn" style={{ padding: '5px 12px', fontSize: '0.72rem' }}>View →</button>
                    </div>
                  )) : (
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', padding: '8px 0' }}>No matching results found.</div>
                  );
                })()}
              </div>
            </div>
            <button onClick={() => { setShowSearchResults(false); setActiveTab('marketplace'); }} className="planner-next-btn" style={{ padding: '10px 20px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              View All Artists → <ArrowRight size={14} />
            </button>
          </div>
        )}

        </div>{/* end main-scrollable */}

        {/* NOTIFICATIONS SLIDE-IN PANEL */}
        {showNotifications && (
          <>
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, backdropFilter: 'blur(2px)' }} onClick={() => setShowNotifications(false)} />
            <div className="animate-fade-in" style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 380, background: 'var(--card-bg)', borderLeft: '1px solid var(--card-border)', zIndex: 201, boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                  Notifications <Bell size={16} style={{ color: 'var(--gold-accent)' }} />
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button onClick={markAllAsRead} style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: 'var(--maroon-btn)', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-btn)' }}>Mark all read</button>
                  <button onClick={() => setShowNotifications(false)} style={{ background: 'var(--bg-color)', border: 'none', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1rem', color: 'var(--text-muted)' }}>✕</button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4, padding: '10px 24px', borderBottom: '1px solid var(--card-border)', flexShrink: 0 }}>
                {['All', 'Bookings', 'Offers', 'Reminders'].map(t => (
                  <button key={t} onClick={() => setNotifTab(t)} style={{ padding: '5px 12px', borderRadius: '20px', border: 'none', background: t === notifTab ? 'var(--maroon-btn)' : 'transparent', color: t === notifTab ? 'var(--text-white)' : 'var(--text-muted)', fontSize: '0.7rem', fontFamily: 'var(--font-btn)', fontWeight: 600, cursor: 'pointer' }}>{t}</button>
                ))}
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {notifList.filter(n => notifTab === 'All' || n.category === notifTab).map((n) => (
                  <div key={n.id} onClick={() => markAsRead(n.id)} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--card-border)', cursor: 'pointer', opacity: n.read ? 0.55 : 1 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${n.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0 }}>{n.icon}</div>
                    <div style={{ textAlign: 'left', flex: 1 }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)', marginBottom: 2 }}>{n.title}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {toastMessage && (
          <div style={{ position: 'fixed', top: 24, right: 24, background: 'var(--success)', color: 'var(--text-white)', padding: '12px 24px', borderRadius: 'var(--radius-sm)', zIndex: 9999, fontFamily: 'var(--font-btn)', fontWeight: 600, fontSize: '0.85rem', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>✓</span> {toastMessage}
          </div>
        )}

        <ApiKeyModal visible={showApiKeyModal} onClose={() => setShowApiKeyModal(false)} />

      </main>
    </div>
  );
}

export default App;
