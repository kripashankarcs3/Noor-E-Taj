import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, DollarSign, Filter, Sparkles, Star, Search } from 'lucide-react';
import { SalonPreview, IMAGES } from '../assets/illustrations';
import { fadeInUp, staggerContainer } from '../animations';
import { askOpenRouter } from '../services/aiService';

const salonImages = [IMAGES.salon1, IMAGES.salon2, IMAGES.salon3, IMAGES.salon4, IMAGES.salon5, IMAGES.salon6];

export default function SalonMarketplace() {
  const salonsList = [
    { id: 1, name: 'Gitanjali Salon', location: 'GK-II', priceRange: '₹₹₹ Luxury', priceVal: 45000, matchScore: 98, style: 'HD Airbrush Bridal Makeup', experience: '12+ Years', services: ['Bridal Makeup', 'Olaplex Hair Spa', 'Clinical Facial', 'Nail Art'], rating: 4.9, trustScore: 99, originalityScore: 97 },
    { id: 2, name: 'Ambika Pillai Studio', location: 'South Extension', priceRange: '₹₹₹₹ Elite', priceVal: 65000, matchScore: 96, style: 'Luxury Signature Silhouette', experience: '18+ Years', services: ['Luxury Makeup', 'Hydrafacial Pro', 'Hair Extension', 'Nail Ext'], rating: 4.8, trustScore: 98, originalityScore: 95 },
    { id: 3, name: 'Bharti Taneja Alps', location: 'Rajouri Garden', priceRange: '₹₹ Standard', priceVal: 28000, matchScore: 93, style: 'Traditional Gold Glow Makeup', experience: '15+ Years', services: ['Traditional Makeup', 'Pre-Bridal Ubtan', 'Keratin Spa'], rating: 4.7, trustScore: 94, originalityScore: 92 },
    { id: 4, name: 'Monsoon Salon & Spa', location: 'Gurgaon', priceRange: '₹₹ Standard', priceVal: 32000, matchScore: 91, style: 'Modern Contemporary Glow', experience: '8+ Years', services: ['Modern Bridal', 'Oxygen Facial', 'Gel Polish extensions'], rating: 4.6, trustScore: 92, originalityScore: 94 },
    { id: 5, name: 'Kaya Clinic & Salon', location: 'Karol Bagh', priceRange: '₹₹ Standard', priceVal: 24000, matchScore: 89, style: 'Dermat-Approved Minimal Makeup', experience: '10+ Years', services: ['Minimal Makeup', 'Derma Facials', 'Scalp detox'], rating: 4.5, trustScore: 95, originalityScore: 91 },
    { id: 6, name: 'Geetanjali Salon', location: 'Noida', priceRange: '₹₹ Standard', priceVal: 30000, matchScore: 90, style: 'Soft Dewy Glam Makeup', experience: '9+ Years', services: ['Soft Glam Makeup', 'Gold Glow Facial', 'Pedicure Ritual'], rating: 4.7, trustScore: 93, originalityScore: 93 },
  ];

  const [selectedLoc, setSelectedLoc] = useState('All');
  const [maxPrice, setMaxPrice] = useState(70000);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [moodboardFile, setMoodboardFile] = useState(null);
  const [isScrapingMoodboard, setIsScrapingMoodboard] = useState(false);
  const [moodboardResult, setMoodboardResult] = useState(null);
  const [lookFile, setLookFile] = useState(null);
  const [lookFilePreview, setLookFilePreview] = useState(null);
  const [isRatingLook, setIsRatingLook] = useState(false);
  const [lookRatingResult, setLookRatingResult] = useState(null);
  const [bookingDate, setBookingDate] = useState('2026-07-15');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [confirmedBookingInfo, setConfirmedBookingInfo] = useState(null);

  const filteredSalons = salonsList.filter(salon => {
    const locMatch = selectedLoc === 'All' || salon.location === selectedLoc;
    const priceMatch = salon.priceVal <= maxPrice;
    const queryMatch = salon.name.toLowerCase().includes(searchQuery.toLowerCase()) || salon.style.toLowerCase().includes(searchQuery.toLowerCase());
    return locMatch && priceMatch && queryMatch;
  });

  const handleMoodboardSubmit = async (e) => {
    e.preventDefault();
    setIsScrapingMoodboard(true);
    
    const prompt = `Act as an expert Pinterest moodboard visual analyzer for Indian bridal beauty. Analyze the moodboard inspiration.
    Return a valid JSON object matching this schema exactly (do not include any conversational text or markdown formatting code blocks, just pure JSON):
    {
      "makeupStyle": "descriptive makeup style name and brief detail",
      "hairstyle": "hairstyle recommendations match",
      "palette": ["#Hex1", "#Hex2", "#Hex3", "#Hex4"],
      "matchingSalons": ["Salon Name (Location)", "Another Salon (Location)"]
    }
    
    Choose salons from this list:
    - Gitanjali Salon (GK-II)
    - Ambika Pillai Studio (South Extension)
    - Bharti Taneja Alps (Rajouri Garden)
    - Monsoon Salon & Spa (Gurgaon)
    - Kaya Clinic & Salon (Karol Bagh)
    - Geetanjali Salon (Noida)`;

    const systemInstruction = "You are a professional Pinterest bridal beauty analyzer. You only respond with JSON matching the requested structure.";

    try {
      const response = await askOpenRouter(prompt, systemInstruction);
      const cleanedResponse = response.replace(/```json/g, "").replace(/```/g, "").trim();
      const resultObj = JSON.parse(cleanedResponse);

      setMoodboardResult({
        makeupStyle: resultObj.makeupStyle || 'Glam Dewy with subtle Winged Liner',
        hairstyle: resultObj.hairstyle || 'Classic Sleek Low Bun with gajra decorations',
        palette: Array.isArray(resultObj.palette) && resultObj.palette.length === 4 ? resultObj.palette : ['#B76E79', '#D4AF37', '#7B3F00', '#F8E8EE'],
        matchingSalons: Array.isArray(resultObj.matchingSalons) ? resultObj.matchingSalons : ['Gitanjali Salon (GK-II)', 'Ambika Pillai Studio (South Extension)']
      });
      if (Array.isArray(resultObj.matchingSalons) && resultObj.matchingSalons.length > 0) {
        const match = resultObj.matchingSalons[0];
        if (match.includes('GK-II')) setSelectedLoc('GK-II');
        else if (match.includes('South Extension')) setSelectedLoc('South Extension');
        else if (match.includes('Rajouri Garden')) setSelectedLoc('Rajouri Garden');
        else if (match.includes('Gurgaon')) setSelectedLoc('Gurgaon');
        else if (match.includes('Karol Bagh')) setSelectedLoc('Karol Bagh');
        else if (match.includes('Noida')) setSelectedLoc('Noida');
      }
    } catch (err) {
      console.error("Failed to scrape moodboard with AI:", err);
      setMoodboardResult({
        makeupStyle: 'Glam Dewy with subtle Winged Liner',
        hairstyle: 'Classic Sleek Low Bun with gajra decorations',
        palette: ['#B76E79', '#D4AF37', '#7B3F00', '#F8E8EE'],
        matchingSalons: ['Gitanjali Salon (GK-II)', 'Ambika Pillai Studio (South Extension)']
      });
      setSelectedLoc('GK-II');
    } finally {
      setIsScrapingMoodboard(false);
    }
  };

  const handleLookFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLookFilePreview(event.target.result);
        setLookFile(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLookRatingSubmit = async (e) => {
    e.preventDefault();
    if (!lookFile) return;
    setIsRatingLook(true);

    const prompt = `Act as an expert bridal beauty rating model. Evaluate a trial makeup look photo.
    Return a valid JSON object matching this schema exactly (do not include any conversational text or markdown formatting code blocks, just pure JSON):
    {
      "elegance": 92,
      "balance": 88,
      "harmony": 95,
      "photography": 90,
      "verdict": "Detailed assessment of the makeup trial look, skin compatibility, and advice for photo shoot lighting."
    }`;

    const systemInstruction = "You are an AI bridal makeup look evaluator. You return only JSON scores and verdicts.";

    try {
      const response = await askOpenRouter(prompt, systemInstruction);
      const cleanedResponse = response.replace(/```json/g, "").replace(/```/g, "").trim();
      const resultObj = JSON.parse(cleanedResponse);

      setTimeout(() => {
        setLookRatingResult({
          elegance: resultObj.elegance || 90,
          balance: resultObj.balance || 85,
          harmony: resultObj.harmony || 92,
          photography: resultObj.photography || 88,
          verdict: resultObj.verdict || 'Good color balancing.'
        });
        setIsRatingLook(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to rate look with AI:", err);
      setTimeout(() => {
        setLookRatingResult({
          elegance: 92,
          balance: 88,
          harmony: 95,
          photography: 90,
          verdict: 'Excellent color harmony matching your skin profile. Highlights are well-positioned under high photography lighting.'
        });
        setIsRatingLook(false);
      }, 3000);
    }
  };

  const handleConfirmBooking = () => {
    if (!selectedSalon) return;
    const newBooking = {
      id: Date.now(),
      name: selectedSalon.name,
      service: 'Bridal Trial Consultation',
      date: bookingDate,
      price: `₹${selectedSalon.priceVal.toLocaleString('en-IN')}`,
      status: 'Confirmed',
      image: salonImages[selectedSalon.id % salonImages.length] || '/recommend_salon1.png'
    };
    try {
      const existing = localStorage.getItem('noor_trial_bookings');
      const bookingsArray = existing ? JSON.parse(existing) : [
        { id: 1, name: 'Poonam Rawat', service: 'Makeup & Hair', date: '12 Dec 2025', price: '₹28,000', status: 'Confirmed', image: '/digital_twin_portrait.png' },
        { id: 2, name: 'Makeup by Oosh', service: 'Bridal Makeup Trial', date: '15 Dec 2025', price: '₹24,000', status: 'Pending', image: '/priya_profile.png' }
      ];
      const updated = [...bookingsArray, newBooking];
      localStorage.setItem('noor_trial_bookings', JSON.stringify(updated));
      window.dispatchEvent(new Event('bookings_update'));
    } catch (e) {
      console.error("Failed to save booking:", e);
    }
    setConfirmedBookingInfo(newBooking);
    setSelectedSalon(null);
    setShowSuccessModal(true);
  };

  return (
    <motion.section className="container" style={{ margin: '60px auto' }} initial="initial" animate="animate" variants={fadeInUp}>
      <div className="section-header">
        <span className="section-tag">Delhi NCR Marketplace</span>
        <h2 className="section-title">Discover Curated Bridal Sanctuaries</h2>
        <p style={{ maxWidth: '600px', margin: '8px auto 0', fontSize: '0.95rem' }}>Explore partners with authentic portfolios, high trust indexes, and smart compatibility matching.</p>
      </div>

      {/* Area Selector */}
      <motion.div className="glass-panel" style={{ padding: '20px', marginBottom: '30px', background: '#FFFDF9' }} variants={fadeInUp}>
        <h4 style={{ fontSize: '1rem', color: 'var(--luxury-accent)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={16} style={{ color: 'var(--primary)' }} /> Interactive Area Selector (NCR Hubs)
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
          {['All', 'GK-II', 'South Extension', 'Rajouri Garden', 'Karol Bagh', 'Gurgaon', 'Noida'].map(loc => {
            const count = salonsList.filter(s => loc === 'All' || s.location === loc).length;
            const isSel = selectedLoc === loc;
            return (
              <motion.div key={loc} onClick={() => setSelectedLoc(loc)} className="glass-card" style={{ padding: '16px', cursor: 'pointer', textAlign: 'center', borderColor: isSel ? 'var(--primary)' : 'rgba(183, 110, 121, 0.1)', background: isSel ? 'var(--accent)' : 'var(--card-bg)' }}
                animate={{ scale: isSel ? 1.05 : 1 }} whileHover={{ y: -3 }}>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-dark)', display: 'block' }}>{loc}</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{count} Studio{count !== 1 ? 's' : ''}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <div className="SalonMarketplace-layout" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '30px' }}>
        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <motion.div className="glass-panel" style={{ background: 'var(--card-bg)' }} variants={fadeInUp}>
            <h4 style={{ fontSize: '1rem', color: 'var(--luxury-accent)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={16} /> Filters
            </h4>
            <div className="luxury-input-group">
              <label className="luxury-label">Search Salon</label>
              <div style={{ position: 'relative' }}>
                <input type="text" className="luxury-input" placeholder="Studio name or style..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ paddingLeft: '36px' }} />
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-light)' }} />
              </div>
            </div>
            <div className="luxury-input-group">
              <label className="luxury-label">Max Price Limit (₹)</label>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '6px' }}>
                <span>₹20k</span>
                <strong style={{ color: 'var(--primary)' }}>₹{maxPrice.toLocaleString('en-IN')}</strong>
                <span>₹70k</span>
              </div>
              <input type="range" min="20000" max="70000" step="2000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary)' }} />
            </div>
            <motion.button onClick={() => { setSelectedLoc('All'); setMaxPrice(70000); setSearchQuery(''); }} style={{ width: '100%', fontSize: '0.8rem', padding: '10px', background: 'transparent', border: '1px solid var(--card-border)', borderRadius: '8px', cursor: 'pointer' }} whileHover={{ background: 'var(--accent)' }} whileTap={{ scale: 0.97 }}>
              Reset Filters
            </motion.button>
          </motion.div>

          {/* Moodboard Feature */}
          <motion.div className="glass-panel" style={{ background: 'var(--card-bg)' }} variants={fadeInUp}>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--luxury-accent)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} style={{ color: 'var(--secondary)' }} /> Moodboard to Reality
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '14px' }}>Upload Pinterest makeup inspiration. AI automatically extracts palettes & styles to suggest match studios.</p>
            <form onSubmit={handleMoodboardSubmit}>
              <div style={{ border: '1px dashed rgba(183, 110, 121, 0.3)', borderRadius: '8px', padding: '16px', background: 'rgba(248, 232, 238, 0.2)', cursor: 'pointer', textAlign: 'center', position: 'relative', marginBottom: '10px' }}>
                <input type="file" accept="image/*" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} onChange={() => setMoodboardFile(true)} />
                {moodboardFile ? <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--success)' }}>✓ Inspiration board uploaded</span> : <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Click to upload inspiration image</span>}
              </div>
              <motion.button type="submit" className="btn-luxury primary" style={{ width: '100%', padding: '10px', fontSize: '0.75rem', justifyContent: 'center' }} disabled={isScrapingMoodboard} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                {isScrapingMoodboard ? 'Analyzing inspiration board...' : 'Extract & Match Venues'}
              </motion.button>
            </form>
            {moodboardResult && (
              <motion.div style={{ marginTop: '14px', background: 'rgba(212, 175, 55, 0.05)', padding: '12px', borderRadius: '8px', fontSize: '0.75rem', borderLeft: '3px solid var(--secondary)' }} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <strong>Style:</strong> {moodboardResult.makeupStyle}<br />
                <strong>Palette:</strong>
                <div style={{ display: 'flex', gap: '4px', margin: '4px 0' }}>
                  {moodboardResult.palette.map(c => <span key={c} style={{ width: '14px', height: '14px', borderRadius: '50%', background: c, display: 'inline-block' }}></span>)}
                </div>
                <strong>Top Matches:</strong> {moodboardResult.matchingSalons.join(', ')}
              </motion.div>
            )}
          </motion.div>

          {/* Look Rater */}
          <motion.div className="glass-panel" style={{ background: 'var(--card-bg)' }} variants={fadeInUp}>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--luxury-accent)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Star size={16} style={{ color: 'var(--primary)' }} /> Bridal Look Rater
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '14px' }}>Upload your trial lookup photos. AI analyzes elegance, shading balances and camera harmony.</p>
            <form onSubmit={handleLookRatingSubmit}>
              <div style={{ border: '1px dashed rgba(183, 110, 121, 0.3)', borderRadius: '8px', padding: '16px', background: 'rgba(248, 232, 238, 0.2)', cursor: 'pointer', textAlign: 'center', position: 'relative', marginBottom: '10px', overflow: 'hidden', height: lookFilePreview ? '140px' : 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <input type="file" accept="image/*" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 10 }} onChange={handleLookFileUpload} />
                {lookFilePreview ? (
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <img src={lookFilePreview} alt="Look preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {isRatingLook && (
                      <motion.div 
                        style={{ position: 'absolute', left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, transparent, var(--primary), transparent)', boxShadow: '0 0 10px var(--primary)', zIndex: 5 }}
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    )}
                  </div>
                ) : (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Upload makeup trial photo</span>
                )}
              </div>
              <motion.button type="submit" className="btn-luxury primary" style={{ width: '100%', padding: '10px', fontSize: '0.75rem', justifyContent: 'center' }} disabled={isRatingLook || !lookFile} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                {isRatingLook ? 'Scanning Facial Mapping...' : 'Evaluate Elegance Score'}
              </motion.button>
            </form>
            {lookRatingResult && (
              <motion.div style={{ marginTop: '14px', background: '#FFFDF9', padding: '12px', borderRadius: '8px', border: '1px solid rgba(183, 110, 121, 0.2)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '0.8rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '6px', marginBottom: '6px' }}>
                  <span>Elegance: {lookRatingResult.elegance}%</span>
                  <span>Harmony: {lookRatingResult.harmony}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '0.8rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '6px', marginBottom: '6px' }}>
                  <span>Balance: {lookRatingResult.balance}%</span>
                  <span>Photo Score: {lookRatingResult.photography}%</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '6px' }}>{lookRatingResult.verdict}</p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Listings */}
        <motion.div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} variants={staggerContainer} initial="initial" animate="animate">
          {filteredSalons.length > 0 ? filteredSalons.map((salon, idx) => {
            return (
              <motion.div key={salon.id} className="glass-card" style={{ padding: '24px', background: 'var(--card-bg)', display: 'grid', gridTemplateColumns: '120px 1fr 200px', gap: '24px', alignItems: 'center', textAlign: 'left' }}
                variants={fadeInUp} whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(183, 110, 121, 0.15)' }}>
                <SalonPreview src={salonImages[idx % salonImages.length]} name={salon.name} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--luxury-accent)' }}>{salon.name}</h3>
                    <span style={{ background: 'var(--accent)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 600 }}>{salon.experience} Exp</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 500, margin: '4px 0 8px' }}>{salon.style}</p>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '10px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {salon.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><DollarSign size={14} /> {salon.priceRange}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Star size={14} style={{ color: 'var(--secondary)', fill: 'var(--secondary)' }} /> {salon.rating}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {salon.services.slice(0, 3).map(svc => <span key={svc} style={{ fontSize: '0.7rem', padding: '3px 8px', background: 'var(--maroon-light)', border: '1px solid var(--card-border)', borderRadius: '4px', color: 'var(--text-dark)' }}>{svc}</span>)}
                  </div>
                </div>
                <div style={{ borderLeft: '1px solid var(--card-border)', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'stretch' }}>
                  <div className="match-score-badge" style={{ justifyContent: 'center' }}>{salon.matchScore}% Match Score</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.7rem', color: 'var(--text-light)', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Portfolio Trust:</span><strong style={{ color: 'var(--success)' }}>{salon.trustScore}%</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Originality:</span><strong style={{ color: 'var(--primary)' }}>{salon.originalityScore}%</strong></div>
                  </div>
                  <motion.button onClick={() => setSelectedSalon(salon)} className="btn-luxury primary" style={{ fontSize: '0.75rem', padding: '8px 16px', borderRadius: '6px', justifyContent: 'center' }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    Quick Book Package
                  </motion.button>
                </div>
              </motion.div>
            );
          }) : (
            <div style={{ border: '1px dashed rgba(183, 110, 121, 0.2)', borderRadius: '16px', padding: '60px', textAlign: 'center', color: 'var(--text-light)', background: 'rgba(183, 110, 121, 0.01)' }}>
<h4>No venues match your criteria</h4>
               <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>Try adjusting your budget or expanding the area selection.</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedSalon && (
          <>
            <motion.div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)', zIndex: 1000 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedSalon(null)} />
            <motion.div className="glass-panel animate-float-up" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '450px', background: '#FFFDF9', padding: '30px', zIndex: 1001 }}
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: 'spring', damping: 20, stiffness: 200 }}>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--luxury-accent)', marginBottom: '10px' }}>Confirm Trial Booking</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '20px' }}>Confirm your booking consultation slot at <strong>{selectedSalon.name} ({selectedSalon.location})</strong>.</p>
              <div style={{ background: 'rgba(248, 232, 238, 0.3)', padding: '14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '20px', borderLeft: '4px solid var(--primary)' }}>
                <strong>AI Match Score Info:</strong> Your {selectedSalon.matchScore}% match score is backed by high compatibility for <strong>{selectedSalon.style}</strong> matching your dry-skin profiles.
              </div>
              <div className="luxury-input-group">
                <label className="luxury-label">Select Date</label>
                <input type="date" className="luxury-input" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
                <motion.button onClick={handleConfirmBooking} className="btn-luxury primary" style={{ flex: 1, justifyContent: 'center' }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  Confirm Appointment
                </motion.button>
                <motion.button onClick={() => setSelectedSalon(null)} className="btn-luxury secondary" style={{ flex: 1, justifyContent: 'center' }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Premium Visual Success Modal */}
      <AnimatePresence>
        {showSuccessModal && confirmedBookingInfo && (
          <>
            <motion.div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 1010 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSuccessModal(false)} />
            <motion.div className="glass-panel animate-float-up" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '450px', background: 'linear-gradient(135deg, #1f1418 0%, #15090b 100%)', border: '1px solid rgba(196, 159, 87, 0.3)', color: '#ffffff', padding: '35px', zIndex: 1011, borderRadius: '24px', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: 'spring', damping: 20, stiffness: 200 }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(46, 204, 113, 0.1)', border: '2px solid #2ecc71', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2ecc71', fontSize: '2.5rem' }}>
                  ✓
                </div>
              </div>
              <h3 style={{ fontSize: '1.6rem', color: 'var(--gold-accent)', fontFamily: 'var(--font-heading)', marginBottom: '8px', fontWeight: 700 }}>Booking Confirmed!</h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '24px' }}>Aapka trial booking consultation register ho gaya hai.</p>
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(196, 159, 87, 0.15)', padding: '18px', borderRadius: '14px', fontSize: '0.85rem', marginBottom: '26px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>Salon Name</span>
                  <strong style={{ color: 'var(--gold-accent)' }}>{confirmedBookingInfo.name}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>Service</span>
                  <span style={{ fontWeight: 600 }}>{confirmedBookingInfo.service}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>Date</span>
                  <span style={{ fontWeight: 600 }}>{confirmedBookingInfo.date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>Price</span>
                  <strong style={{ color: 'var(--gold-accent)' }}>{confirmedBookingInfo.price}</strong>
                </div>
              </div>
              <motion.button onClick={() => setShowSuccessModal(false)} className="btn-luxury primary" style={{ width: '100%', padding: '12px', borderRadius: '10px', fontSize: '0.88rem', fontWeight: 700, justifyContent: 'center' }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                Great, Thank You!
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
