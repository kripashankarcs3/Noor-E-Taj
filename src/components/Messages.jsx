import { useState } from 'react';
import { ArrowLeft, Search, Phone, Video, MoreVertical, Paperclip, Smile, Send, CheckCheck } from 'lucide-react';

export default function Messages({ onBack, onNavigate, conversations = [], setConversations = () => {} }) {
  const [activeChat, setActiveChat] = useState(0);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showGallery, setShowGallery] = useState(false);
  const [showAllMedia, setShowAllMedia] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [toast, setToast] = useState('');
  const [blockedChats, setBlockedChats] = useState({});

  const handleChatClick = (id) => {
    setActiveChat(id);
    setConversations(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };

  const filteredConversations = conversations.filter(conv => {
    if (searchQuery && !conv.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeTab === 'Unread') return conv.unread > 0;
    if (activeTab === 'Bookings') return conv.type === 'booking';
    if (activeTab === 'Enquiries') return conv.type === 'enquiry';
    return true;
  });

  const [chatData, setChatData] = useState({
    0: [
      { id: 1, sender: 'them', text: "Hi Priya! Thank you for showing interest in our services. I'd love to know more about your big day! ✨", time: '10:28 AM' },
      { id: 2, sender: 'me', text: "Hi Riya! I'm getting married on 12 Dec 2025. I'm looking for a soft glam look for my sangeet and a classic bridal look for the wedding.", time: '10:29 AM' },
      { id: 3, sender: 'them', text: "That sounds beautiful! I can definitely create the perfect looks for you. 💕 Would you like to see some references and our packages?", time: '10:30 AM' },
      { id: 4, sender: 'them', type: 'media', images: ['/mood_eye.png', '/bridal_lehenga.png'], title: 'Sangeet & Wedding Looks', count: 15, time: '10:30 AM' },
      { id: 5, sender: 'me', text: "Yes please! Also, share the package details and availability.", time: '10:31 AM' },
    ],
    1: [
      { id: 1, sender: 'them', text: "Hi Priya, your booking at Chandni Singh is confirmed for 12 Dec. We're excited to have you! ✨", time: '2:15 PM' },
      { id: 2, sender: 'me', text: "Thank you so much! Could you share the prep checklist?", time: '2:20 PM' },
      { id: 3, sender: 'them', text: "Of course! Sending it over shortly.", time: '2:22 PM' },
    ],
    2: [
      { id: 1, sender: 'them', text: "Hello Priya! We have some exciting bridal offers for you this season.", time: '11:00 AM' },
      { id: 2, sender: 'me', text: "Please share the details!", time: '11:05 AM' },
    ],
    3: [
      { id: 1, sender: 'them', text: "Here are some trending mehendi designs for the wedding season 🌸", time: '3:00 PM' },
      { id: 2, sender: 'them', type: 'media', images: ['/mood_henna.png', '/mood_hair.png'], title: 'Bridal Mehendi Designs', count: 8, time: '3:01 PM' },
      { id: 3, sender: 'me', text: "These are gorgeous! I love the intricate patterns.", time: '3:15 PM' },
    ],
    4: [
      { id: 1, sender: 'them', text: "Your venue tour at The Leela Palace is confirmed for 25 May at 4 PM. See you there!", time: '10:00 AM' },
      { id: 2, sender: 'me', text: "Perfect, looking forward to it!", time: '10:05 AM' },
    ],
    5: [
      { id: 1, sender: 'them', text: "Let's schedule your makeup trial session. When are you free?", time: '9:30 AM' },
      { id: 2, sender: 'me', text: "Next weekend works best for me.", time: '9:35 AM' },
    ],
  });

  const quickActions = ['Request a Call', 'Share Requirements', 'Send Inspiration'];

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleSend = () => {
    if (!message.trim()) return;
    const conv = conversations[activeChat];
    if (blockedChats[conv?.name]) {
      showToast('⛔ You have blocked this user. Unblock to send messages.');
      return;
    }
    const newMsg = {
      id: Date.now(),
      sender: 'me',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatData(prev => ({ ...prev, [activeChat]: [...(prev[activeChat] || []), newMsg] }));
    setConversations(prev => prev.map(c => c.id === activeChat ? { ...c, lastMsg: message, time: 'Just now' } : c));
    setMessage('');
  };

  const handleClearChat = () => {
    setChatData(prev => ({ ...prev, [activeChat]: [] }));
    setShowMoreMenu(false);
    showToast('🗑️ Chat cleared');
  };

  const handleBlock = () => {
    const conv = conversations[activeChat];
    setBlockedChats(prev => ({ ...prev, [conv.name]: true }));
    setShowMoreMenu(false);
    showToast(`⛔ ${conv.name} has been blocked`);
  };

  const handleReport = () => {
    setShowMoreMenu(false);
    showToast('🚨 Report submitted. Our team will review this conversation.');
  };

  return (
    <div className="messages-page animate-fade-in" style={{ padding: '0 0 0 0', height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '16px', flexShrink: 0 }}>
        <button className="planner-back-btn" onClick={onBack} style={{ marginBottom: '6px' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.9rem', color: 'var(--sidebar-bg)', fontWeight: 700, marginBottom: '2px' }}>
          Messages 💬
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Connect with your artists and vendors</p>
      </div>

      {/* Three-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 260px', gap: '16px', flex: 1, minHeight: 0 }}>

        {/* COL 1 — Contact List */}
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          {/* Search */}
          <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid var(--card-border)', flexShrink: 0 }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input placeholder="Search conversations..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '100%', background: 'var(--bg-color)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '8px 12px 8px 30px', fontSize: '0.78rem', outline: 'none', fontFamily: 'var(--font-body)' }} />
            </div>
          </div>
          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '4px', padding: '8px 10px', borderBottom: '1px solid var(--card-border)', flexShrink: 0, overflowX: 'auto' }}>
            {['All', 'Unread', 'Bookings', 'Enquiries'].map(t => (
              <button key={t} onClick={() => setActiveTab(t)} style={{ padding: '5px 10px', borderRadius: '20px', border: 'none', background: activeTab === t ? 'var(--maroon-btn)' : 'transparent', color: activeTab === t ? 'var(--text-white)' : 'var(--text-muted)', fontSize: '0.7rem', fontFamily: 'var(--font-btn)', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {t}
              </button>
            ))}
          </div>
          {/* Conversation List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredConversations.map(conv => (
              <div key={conv.id} onClick={() => handleChatClick(conv.id)} style={{ display: 'flex', gap: '10px', padding: '12px 14px', cursor: 'pointer', background: activeChat === conv.id ? 'var(--maroon-light)' : 'transparent', borderLeft: activeChat === conv.id ? '3px solid var(--maroon-btn)' : '3px solid transparent', transition: 'background 0.15s', alignItems: 'flex-start' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img src={conv.image} alt={conv.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--card-border)' }} />
                  {conv.online && <span style={{ position: 'absolute', bottom: '1px', right: '1px', width: '9px', height: '9px', borderRadius: '50%', background: '#2ecc71', border: '1.5px solid var(--text-white)' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', fontFamily: 'var(--font-btn)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {conv.name}
                      {conv.verified && <span style={{ background: 'var(--gold-accent)', color: 'var(--sidebar-bg)', fontSize: '0.55rem', fontWeight: 700, padding: '1px 5px', borderRadius: '10px' }}>✓</span>}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', flexShrink: 0 }}>{conv.time}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>{conv.lastMsg}</p>
                    {conv.unread && <span style={{ background: 'var(--maroon-btn)', color: 'var(--text-white)', fontSize: '0.6rem', fontWeight: 700, width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{conv.unread}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COL 2 — Chat Area */}
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          {/* Chat Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid var(--card-border)', flexShrink: 0, background: 'var(--bg-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ position: 'relative' }}>
                <img src={conversations[activeChat]?.image || '/digital_twin_portrait.png'} alt={conversations[activeChat]?.name} style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--card-border)' }} />
                {conversations[activeChat]?.online && <span style={{ position: 'absolute', bottom: '1px', right: '1px', width: '9px', height: '9px', borderRadius: '50%', background: '#2ecc71', border: '1.5px solid var(--text-white)' }} />}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {conversations[activeChat]?.name}
                  {conversations[activeChat]?.verified && <span style={{ background: 'var(--gold-accent)', color: 'var(--sidebar-bg)', fontSize: '0.55rem', fontWeight: 700, padding: '1px 6px', borderRadius: '10px' }}>✓ Verified</span>}
                </div>
                {blockedChats[conversations[activeChat]?.name] ? (
                  <div style={{ fontSize: '0.7rem', color: 'var(--maroon-btn)', fontFamily: 'var(--font-btn)', fontWeight: 500 }}>⛔ Blocked</div>
                ) : (
                  <div style={{ fontSize: '0.7rem', color: '#2ecc71', fontFamily: 'var(--font-btn)', fontWeight: 500 }}>● Online now</div>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', position: 'relative' }}>
              <button onClick={() => showToast('📞 Calling Poonam Rawat...')} style={{ background: 'var(--bg-color)', border: '1px solid var(--card-border)', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <Phone size={15} />
              </button>
              <button onClick={() => showToast('🎥 Starting video call...')} style={{ background: 'var(--bg-color)', border: '1px solid var(--card-border)', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <Video size={15} />
              </button>
              <div style={{ position: 'relative' }}>
                <button onClick={() => setShowMoreMenu(!showMoreMenu)} style={{ background: 'var(--bg-color)', border: '1px solid var(--card-border)', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <MoreVertical size={15} />
                </button>
                {showMoreMenu && (
                  <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-md)', zIndex: 10, minWidth: 140 }}>
                    {[
                      { label: 'Block', handler: handleBlock },
                      { label: 'Report', handler: handleReport },
                      { label: 'Clear Chat', handler: handleClearChat },
                    ].map(action => (
                      <div key={action.label} onClick={action.handler} style={{ padding: '8px 14px', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'var(--font-btn)', color: action.label === 'Clear Chat' ? 'var(--maroon-btn)' : 'var(--text-dark)', borderBottom: '1px solid var(--card-border)' }}>
                        {action.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Date separator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--card-border)' }} />
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-btn)', fontWeight: 500 }}>Today</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--card-border)' }} />
            </div>

            {blockedChats[conversations[activeChat]?.name] ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, color: 'var(--text-muted)', padding: '20px' }}>
                <span style={{ fontSize: '2rem' }}>⛔</span>
                <p style={{ fontSize: '0.85rem', fontFamily: 'var(--font-btn)', margin: 0 }}>You have blocked {conversations[activeChat]?.name}</p>
                <button onClick={() => { setBlockedChats(prev => { const n = { ...prev }; delete n[conversations[activeChat]?.name]; return n; }); showToast('✅ User unblocked'); }} style={{ background: 'none', border: '1px solid var(--maroon-btn)', color: 'var(--maroon-btn)', borderRadius: 'var(--radius-sm)', padding: '6px 16px', fontSize: '0.78rem', fontFamily: 'var(--font-btn)', fontWeight: 600, cursor: 'pointer' }}>
                  Unblock
                </button>
              </div>
            ) : (chatData[activeChat]?.length === 0) ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, color: 'var(--text-muted)' }}>
                <span style={{ fontSize: '2rem' }}>💬</span>
                <p style={{ fontSize: '0.85rem', fontFamily: 'var(--font-btn)', margin: 0 }}>No messages yet. Start a conversation!</p>
              </div>
            ) : (
              (chatData[activeChat] || []).map(msg => (
              <div key={msg.id} style={{ 
                display: 'flex', 
                gap: '8px', 
                maxWidth: '75%', 
                alignSelf: msg.sender === 'me' ? 'flex-end' : 'flex-start',
                flexDirection: msg.sender === 'me' ? 'row-reverse' : 'row'
              }}>
                {msg.sender === 'them' && (
                  <img src="/digital_twin_portrait.png" alt="Riya" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, alignSelf: 'flex-end' }} />
                )}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'me' ? 'flex-end' : 'flex-start' }}>
                  {msg.type === 'media' ? (
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: msg.sender === 'me' ? 'var(--radius-md) 0 var(--radius-md) var(--radius-md)' : '0 var(--radius-md) var(--radius-md) var(--radius-md)', padding: '12px', boxShadow: 'var(--shadow-sm)' }}>
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                        {msg.images.map((img, i) => (
                          <img key={i} src={img} alt="ref" style={{ width: '70px', height: '70px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                        ))}
                        {msg.count > msg.images.length && (
                          <div style={{ width: '70px', height: '70px', borderRadius: 'var(--radius-sm)', background: 'rgba(34,24,25,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-white)', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>
                            +{msg.count - msg.images.length}
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '2px' }}>{msg.title}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{msg.count} Images</div>
                      <button onClick={() => setShowGallery(true)} style={{ background: 'var(--maroon-light)', color: 'var(--maroon-btn)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '5px 12px', fontSize: '0.72rem', fontFamily: 'var(--font-btn)', fontWeight: 600, cursor: 'pointer' }}>
                        View Gallery
                      </button>
                    </div>
                  ) : (
                    <>
                      <div style={{ 
                        background: msg.sender === 'me' ? 'var(--maroon-btn)' : 'var(--card-bg)', 
                        border: msg.sender === 'me' ? 'none' : '1px solid var(--card-border)',
                        borderRadius: msg.sender === 'me' ? 'var(--radius-md) 0 var(--radius-md) var(--radius-md)' : '0 var(--radius-md) var(--radius-md) var(--radius-md)', 
                        padding: '10px 14px', 
                        fontSize: '0.82rem', 
                        color: msg.sender === 'me' ? 'var(--text-white)' : 'var(--text-dark)', 
                        lineHeight: 1.5,
                        boxShadow: msg.sender === 'me' ? 'none' : 'var(--shadow-sm)'
                      }}>
                        {msg.text}
                      </div>
                      <div style={{ 
                        fontSize: '0.62rem', 
                        color: 'var(--text-muted)', 
                        marginTop: '3px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start',
                        gap: '3px'
                      }}>
                        {msg.time} {msg.sender === 'me' && <CheckCheck size={12} style={{ color: 'var(--gold-accent)' }} />}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )))}
          </div>

          {/* Input Bar */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--card-border)', display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0, background: 'var(--card-bg)' }}>
            <button onClick={() => { const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*'; input.click(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
              <Paperclip size={18} />
            </button>
            <input
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              style={{ flex: 1, background: 'var(--bg-color)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '10px 16px', fontSize: '0.82rem', outline: 'none', fontFamily: 'var(--font-body)' }}
            />
            <button onClick={() => setShowEmojiPicker(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
              <Smile size={18} />
            </button>
            <button onClick={handleSend} style={{ background: 'var(--maroon-btn)', border: 'none', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'opacity 0.2s' }}
              onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
              onMouseOut={e => e.currentTarget.style.opacity = '1'}
            >
              <Send size={16} style={{ color: 'var(--text-white)' }} />
            </button>
          </div>
        </div>

        {/* COL 3 — Info Panel */}
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {/* Artist Image */}
            <div style={{ position: 'relative', height: '160px', flexShrink: 0 }}>
              <img src="/countdown_bride.png" alt="Artist" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(34,24,25,0.7) 0%, transparent 60%)' }} />
            </div>

            {/* Artist Info Card */}
            <div style={{ padding: '0 14px 14px', marginTop: '-20px', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', marginBottom: '10px' }}>
                <div style={{ position: 'relative' }}>
                  <img src="/digital_twin_portrait.png" alt="Riya" style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--text-white)', boxShadow: 'var(--shadow-sm)' }} />
                  <span style={{ position: 'absolute', bottom: '1px', right: '1px', width: '9px', height: '9px', borderRadius: '50%', background: '#2ecc71', border: '1.5px solid var(--text-white)' }} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {conversations[activeChat]?.name}
                    {conversations[activeChat]?.verified && <span style={{ background: 'var(--gold-accent)', color: 'var(--sidebar-bg)', fontSize: '0.5rem', fontWeight: 700, padding: '1px 5px', borderRadius: '10px' }}>✓</span>}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{conversations[activeChat]?.type === 'booking' ? 'Bridal Service Partner' : 'Enquiry Partner'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', fontSize: '0.72rem', color: 'var(--text-dark)', marginBottom: '10px', flexWrap: 'wrap' }}>
                <span>⭐ 4.9</span>
                <span>💼 8+ yrs</span>
                <span>📍 South Delhi</span>
              </div>
              <button onClick={() => { if (onNavigate) onNavigate('marketplace'); }} style={{ width: '100%', background: 'var(--maroon-light)', color: 'var(--maroon-btn)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px', fontFamily: 'var(--font-btn)', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}>
                View Profile
              </button>
            </div>

            {/* Booking Summary */}
            <div style={{ margin: '0 14px 14px', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)', padding: '12px', border: '1px solid var(--card-border)' }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', color: 'var(--sidebar-bg)', fontWeight: 700, marginBottom: '10px' }}>📅 Booking Summary</h4>
              {[
                { label: 'Service', value: conversations[activeChat]?.type === 'booking' ? 'Premium Bridal Package' : 'Beauty Consultation' },
                { label: 'Date', value: '12 Dec 2025' },
                { label: 'Time', value: '6:00 AM' },
                { label: 'Location', value: 'The Leela Palace' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.72rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                  <span style={{ color: 'var(--text-dark)', fontWeight: 600, textAlign: 'right', maxWidth: '55%' }}>{row.value}</span>
                </div>
              ))}
              <button onClick={() => { if (onNavigate) onNavigate('bookings'); }} style={{ width: '100%', background: 'var(--maroon-light)', color: 'var(--maroon-btn)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '7px', fontFamily: 'var(--font-btn)', fontWeight: 600, fontSize: '0.72rem', cursor: 'pointer', marginTop: '8px' }}>
                View Booking Details
              </button>
            </div>

            {/* Shared Media */}
            <div style={{ margin: '0 14px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)' }}>Shared Media & Files</span>
                <button onClick={() => setShowAllMedia(true)} style={{ background: 'none', border: 'none', fontSize: '0.68rem', color: 'var(--maroon-btn)', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-btn)' }}>View All</button>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['/mood_eye.png', '/bridal_lehenga.png', '/mood_hair.png'].map((img, i) => (
                  <img key={i} src={img} alt="media" style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1px solid var(--card-border)' }} />
                ))}
                <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-sm)', background: 'var(--sidebar-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-accent)', fontWeight: 700, fontSize: '0.82rem' }}>+8</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ margin: '0 14px 14px' }}>
              <h4 style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--sidebar-bg)', fontFamily: 'var(--font-btn)', marginBottom: '8px' }}>Quick Actions</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {quickActions.map(action => (
                  <button key={action} onClick={() => {
                    if (action === 'Request a Call') showToast(`📞 Call request sent to ${conversations[activeChat]?.name}`);
                    else if (action === 'Share Requirements') showToast('📋 Requirements form opened');
                    else if (action === 'Send Inspiration') { const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*'; input.click(); showToast('📸 Select images to share'); }
                  }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-color)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '8px 10px', fontSize: '0.75rem', color: 'var(--text-dark)', fontFamily: 'var(--font-btn)', fontWeight: 500, cursor: 'pointer', transition: 'background 0.15s', textAlign: 'left' }}
                    onMouseOver={e => e.currentTarget.style.background = 'var(--maroon-light)'}
                    onMouseOut={e => e.currentTarget.style.background = 'var(--bg-color)'}
                  >
                    {action} <span style={{ color: 'var(--gold-accent)', fontWeight: 700 }}>›</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── GALLERY MODAL ── */}
      {showGallery && (
        <div onClick={() => setShowGallery(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', padding: '28px', width: 520, maxWidth: '90vw', maxHeight: '80vh', overflowY: 'auto', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--sidebar-bg)', margin: 0 }}>🖼️ Shared Gallery</h3>
              <button onClick={() => setShowGallery(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.1rem' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {['/mood_eye.png', '/bridal_lehenga.png', '/mood_hair.png', '/mood_jewelry.png', '/mood_henna.png', '/luxury_salon.png', '/faceshape_profile.png', '/mood_walk.png', '/digital_twin_portrait.png'].map((img, i) => (
                <div key={i} style={{ aspectRatio: '1', borderRadius: 'var(--radius-sm)', overflow: 'hidden', cursor: 'pointer' }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── ALL MEDIA MODAL ── */}
      {showAllMedia && (
        <div onClick={() => setShowAllMedia(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', padding: '28px', width: 480, maxWidth: '90vw', maxHeight: '80vh', overflowY: 'auto', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--sidebar-bg)', margin: 0 }}>📁 All Shared Media</h3>
              <button onClick={() => setShowAllMedia(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.1rem' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {Array.from({ length: 11 }, (_, i) => (
                <div key={i} style={{ aspectRatio: '1', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                  <img src={['/mood_eye.png', '/bridal_lehenga.png', '/mood_hair.png', '/mood_jewelry.png', '/mood_henna.png', '/luxury_salon.png', '/faceshape_profile.png', '/mood_walk.png', '/digital_twin_portrait.png', '/countdown_bride.png', '/recommend_salon1.png'][i]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── EMOJI PICKER MODAL ── */}
      {showEmojiPicker && (
        <div onClick={() => setShowEmojiPicker(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', padding: '20px', width: 320, maxWidth: '90vw', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--sidebar-bg)', margin: 0 }}>😊 Emoji</h3>
              <button onClick={() => setShowEmojiPicker(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.1rem' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '4px' }}>
              {['😊','😂','❤️','🥰','😍','🤗','😘','😌','😏','😎','🤩','😢','😭','😤','😡','🥺','😳','🤔','🙄','😴','🤭','😇','🙏','👏','✨','💪','🔥','🎉','💖','🌟','💅','👸','🌸','💄','👗','💍','🪔','🥻','👑','💎','📸','🎀','💋','💕','😉','🤷','💯','👍'].map(e => (
                <button key={e} onClick={() => { setMessage(prev => prev + e); setShowEmojiPicker(false); }} style={{ fontSize: '1.4rem', padding: '4px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '6px', transition: 'background 0.15s' }}
                  onMouseOver={e => e.currentTarget.style.background = 'var(--card-border)'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >{e}</button>
              ))}
            </div>
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
