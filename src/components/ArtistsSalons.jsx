import { useState } from 'react';
import { Filter, Grid, List, Heart, MapPin, ChevronDown, ArrowLeft } from 'lucide-react';
import PackageDetails from './PackageDetails';

/* ── Real Artists data (Delhi's top bridal makeup artists) ── */
const ARTISTS_DATA = [
  {
    id: 1,
    name: 'Poonam Rawat',
    badge: 'Most Booked',
    subtitle: 'Celebrity Bridal Artist',
    rating: 4.9, reviews: 1250, exp: '8+ Years Exp.', location: 'South Delhi',
    tags: ['HD Makeup', 'Airbrush', 'Luxury Brands', 'On-location', 'Natural Look'],
    desc: 'Award-winning bridal makeup artist featured in Women\'s Era & Wedding Affairs. Specializing in flawless HD bridal looks with international products.',
    price: '₹28,000',
    image: '/digital_twin_portrait.png',
    photos: 30,
    category: 'Makeup',
    verified: true,
    portfolioImgs: [
      '/bridal_lehenga.png', '/countdown_bride.png', '/digital_twin_portrait.png', '/recommend_salon1.png',
      '/mood_jewelry.png', '/mood_henna.png', '/mood_walk.png', '/recommend_salon2.png',
    ],
    stats: [
      { icon: '✔', label: 'Verified' },
      { icon: '👥', label: '800+\nHappy Brides' },
      { icon: '📍', label: 'On-location\nServices' },
      { icon: '⭐', label: 'Premium\nProducts' },
    ],
    packages: [
      { name: 'Premium Bridal Package', desc: 'HD Makeup, Hair Styling, Draping, False Lashes, Touch-up', price: '₹28,000' },
      { name: 'Luxury Bridal Package',  desc: 'Airbrush Makeup, Premium Products, 2 Looks, Touch-up',   price: '₹45,000' },
    ],
    details: { studio: 'South Delhi', travels: 'Pan India', priceRange: '₹22,000 - ₹45,000', advance: '30% at booking', cancellation: 'Free 48hr cancellation' },
    review: { name: 'Ananya Sharma', rating: 5, text: 'Poonam did a phenomenal job! She understood exactly what I wanted. Highly recommended! 🌟', verified: true },
  },
  {
    id: 2,
    name: 'Chandni Singh',
    badge: 'Top Rated',
    subtitle: 'Minimalist Bridal Expert',
    rating: 4.9, reviews: 1050, exp: '10+ Years Exp.', location: 'South Delhi',
    tags: ['Natural Look', 'Minimal Makeup', 'Airbrush', 'Flawless Base', 'HD Finish'],
    desc: 'Known for her signature minimal yet elegant bridal looks. Chandni believes in enhancing natural beauty without heavy makeup.',
    price: '₹35,000',
    image: '/recommend_salon1.png',
    photos: 28,
    category: 'Makeup',
    verified: true,
    portfolioImgs: [
      '/bridal_lehenga.png', '/countdown_bride.png', '/digital_twin_portrait.png', '/recommend_salon1.png',
      '/mood_jewelry.png', '/mood_henna.png', '/mood_walk.png', '/recommend_salon2.png',
    ],
    stats: [
      { icon: '✔', label: 'Verified' },
      { icon: '👥', label: '600+\nHappy Brides' },
      { icon: '📍', label: 'Studio &\nOn-location' },
      { icon: '⭐', label: 'High-End\nProducts' },
    ],
    packages: [
      { name: 'Classic Bridal', desc: 'HD Makeup, Hair Styling, Draping, Natural Look', price: '₹35,000' },
      { name: 'Luxury Bridal', desc: 'Airbrush Makeup, Trial Included, Premium Brands', price: '₹55,000' },
    ],
    details: { studio: 'South Delhi', travels: 'Delhi NCR', priceRange: '₹30,000 - ₹55,000', advance: '40% at booking', cancellation: '48hr advance notice' },
    review: { name: 'Meera Kapoor', rating: 5, text: 'Chandni is a true artist! She made me look naturally beautiful without overdoing it. Absolutely loved it!', verified: true },
  },
  {
    id: 3,
    name: 'Anu Kaushik',
    badge: "Editor's Choice",
    subtitle: 'Award-Winning Studio',
    rating: 4.8, reviews: 920, exp: '12+ Years Exp.', location: 'Chattarpur, New Delhi',
    tags: ['Natural Bridal', 'HD Makeup', 'Hair Styling', 'Saree Draping', 'Trial Included'],
    desc: 'Perfected the art of mimicking natural beauty with makeup. Trusted by Delhi\'s elite brides for over a decade.',
    price: '₹30,000',
    image: '/recommend_salon2.png',
    photos: 22,
    category: 'Makeup',
    verified: true,
    portfolioImgs: [
      '/bridal_lehenga.png', '/countdown_bride.png', '/digital_twin_portrait.png', '/recommend_salon1.png',
      '/mood_jewelry.png', '/mood_henna.png', '/mood_walk.png', '/recommend_salon2.png',
    ],
    stats: [
      { icon: '✔', label: 'Verified' },
      { icon: '👥', label: '700+\nHappy Brides' },
      { icon: '📍', label: 'Studio at\nChattarpur' },
      { icon: '⭐', label: 'Premium\nBrands' },
    ],
    packages: [
      { name: 'Bridal Makeup + Hair', desc: 'HD Makeup, Hair Styling, Draping, Trial Session', price: '₹30,000' },
      { name: 'Complete Bridal Glow', desc: 'Airbrush Makeup, Hair, Draping, Pre-Wedding Facial', price: '₹48,000' },
    ],
    details: { studio: '1, Meera Farms, Chattarpur', travels: 'Delhi NCR', priceRange: '₹25,000 - ₹48,000', advance: '50% at booking', cancellation: '72hr notice' },
    review: { name: 'Priya Patel', rating: 5, text: 'Anu made me look effortlessly perfect! She listened to exactly what I wanted and delivered beyond expectations.', verified: true },
  },
  {
    id: 4,
    name: 'Komal Gulati',
    badge: 'Trending',
    subtitle: 'International Bridal Expert',
    rating: 4.8, reviews: 880, exp: '10+ Years Exp.', location: 'Sainik Farms, New Delhi',
    tags: ['Dewy Glow', 'Neutral Shades', 'HD Makeup', 'Airbrush', 'Editorial Look'],
    desc: 'Expert on international bridal makeup trends. Known for her signature dewy, glowing bridal looks with natural neutral tones.',
    price: '₹32,000',
    image: '/countdown_bride.png',
    photos: 25,
    category: 'Makeup',
    verified: true,
    portfolioImgs: [
      '/bridal_lehenga.png', '/countdown_bride.png', '/digital_twin_portrait.png', '/recommend_salon1.png',
      '/mood_jewelry.png', '/mood_henna.png', '/mood_walk.png', '/recommend_salon2.png',
    ],
    stats: [
      { icon: '✔', label: 'Verified' },
      { icon: '👥', label: '500+\nHappy Brides' },
      { icon: '📍', label: 'Studio in\nSainik Farms' },
      { icon: '⭐', label: 'Global\nBrands' },
    ],
    packages: [
      { name: 'Dewy Bridal Glow', desc: 'HD Makeup, Hair, Neutral Glam Look, Touch-up Kit', price: '₹32,000' },
      { name: 'International Bridal', desc: 'Airbrush, Premium Brands, 2 Looks, Bridesmaid Touch-up', price: '₹50,000' },
    ],
    details: { studio: 'CC-04, Anupam Garden, Sainik Farms', travels: 'Delhi NCR + Travel', priceRange: '₹28,000 - ₹50,000', advance: '40% at booking', cancellation: 'Free cancellation 48hrs' },
    review: { name: 'Ritu Agarwal', rating: 5, text: 'Komal gave me the most gorgeous dewy glow! I felt like a million bucks. Her attention to detail is unmatched!', verified: true },
  },
  {
    id: 5,
    name: 'Vidya Tikari',
    badge: 'Celebrity Artist',
    subtitle: 'Celebrity Makeup Artist',
    rating: 4.9, reviews: 1500, exp: '15+ Years Exp.', location: 'Lajpat Nagar, Delhi',
    tags: ['Bridal Makeup', 'Airbrush', 'Party Makeup', 'Editorial', 'HD Finish'],
    desc: 'Worked with Bollywood stars like Sushmita Sen & Madhuri Dixit. Known for her versatile approach matching every bride\'s personality.',
    price: '₹40,000',
    image: '/luxury_salon.png',
    photos: 35,
    category: 'Makeup',
    verified: true,
    portfolioImgs: [
      '/bridal_lehenga.png', '/countdown_bride.png', '/digital_twin_portrait.png', '/recommend_salon1.png',
      '/mood_jewelry.png', '/mood_henna.png', '/mood_walk.png', '/recommend_salon2.png',
    ],
    stats: [
      { icon: '✔', label: 'Verified' },
      { icon: '👥', label: '1000+\nHappy Brides' },
      { icon: '📍', label: 'Lajpat Nagar\n+ Gurgaon' },
      { icon: '⭐', label: 'Celebrity\nClients' },
    ],
    packages: [
      { name: 'Bridal Signature', desc: 'Full Bridal Makeup, Hair Styling, Draping, Trial', price: '₹40,000' },
      { name: 'Celebrity Bridal', desc: 'Airbrush, Premium Brands, 3 Looks, Full Day Touch-up', price: '₹65,000' },
    ],
    details: { studio: 'B-21, Lajpat Nagar-2, New Delhi', travels: 'Pan India', priceRange: '₹35,000 - ₹65,000', advance: '50% at booking', cancellation: '48hr cancellation' },
    review: { name: 'Sneha Verma', rating: 5, text: 'Vidya is an absolute legend! She made me look like a Bollywood bride. Worth every penny!', verified: true },
  },
  {
    id: 6,
    name: 'Makeup by Oosh',
    badge: 'Top Rated',
    subtitle: 'Freelance Bridal Artist',
    rating: 4.9, reviews: 760, exp: '7+ Years Exp.', location: 'Greater Kailash, South Delhi',
    tags: ['Minimal Glam', 'HD Makeup', 'Airbrush', 'On-location', 'Soft Glam'],
    desc: 'Highly professional freelance bridal artist based in Greater Kailash. Known for minimal yet glamorous bridal looks that photograph beautifully.',
    price: '₹24,000',
    image: '/faceshape_profile.png',
    photos: 20,
    category: 'Makeup',
    verified: true,
    portfolioImgs: [
      '/bridal_lehenga.png', '/countdown_bride.png', '/digital_twin_portrait.png', '/recommend_salon1.png',
      '/mood_jewelry.png', '/mood_henna.png', '/mood_walk.png', '/recommend_salon2.png',
    ],
    stats: [
      { icon: '✔', label: 'Verified' },
      { icon: '👥', label: '400+\nHappy Brides' },
      { icon: '📍', label: 'Greater\nKailash' },
      { icon: '⭐', label: 'Premium\nProducts' },
    ],
    packages: [
      { name: 'Essential Bridal', desc: 'HD Makeup, Hair, Soft Glam Look, Touch-up', price: '₹24,000' },
      { name: 'Premium Bridal', desc: 'Airbrush, Trial, Hair, Full Day Coverage', price: '₹38,000' },
    ],
    details: { studio: 'Greater Kailash, South Delhi', travels: 'Delhi NCR', priceRange: '₹20,000 - ₹38,000', advance: '30% at booking', cancellation: 'Flexible 48hrs' },
    review: { name: 'Neha Gupta', rating: 5, text: 'Oosh is phenomenal! My bridal makeup was flawless and lasted all night. So many compliments!', verified: true },
  },
  {
    id: 7,
    name: 'Ambika Pillai',
    badge: 'Legend',
    subtitle: 'Industry Stalwart',
    rating: 4.9, reviews: 2000, exp: '20+ Years Exp.', location: 'South Extension, Delhi',
    tags: ['Luxury Makeup', 'Airbrush', 'Editorial', 'Celebrity Look', 'HD'],
    desc: 'A stalwart in the Indian makeup industry. Ambika Pillai is the ultimate destination for bridal makeup with decades of experience and a loyal celebrity clientele.',
    price: '₹50,000',
    image: '/bridal_lehenga.png',
    photos: 40,
    category: 'Makeup',
    verified: true,
    portfolioImgs: [
      '/bridal_lehenga.png', '/countdown_bride.png', '/digital_twin_portrait.png', '/recommend_salon1.png',
      '/mood_jewelry.png', '/mood_henna.png', '/mood_walk.png', '/recommend_salon2.png',
    ],
    stats: [
      { icon: '✔', label: 'Verified' },
      { icon: '👥', label: '2000+\nHappy Brides' },
      { icon: '📍', label: 'South Ext.\nStudio' },
      { icon: '⭐', label: 'Luxury\nBrands' },
    ],
    packages: [
      { name: 'Signature Bridal', desc: 'Luxury Makeup, Hair, Draping, Premium Brands, Trial', price: '₹50,000' },
      { name: 'Ambika Elite', desc: 'Airbrush, 3 Looks, Full Bridal Party, Touch-up, Photo Session', price: '₹85,000' },
    ],
    details: { studio: 'D-16 South Extension Part 2', travels: 'Pan India', priceRange: '₹45,000 - ₹85,000', advance: '50% at booking', cancellation: '7 days notice required' },
    review: { name: 'Kritika Singh', rating: 5, text: 'Ambika Pillai is a class apart! The experience was luxurious and the result was breathtaking!', verified: true },
  },
  {
    id: 8,
    name: 'Sakshi Sagar',
    badge: 'Trending',
    subtitle: 'Soft Elegance Specialist',
    rating: 4.8, reviews: 680, exp: '9+ Years Exp.', location: 'Delhi NCR',
    tags: ['Soft Glam', 'Elegant Look', 'HD Makeup', 'Draping', 'Airbrush'],
    desc: 'Trained at London College of Fashion & Pearl Academy. Known for soft, elegant, and poised bridal looks that highlight natural beauty.',
    price: '₹26,000',
    image: '/mood_jewelry.png',
    photos: 18,
    category: 'Makeup',
    verified: true,
    portfolioImgs: [
      '/bridal_lehenga.png', '/countdown_bride.png', '/digital_twin_portrait.png', '/recommend_salon1.png',
      '/mood_jewelry.png', '/mood_henna.png', '/mood_walk.png', '/recommend_salon2.png',
    ],
    stats: [
      { icon: '✔', label: 'Verified' },
      { icon: '👥', label: '400+\nHappy Brides' },
      { icon: '📍', label: 'Delhi NCR\nStudio' },
      { icon: '⭐', label: 'London\nTrained' },
    ],
    packages: [
      { name: 'Soft Elegance', desc: 'HD Makeup, Hair Styling, Draping, Trial Included', price: '₹26,000' },
      { name: 'Editorial Bridal', desc: 'Airbrush, 2 Looks, Premium Brands, Bridesmaid Makeup', price: '₹42,000' },
    ],
    details: { studio: 'Delhi NCR', travels: 'Delhi NCR + North India', priceRange: '₹22,000 - ₹42,000', advance: '30% at booking', cancellation: '48hr advance' },
    review: { name: 'Ishita Mehta', rating: 5, text: 'Sakshi has magic in her hands! She kept showing me progress and ensured I was happy at every step.', verified: true },
  },
  {
    id: 9,
    name: 'Shruti Sharma',
    badge: 'Rising Star',
    subtitle: 'Passionate Bridal Artist',
    rating: 4.7, reviews: 540, exp: '6+ Years Exp.', location: 'Chattarpur, New Delhi',
    tags: ['Flawless Skin', 'Eye Focus', 'Natural Glow', 'Hair Styling', 'Draping'],
    desc: 'A highly passionate makeup artist who focuses on creating flawless skin and drawing attention to the eyes and lips for that perfect bridal look.',
    price: '₹20,000',
    image: '/mood_hair.png',
    photos: 15,
    category: 'Makeup',
    verified: true,
    portfolioImgs: [
      '/bridal_lehenga.png', '/countdown_bride.png', '/digital_twin_portrait.png', '/recommend_salon1.png',
      '/mood_jewelry.png', '/mood_henna.png', '/mood_walk.png', '/recommend_salon2.png',
    ],
    stats: [
      { icon: '✔', label: 'Verified' },
      { icon: '👥', label: '300+\nHappy Brides' },
      { icon: '📍', label: 'Chattarpur\nStudio' },
      { icon: '⭐', label: 'Quality\nProducts' },
    ],
    packages: [
      { name: 'Bridal Beauty', desc: 'HD Makeup, Hair Styling, Draping, Touch-up', price: '₹20,000' },
      { name: 'Complete Bridal', desc: 'Airbrush Makeup, Hair, 2 Looks, Trial, Touch-up Kit', price: '₹35,000' },
    ],
    details: { studio: '11, Dhan Mills, Chattarpur', travels: 'Delhi NCR', priceRange: '₹18,000 - ₹35,000', advance: '30% at booking', cancellation: 'Free 48hr cancellation' },
    review: { name: 'Divya Jain', rating: 5, text: 'Shruti is incredibly talented! She made my skin look flawless and my eyes sparkled all day long!', verified: true },
  },
  {
    id: 10,
    name: 'Makeup by Sangeeta Sehrawat',
    badge: 'Most Booked',
    subtitle: 'Certified Professional',
    rating: 4.9, reviews: 890, exp: '8+ Years Exp.', location: 'Kalkaji, South Delhi',
    tags: ['HD Makeup', 'Airbrush', 'Glam Makeup', 'On-location', 'Trial Included'],
    desc: 'Certified makeup artist based in Kalkaji, South Delhi. Known for her friendly approach and stunning bridal transformations. 21 cities & counting!',
    price: '₹25,000',
    image: '/mood_henna.png',
    photos: 20,
    category: 'Makeup',
    verified: true,
    portfolioImgs: [
      '/bridal_lehenga.png', '/countdown_bride.png', '/digital_twin_portrait.png', '/recommend_salon1.png',
      '/mood_jewelry.png', '/mood_henna.png', '/mood_walk.png', '/recommend_salon2.png',
    ],
    stats: [
      { icon: '✔', label: 'Verified' },
      { icon: '👥', label: '500+\nHappy Brides' },
      { icon: '📍', label: 'Kalkaji\nStudio' },
      { icon: '⭐', label: '21 Cities\nExperience' },
    ],
    packages: [
      { name: 'Bridal Makeover', desc: 'HD Makeup, Hair Styling, Draping, Trial Session', price: '₹25,000' },
      { name: 'Luxury Bridal', desc: 'Airbrush, 2 Looks, Premium Brands, Full Day Coverage', price: '₹40,000' },
    ],
    details: { studio: 'Kalkaji, South Delhi', travels: 'Delhi NCR + 21 Cities', priceRange: '₹22,000 - ₹40,000', advance: '30% at booking', cancellation: 'Flexible' },
    review: { name: 'Tanya Bhatia', rating: 5, text: 'Sangeeta is a gem! She made me feel so comfortable and the makeup was absolutely stunning!', verified: true },
  },
];

const CATEGORIES = ['Makeup', 'Hair', 'Mehendi', 'Skincare', 'Photography', 'Bridal Outfit', 'More'];
const RATINGS = ['4★ & above', '4.5★ & above', '4★ & above'];
const SERVICES_LIST = ['Makeup', 'Hair', 'Mehendi', 'Skincare'];

export default function ArtistsSalons({ onBack, onNavigate, wishlistItems = [], toggleWishlist = () => {} }) {
  const [view, setView] = useState('list');
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Makeup');
  const [activeRating, setActiveRating] = useState('4.5★ & above');
  const [priceRange, setPriceRange] = useState(50000);
  const [services, setServices] = useState(['Makeup', 'Hair']);
  const [availability, setAvailability] = useState(false);
  const selectedDate = '12 Dec 2025';
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [profileTab, setProfileTab] = useState('Portfolio');
  const [showFullPortfolio, setShowFullPortfolio] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortBy, setSortBy] = useState('Most Relevant');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('South Delhi');
const [availabilityChecked, setAvailabilityChecked] = useState(false);
const [showAllSlots, setShowAllSlots] = useState(false);
const [showAllSuggestions, setShowAllSuggestions] = useState(false);
const [showAllServices, setShowAllServices] = useState(false);
const [showMoreOptions, setShowMoreOptions] = useState(false);
const [aiSearchTerm, setAiSearchTerm] = useState('');

  const SUGGESTIONS = [
    'Best makeup artists in South Delhi',
    'Natural makeup under ₹20,000',
    'Makeup with hair + draping',
    'Top rated bridal studios',
  ];

  const toggleService = (s) => setServices(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const openProfile = (artist) => { setSelectedArtist(artist); setView('profile'); setProfileTab('Portfolio'); };

  const parsePrice = (priceStr) => parseInt(priceStr.replace(/[₹,]/g, ''), 10);

  const filteredArtists = ARTISTS_DATA.filter(artist => {
    if (activeCategory !== 'More' && artist.category !== activeCategory) return false;
    if (activeRating === '4★ & above' && artist.rating < 4) return false;
    if (activeRating === '4.5★ & above' && artist.rating < 4.5) return false;
    if (parsePrice(artist.price) > priceRange) return false;
    const hasService = services.some(s => artist.tags.some(t => t.toLowerCase().includes(s.toLowerCase())));
    if (!hasService) return false;
    if (aiSearchTerm) {
      const q = aiSearchTerm.toLowerCase();
      if (!artist.name.toLowerCase().includes(q) &&
          !artist.desc.toLowerCase().includes(q) &&
          !artist.tags.some(t => t.toLowerCase().includes(q))) return false;
    }
    return true;
  });

  const clearAllFilters = () => {
    setActiveCategory('Makeup');
    setActiveRating('4.5★ & above');
    setPriceRange(50000);
    setServices(['Makeup', 'Hair']);
    setAvailability(false);
  };

  if (view === 'packages') return (
    <PackageDetails onBack={() => setView('profile')} onNavigate={onNavigate} />
  );

  if (view === 'profile' && selectedArtist) {
    const a = selectedArtist;
    return (
      <div className="artists-page animate-fade-in">
        <div className="artists-topnav">
          <button className="planner-back-btn" onClick={() => setView('list')}>
            <ArrowLeft size={16} /> Back to Artists
          </button>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', position: 'relative' }}>
            <button className="topbar-btn" onClick={() => toggleWishlist(a.name)}><Heart size={20} style={{ color: wishlistItems.includes(a.name) ? 'var(--maroon-btn)' : 'var(--text-muted)', fill: wishlistItems.includes(a.name) ? 'var(--maroon-btn)' : 'none' }} /></button>
            <button className="topbar-btn" style={{ fontSize: '1.2rem' }} onClick={() => { navigator.clipboard.writeText(a.name); }}>⚡</button>
            <button className="topbar-btn" style={{ fontSize: '1.2rem' }} onClick={() => setShowMoreOptions(!showMoreOptions)}>⋮</button>
            {showMoreOptions && (
              <div style={{ position: 'absolute', top: '100%', right: 0, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-md)', zIndex: 100, minWidth: 140, padding: '4px 0' }}>
                {['Report', 'Save', 'Share'].map(opt => (
                  <div key={opt} onClick={() => { setShowMoreOptions(false); if (opt === 'Share') navigator.clipboard.writeText(a.name); }} style={{ padding: '8px 16px', fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'var(--font-btn)', color: 'var(--text-dark)' }}>{opt}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="profile-layout">
          <div>
            <div className="profile-hero-card">
              <img src={a.image} alt={a.name} className="profile-hero-img" />
              <div className="profile-hero-overlay">
                {a.badge && <span className="artist-top-badge">{a.badge}</span>}
                <div className="profile-hero-info">
                  <h1 className="profile-hero-name">{a.name} <span className="artist-verified">✔</span></h1>
                  <p className="profile-hero-sub">{a.subtitle}</p>
                  <div className="profile-hero-meta">
                    <span>★ {a.rating} ({a.reviews}+)</span>
                    <span>|</span><span>{a.exp}</span>
                    <span>|</span><MapPin size={13} /><span>{a.location}</span>
                  </div>
                  <div className="profile-stats-row">
                    {a.stats.map(s => (
                      <div key={s.label} className="profile-stat-item">
                        <span className="profile-stat-icon">{s.icon}</span>
                        <span className="profile-stat-lbl">{s.label}</span>
                      </div>
                    ))}
                  </div>
                  <p className="profile-hero-desc">{a.desc}</p>
                  <div className="artist-tags" style={{ marginBottom: 16 }}>
                    {a.tags.map(t => <span key={t} className="artist-tag" style={{ borderColor: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'var(--text-white)' }}>{t}</span>)}
                  </div>
                  <div className="profile-hero-btns">
                    <button className="profile-book-btn" onClick={() => setView('packages')}>📅 Book Now</button>
                    <button className="profile-msg-btn" onClick={() => { if (onNavigate) onNavigate('messages'); }}>💬 Message</button>
                  </div>
                </div>
                <div className="profile-thumbs">
                  <button className="profile-thumb-play">▶</button>
                  {a.portfolioImgs?.slice(0, 4).map((img, i) => (
                    <img key={i} src={img} alt="" className="profile-thumb" />
                  ))}
                  <div className="profile-thumb-more">+20</div>
                </div>
              </div>
            </div>

            <div className="profile-tabs">
              {['Portfolio', 'About', 'Services & Packages', 'Reviews (1200+)', 'FAQs'].map(tab => (
                <button key={tab} className={`profile-tab-btn ${profileTab === tab ? 'active' : ''}`}
                  onClick={() => {
                    if (tab === 'Services & Packages') { setView('packages'); return; }
                    setProfileTab(tab);
                  }}
                >{tab}</button>
              ))}
            </div>

            {profileTab === 'Portfolio' && (
              <div>
                <div className="profile-section-header">
                  <h3 className="profile-section-title">Portfolio Highlights</h3>
                  <button className="results-see-match-btn" style={{ padding: 0 }} onClick={() => setShowFullPortfolio(prev => !prev)}>{showFullPortfolio ? 'Show Less −' : 'View Full Portfolio →'}</button>
                </div>
                <div className="portfolio-grid">
                  {(a.portfolioImgs || []).slice(0, showFullPortfolio ? undefined : 8).map((img, i) => (
                    <div key={i} className="portfolio-img-wrap">
                      <img src={img} alt={`Portfolio ${i + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {profileTab === 'About' && (
              <div className="profile-about-section" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '16px' }}>About the Artist</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-dark)', lineHeight: 1.6, marginBottom: '16px' }}>
                  {a.desc || 'A premier bridal artist specializing in luxury wedding makeup with over 8 years of experience. Trained in advanced techniques and certified by leading beauty academies.'}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {[
                    { label: 'Experience', value: a.exp || '8+ Years' },
                    { label: 'Specialization', value: a.tags?.join(', ') || 'Bridal Makeup' },
                    { label: 'Languages', value: 'Hindi, English' },
                    { label: 'Travel', value: a.details?.travels || 'Pan India' },
                    { label: 'Studio Location', value: a.location || 'South Delhi' },
                    { label: 'Certifications', value: 'Advanced Bridal Certification' },
                  ].map(item => (
                    <div key={item.label}>
                      <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-btn)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>{item.label}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-dark)', fontWeight: 500 }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {profileTab === 'Reviews (1200+)' && (
              <div>
                <div className="profile-section-header">
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--sidebar-bg)' }}>What Brides Say</h3>
                  <button className="results-see-match-btn" style={{ padding: 0 }}>Write a Review</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
                  {[
                    { name: 'Ananya Sharma', rating: 5, text: 'Absolutely stunning work! She understood exactly what I wanted. The makeup was flawless and lasted all night. Highly recommend! 🌟', date: '12 Dec 2025', verified: true },
                    { name: 'Meera Kapoor', rating: 5, text: 'Best bridal artist I have ever worked with. Professional, punctual, and incredibly talented!', date: '28 Nov 2025', verified: true },
                    { name: 'Priya Patel', rating: 4, text: 'Great experience overall. The trial session was very helpful in finalizing the look.', date: '15 Oct 2025', verified: true },
                  ].map((r, i) => (
                    <div key={i} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', padding: '18px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img src="/priya_profile.png" alt={r.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                          <div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)' }}>{r.name}</div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                              {r.date} {r.verified && <span style={{ color: 'var(--success)', fontWeight: 600 }}>✔ Verified</span>}
                            </div>
                          </div>
                        </div>
                        <div style={{ color: 'var(--gold-accent)', fontSize: '0.82rem' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-dark)', lineHeight: 1.5, margin: 0 }}>"{r.text}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {profileTab === 'FAQs' && (
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--sidebar-bg)', marginBottom: '16px' }}>Frequently Asked Questions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {[
                    { q: 'Do you offer trial sessions before the wedding?', a: 'Yes, we offer complimentary trial sessions for all our bridal packages. You can book a trial at least 2 weeks before your wedding date.' },
                    { q: 'What products do you use?', a: 'We use premium international brands including Mac, Huda Beauty, Charlotte Tilbury, and Kryolan to ensure long-lasting flawless results.' },
                    { q: 'Do you travel to the venue?', a: 'Yes, we provide on-location services across Delhi NCR, and can travel pan India for an additional travel charge.' },
                    { q: 'What is the cancellation policy?', a: 'Cancellations made 48+ hours before the booking are fully refundable. Late cancellations may incur a 50% charge.' },
                    { q: 'How long does the bridal makeup take?', a: 'Bridal makeup typically takes 2-3 hours depending on the complexity of the look. We recommend starting early to ensure ample time.' },
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

            <div className="profile-brands-bar">
              <span className="profile-brands-lbl">Trusted By<br /><strong>500+ Happy Brides</strong></span>
              {['WEDDING TIMES', 'FEMINA', 'wedMeGood', 'ZO WEDDINGS', 'shaadi.com'].map(b => (
                <span key={b} className="profile-brand-logo">{b}</span>
              ))}
              <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>›</span>
            </div>
          </div>

          <div className="profile-book-panel">
            <h3 className="profile-book-title">📅 Book This Artist</h3>

            <div className="profile-book-section">
              <label className="profile-book-label">Select Date</label>
              <div className="profile-date-select">
                <span>📅</span>
                <span style={{ flex: 1, fontSize: '0.85rem' }}>{selectedDate}</span>
                <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="profile-book-section">
              <label className="profile-book-label">Select Time</label>
              <div className="profile-time-slots">
                {['10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'].slice(0, showAllSlots ? 8 : 3).map(t => (
                  <button key={t} className={`profile-time-slot ${selectedTime === t ? 'active' : ''}`} onClick={() => setSelectedTime(t)}>{t}</button>
                ))}
              </div>
              <button className="results-see-match-btn" style={{ fontSize: '0.72rem', padding: '4px 0 0' }} onClick={() => setShowAllSlots(!showAllSlots)}>{showAllSlots ? 'Show Less ↑' : 'More Slots ↓'}</button>
            </div>

            <button className="profile-check-btn" onClick={() => setAvailabilityChecked(true)}>Check Availability</button>
            {availabilityChecked && (
              <div style={{ marginTop: 8, padding: '6px 12px', background: 'var(--success)', color: 'var(--text-white)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', textAlign: 'center', fontFamily: 'var(--font-btn)', fontWeight: 600 }}>✅ Available!</div>
            )}

            <div className="profile-details-section">
              <h4 className="profile-details-title">Artist Details</h4>
              {Object.entries(a.details || {}).map(([k, v]) => (
                <div key={k} className="profile-detail-row">
                  <span className="profile-detail-key">{k.charAt(0).toUpperCase() + k.slice(1)}</span>
                  <span className="profile-detail-val">{v}</span>
                </div>
              ))}
            </div>

            <div className="profile-packages-section">
              <div className="profile-section-header">
                <h4 className="profile-details-title">Popular Packages</h4>
                <button className="results-see-match-btn" style={{ fontSize: '0.7rem', padding: 0 }} onClick={() => setView('packages')}>View All</button>
              </div>
              {(a.packages || []).map(pkg => (
                <div key={pkg.name} className="profile-pkg-card">
                  <div className="profile-pkg-top">
                    <span className="profile-pkg-name">{pkg.name}</span>
                    <span className="profile-pkg-price">{pkg.price}</span>
                  </div>
                  <p className="profile-pkg-desc">{pkg.desc}</p>
                  <button className="other-match-btn" style={{ marginTop: 8 }} onClick={() => setView('packages')}>View Details</button>
                </div>
              ))}
            </div>

            {a.review && (
              <div className="profile-review-section">
                <div className="profile-section-header">
                  <h4 className="profile-details-title">What Brides Say</h4>
                  <button className="results-see-match-btn" style={{ fontSize: '0.7rem', padding: 0 }} onClick={() => setProfileTab('Reviews (1200+)')}>View All</button>
                </div>
                <div className="profile-review-card">
                  <div className="profile-review-top">
                    <img src="/priya_profile.png" alt="Reviewer" className="profile-review-avatar" />
                    <div>
                      <div className="profile-review-name">{a.review.name}</div>
                      {a.review.verified && <span className="profile-review-verified">✔ Verified</span>}
                    </div>
                    <div className="profile-review-stars">{'★'.repeat(a.review.rating)}</div>
                  </div>
                  <p className="profile-review-text">{a.review.text}</p>
                  <div className="profile-review-dots">
                    <span className="profile-dot active" /><span className="profile-dot" /><span className="profile-dot" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="artists-page animate-fade-in">
      <div className="artists-topnav">
        <button className="planner-back-btn" onClick={onBack}>
          <ArrowLeft size={16} /> Back
        </button>
        <div className="artists-steps-indicator">
          {[{ n: '01', l: 'Wedding Type', done: true }, { n: '02', l: 'Preferences', done: true }, { n: '03', l: 'Style Match', active: true }, { n: '04', l: 'Results' }].map((s, i) => (
            <div key={s.n} className="planner-step-item" style={{ minWidth: 80 }}>
              <div className={`planner-step-circle ${s.active ? 'active' : s.done ? 'done' : ''}`}>
                {s.done ? '✓' : <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>{s.n}</span>}
              </div>
              {i < 3 && <div className={`planner-step-line ${s.done ? 'done' : ''}`} />}
              <span className={`planner-step-label ${s.active ? 'active' : ''}`}>{s.l}</span>
            </div>
          ))}
        </div>
        <div style={{ width: 120 }} />
      </div>

      <div className="artists-listing-header">
        <div>
          <h1 className="artists-page-title">Match Your <em style={{ fontFamily: 'var(--font-heading)', fontStyle: 'italic', color: 'var(--maroon-btn)' }}>Perfect Bridal</em> Experts <span style={{ color: 'var(--gold-accent)' }}>✨</span></h1>
          <p className="artists-page-sub">Based on your preferences, we've found <strong style={{ color: 'var(--maroon-btn)' }}>{filteredArtists.length}+</strong> verified professionals in South Delhi</p>
        </div>
      </div>

      <div className="artists-cat-tabs">
        {CATEGORIES.map(cat => (
          <button key={cat} className={`artists-cat-btn ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
            {cat} {cat === 'More' && <ChevronDown size={13} />}
          </button>
        ))}
      </div>

      <div className="artists-filter-bar">
        <button onClick={() => { window.scrollTo({ top: document.querySelector('.artists-right-panel')?.offsetTop, behavior: 'smooth' }); }} className="artists-filter-pill">
          <Filter size={14} /> Filters <ChevronDown size={13} />
        </button>
        <button className="artists-filter-pill">
          Price Range<br /><span style={{ fontSize: '0.7rem', color: 'var(--maroon-btn)', fontWeight: 700 }}>₹5,000 - ₹{priceRange.toLocaleString()}+</span>
          <ChevronDown size={13} />
        </button>
        <div style={{ position: 'relative' }}>
          <button onClick={() => { setShowSortDropdown(!showSortDropdown); setShowLocationDropdown(false); }} className="artists-filter-pill">
            Sort By<br /><span style={{ fontSize: '0.7rem', color: 'var(--maroon-btn)', fontWeight: 700 }}>{sortBy}</span>
            <ChevronDown size={13} />
          </button>
          {showSortDropdown && (
            <div className="filter-dropdown-menu">
              {['Most Relevant', 'Price: Low to High', 'Price: High to Low', 'Rating: High to Low', 'Popularity'].map(s => (
                <div key={s} onClick={() => { setSortBy(s); setShowSortDropdown(false); }} className={`filter-dropdown-option ${sortBy === s ? 'active' : ''}`}>
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ position: 'relative' }}>
          <button onClick={() => { setShowLocationDropdown(!showLocationDropdown); setShowSortDropdown(false); }} className="artists-filter-pill">
            Location<br /><span style={{ fontSize: '0.7rem', color: 'var(--maroon-btn)', fontWeight: 700 }}>{selectedLocation}</span>
            <ChevronDown size={13} />
          </button>
          {showLocationDropdown && (
            <div className="filter-dropdown-menu">
              {['South Delhi', 'North Delhi', 'East Delhi', 'West Delhi', 'Central Delhi', 'Gurgaon', 'Noida'].map(loc => (
                <div key={loc} onClick={() => { setSelectedLocation(loc); setShowLocationDropdown(false); }} className={`filter-dropdown-option ${selectedLocation === loc ? 'active' : ''}`}>
                  {loc}
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className={`artists-view-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}><Grid size={16} /></button>
          <button className={`artists-view-btn ${view !== 'grid' ? 'active' : ''}`} onClick={() => setView('list')}><List size={16} /></button>
        </div>
      </div>

      <div className="artists-layout">
        <div style={{ flex: 1 }}>
          {filteredArtists.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '20px 0' }}>No artists match your filters.</div>
          ) : view === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {filteredArtists.map(artist => (
                <div key={artist.id} className="artists-listing-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', margin: 0 }}>
                  <div className="artists-listing-img" style={{ height: 160, position: 'relative' }}>
                    <img src={artist.image} alt={artist.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {artist.badge && <span className="artist-top-badge">{artist.badge}</span>}
                    <button className="artist-heart-btn" onClick={() => toggleWishlist(artist.name)}><Heart size={14} style={{ color: wishlistItems.includes(artist.name) ? 'var(--maroon-btn)' : 'var(--text-white)', fill: wishlistItems.includes(artist.name) ? 'var(--maroon-btn)' : 'none' }} /></button>
                    <span className="artist-portfolio-tag">{artist.photos}+ Photos</span>
                  </div>
                  <div className="artists-listing-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '12px 14px' }}>
                    <div>
                      <div className="artist-name-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                        <h3 className="artist-name" style={{ fontSize: '1rem', margin: 0 }}>{artist.name}</h3>
                        {artist.verified && <span className="artist-verified" style={{ marginLeft: 4 }}>✔</span>}
                      </div>
                      <div className="artist-location" style={{ fontSize: '0.75rem', marginBottom: 4 }}>{artist.subtitle}</div>
                      <div className="artist-meta-row" style={{ fontSize: '0.7rem', display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                        <span>★ {artist.rating} ({artist.reviews}+)</span>
                        <span>|</span><span>{artist.exp}</span>
                      </div>
                      <p className="artist-desc" style={{ fontSize: '0.72rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 10, lineHeight: 1.4 }}>{artist.desc}</p>
                    </div>
                    <div className="artists-listing-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 10 }}>
                      <div>
                        <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Starts from</span>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-heading)' }}>{artist.price}</div>
                      </div>
                      <button className="artist-view-btn" style={{ padding: '6px 12px', fontSize: '0.72rem' }} onClick={() => openProfile(artist)}>Profile →</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            filteredArtists.map(artist => (
              <div key={artist.id} className="artists-listing-card">
                <div className="artists-listing-img">
                  <img src={artist.image} alt={artist.name} />
                  {artist.badge && <span className="artist-top-badge">{artist.badge}</span>}
                  <button className="artist-heart-btn" onClick={() => toggleWishlist(artist.name)}><Heart size={14} style={{ color: wishlistItems.includes(artist.name) ? 'var(--maroon-btn)' : 'var(--text-white)', fill: wishlistItems.includes(artist.name) ? 'var(--maroon-btn)' : 'none' }} /></button>
                  <span className="artist-portfolio-tag">{artist.photos}+ Photos</span>
                </div>
                <div className="artists-listing-body">
                  <div className="artists-listing-top">
                    <div>
                      <div className="artist-name-row">
                        <h3 className="artist-name" style={{ fontSize: '1.2rem' }}>{artist.name}</h3>
                        {artist.verified && <span className="artist-verified">✔</span>}
                      </div>
                      <div className="artist-location" style={{ marginBottom: 6 }}>{artist.subtitle}</div>
                      <div className="artist-meta-row" style={{ marginBottom: 8 }}>
                        <span>★ {artist.rating} ({artist.reviews}+)</span>
                        <span>|</span><span>{artist.exp}</span>
                        <span>|</span><MapPin size={12} /><span>{artist.location}</span>
                      </div>
                      <div className="artist-tags" style={{ marginBottom: 8 }}>
                        {artist.tags.map(t => <span key={t} className="artist-tag">{t}</span>)}
                      </div>
                      <p className="artist-desc" style={{ marginBottom: 0 }}>{artist.desc}</p>
                    </div>
                  </div>
                  <div className="artists-listing-footer">
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-btn)' }}>Starts from</span>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-heading)' }}>{artist.price}</div>
                    </div>
                    <button className="artist-view-btn" onClick={() => openProfile(artist)}>View Profile →</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="artists-right-panel">
          <div className="artists-ai-card">
            <div className="artists-ai-header">
              <Sparkle /> <span>Ask Noor AI</span>
            </div>
            <p className="artists-ai-sub">Your personal bridal assistant</p>
            <div style={{ position: 'relative', margin: '10px 0' }}>
              <input type="text" className="ask-noor-input-new" placeholder="What are you looking for?" value={aiQuery} onChange={e => setAiQuery(e.target.value)} />
              <button className="ask-noor-btn" style={{ background: 'var(--maroon-btn)', color: 'var(--text-white)' }} onClick={() => setAiSearchTerm(aiQuery)}>➔</button>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-btn)', marginBottom: 8, fontWeight: 600 }}>Suggested for you</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {SUGGESTIONS.slice(0, showAllSuggestions ? undefined : 2).map(s => (
                <div key={s} className="artists-suggestion" onClick={() => setAiQuery(s)}>{s}</div>
              ))}
            </div>
            <button className="results-see-match-btn" style={{ padding: '6px 0 0', display: 'block', textAlign: 'right' }} onClick={() => setShowAllSuggestions(!showAllSuggestions)}>{showAllSuggestions ? 'Show Less' : 'View More'}</button>
          </div>

          <div className="artists-filter-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--sidebar-bg)' }}>Refine Your Search</span>
              <button onClick={clearAllFilters} className="results-see-match-btn" style={{ padding: 0, fontSize: '0.72rem' }}>Clear All</button>
            </div>

            <div className="filter-section">
              <div className="filter-label">Price Range</div>
              <div className="filter-price-row">
                <span>₹5,000</span><span>₹50,000+</span>
              </div>
              <input type="range" min={5000} max={50000} step={1000} value={priceRange}
                onChange={e => setPriceRange(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--maroon-btn)', margin: '6px 0' }} />
            </div>

            <div className="filter-section">
              <div className="filter-label">Services</div>
              {SERVICES_LIST.slice(0, showAllServices ? undefined : 2).map(s => (
                <label key={s} className="filter-checkbox-row">
                  <input type="checkbox" checked={services.includes(s)} onChange={() => toggleService(s)}
                    style={{ accentColor: 'var(--maroon-btn)' }} />
                  <span>{s}</span>
                </label>
              ))}
              <button className="results-see-match-btn" style={{ padding: '6px 0 0', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => setShowAllServices(!showAllServices)}>{showAllServices ? 'Show Less ↑' : 'View More ↓'}</button>
            </div>

            <div className="filter-section">
              <div className="filter-label">Rating</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {RATINGS.map(r => (
                  <button key={r} className={`filter-rating-btn ${activeRating === r ? 'active' : ''}`} onClick={() => setActiveRating(r)}>{r}</button>
                ))}
              </div>
            </div>

            <div className="filter-section" style={{ borderBottom: 'none' }}>
              <div className="filter-label">Availability</div>
              <label className="filter-checkbox-row">
                <input type="checkbox" checked={availability} onChange={() => setAvailability(!availability)}
                  style={{ accentColor: 'var(--maroon-btn)' }} />
                <span>Available on my date</span>
              </label>
            </div>

            <button className="planner-next-btn" style={{ width: '100%', justifyContent: 'center', marginTop: 14, opacity: 0.7, cursor: 'default' }}>Filters Applied ✓</button>
            <div style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 8, fontFamily: 'var(--font-btn)' }}>{filteredArtists.length} Results Found</div>
          </div>
        </div>
      </div>
    </div>
  );
}
function Sparkle() {
  return <span style={{ color: 'var(--gold-accent)', fontSize: '0.9rem' }}>✨</span>;
}
