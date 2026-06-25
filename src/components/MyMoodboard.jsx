import { useState } from 'react';
import { ArrowLeft, Plus, Share2, Edit2, Heart, MoreHorizontal, Grid, X, Copy } from 'lucide-react';

export default function MyMoodboard({ onBack, wishlistItems = [], toggleWishlist = () => {} }) {
  const [activeBoard, setActiveBoard] = useState('All Boards (4)');
  const [activeFilter, setActiveFilter] = useState('All (24)');
  const [liked, setLiked] = useState(() => {
    try { return JSON.parse(localStorage.getItem('noor_moodboard_liked') || '{}'); } catch { return {}; }
  });
  const [sortOrder, setSortOrder] = useState('Recent');
  const [showSort, setShowSort] = useState(false);
  const [showNewBoard, setShowNewBoard] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [boardName, setBoardName] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [toast, setToast] = useState('');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAllCollections, setShowAllCollections] = useState(false);

  const boards = ['All Boards (4)', 'Bridal Look', 'Makeup Inspo', 'Hair & Accessories', 'Outfit Ideas', 'Venue & Decor'];
  const filters = ['All (24)', 'Outfit (6)', 'Makeup (7)', 'Hair (4)', 'Jewellery (4)', 'Inspo (3)'];

  const baseItems = [
    { img: '/mood_eye.png', label: 'Makeup Look', category: 'Makeup' },
    { img: '/mood_hair.png', label: 'Hair Style', category: 'Hair' },
    { img: '/bridal_lehenga.png', label: 'Outfit Inspiration', category: 'Outfit' },
    { img: '/mood_jewelry.png', label: 'Jewellery', category: 'Jewellery' },
    { img: '/mood_henna.png', label: 'Mehendi Design', category: 'Inspo' },
    { img: '/luxury_salon.png', label: 'Stage Decor', category: 'Inspo' },
    { img: '/faceshape_profile.png', label: 'Footwear', category: 'Outfit' },
    { img: '/mood_walk.png', label: 'Nails', category: 'Makeup' },
  ];

  const [gridItems, setGridItems] = useState(baseItems);

  const collections = [
    { name: 'Wedding Day Look', count: 18, img: '/digital_twin_portrait.png' },
    { name: 'Reception Look', count: 12, img: '/recommend_salon1.png' },
    { name: 'Haldi Look', count: 9, img: '/mood_eye.png' },
    { name: 'Mehendi Look', count: 7, img: '/mood_henna.png' },
  ];

  const moreCollections = [
    { name: 'Engagement Look', count: 6, img: '/luxury_salon.png' },
    { name: 'Cocktail Look', count: 5, img: '/mood_walk.png' },
  ];

  const allCollections = [...collections, ...moreCollections];
  const displayCollections = showAllCollections ? allCollections : collections;

  const toggleLike = (i) => setLiked(prev => {
    const next = { ...prev, [i]: !prev[i] };
    localStorage.setItem('noor_moodboard_liked', JSON.stringify(next));
    return next;
  });

  const filteredItems = gridItems.filter((item) => {
    const filterCategory = activeFilter.replace(/ \(\d+\)$/, '');
    if (filterCategory !== 'All' && item.category !== filterCategory) return false;
    const boardCategory = activeBoard.replace(/ \(\d+\)$/, '');
    if (boardCategory !== 'All Boards') {
      if (boardCategory === 'Bridal Look') return ['Makeup', 'Hair'].includes(item.category);
      if (boardCategory === 'Makeup Inspo') return item.category === 'Makeup';
      if (boardCategory === 'Hair & Accessories') return item.category === 'Hair';
      if (boardCategory === 'Outfit Ideas') return item.category === 'Outfit';
      if (boardCategory === 'Venue & Decor') return item.category === 'Inspo';
    }
    return true;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortOrder === 'Oldest') return 1;
    if (sortOrder === 'Most Liked') {
      const aLiked = wishlistItems.includes(a.label) ? 1 : 0;
      const bLiked = wishlistItems.includes(b.label) ? 1 : 0;
      return bLiked - aLiked;
    }
    return 0;
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const handleNewBoard = () => {
    if (!boardName.trim()) return;
    showToast(`Board "${boardName}" created!`);
    setBoardName('');
    setShowNewBoard(false);
  };

  const handleGenerateAI = () => {
    setAiGenerating(true);
    setTimeout(() => {
      const newItems = [
        { img: '/countdown_bride.png', label: 'AI: Wedding Glow', category: 'Makeup' },
        { img: '/digital_twin_portrait.png', label: 'AI: Royal Portrait', category: 'Inspo' },
      ];
      setGridItems(prev => [...newItems, ...prev]);
      setAiGenerating(false);
      showToast('✨ AI generated 2 new ideas!');
    }, 1500);
  };

  const openLightbox = (i) => {
    setLightboxIndex(i);
    setShowLightbox(true);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0 0 40px 0' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <button className="planner-back-btn" onClick={onBack} style={{ marginBottom: '8px' }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.9rem', color: 'var(--sidebar-bg)', fontWeight: 700, marginBottom: '4px' }}>
            My Moodboard ✨
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Curate your perfect bridal vision board
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '36px' }}>
          <button onClick={() => setShowNewBoard(true)} style={{ background: 'var(--card-bg)', border: '1.5px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '9px 16px', fontFamily: 'var(--font-btn)', fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-dark)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={15} /> New Board
          </button>
          <button onClick={() => setShowShare(true)} className="planner-next-btn" style={{ padding: '9px 16px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Share2 size={14} /> Share Board
          </button>
        </div>
      </div>

      {/* Main two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '24px', alignItems: 'start' }}>

        {/* ── LEFT / CENTER COLUMN ── */}
        <div>
          {/* Board Tabs */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--card-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)', padding: '4px 8px', marginBottom: '20px', overflowX: 'auto', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', gap: '2px' }}>
              {boards.map(b => (
                <button key={b} onClick={() => setActiveBoard(b)} style={{ padding: '7px 14px', borderRadius: 'var(--radius-sm)', border: 'none', background: activeBoard === b ? 'var(--sidebar-bg)' : 'transparent', color: activeBoard === b ? 'var(--text-white)' : 'var(--text-muted)', fontFamily: 'var(--font-btn)', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                  {b}
                </button>
              ))}
            </div>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowSort(!showSort)} style={{ padding: '6px 12px', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', background: 'transparent', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-btn)', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                {sortOrder} ↓
              </button>
              {showSort && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-md)', zIndex: 10, minWidth: 140 }}>
                  {['Recent', 'Oldest', 'Most Liked'].map(s => (
                    <div key={s} onClick={() => { setSortOrder(s); setShowSort(false); }} style={{ padding: '8px 14px', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'var(--font-btn)', borderRadius: 'inherit', background: sortOrder === s ? 'rgba(196,159,87,0.08)' : 'transparent', color: sortOrder === s ? 'var(--maroon-btn)' : 'var(--text-dark)', fontWeight: sortOrder === s ? 600 : 400 }}>
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Featured Board Card */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '20px', display: 'flex', gap: '20px', marginBottom: '20px', boxShadow: 'var(--shadow-sm)', alignItems: 'flex-start' }}>
            {/* Image */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <img src="/countdown_bride.png" alt="Featured Board" style={{ width: '120px', height: '120px', borderRadius: 'var(--radius-md)', objectFit: 'cover', border: '2px solid var(--card-border)' }} />
              <span style={{ position: 'absolute', top: '8px', left: '8px', background: 'var(--sidebar-bg)', color: 'var(--gold-accent)', fontSize: '0.62rem', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', fontFamily: 'var(--font-btn)' }}>
                {gridItems.length} items
              </span>
              <button onClick={() => setShowEditModal(true)} style={{ position: 'absolute', top: '8px', right: '8px', background: 'var(--card-bg)', border: 'none', borderRadius: '50%', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>
                <Edit2 size={12} style={{ color: 'var(--text-muted)' }} />
              </button>
            </div>

            {/* Info */}
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--sidebar-bg)', fontWeight: 700 }}>
                  Sangeet Night Look 👑
                </h3>
                <div style={{ position: 'relative' }}>
                  <button onClick={() => setShowMoreMenu(!showMoreMenu)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0 4px' }}>
                    <MoreHorizontal size={18} />
                  </button>
                  {showMoreMenu && (
                    <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-md)', zIndex: 10, minWidth: 150 }}>
                      {['Edit', 'Duplicate', 'Share', 'Delete'].map(action => (
                        <div key={action} onClick={() => { setShowMoreMenu(false); showToast(`Board ${action.toLowerCase()}d!`); }} style={{ padding: '8px 14px', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'var(--font-btn)', color: action === 'Delete' ? 'var(--maroon-btn)' : 'var(--text-dark)', borderBottom: action !== 'Delete' ? '1px solid var(--card-border)' : 'none' }}>
                          {action}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '10px', fontFamily: 'var(--font-btn)' }}>
                Created on 10 Dec 2025 • Updated just now
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-dark)', lineHeight: 1.5, marginBottom: '12px' }}>
                A curated collection of glam & royal looks for your sangeet night. Bold eyes, warm tones & heritage jewellery pieces.
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Glam', 'Soft Glam', 'Royal', 'Warm Tones'].map(tag => (
                  <span key={tag} style={{ background: 'var(--gold-light, #f6ebd6)', color: 'var(--sidebar-bg)', fontSize: '0.7rem', fontWeight: 600, padding: '3px 10px', borderRadius: '20px', border: '1px solid var(--card-border)', fontFamily: 'var(--font-btn)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {filters.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)} style={{ padding: '6px 14px', border: activeFilter === f ? '1.5px solid var(--maroon-btn)' : '1.5px solid var(--card-border)', borderRadius: '20px', background: activeFilter === f ? 'var(--maroon-light)' : 'transparent', color: activeFilter === f ? 'var(--maroon-btn)' : 'var(--text-muted)', fontFamily: 'var(--font-btn)', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                {f}
              </button>
            ))}
          </div>

          {/* Image Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {sortedItems.map((item) => {
              const realIndex = gridItems.indexOf(item);
              return (
                <div key={realIndex} onClick={() => openLightbox(realIndex)} style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', aspectRatio: '0.85', boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }}>
                  {item.img.startsWith('AI:') ? (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #280c11, #3d1820)', color: 'var(--gold-accent)', fontSize: '0.75rem', fontWeight: 600, fontFamily: 'var(--font-btn)', textAlign: 'center', padding: 8 }}>
                      {item.img.replace('AI: ', '')}
                    </div>
                  ) : (
                    <img src={item.img} alt={item.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  )}
                  <button onClick={(e) => { e.stopPropagation(); toggleWishlist(item.label); }} style={{ position: 'absolute', top: '8px', right: '8px', background: 'var(--card-bg)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>
                    <Heart size={14} style={{ color: wishlistItems.includes(item.label) ? 'var(--maroon-btn)' : 'var(--text-muted)', fill: wishlistItems.includes(item.label) ? 'var(--maroon-btn)' : 'none' }} />
                  </button>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(0deg, rgba(34,24,25,0.88) 0%, transparent 100%)', padding: '20px 10px 8px', color: 'var(--text-white)', fontSize: '0.72rem', fontFamily: 'var(--font-btn)', fontWeight: 600 }}>
                    {item.label}
                  </div>
                </div>
              );
            })}
          </div>
          {sortedItems.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No items match this filter. Try a different category!
            </div>
          )}
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '20px' }}>

          {/* AI Moodboard Assistant */}
          <div style={{ background: 'linear-gradient(160deg, #280c11 0%, #3d1820 100%)', borderRadius: 'var(--radius-lg)', padding: '20px', border: '1px solid var(--card-border)' }}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: 'var(--gold-accent)', fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                ✨ AI Moodboard Assistant
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>
                Get personalized suggestions
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              {[
                { icon: '🎨', title: 'Complete Your Look', sub: 'Fill gaps in your board' },
                { icon: '🌈', title: 'Smart Color Palette', sub: 'AI-matched tones' },
                { icon: '💰', title: 'Budget Optimization', sub: 'Best looks, best price' },
              ].map(feat => (
                <div key={feat.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ fontSize: '1rem', flexShrink: 0, marginTop: '1px' }}>{feat.icon}</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-btn)' }}>{feat.title}</div>
                    <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)' }}>{feat.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={handleGenerateAI} disabled={aiGenerating} style={{ width: '100%', background: 'var(--gold-accent)', color: 'var(--sidebar-bg)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '10px', fontFamily: 'var(--font-btn)', fontWeight: 700, fontSize: '0.82rem', cursor: aiGenerating ? 'wait' : 'pointer', opacity: aiGenerating ? 0.7 : 1, transition: 'transform 0.2s' }}
              onMouseOver={e => { if (!aiGenerating) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {aiGenerating ? '✦ Generating...' : '✦ Generate More Ideas'}
            </button>
          </div>

          {/* Your Collections */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '18px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', color: 'var(--sidebar-bg)', fontWeight: 700, margin: 0 }}>Your Collections</h4>
              <button onClick={() => setShowAllCollections(!showAllCollections)} style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: 'var(--maroon-btn)', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-btn)' }}>
                {showAllCollections ? 'Show Less' : 'View All'}
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {displayCollections.map(col => (
                <div key={col.name} onClick={() => { setActiveBoard(col.name); showToast(`Showing "${col.name}"`); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <img src={col.img} alt={col.name} style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1px solid var(--card-border)' }} />
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)' }}>{col.name}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{col.count} items</div>
                  </div>
                  <Grid size={14} style={{ color: 'var(--text-muted)' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── NEW BOARD MODAL ── */}
      {showNewBoard && (
        <div onClick={() => setShowNewBoard(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', padding: '28px', width: 400, maxWidth: '90vw', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--sidebar-bg)', margin: 0 }}>Create New Board</h3>
              <button onClick={() => setShowNewBoard(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)', display: 'block', marginBottom: '6px' }}>Board Name</label>
              <input type="text" value={boardName} onChange={e => setBoardName(e.target.value)} placeholder="e.g. Wedding Day Look"
                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--card-border)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-btn)', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)', display: 'block', marginBottom: '6px' }}>Category Tags</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {['Makeup', 'Hair', 'Outfit', 'Jewellery', 'Inspo'].map(tag => (
                  <span key={tag} style={{ background: 'var(--gold-light, #f6ebd6)', color: 'var(--sidebar-bg)', fontSize: '0.72rem', fontWeight: 600, padding: '4px 12px', borderRadius: '20px', border: '1px solid var(--card-border)', fontFamily: 'var(--font-btn)', cursor: 'pointer' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <button onClick={handleNewBoard} style={{ width: '100%', background: 'var(--maroon-btn)', color: 'var(--text-white)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '11px', fontFamily: 'var(--font-btn)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
              Create Board
            </button>
          </div>
        </div>
      )}

      {/* ── SHARE MODAL ── */}
      {showShare && (
        <div onClick={() => setShowShare(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', padding: '28px', width: 360, maxWidth: '90vw', boxShadow: 'var(--shadow-md)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🔗</div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--sidebar-bg)', margin: '0 0 6px' }}>Share Your Board</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Let others see your bridal inspiration!</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '16px' }}>
              {[{ icon: '💬', label: 'WhatsApp' }, { icon: '📸', label: 'Instagram' }, { icon: '💌', label: 'Email' }].map(s => (
                <div key={s.label} onClick={() => showToast(`Shared via ${s.label}!`)} style={{ width: 70, padding: '12px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--card-border)', cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{s.icon}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-btn)' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '8px 12px', marginBottom: '16px' }}>
              <span style={{ flex: 1, fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'left' }}>noor.ai/board/sangeet-night</span>
              <Copy size={14} style={{ color: 'var(--maroon-btn)', cursor: 'pointer' }} onClick={() => { navigator.clipboard.writeText('noor.ai/board/sangeet-night'); showToast('Link copied!'); }} />
            </div>
            <button onClick={() => setShowShare(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontFamily: 'var(--font-btn)', fontSize: '0.78rem', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── LIGHTBOX ── */}
      {showLightbox && (
        <div onClick={() => setShowLightbox(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ position: 'relative', maxWidth: '70vw', maxHeight: '85vh' }}>
            <button onClick={() => setShowLightbox(false)} style={{ position: 'absolute', top: -40, right: 0, background: 'none', border: 'none', color: 'var(--text-white)', cursor: 'pointer', fontFamily: 'var(--font-btn)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              <X size={18} /> Close
            </button>
            {gridItems[lightboxIndex]?.img.startsWith('AI:') ? (
              <div style={{ width: 400, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #280c11, #3d1820)', color: 'var(--gold-accent)', fontSize: '1.2rem', fontWeight: 600, fontFamily: 'var(--font-btn)', borderRadius: 'var(--radius-md)' }}>
                {gridItems[lightboxIndex].label}
              </div>
            ) : (
              <img src={gridItems[lightboxIndex]?.img} alt={gridItems[lightboxIndex]?.label} style={{ maxWidth: '70vw', maxHeight: '75vh', borderRadius: 'var(--radius-md)', objectFit: 'contain' }} />
            )}
            <div style={{ color: 'var(--text-white)', textAlign: 'center', marginTop: 12, fontSize: '0.85rem', fontFamily: 'var(--font-btn)' }}>
              {gridItems[lightboxIndex]?.label} — {lightboxIndex + 1} of {gridItems.length}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: 12 }}>
              <button onClick={() => setLightboxIndex(prev => prev > 0 ? prev - 1 : gridItems.length - 1)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 'var(--radius-sm)', padding: '8px 20px', color: 'var(--text-white)', cursor: 'pointer', fontFamily: 'var(--font-btn)', fontSize: '0.82rem' }}>
                ← Previous
              </button>
              <button onClick={() => setLightboxIndex(prev => prev < gridItems.length - 1 ? prev + 1 : 0)} style={{ background: 'var(--maroon-btn)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 20px', color: 'var(--text-white)', cursor: 'pointer', fontFamily: 'var(--font-btn)', fontSize: '0.82rem' }}>
                Next →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT BOARD MODAL ── */}
      {showEditModal && (
        <div onClick={() => setShowEditModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', padding: '28px', width: 360, maxWidth: '90vw', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--sidebar-bg)', margin: '0 0 16px' }}>Edit Board</h3>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)', display: 'block', marginBottom: '6px' }}>Board Name</label>
              <input type="text" defaultValue="Sangeet Night Look" style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--card-border)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-btn)', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)', display: 'block', marginBottom: '6px' }}>Cover Image</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['/countdown_bride.png', '/bridal_lehenga.png', '/mood_eye.png'].map(img => (
                  <img key={img} src={img} alt="" style={{ width: 60, height: 60, borderRadius: 'var(--radius-sm)', objectFit: 'cover', cursor: 'pointer', border: '2px solid transparent', opacity: 0.6 }} />
                ))}
              </div>
            </div>
            <button onClick={() => { setShowEditModal(false); showToast('Board updated!'); }} style={{ width: '100%', background: 'var(--maroon-btn)', color: 'var(--text-white)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '11px', fontFamily: 'var(--font-btn)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
              Save Changes
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
