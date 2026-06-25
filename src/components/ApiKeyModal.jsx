import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Eye, EyeOff, Check, X, ExternalLink, Trash2 } from 'lucide-react';
import { saveApiKey, hasApiKey, retryPendingAction, clearPendingAction } from '../services/aiService';

const gold = 'var(--ai-gold)';

export default function ApiKeyModal({ visible, onClose }) {
  const [input, setInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    if (visible) setHasKey(hasApiKey());
  }, [visible]);

  const handleSave = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    saveApiKey(trimmed);
    setHasKey(true);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setInput('');
      onClose();
      retryPendingAction();
    }, 800);
  };

  const handleRemove = () => {
    localStorage.removeItem('noor_api_key');
    setHasKey(false);
    setInput('');
  };

  const handleSkip = () => {
    clearPendingAction();
    setInput('');
    onClose();
  };

  const handleClose = () => {
    clearPendingAction();
    setInput('');
    onClose();
  };

  const styles = {
    overlay: {
      position: 'fixed', inset: 0,
      background: 'rgba(5, 5, 5, 0.8)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: 20,
    },
    modal: {
      background: 'var(--ai-card)',
      border: '1px solid var(--ai-border)',
      borderRadius: 24,
      padding: '36px 32px 28px',
      width: 440, maxWidth: '100%',
      boxShadow: '0 0 60px rgba(212,175,55,0.08), 0 20px 60px rgba(0,0,0,0.5)',
      textAlign: 'center',
    },
    iconWrap: {
      width: 64, height: 64, borderRadius: 20,
      background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      margin: '0 auto 16px',
      border: '1px solid rgba(212,175,55,0.2)',
    },
    title: {
      fontFamily: "'Playfair Display', serif",
      fontSize: '1.4rem', fontWeight: 700, color: 'var(--ai-text)',
      marginBottom: 8,
    },
    subtitle: {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '0.82rem', color: 'var(--ai-text-secondary)',
      lineHeight: 1.5, marginBottom: 24,
    },
    inputWrap: {
      display: 'flex', alignItems: 'center', gap: 8,
      background: 'var(--ai-card-subtle)',
      border: '1px solid var(--ai-border)',
      borderRadius: 12, padding: '4px 4px 4px 16px',
    },
    input: {
      flex: 1, border: 'none', background: 'transparent',
      color: 'var(--ai-text)', fontSize: '0.82rem',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      outline: 'none', padding: '10px 0',
    },
    toggleBtn: {
      background: 'transparent', border: 'none',
      color: 'var(--ai-text-secondary)', cursor: 'pointer',
      padding: '6px', borderRadius: 8,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    primaryBtn: {
      width: '100%', marginTop: 16,
      background: `linear-gradient(135deg, ${gold}, #c8a34e)`,
      border: 'none', borderRadius: 12,
      padding: '14px', color: 'var(--text-white)',
      fontWeight: 700, fontSize: '0.85rem',
      cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    },
    dangerBtn: {
      width: '100%', marginTop: 12,
      background: 'rgba(220, 50, 50, 0.12)',
      border: '1px solid rgba(220, 50, 50, 0.25)',
      borderRadius: 12,
      padding: '14px', color: '#dc3232',
      fontWeight: 700, fontSize: '0.85rem',
      cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    },
    hint: {
      marginTop: 14,
      fontSize: '0.7rem', color: 'var(--ai-text-secondary)',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    },
    link: {
      color: gold, textDecoration: 'none', fontWeight: 600,
    },
  };

  const renderConnected = () => (
    <>
      <div style={styles.iconWrap}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Check size={16} color="white" />
        </div>
      </div>
      <h2 style={styles.title}>API Key Connected</h2>
      <p style={styles.subtitle}>Your OpenRouter API key is configured. All AI features are ready to use.</p>
      <button onClick={handleRemove} style={styles.dangerBtn}>
        <Trash2 size={14} />
        Remove API Key
      </button>
      <button
        onClick={() => setHasKey(false)}
        style={{
          marginTop: 8,
          background: 'transparent', border: 'none',
          color: 'var(--ai-text-secondary)', fontSize: '0.75rem',
          cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
          padding: '8px 16px', textDecoration: 'underline',
        }}
      >
        Change Key
      </button>
    </>
  );

  const renderEnterKey = () => (
    <>
      <div style={styles.iconWrap}>
        <Key size={28} style={{ color: gold }} />
      </div>
      <h2 style={styles.title}>Enter Your API Key</h2>
      <p style={styles.subtitle}>This action requires an OpenRouter API key. Enter yours below to connect all AI features — one key works everywhere.</p>
      <div style={styles.inputWrap}>
        <input
          type={showKey ? 'text' : 'password'}
          placeholder="sk-or-v1-..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
          style={styles.input}
          autoFocus
        />
        <button onClick={() => setShowKey(!showKey)} style={styles.toggleBtn} title={showKey ? 'Hide' : 'Show'}>
          {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      <motion.button
        onClick={handleSave}
        style={{
          ...styles.primaryBtn,
          opacity: input.trim() ? 1 : 0.5,
        }}
        whileHover={input.trim() ? { scale: 1.01 } : {}}
        whileTap={input.trim() ? { scale: 0.98 } : {}}
        disabled={!input.trim()}
      >
        <Key size={14} />
        Connect & Save
      </motion.button>
      <div style={styles.hint}>
        Don't have an API key?{' '}
        <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" style={styles.link}>
          Get one here <ExternalLink size={10} style={{ display: 'inline' }} />
        </a>
      </div>
      <button onClick={handleSkip} style={{
        marginTop: 8,
        background: 'transparent', border: 'none',
        color: 'var(--ai-text-secondary)', fontSize: '0.75rem',
        cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
        padding: '8px 16px',
      }}>
        Skip for now
      </button>
    </>
  );

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          style={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            style={styles.modal}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {saved ? (
              <>
                <div style={styles.iconWrap}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Check size={28} style={{ color: 'var(--success)' }} />
                  </motion.div>
                </div>
                <h2 style={styles.title}>API Key Connected!</h2>
                <p style={styles.subtitle}>Your AI features are now ready to use.</p>
              </>
            ) : hasKey ? renderConnected() : renderEnterKey()}

            <button onClick={handleClose} style={{
              position: 'absolute', top: 16, right: 16,
              background: 'var(--ai-card-subtle)', border: 'none',
              borderRadius: '50%', width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--ai-text-secondary)',
            }}>
              <X size={16} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
