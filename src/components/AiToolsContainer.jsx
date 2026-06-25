import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, Scissors, Smile, Image, Percent, HeartPulse, MessageCircle, Send, Phone, Camera, Star, Droplets, ShieldCheck, Eye, Heart, Zap, Clock, Gem } from 'lucide-react';
import { DigitalTwinAvatar, FaceShapeGrid, SpotEraserSVG, PremiumImage, IMAGES } from '../assets/illustrations';
import { askOpenRouter, saveApiKey, hasApiKey, ensureApiKey } from '../services/aiService';

const gold = 'var(--ai-gold)';
const softGold = 'var(--ai-soft-gold)';
const successGreen = 'var(--success)';

function TabHeader({ category, title, icon: IconComp, subtitle }) {
  return (
    <div style={{ marginBottom: 32 }}>
      {category && (
        <span style={{ fontSize: '0.65rem', color: gold, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, display: 'block', marginBottom: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {category}
        </span>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.25rem', fontWeight: 700, color: 'var(--ai-text)', margin: 0, letterSpacing: '-0.5px', lineHeight: 1.2 }}>
          {title}
        </h1>
        {IconComp && <IconComp size={22} style={{ color: gold }} />}
      </div>
      {subtitle && (
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.88rem', color: 'var(--ai-text-secondary)', marginTop: 6, marginBottom: 0, lineHeight: 1.5 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

const looksData = {
  'Royal Bridal': {
    name: 'Royal Bridal',
    sub: 'Heritage red & gold look',
    img: '/digital_twin_portrait.png',
    lip: 'Deep Crimson Matte (#8B0000)',
    eye: 'Heavy Gold Leaf Lid with Bold Kohl',
    hair: 'Traditional Neat Bun with Gajra and Matha Patti',
    jewellery: 'Kundan choker with emerald drops and nosering',
    accent: 'Classic Royal Elegance'
  },
  'Minimal Luxury': {
    name: 'Minimal Luxury',
    sub: 'Soft dewy ivory look',
    img: '/recommend_salon2.png',
    lip: 'Soft Peachy Nude Gloss (#D2B48C)',
    eye: 'Muted Taupe Shimmer with Feathered Lashes',
    hair: 'Sleek Center-Parted Low Bun or Waves',
    jewellery: 'Minimalist Polki Studs and Delicate Choker',
    accent: 'Modern Editorial Grace'
  },
  'Reception Glam': {
    name: 'Reception Glam',
    sub: 'Modern champagne gloss',
    img: '/recommend_salon1.png',
    lip: 'Rich Berry Satin (#800020)',
    eye: 'Champagne Gold Cut-Crease with Winged Liner',
    hair: 'Voluminous Side-Swept Hollywood Waves',
    jewellery: 'Contemporary Diamond Choker and Drops',
    accent: 'High Glamour & Shine'
  },
  'Pastel Princess': {
    name: 'Pastel Princess',
    sub: 'Floral blush rose look',
    img: '/countdown_bride.png',
    lip: 'Soft Dusty Pink Matte (#DB7093)',
    eye: 'Rose Gold Halo Eye with Winged Lash',
    hair: 'Messy Floral Braids or Half-Up Waves',
    jewellery: 'Pink Tourmaline and Pearl Choker Set',
    accent: 'Romantic Ethereal Charm'
  },
  'Traditional Red': {
    name: 'Traditional Red',
    sub: 'Classic zardozi lehenga look',
    img: '/bridal_lehenga.png',
    lip: 'Iconic Crimson Red (#B22222)',
    eye: 'Classic Smoked Out Winged Liner & Bronze Sparkle',
    hair: 'Elegant Neat Braids or Floral Crown Bun',
    jewellery: 'Heavy Gold Heritage Temple Jewelry Set',
    accent: 'Timeless Cultural Grandeur'
  }
};

const biometricNodes = [
  { name: 'Frontal (Pore Density: 92%)', top: '15%', left: '50%' },
  { name: 'Cheek L (Hydration: 72%)', top: '48%', left: '33%' },
  { name: 'Cheek R (Melanin: Low)', top: '48%', left: '67%' },
  { name: 'Mandible (Elasticity: 0.89)', top: '78%', left: '50%' }
];

export default function AiToolsContainer({ initialActiveTool = 'twin' }) {
  const [activeTab, setActiveTab] = useState(initialActiveTool);

  const tabs = [
    { id: 'twin', label: 'AI Bridal Twin', icon: Sparkles },
    { id: 'timeline', label: 'Beauty Timeline', icon: Calendar },
    { id: 'lehenga', label: 'Lehenga Matcher', icon: Scissors },
    { id: 'faceshape', label: 'Face Shape Analyzer', icon: Smile },
    { id: 'lookbook', label: 'Lookbook Generator', icon: Image },
    { id: 'budget', label: 'Budget Optimizer', icon: Percent },
    { id: 'emergency', label: 'SOS Co-Pilot', icon: HeartPulse },
    { id: 'copilot', label: 'AI Copilot Chat', icon: MessageCircle }
  ];

  const [twinForm, setTwinForm] = useState({ skinType: 'Combination', hairType: 'Curly/Frizzy', selfie: null });
  const [twinResult, setTwinResult] = useState({
    readinessScore: 82,
    skinScore: 84,
    hairScore: 78,
    glowIndex: 8.8,
    skinProfile: 'Combination — Dehydrated',
    hairProfile: 'Type 2C — High Porosity',
    recs: [
      'Increase Vitamin C intake and lock hydration serum for the next 14 days.',
      'Book a gentle Hydrafacial trial session at GK-II.',
      'Apply custom deep conditioning hair mask twice weekly.'
    ]
  });
  const [selectedLook, setSelectedLook] = useState('Royal Bridal');
  const [isAnalyzingTwin, setIsAnalyzingTwin] = useState(false);

  async function handleTwinSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    ensureApiKey(() => {
      setIsAnalyzingTwin(true);
      performTwinAnalysis();
    });
  }

  const performTwinAnalysis = () => {
    (async () => {
      const prompt = `Perform a bridal skin and hair biometric simulation. Inputs are:
Skin Type: ${twinForm.skinType}
Hair Texture: ${twinForm.hairType}

Return a valid JSON object matching this schema exactly (do not include any conversational text or markdown formatting code blocks, just pure JSON):
{
  "readinessScore": 88,
  "skinScore": 86,
  "hairScore": 80,
  "glowIndex": 9.2,
  "skinProfile": "Descriptive skin status line",
  "hairProfile": "Descriptive hair status line",
  "recs": [
    "Skincare recommendation 1",
    "Skincare recommendation 2",
    "Haircare recommendation 3"
  ]
}`;

      const systemInstruction = "You are an AI beauty biometric analyzer. You generate accurate, customized skincare and haircare diagnostics. You only return valid, parseable JSON.";

      try {
        const response = await askOpenRouter(prompt, systemInstruction);
        const cleanedResponse = response.replace(/```json/g, "").replace(/```/g, "").trim();
        const resultObj = JSON.parse(cleanedResponse);

        setTwinResult({
          readinessScore: resultObj.readinessScore || 85,
          skinScore: resultObj.skinScore || 84,
          hairScore: resultObj.hairScore || 78,
          glowIndex: resultObj.glowIndex || 8.8,
          skinProfile: resultObj.skinProfile || `${twinForm.skinType} - Custom Profile`,
          hairProfile: resultObj.hairProfile || `${twinForm.hairType} - Custom Profile`,
          recs: Array.isArray(resultObj.recs) ? resultObj.recs.slice(0, 3) : ['Skincare recommendation', 'Haircare recommendation', 'Lifestyle recommendation']
        });
      } catch (err) {
        console.error("Failed to analyze twin with AI:", err);
        setTwinResult({
          readinessScore: Math.floor(Math.random() * 15) + 80,
          skinScore: Math.floor(Math.random() * 15) + 80,
          hairScore: Math.floor(Math.random() * 15) + 75,
          glowIndex: parseFloat((Math.random() * 2 + 8).toFixed(1)),
          skinProfile: `${twinForm.skinType} — Dynamic Profile`,
          hairProfile: `${twinForm.hairType} — Custom Texture`,
          recs: [
            `Adjust skincare routine for ${twinForm.skinType} skin.`,
            `Keep your ${twinForm.hairType} hair nourished with oils.`,
            `Consult with a local Delhi specialist for a custom treatment.`
          ]
        });
      } finally {
        setTimeout(() => {
          setIsAnalyzingTwin(false);
        }, 1000);
      }
    })();
  };

  const handleTwinRef = useRef(handleTwinSubmit);
  useEffect(() => { handleTwinRef.current = handleTwinSubmit; });

  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImg, setCapturedImg] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef(null);

  const startCamera = async () => {
    setCapturedImg(null);
    setCameraError('');
    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } }
      });
      setCameraStream(mediaStream);
      setCameraActive(true);
      setCountdown(3); // Start 3 seconds countdown
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera connection error:", err);
      setCameraError("Camera permission blocked hai ya device available nahi hai. Kripya image upload option use karein.");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setCameraActive(false);
    setCountdown(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    stopCamera();
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setCapturedImg(dataUrl);
      setTwinForm(prev => ({ ...prev, selfie: dataUrl }));
      // Auto-trigger diagnostics
      handleTwinSubmit();
    };
    reader.readAsDataURL(file);
  };

  // Countdown timer effect
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setTimeout(() => {
        if (!videoRef.current) return;
        try {
          const video = videoRef.current;
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth || 480;
          canvas.height = video.videoHeight || 480;
          const ctx = canvas.getContext('2d');
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          setCapturedImg(dataUrl);
          setTwinForm(prev => ({ ...prev, selfie: dataUrl }));
          
          if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
          }
          setCameraActive(false);
          setCountdown(null);
          
          handleTwinRef.current();
        } catch (err) {
          console.error("Capture snapshot failed:", err);
        }
      }, 0);
      return;
    }
    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown, cameraStream]);

  // Clean stream tracks on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  const [telemetryText, setTelemetryText] = useState('CALIBRATING FACE VECTOR MAP...');
  useEffect(() => {
    const logs = [
      'CALIBRATING FACE VECTOR MAP...',
      'SCANNING PORPHYRIN LEVELS...',
      'MAPPING T-ZONE LIPID CONCENTRATION...',
      'COLLAGEN LAYER THICKNESS: 94%',
      'HYDRATION INDEX: 84% - NOMINAL',
      'PEAK GLOW VECTOR LOCKED...',
      'HAIR POROSITY CALIBRATION COMPLETE'
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % logs.length;
      setTelemetryText(logs[i]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const [isMatchingLehenga, setIsMatchingLehenga] = useState(false);
  const [faceShapeResult, setFaceShapeResult] = useState({
    contour: 'Deepen the zygomatic arches to soften the jawline. Use rose gold shimmer on high points.',
    hair: 'Loose textured waves starting below jawline, side-swept bangs.',
    jewelry: 'Chandbalis, round hoops, heavy multi-layered collar necklaces.',
    makeup: 'Elongated winged liner to balance the wider forehead. Highlight the jaw angles.'
  });
  const [isAnalyzingFace, setIsAnalyzingFace] = useState(false);
  const [isSosAnalyzing, setIsSosAnalyzing] = useState(false);

  const [timelineCountdown] = useState(64);
  const [sosMsg, setSosMsg] = useState('');
  const [sosHistory, setSosHistory] = useState([
    { text: 'Describe your skin or beauty emergency. You can also upload a photo for AI analysis.', from: 'bot' },
    { text: 'Sudden breakout on my chin — I have my Mehendi tonight. It\'s red and inflamed.', from: 'user' },
    { text: 'Analyzing inflammation patterns...', from: 'bot' },
  ]);

  // SOS Calling States & Logic
  const [showCallModal, setShowCallModal] = useState(false);
  const [callState, setCallState] = useState('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [callTranscripts, setCallTranscripts] = useState([]);

  useEffect(() => {
    let timer;
    if (callState === 'connected') {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [callState]);

  const dialogueScripts = [
    { time: 3, speaker: 'Support', text: 'Hello Priya, this is Dr. Ananya from the Noor Elite Concierge team. I see you selected our emergency line. How can I help you today?' },
    { time: 8, speaker: 'You', text: 'Hi, I have a sudden breakout on my forehead. My Mehendi is tonight and I\'m completely panicking!' },
    { time: 13, speaker: 'Support', text: 'Oh, don\'t worry at all! First, please do not squeeze it. Apply a clean ice compress wrapped in muslin cloth for 5 minutes right away. I\'m sending an SOS precision spot eraser kit to your GK-I address via hyper-local delivery.' },
    { time: 20, speaker: 'Support', text: 'It should reach you in 25 minutes. Our partner artist, Riya, is also updated and she will use a clinical green corrector base to fully conceal it during makeup. You are in safe hands!' },
    { time: 27, speaker: 'You', text: 'Oh my god, thank you so much! That is such a massive relief.' },
    { time: 32, speaker: 'Support', text: 'You\'re very welcome, Priya. Keep hydrated and I\'ll stay in touch via chat. Have a wonderful Mehendi ceremony!' }
  ];

  useEffect(() => {
    if (callState !== 'connected') {
      setCallTranscripts([]);
      return;
    }
    const activeTranscripts = dialogueScripts.filter(s => s.time <= callDuration);
    setCallTranscripts(activeTranscripts);
  }, [callDuration, callState]);

  const handleStartCall = () => {
    setShowCallModal(true);
    setCallState('dialing');
    setTimeout(() => {
      setCallState('connected');
    }, 2500);
  };

  const handleEndCall = () => {
    setCallState('ended');
    setTimeout(() => {
      setShowCallModal(false);
      setCallState('idle');
    }, 1000);
  };

  const [lehengaColor, setLehengaColor] = useState('Crimson Red');
  const [lehengaEmbroidery, setLehengaEmbroidery] = useState('Zardozi');
  const [lehengaResult, setLehengaResult] = useState({ lookName: 'Royal Heritage Classic', lipShade: 'Matte Deep Ruby (#D00000)', eyeMakeup: 'Classic Winged Eyeliner with warm Gold metallic shimmer base', hairstyle: 'Elegant center-parted low sleek bun with fresh gajra wraps', jewellery: 'Kundan choker neckpiece with emerald hanging beads' });

  const updateLehengaRecs = async (color, embroidery) => {
    ensureApiKey(() => {
      setLehengaColor(color);
      setLehengaEmbroidery(embroidery);
      setIsMatchingLehenga(true);

      const prompt = `Provide styling recommendations for a bride.
Lehenga Color: ${color}
Embroidery Style: ${embroidery}

Return a valid JSON object matching this schema exactly (do not include any conversational text or markdown formatting code blocks, just pure JSON):
{
  "lookName": "Classic name of the style match",
  "lipShade": "Specific lip color with hex code",
  "eyeMakeup": "Specific eye makeup suggestion",
  "hairstyle": "Suggested hairstyle description",
  "jewellery": "Suggested jewelry pieces description"
}`;

      const systemInstruction = "You are an AI bridal lehenga styling expert. You only respond with JSON matching the requested structure.";

      (async () => {
        try {
          const response = await askOpenRouter(prompt, systemInstruction);
          const cleanedResponse = response.replace(/```json/g, "").replace(/```/g, "").trim();
          const resultObj = JSON.parse(cleanedResponse);

          setLehengaResult({
            lookName: resultObj.lookName || 'Royal Heritage Classic',
            lipShade: resultObj.lipShade || 'Matte Deep Ruby (#D00000)',
            eyeMakeup: resultObj.eyeMakeup || 'Classic Winged Eyeliner with warm Gold metallic shimmer base',
            hairstyle: resultObj.hairstyle || 'Elegant center-parted low sleek bun with fresh gajra wraps',
            jewellery: resultObj.jewellery || 'Kundan choker neckpiece with emerald hanging beads'
          });
        } catch (err) {
          console.error("Failed to match lehenga:", err);
          const recs = {
            'Crimson Red': { lookName: 'Royal Heritage Classic', lipShade: 'Matte Deep Ruby (#D00000)', eyeMakeup: 'Classic Winged Eyeliner with warm Gold metallic shimmer base', hairstyle: 'Elegant center-parted low sleek bun with fresh gajra wraps', jewellery: 'Kundan choker neckpiece with emerald hanging beads' },
            'Pastel Pink': { lookName: 'Dewy Blossom Glow', lipShade: 'Soft Dusty Rose Gloss (#E88F9A)', eyeMakeup: 'Rose gold halo eyeshadow with soft brown smoked liner', hairstyle: 'Loose textured romantic waves with side-swept floral pins', jewellery: 'Polki choker with pink tourmaline droplets' },
            'Mustard Yellow': { lookName: 'Marigold Sunshine Blush', lipShade: 'Warm Terracotta Nude (#C86446)', eyeMakeup: 'Soft bronze cut crease with dual-tone chrome gold pigments', hairstyle: 'French braided half-updo with baby\'s breath flowers', jewellery: 'Temple gold jewellery set with heritage engravings' },
            'Velvet Navy': { lookName: 'Midnight Royalty Glitz', lipShade: 'Sophisticated Mauve Satin (#9B6A84)', eyeMakeup: 'Deep charcoal smoky eyes with soft gold inner-corner highlights', hairstyle: 'Hollywood glam side waves with side crystal hair barrette', jewellery: 'Diamond/White Gold choker with royal blue sapphire drop earrings' },
          };
          setLehengaResult(recs[color] || recs['Crimson Red']);
        } finally {
          setIsMatchingLehenga(false);
        }
      })();
    });
  };

  const [faceShape, setFaceShape] = useState('Heart');

  const faceShapeRecs = useMemo(() => ({
    Oval: { contour: 'Subtle cheekbone sculpting with light dusting on the forehead temples.', hair: 'Center-parted sleek buns, voluminous layers, or loose curls.', jewelry: 'Elongated danglers, teardrop earrings, and heavy chokers.', makeup: 'Balanced makeup distribution; highlight the center of the forehead and chin.' },
    Round: { contour: 'Heavy contouring along the sides of cheeks and jawline to create length.', hair: 'Side-parted high updo, soft layers framing the chin, high puff braids.', jewelry: 'Vertical drop earrings, angular studs, long layered necklaces.', makeup: 'Focus on highlighting the center T-zone with bold vertical eyeliner.' },
    Heart: { contour: 'Deepen the zygomatic arches to soften the jawline. Use rose gold shimmer on high points.', hair: 'Loose textured waves starting below jawline, side-swept bangs.', jewelry: 'Chandbalis, round hoops, heavy multi-layered collar necklaces.', makeup: 'Elongated winged liner to balance the wider forehead. Highlight the jaw angles.' },
    Square: { contour: 'Deep shading on the jaw corners and forehead corners to soften angles.', hair: 'Soft wispy side bangs, romantic textured messy braids, side-part waves.', jewelry: 'Oval hoops, circular studs, round button neck chokers.', makeup: 'Soft circular blush application with diffused lips — no hard outlines.' },
  }), []);
  useEffect(() => {
    const fetchFaceShapeRecs = async () => {
      if (!hasApiKey()) { return; }
      setIsAnalyzingFace(true);

      const prompt = `Analyze face shape: ${faceShape}.
Return a valid JSON object matching this schema exactly (do not include any conversational text or markdown formatting code blocks, just pure JSON):
{
  "contour": "contouring recommendation",
  "hair": "hairstyle recommendation",
  "jewelry": "jewelry recommendations",
  "makeup": "makeup balance instructions"
}`;
      const systemInstruction = "You are an AI face biometric and bridal beauty analyzer. You respond only with JSON containing styling advice matching the specified face shape.";

      try {
        const response = await askOpenRouter(prompt, systemInstruction);
        const cleanedResponse = response.replace(/```json/g, "").replace(/```/g, "").trim();
        const resultObj = JSON.parse(cleanedResponse);

        setFaceShapeResult({
          contour: resultObj.contour || faceShapeRecs[faceShape].contour,
          hair: resultObj.hair || faceShapeRecs[faceShape].hair,
          jewelry: resultObj.jewelry || faceShapeRecs[faceShape].jewelry,
          makeup: resultObj.makeup || faceShapeRecs[faceShape].makeup
        });
      } catch (err) {
        console.error("Failed to fetch face shape recommendations:", err);
        const recs = faceShapeRecs[faceShape] || faceShapeRecs['Heart'];
        setFaceShapeResult(recs);
      } finally {
        setIsAnalyzingFace(false);
      }
    };

    if (hasApiKey()) {
      fetchFaceShapeRecs();
    }
  }, [faceShape, faceShapeRecs]);

  const [budgetVal, setBudgetVal] = useState(425000);
  const breakdown = { makeup: Math.round(budgetVal * 0.47), skincare: Math.round(budgetVal * 0.25), hair: Math.round(budgetVal * 0.16), nails: Math.round(budgetVal * 0.05), emergency: Math.round(budgetVal * 0.07) };

  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([{ sender: 'ai', text: 'Hello! I\'m your AI Bridal Beauty Copilot. Ask me about budget breakdowns, skincare timelines, or any wedding beauty concern.' }]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSosSubmit = async (textToSend) => {
    const text = textToSend || sosMsg;
    if (!text.trim()) return;
    ensureApiKey(() => {
      setSosHistory(prev => [...prev, { text, from: 'user' }]);
      setSosMsg('');
      setIsSosAnalyzing(true);

      setSosHistory(prev => [...prev, { text: 'Analyzing inflammation patterns & concern details...', from: 'bot', isAnalyzing: true }]);

      const systemInstruction = "You are an AI Emergency Bridal Beauty Co-Pilot (SOS). Give extremely rapid, safe, and helpful home remedies or makeup cover-up tips for last-minute skin issues (pimple, redness, dark circles, rash, swelling). Keep responses short (under 60 words). Always advise caution and testing on a small skin patch.";

      (async () => {
        try {
          const response = await askOpenRouter(text, systemInstruction);
          setSosHistory(prev => prev.filter(m => !m.isAnalyzing).concat({ text: response || "Sorry, I'm having trouble connecting. Apply a cold compress (ice wrapped in clean cloth) to soothe inflammation in the meantime! 🧊", from: 'bot' }));
        } catch (err) {
          console.error("SOS API Error:", err);
          setSosHistory(prev => prev.filter(m => !m.isAnalyzing).concat({ text: "Sorry, I'm having trouble connecting. Apply a cold compress (ice wrapped in clean cloth) to soothe inflammation in the meantime! 🧊", from: 'bot' }));
        } finally {
          setIsSosAnalyzing(false);
        }
      })();
    });
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    ensureApiKey(() => {
      const userMsg = chatInput;
      setChatHistory(prev => [...prev, { sender: 'user', text: userMsg }]);
      setChatInput('');
      setIsTyping(true);

      const systemInstruction = "You are Noor AI, a luxury Indian bridal beauty copilot assistant. You help brides plan their makeup looks, skincare routines, hair treatments, and organize their budgets. Keep answers structured, friendly, elegant, and concise (under 120 words). Offer customized suggestions based on Delhi wedding preferences when relevant.";

      (async () => {
        try {
          const response = await askOpenRouter(userMsg, systemInstruction);
          setChatHistory(prev => [...prev, { sender: 'ai', text: response || "I'm having trouble connecting right now. Please try again later! 🙏" }]);
        } catch (err) {
          console.error("Chat API error:", err);
          setChatHistory(prev => [...prev, { sender: 'ai', text: "I'm having trouble connecting right now. Please try again later! 🙏" }]);
        } finally {
          setIsTyping(false);
        }
      })();
    });
  };

  const contentVariants = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0, transition: { duration: 0.3 } }, exit: { opacity: 0, y: -15, transition: { duration: 0.2 } } };

  const glassCard = {
    background: 'var(--ai-card)',
    border: '1px solid var(--ai-border)',
    borderRadius: 20,
    boxShadow: 'var(--ai-shadow), var(--ai-shadow-sm)',
  };

  const glowBox = {
    boxShadow: 'var(--ai-glow), var(--ai-shadow-sm)',
  };

  const inputStyle = {
    background: 'var(--ai-card-subtle)',
    border: '1px solid var(--ai-border)',
    borderRadius: 12,
    padding: '12px 16px',
    color: 'var(--ai-text)',
    fontSize: '0.85rem',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    outline: 'none',
    width: '100%',
  };

  return (
    <section style={{ background: 'var(--ai-bg)', minHeight: '100vh', padding: '0 0 32px 0' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '32px 32px', display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24 }}>

        {/* ── SIDEBAR ── */}
        <div style={{ position: 'sticky', top: 30, alignSelf: 'start' }}>
          <div style={{ ...glassCard, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: '0 10px 12px', borderBottom: `1px solid var(--ai-border)`, marginBottom: 4 }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 750, textTransform: 'uppercase', letterSpacing: 2, color: gold, opacity: 0.9 }}>Noor AI</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--ai-text-secondary)', marginTop: 2 }}>Beauty Intelligence</div>
            </div>
            {tabs.map(tab => {
              const IconComp = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <motion.button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: isSelected ? `linear-gradient(135deg, ${gold}, ${softGold})` : 'var(--ai-card-subtle)',
                    color: isSelected ? 'var(--text-white)' : 'var(--ai-text-secondary)',
                    border: isSelected ? 'none' : `1px solid var(--ai-border)`,
                    borderRadius: 12, padding: '14px 18px',
                    fontSize: '0.8rem', fontWeight: isSelected ? 600 : 500, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    transition: 'all 0.2s',
                  }}
                  whileHover={{ x: 3, background: isSelected ? `linear-gradient(135deg, ${gold}, ${softGold})` : 'var(--ai-card)' }} whileTap={{ scale: 0.97 }}
                >
                  <IconComp size={14} style={{ color: isSelected ? 'var(--text-white)' : 'var(--ai-text-secondary)' }} />
                  {tab.label}
                  {isSelected && <motion.div layoutId="goldDot" style={{ marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%', background: 'var(--text-white)' }} />}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={{ textAlign: 'left', minHeight: '760px' }}>
          <AnimatePresence mode="wait">

            {/* ══════════════════════════════════════════ */}
            {/* TAB 1: TWIN — FULL LUXURY REDESIGN */}
            {/* ══════════════════════════════════════════ */}
            {activeTab === 'twin' && (
              <motion.div key="twin" variants={contentVariants} initial="initial" animate="animate" exit="exit">

                {/* ── HEADER ── */}
                <TabHeader 
                  category="AI Beauty Suite // Digital Twin"
                  title="AI Bridal Twin"
                  icon={Sparkles}
                  subtitle="Your Personal Bridal Beauty Intelligence Platform & Biometric Diagnostic Profile"
                />

                {/* ── METRICS ROW ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 32 }}>
                  {[
                    { label: 'Skin Health Score', value: isAnalyzingTwin ? '...' : `${twinResult.skinScore || 84}%`, icon: Droplets, color: '#5B9BD5' },
                    { label: 'Hair Health Score', value: isAnalyzingTwin ? '...' : `${twinResult.hairScore || 78}%`, icon: Zap, color: gold },
                    { label: 'Wedding Readiness', value: isAnalyzingTwin ? '...' : `${twinResult.readinessScore || 82}%`, icon: Heart, color: '#D4737A' },
                    { label: 'Glow Index', value: isAnalyzingTwin ? '...' : `${twinResult.glowIndex || 8.8}/10`, icon: ShieldCheck, color: successGreen },
                  ].map(m => (
                    <motion.div key={m.label} style={{ ...glassCard, padding: 16, display: 'flex', alignItems: 'center', gap: 12 }} whileHover={{ y: -2, borderColor: gold }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: `rgba(212,175,55,0.08)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <m.icon size={16} style={{ color: m.color }} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.62rem', color: 'var(--ai-text-secondary)', fontWeight: 550, textTransform: 'uppercase', letterSpacing: 0.5 }}>{m.label}</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--ai-text)', fontFamily: "'Playfair Display', serif", marginTop: 2 }}>{m.value}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* ── HERO SECTION (60/40) ── */}
                {/* ── HERO SECTION (60/40) ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: 24, marginBottom: 32 }}>

                  {/* LEFT: Upload & Scan Biometrics */}
                  <div style={{ ...glassCard, padding: 16, display: 'flex', flexDirection: 'column', gap: 16, ...glowBox }}>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: 'var(--ai-text)', margin: 0 }}>
                      AI Facial Scan
                    </h2>

                    {cameraError && (
                      <div style={{
                        background: 'rgba(231,76,60,0.12)',
                        border: '1px solid rgba(231,76,60,0.3)',
                        borderRadius: 10,
                        padding: '8px 12px',
                        fontSize: '0.72rem',
                        color: '#ff6b6b',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 10,
                        textAlign: 'left',
                        zIndex: 100
                      }}>
                        <span>⚠️ {cameraError}</span>
                        <button onClick={() => setCameraError('')} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>✕</button>
                      </div>
                    )}
                    
                    {/* Selfie scan visualization */}
                    <div style={{ position: 'relative', width: '100%', height: 260, borderRadius: 14, overflow: 'hidden', border: '1px solid var(--ai-border)', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {/* Grid Backdrop */}
                      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(var(--ai-border) 1px, transparent 1px)', backgroundSize: '16px 16px', opacity: 0.25, zIndex: 0 }} />
                      
                      {/* Live Camera Feed */}
                      {cameraActive && (
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transform: 'scaleX(-1)',
                            zIndex: 1,
                            opacity: 0.7
                          }}
                        />
                      )}

                      {/* Countdown Overlay */}
                      {countdown !== null && (
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(5, 5, 5, 0.4)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 14
                        }}>
                          <motion.div
                            key={countdown}
                            initial={{ scale: 0.3, opacity: 0 }}
                            animate={{ scale: 1.2, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            style={{
                              fontSize: '4.5rem',
                              fontWeight: 900,
                              color: gold,
                              fontFamily: "'Playfair Display', serif",
                              textShadow: '0 0 20px var(--ai-gold)'
                            }}
                          >
                            {countdown}
                          </motion.div>
                          <div style={{ fontSize: '0.62rem', color: 'var(--text-white)', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: 8, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Calibrating Scan... Hold Still
                          </div>
                        </div>
                      )}

                      {/* Captured / Uploaded Image Preview */}
                      {capturedImg && !cameraActive && (
                        <img
                          src={capturedImg}
                          alt="Captured face scan preview"
                          style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            zIndex: 1,
                            opacity: 0.6
                          }}
                        />
                      )}

                      {/* Vector Face Scan overlay (always visible unless camera active without preview, to keep clinical feel) */}
                      {(!cameraActive || countdown !== null) && (
                        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: capturedImg ? 0.65 : 1 }}>
                          <DigitalTwinAvatar size={200} />
                        </div>
                      )}

                      {/* Pulsing Biometric Nodes */}
                      {biometricNodes.map((node, index) => (
                        <div key={index} style={{ position: 'absolute', top: node.top, left: node.left, transform: 'translate(-50%, -50%)', zIndex: 10 }}>
                          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <motion.div
                              animate={{ scale: [1, 2, 1] }}
                              transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                              style={{ position: 'absolute', width: 14, height: 14, borderRadius: '50%', border: `1.5px solid ${gold}`, opacity: 0.8 }}
                            />
                            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: gold }} />
                          </div>
                          <div style={{
                            position: 'absolute',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            top: 12,
                            whiteSpace: 'nowrap',
                            background: 'rgba(5, 5, 5, 0.95)',
                            border: `1px solid ${gold}`,
                            padding: '2px 6px',
                            borderRadius: 4,
                            fontSize: '0.55rem',
                            color: 'var(--text-white)',
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            pointerEvents: 'none',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
                          }}>
                            {node.name}
                          </div>
                        </div>
                      ))}

                      {/* Animated laser scan line */}
                      <motion.div 
                        style={{ position: 'absolute', left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, var(--ai-gold), transparent)', boxShadow: '0 0 12px var(--ai-gold)', zIndex: 12 }}
                        animate={{ top: ['5%', '95%', '5%'] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      
                      {/* Scan Status Badge (Top Left) */}
                      <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(5, 5, 5, 0.8)', padding: '4px 10px', borderRadius: 8, fontSize: '0.6rem', color: gold, fontWeight: 700, border: '1px solid rgba(212, 175, 55, 0.3)', display: 'flex', alignItems: 'center', gap: 6, zIndex: 15 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: isAnalyzingTwin ? '#ff9f43' : (cameraActive ? '#e74c3c' : successGreen), animation: 'pulse 1s infinite' }} />
                        {isAnalyzingTwin ? 'ANALYZING...' : (cameraActive ? `CAPTURING (${countdown}s)` : 'SYSTEM SYNCED')}
                      </div>

                      {/* Telemetry scrolling ticker */}
                      <div style={{
                        position: 'absolute',
                        bottom: 8,
                        left: 8,
                        right: 8,
                        background: 'rgba(5, 5, 5, 0.85)',
                        border: '1px solid var(--ai-border)',
                        padding: '6px 10px',
                        borderRadius: 8,
                        fontSize: '0.58rem',
                        fontFamily: "'Courier New', Courier, monospace",
                        color: gold,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        zIndex: 15
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span>{telemetryText}</span>
                        </div>
                        <div style={{ color: 'var(--ai-text-secondary)', fontSize: '0.55rem' }}>
                          {isAnalyzingTwin ? 'RUNNING' : (cameraActive ? 'STREAMING' : 'ONLINE')}
                        </div>
                      </div>
                    </div>

                    {/* Dual Action Buttons (Upload & Camera) */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <input
                        type="file"
                        id="selfie-file-input"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                      
                      <motion.button
                        onClick={() => document.getElementById('selfie-file-input').click()}
                        style={{
                          background: 'var(--ai-card-subtle)',
                          border: '1px solid var(--ai-border)',
                          borderRadius: 12,
                          color: 'var(--ai-text)',
                          padding: '10px 14px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          fontFamily: "'Plus Jakarta Sans', sans-serif"
                        }}
                        whileHover={{ background: 'var(--ai-card)', borderColor: gold }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Image size={14} style={{ color: gold }} />
                        Upload Portrait
                      </motion.button>

                      <motion.button
                        onClick={cameraActive ? stopCamera : startCamera}
                        style={{
                          background: cameraActive ? 'rgba(231,76,60,0.15)' : 'var(--ai-card-subtle)',
                          border: `1px solid ${cameraActive ? '#e74c3c' : 'var(--ai-border)'}`,
                          borderRadius: 12,
                          color: cameraActive ? '#e74c3c' : 'var(--ai-text)',
                          padding: '10px 14px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          fontFamily: "'Plus Jakarta Sans', sans-serif"
                        }}
                        whileHover={{ borderColor: cameraActive ? '#e74c3c' : gold }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Camera size={14} style={{ color: cameraActive ? '#e74c3c' : gold }} />
                        {cameraActive ? 'Cancel Camera' : 'Use Live Camera'}
                      </motion.button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                      <div>
                        <label style={{ fontSize: '0.65rem', color: 'var(--ai-text-secondary)', fontWeight: 600, display: 'block', marginBottom: 4, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Skin Type</label>
                        <select value={twinForm.skinType} onChange={(e) => setTwinForm({...twinForm, skinType: e.target.value})} style={{ ...inputStyle, padding: '8px 10px', fontSize: '0.72rem' }}>
                          <option>Combination</option><option>Oily</option><option>Dry</option><option>Sensitive</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '0.65rem', color: 'var(--ai-text-secondary)', fontWeight: 600, display: 'block', marginBottom: 4, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Hair Type</label>
                        <select value={twinForm.hairType} onChange={(e) => setTwinForm({...twinForm, hairType: e.target.value})} style={{ ...inputStyle, padding: '8px 10px', fontSize: '0.72rem' }}>
                          <option>Curly / Frizzy</option><option>Straight / Fine</option><option>Wavy / Normal</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '0.65rem', color: 'var(--ai-text-secondary)', fontWeight: 600, display: 'block', marginBottom: 4, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Face Shape</label>
                        <select value={faceShape} onChange={(e) => setFaceShape(e.target.value)} style={{ ...inputStyle, padding: '8px 10px', fontSize: '0.72rem' }}>
                          <option>Heart</option><option>Oval</option><option>Round</option><option>Square</option>
                        </select>
                      </div>
                    </div>

                    <motion.button onClick={handleTwinSubmit} disabled={isAnalyzingTwin}
                      style={{ width: '100%', padding: '12px', background: `linear-gradient(135deg, ${gold}, ${softGold})`, border: 'none', borderRadius: 12, color: 'var(--text-white)', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      whileHover={{ scale: 1.01, boxShadow: `0 4px 20px rgba(212,175,55,0.25)` }} whileTap={{ scale: 0.98 }}
                    >
                      {isAnalyzingTwin ? 'Analyzing Biometrics...' : 'Trigger Recalibration Scan'}
                    </motion.button>
                  </div>

                  {/* RIGHT: Digital Twin Diagnostics Hub */}
                  <div style={{ ...glassCard, padding: 20, display: 'flex', flexDirection: 'column', gap: 20, ...glowBox, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 30%, rgba(212,175,55,0.08), transparent 70%)` }} />
                    
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', zIndex: 5 }}>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: 'var(--ai-text)', margin: '0 0 16px 0', textAlign: 'center' }}>
                        AI Diagnostics Console
                      </h3>

                      {/* Massive Centerpiece Wedding Readiness Hero Circle */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '8px 0 20px 0', position: 'relative' }}>
                        {/* Gold Backglow blur */}
                        <div style={{
                          position: 'absolute',
                          width: 210,
                          height: 210,
                          borderRadius: '50%',
                          background: 'radial-gradient(circle, rgba(212,175,55,0.18) 0%, transparent 70%)',
                          filter: 'blur(12px)',
                          zIndex: 1
                        }} />

                        {/* Circular progress bar */}
                        <div style={{ width: 190, height: 190, borderRadius: '50%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `conic-gradient(${gold} ${isAnalyzingTwin ? 25 : twinResult.readinessScore}%, var(--ai-border) ${isAnalyzingTwin ? 25 : twinResult.readinessScore}%)`, zIndex: 2 }}>
                          <div style={{ width: 162, height: 162, borderRadius: '50%', background: 'var(--ai-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', border: '1.5px solid var(--ai-border)' }}>
                            <span style={{ fontSize: '0.62rem', color: 'var(--ai-text-secondary)', fontFamily: "'Plus Jakarta Sans', sans-serif", textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 600 }}>Wedding Readiness</span>
                            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: gold, fontFamily: "'Playfair Display', serif", margin: '4px 0 2px 0' }}>
                              {isAnalyzingTwin ? '...' : `${twinResult.readinessScore}%`}
                            </span>
                            <span style={{ fontSize: '0.58rem', color: '#2ecc71', background: 'rgba(46,139,87,0.1)', padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(46,139,87,0.25)', fontWeight: 650, letterSpacing: '0.5px' }}>
                              {isAnalyzingTwin ? 'RECALIBRATING...' : 'PEAK RADIANCE'}
                            </span>
                          </div>
                        </div>

                        {/* Calibration Sync info */}
                        <div style={{ marginTop: 12, fontSize: '0.72rem', color: 'var(--ai-text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, zIndex: 2 }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: isAnalyzingTwin ? '#ff9f43' : successGreen, animation: 'pulse 1s infinite' }} />
                          {isAnalyzingTwin ? 'Running beauty simulation...' : 'Digital Twin Calibrated: 2 Hours Ago'}
                        </div>
                      </div>

                      {/* Secondary Diagnostic Metrics */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 'auto' }}>
                        
                        <div style={{ background: 'var(--ai-card-subtle)', padding: '10px 12px', borderRadius: 12, border: '1px solid var(--ai-border)', textAlign: 'left' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                            <span style={{ fontSize: '0.6rem', color: 'var(--ai-text-secondary)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Skin Health</span>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#5B9BD5' }}>{isAnalyzingTwin ? '...' : `${twinResult.skinScore || 84}%`}</span>
                          </div>
                          <div style={{ width: '100%', height: 4, background: 'var(--ai-border)', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ width: isAnalyzingTwin ? '40%' : `${twinResult.skinScore || 84}%`, height: '100%', background: '#5B9BD5', transition: 'width 0.5s ease' }} />
                          </div>
                          <span style={{ fontSize: '0.52rem', color: 'var(--ai-text-secondary)', marginTop: 4, display: 'block' }}>Nominal Lipid Index</span>
                        </div>

                        <div style={{ background: 'var(--ai-card-subtle)', padding: '10px 12px', borderRadius: 12, border: '1px solid var(--ai-border)', textAlign: 'left' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                            <span style={{ fontSize: '0.6rem', color: 'var(--ai-text-secondary)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Hair Health</span>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: gold }}>{isAnalyzingTwin ? '...' : `${twinResult.hairScore || 78}%`}</span>
                          </div>
                          <div style={{ width: '100%', height: 4, background: 'var(--ai-border)', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ width: isAnalyzingTwin ? '30%' : `${twinResult.hairScore || 78}%`, height: '100%', background: gold, transition: 'width 0.5s ease' }} />
                          </div>
                          <span style={{ fontSize: '0.52rem', color: 'var(--ai-text-secondary)', marginTop: 4, display: 'block' }}>High Porosity Check</span>
                        </div>

                        <div style={{ background: 'var(--ai-card-subtle)', padding: '10px 12px', borderRadius: 12, border: '1px solid var(--ai-border)', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <span style={{ fontSize: '0.6rem', color: 'var(--ai-text-secondary)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Face Shape</span>
                          <strong style={{ fontSize: '0.82rem', color: gold, marginTop: 2 }}>{faceShape} Contours</strong>
                        </div>

                        <div style={{ background: 'var(--ai-card-subtle)', padding: '10px 12px', borderRadius: 12, border: '1px solid var(--ai-border)', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <span style={{ fontSize: '0.6rem', color: 'var(--ai-text-secondary)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Glow Index</span>
                          <strong style={{ fontSize: '0.82rem', color: successGreen, marginTop: 2 }}>{isAnalyzingTwin ? '...' : `${twinResult.glowIndex || 8.8}/10`}</strong>
                        </div>

                      </div>
                      
                      <div style={{ marginTop: 16, borderTop: '1px dashed var(--ai-border)', paddingTop: 12 }}>
                        <p style={{ fontSize: '0.72rem', color: 'var(--ai-text-secondary)', margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.45 }}>
                          {isAnalyzingTwin ? (
                            'AI is running diagnostics...'
                          ) : (
                            <>
                              <span style={{ color: gold, fontWeight: 700 }}>Bridal Intelligence Alert: </span>
                              Target the remaining <strong style={{ color: gold }}>{100 - twinResult.readinessScore}%</strong> readiness by scheduling your South Delhi hydrafacial trial.
                            </>
                          )}
                        </p>
                      </div>

                    </div>
                  </div>

                </div>

                {/* ── SECOND ROW: ANALYSIS RESULTS ── */}
                <div style={{ marginBottom: 32 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                    <div style={{ width: 3, height: 20, background: gold, borderRadius: 4 }} />
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: 'var(--ai-text)', margin: 0 }}>AI Analysis Results</h2>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
                    {[
                      { icon: Droplets, label: 'Skin Profile', items: ['Hydration Score: 72%', 'Pigmentation: 34%', 'Glow Index: 8.8/10'], color: '#5B9BD5' },
                      { icon: Zap, label: 'Hair Profile', items: ['Texture: 2C Curly', 'Porosity: High', 'Strength: 78%'], color: gold },
                      { icon: Eye, label: 'Face Shape', items: ['Oval: 28%', 'Round: 15%', 'Heart: 82%', 'Diamond: 22%'], color: '#D4737A' },
                      { icon: Heart, label: 'Wedding Beauty Score', items: [`Readiness: ${twinResult.readinessScore}%`, 'Skin Prep: On Track', 'Hair: Needs Care'], color: successGreen },
                    ].map(card => (
                      <motion.div key={card.label} style={{ ...glassCard, padding: 16 }} whileHover={{ y: -3, borderColor: gold }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: `rgba(212,175,55,0.08)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <card.icon size={16} style={{ color: card.color }} />
                          </div>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ai-text)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{card.label}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {card.items.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', color: 'var(--ai-text-secondary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                              <Gem size={8} style={{ color: gold, opacity: 0.6 }} />
                              {item}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* ── THIRD ROW: AI RECOMMENDATIONS ── */}
                <div style={{ marginBottom: 32 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                    <div style={{ width: 3, height: 20, background: gold, borderRadius: 4 }} />
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: 'var(--ai-text)', margin: 0 }}>AI Recommendations</h2>
                  </div>
                  <motion.div style={{ ...glassCard, padding: 16, ...glowBox, background: `linear-gradient(135deg, ${'var(--ai-card)'}, rgba(212,175,55,0.03))` }} whileHover={{ borderColor: gold }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1fr', gap: 24 }}>
                      <div>
                        <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.85rem', fontWeight: 600, color: gold, marginBottom: 12 }}>Recommended Treatments</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {['Hydrafacial — ₹3,500', 'Deep Conditioning — ₹1,800', 'Bridal Facial — ₹5,000', 'Threading & Shaping — ₹500'].map((t, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'var(--ai-card-subtle)', borderRadius: 8, border: `1px solid ${'var(--ai-border)'}` }}>
                              <div style={{ width: 24, height: 24, borderRadius: 6, background: `rgba(212,175,55,0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: gold }}>✦</div>
                              <span style={{ fontSize: '0.78rem', color: 'var(--ai-text)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.85rem', fontWeight: 600, color: gold, marginBottom: 12 }}>Suggested Facials</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {['Gold Radiance Facial', 'OxyGeneo Glow', 'HydraFacial MD', 'Vitamin C Boost'].map((f, i) => (
                            <div key={i} style={{ fontSize: '0.75rem', color: 'var(--ai-text-secondary)', fontFamily: "'Plus Jakarta Sans', sans-serif", padding: '4px 0', borderBottom: `1px solid ${'var(--ai-border)'}` }}>✦ {f}</div>
                          ))}
                        </div>
                        <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.85rem', fontWeight: 600, color: gold, margin: '16px 0 12px' }}>Hair Care Routine</h3>
                        <div style={{ fontSize: '0.75rem', color: 'var(--ai-text-secondary)', fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.6 }}>
                          Apply coconut + argan oil mask twice weekly. Use sulfate-free shampoo. Schedule keratin treatment 2 weeks before the wedding.
                        </div>
                      </div>
                      <div>
                        <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.85rem', fontWeight: 600, color: gold, marginBottom: 12 }}>Bridal Makeup Prep Plan</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {[
                            { day: 'Day 1-14', text: 'Hydration boost & Vitamin C serum' },
                            { day: 'Day 15-30', text: 'Weekly facials & SPF routine' },
                            { day: 'Day 31-60', text: 'Trial makeup & patch testing' },
                            { day: 'Day 61-90', text: 'Final glow protocol' },
                          ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 12px', background: 'var(--ai-card-subtle)', borderRadius: 8, border: `1px solid ${'var(--ai-border)'}` }}>
                              <Clock size={12} style={{ color: gold, marginTop: 2, flexShrink: 0 }} />
                              <div>
                                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: gold, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.day}</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--ai-text-secondary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.text}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div style={{ marginTop: 12, padding: '10px 14px', background: `rgba(212,175,55,0.06)`, borderRadius: 10, border: `1px solid rgba(212,175,55,0.15)`, display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Star size={14} style={{ color: gold }} />
                          <span style={{ fontSize: '0.72rem', color: 'var(--ai-text)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Beauty actions for next <strong style={{ color: gold }}>90 days</strong></span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* ── FOURTH ROW: LOOKBOOK ── */}
                <div style={{ marginBottom: 32 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                    <div style={{ width: 3, height: 20, background: gold, borderRadius: 4 }} />
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: 'var(--ai-text)', margin: 0 }}>AI Lookbook Generator</h2>
                  </div>
                  <motion.div style={{ ...glassCard, padding: 16, ...glowBox }} whileHover={{ borderColor: gold }}>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                      {Object.keys(looksData).map((lookName) => (
                        <motion.button key={lookName} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          onClick={() => { setSelectedLook(lookName); setActiveTab('lookbook'); }}
                          style={{ padding: '8px 16px', borderRadius: 10, border: `1px solid var(--ai-border)`, background: 'var(--ai-card-subtle)', color: 'var(--ai-text)', fontWeight: 650, cursor: 'pointer', fontSize: '0.75rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {lookName}
                        </motion.button>
                      ))}
                    </div>
                    
                    {/* Lookbook photography replacing color gradients */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
                      {[
                        { name: 'Royal Bridal', sub: 'Heritage red & gold look', img: '/digital_twin_portrait.png' },
                        { name: 'Minimal Luxury', sub: 'Soft dewy ivory look', img: '/recommend_salon2.png' },
                        { name: 'Reception Glam', sub: 'Modern champagne gloss', img: '/recommend_salon1.png' },
                        { name: 'Pastel Princess', sub: 'Floral blush rose look', img: '/countdown_bride.png' },
                        { name: 'Traditional Red', sub: 'Classic zardozi lehenga look', img: '/bridal_lehenga.png' }
                      ].map((look, i) => (
                        <motion.div key={i} style={{ borderRadius: 14, overflow: 'hidden', cursor: 'pointer', border: `1px solid var(--ai-border)`, position: 'relative', height: 160 }} whileHover={{ y: -4, boxShadow: `0 8px 30px rgba(212,175,55,0.15)` }}>
                          <img src={look.img} alt={look.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, zIndex: 1 }} />
                          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,15,18,0.9) 0%, rgba(15,15,18,0.3) 60%, transparent 100%)', zIndex: 2 }} />
                          <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 12, zIndex: 3, textAlign: 'left' }}>
                            <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(5, 5, 5, 0.65)', backdropFilter: 'blur(8px)', padding: '3px 8px', borderRadius: 6, fontSize: '0.55rem', color: 'var(--ai-gold)', fontWeight: 600, border: '1px solid rgba(212, 175, 55, 0.2)' }}>AI</div>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFF', fontFamily: "'Playfair Display', serif" }}>{look.name}</span>
                            <span style={{ fontSize: '0.6rem', color: '#A5A5AA', fontFamily: "'Plus Jakarta Sans', sans-serif", marginTop: 2 }}>{look.sub}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* ── FIFTH ROW: BUDGET OPTIMIZER PREVIEW ── */}
                <div style={{ marginBottom: 32 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 3, height: 20, background: gold, borderRadius: 4 }} />
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: 'var(--ai-text)', margin: 0 }}>Budget Optimizer Preview</h2>
                  </div>
                  <motion.div style={{ ...glassCard, padding: 16, ...glowBox }} whileHover={{ borderColor: gold }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, alignItems: 'center' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--ai-text-secondary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Total Budget</span>
                          <span style={{ fontSize: '1.5rem', fontWeight: 700, color: gold, fontFamily: "'Playfair Display', serif" }}>₹{budgetVal.toLocaleString('en-IN')}</span>
                        </div>
                        <input type="range" min="50000" max="500000" step="10000" value={budgetVal} onChange={(e) => setBudgetVal(Number(e.target.value))} style={{ width: '100%', height: 6, appearance: 'none', background: `linear-gradient(to right, ${gold} 0%, ${gold} ${(budgetVal/500000)*100}%, var(--ai-border) ${(budgetVal/500000)*100}%, var(--ai-border) 100%)`, borderRadius: 4, outline: 'none', cursor: 'pointer', marginBottom: 16 }} />
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {[
                            { label: 'Clinical Prep', val: breakdown.skincare, pct: 25, color: '#5B9BD5' },
                            { label: 'Hair Sculpting', val: breakdown.hair, pct: 16, color: gold },
                            { label: 'HD Bridal Makeup', val: breakdown.makeup, pct: 47, color: '#D4737A' },
                          ].map(item => (
                            <div key={item.label}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2, fontSize: '0.72rem' }}>
                                <span style={{ color: 'var(--ai-text)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.label}</span>
                                <span style={{ color: gold, fontWeight: 600 }}>₹{item.val.toLocaleString('en-IN')} ({item.pct}%)</span>
                              </div>
                              <div style={{ width: '100%', height: 4, background: 'var(--ai-border)', borderRadius: 2, overflow: 'hidden' }}>
                                <motion.div style={{ width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: 2 }} initial={{ width: 0 }} animate={{ width: `${item.pct}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <div style={{ position: 'relative', width: 150, height: 150 }}>
                          <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                            {[
                              { pct: 47, color: '#D4737A', offset: 0 },
                              { pct: 25, color: '#5B9BD5', offset: 47 },
                              { pct: 16, color: gold, offset: 72 },
                              { pct: 7, color: successGreen, offset: 88 },
                              { pct: 5, color: '#C9A0DC', offset: 95 },
                            ].map((seg, i) => {
                              const r = 38;
                              const circ = 2 * Math.PI * r;
                              const dash = (seg.pct / 100) * circ;
                              const dashOffset = -(seg.offset / 100) * circ;
                              return (
                                <circle key={i} cx="50" cy="50" r={r} fill="none" stroke={seg.color} strokeWidth={9}
                                  strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={dashOffset} strokeLinecap="round"
                                />
                              );
                            })}
                          </svg>
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.52rem', color: 'var(--ai-text-secondary)', fontFamily: "'Plus Jakarta Sans', sans-serif", textTransform: 'uppercase' }}>Ratio</span>
                            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: gold, fontFamily: "'Playfair Display', serif" }}>AI Model</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                </div>

              </motion.div>
            )}

            {/* ══════════════════════════════════════════ */}
            {/* TAB 2: TIMELINE */}
            {/* ══════════════════════════════════════════ */}
            {activeTab === 'timeline' && (
              <motion.div key="timeline" variants={contentVariants} initial="initial" animate="animate" exit="exit">
                <TabHeader 
                  category="Beauty Timeline"
                  title="Bridal Beauty Timeline"
                  icon={Calendar}
                  subtitle="Your personalized beauty countdown to the big day."
                />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                  <div style={{ ...glassCard, padding: 16, display: 'inline-flex', alignItems: 'center', gap: 16 }}>
                    <Clock size={18} style={{ color: gold }} />
                    <div>
                      <span style={{ fontSize: '0.6rem', color: 'var(--ai-text-secondary)', display: 'block', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Days Remaining</span>
                      <strong style={{ fontSize: '1.3rem', color: gold, fontFamily: "'Playfair Display', serif" }}>{timelineCountdown}</strong>
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'relative', paddingLeft: 30 }}>
                  <div style={{ position: 'absolute', top: 10, bottom: 10, left: 10, width: 2, background: `linear-gradient(180deg, ${gold}, rgba(212,175,55,0.15))` }} />
                  {[
                    { title: 'Initial Consultation', status: 'Completed', sub: 'AI mapping, baseline analysis.', color: successGreen },
                    { title: 'Skin Prep & Hydrafacials', status: 'Active', sub: 'Moisture locking, keratin treatments.', color: gold },
                    { title: 'Pre-Wedding Trials', status: '', sub: 'Lehenga-matching trials, nail extensions.', color: 'var(--ai-border)' },
                    { title: 'Wedding Week Radiance', status: '', sub: 'Final glow facial, Mehendi prep.', color: 'var(--ai-border)' },
                  ].map((item, i) => (
                    <motion.div key={i} style={{ ...glassCard, padding: 16, position: 'relative', marginLeft: 10 }} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
                      <div style={{ position: 'absolute', left: -27, top: 16, width: 14, height: 14, borderRadius: '50%', background: item.color, border: `3px solid ${'var(--ai-bg)'}` }} />
                      <h4 style={{ fontSize: '0.9rem', color: 'var(--ai-text)', fontFamily: "'Plus Jakarta Sans', sans-serif", display: 'flex', alignItems: 'center', gap: 10 }}>
                        {item.title}
                        {item.status && <span style={{ fontSize: '0.6rem', padding: '2px 10px', borderRadius: 20, background: `rgba(212,175,55,0.1)`, color: gold, fontWeight: 600 }}>{item.status}</span>}
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--ai-text-secondary)', fontFamily: "'Plus Jakarta Sans', sans-serif", margin: 0 }}>{item.sub}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════ */}
            {/* TAB 3: LEHENGA MATCHER */}
            {/* ══════════════════════════════════════════ */}
            {activeTab === 'lehenga' && (
              <motion.div key="lehenga" variants={contentVariants} initial="initial" animate="animate" exit="exit">
                <TabHeader 
                  category="Lehenga Matcher"
                  title="AI Lehenga Makeup Matcher"
                  icon={Scissors}
                  subtitle="Select your lehenga color and embroidery — AI will generate a full makeup and jewellery coordination palette."
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <div style={{ ...glassCard, padding: 16 }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--ai-text)', fontWeight: 600, display: 'block', marginBottom: 12, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Lehenga Color</label>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                      {['Crimson Red', 'Pastel Pink', 'Mustard Yellow', 'Velvet Navy'].map(c => (
                        <button key={c} onClick={() => updateLehengaRecs(c, lehengaEmbroidery)}
                          style={{ padding: '8px 16px', borderRadius: 10, border: lehengaColor === c ? `2px solid ${gold}` : `1px solid ${'var(--ai-border)'}`, background: lehengaColor === c ? `rgba(212,175,55,0.08)` : 'var(--ai-card-subtle)', fontWeight: 600, cursor: 'pointer', fontSize: '0.75rem', fontFamily: "'Plus Jakarta Sans', sans-serif", color: lehengaColor === c ? gold : 'var(--ai-text-secondary)' }}>
                          {c}
                        </button>
                      ))}
                    </div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--ai-text)', fontWeight: 600, display: 'block', marginBottom: 12, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Embroidery Style</label>
                    <select value={lehengaEmbroidery} onChange={(e) => updateLehengaRecs(lehengaColor, e.target.value)} style={{ ...inputStyle, marginBottom: 16 }}>
                      <option>Zardozi</option><option>Gota Patti</option><option>Chikankari</option><option>Spangles & Sequins</option>
                    </select>
                    <div style={{ height: 160, borderRadius: 14, overflow: 'hidden', position: 'relative', border: `1px solid ${'var(--ai-border)'}` }}>
                      <PremiumImage src={IMAGES.lehenga} alt="Lehenga" height="100%" overlay={false} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.5), transparent)', display: 'flex', alignItems: 'flex-end', padding: 14, color: '#FFF', fontWeight: 600, fontSize: '0.8rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {lehengaColor} · {lehengaEmbroidery}
                      </div>
                    </div>
                  </div>
                  
                  <motion.div style={{ ...glassCard, padding: 16 }} key={lehengaResult.lookName} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                      <span style={{ fontSize: '0.6rem', padding: '3px 10px', borderRadius: 20, background: `rgba(212,175,55,0.1)`, color: gold, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AI Match</span>
                      <h4 style={{ fontSize: '1rem', color: 'var(--ai-text)', fontFamily: "'Playfair Display', serif" }}>{isMatchingLehenga ? 'Matching Look...' : lehengaResult.lookName}</h4>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.85rem' }}>
                      {[['Lip Color', isMatchingLehenga ? 'AI Matching...' : lehengaResult.lipShade], ['Eye Makeup', isMatchingLehenga ? 'AI Matching...' : lehengaResult.eyeMakeup], ['Hairstyle', isMatchingLehenga ? 'AI Matching...' : lehengaResult.hairstyle], ['Jewellery', isMatchingLehenga ? 'AI Matching...' : lehengaResult.jewellery]].map(([l, v]) => (
                        <div key={l} style={{ borderBottom: `1px solid ${'var(--ai-border)'}`, paddingBottom: 10 }}>
                          <span style={{ fontSize: '0.65rem', fontWeight: 700, color: gold, textTransform: 'uppercase', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{l}</span>
                          <p style={{ color: 'var(--ai-text-secondary)', fontWeight: 500, marginTop: 2, fontSize: '0.82rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{v}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════ */}
            {/* TAB 4: FACE SHAPE */}
            {/* ══════════════════════════════════════════ */}
            {activeTab === 'faceshape' && (
              <motion.div key="faceshape" variants={contentVariants} initial="initial" animate="animate" exit="exit">
                <TabHeader 
                  category="Face Shape Analyzer"
                  title="Face Shape Analyzer"
                  icon={Smile}
                  subtitle="Computer vision analysis that maps your facial structure and recommends tailored contouring, hairstyles, and jewellery."
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <div style={{ ...glassCard, padding: 16 }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--ai-text)', fontWeight: 600, marginBottom: 12, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Biometric Scan</div>
                    <div style={{ borderRadius: 14, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `radial-gradient(circle at 50% 50%, rgba(212,175,55,0.04), transparent)`, height: 260, position: 'relative', border: `1px solid ${'var(--ai-border)'}` }}>
                      <FaceShapeGrid size={200} />
                      <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'var(--ai-card)', backdropFilter: 'blur(12px)', color: 'var(--ai-text)', padding: '6px 14px', borderRadius: 8, fontSize: '0.7rem', fontFamily: "'Plus Jakarta Sans', sans-serif", border: `1px solid ${'var(--ai-border)'}` }}>
                        Shape: <strong style={{ color: gold }}>{faceShape}</strong>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                      {['Oval', 'Round', 'Heart', 'Square'].map(s => (
                        <button key={s} onClick={() => setFaceShape(s)}
                          style={{ flex: 1, padding: '8px 4px', borderRadius: 8, border: faceShape === s ? `2px solid ${gold}` : `1px solid ${'var(--ai-border)'}`, background: faceShape === s ? `rgba(212,175,55,0.08)` : 'transparent', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", color: faceShape === s ? gold : 'var(--ai-text-secondary)' }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <motion.div style={{ ...glassCard, padding: 16 }} key={faceShape} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <h4 style={{ fontSize: '1rem', color: 'var(--ai-text)', fontFamily: "'Playfair Display', serif" }}>Analysis Results</h4>
                      <span style={{ fontSize: '0.6rem', padding: '3px 10px', borderRadius: 20, background: `rgba(212,175,55,0.1)`, color: gold, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>82% Match</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.85rem' }}>
                      {[['Contouring', isAnalyzingFace ? 'Analyzing with AI...' : faceShapeResult.contour], ['Hairstyle', isAnalyzingFace ? 'Analyzing with AI...' : faceShapeResult.hair], ['Jewellery', isAnalyzingFace ? 'Analyzing with AI...' : faceShapeResult.jewelry], ['Makeup Balance', isAnalyzingFace ? 'Analyzing with AI...' : faceShapeResult.makeup]].map(([l, v]) => (
                        <div key={l} style={{ borderBottom: `1px solid ${'var(--ai-border)'}`, paddingBottom: 8 }}>
                          <strong style={{ color: gold, display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', marginBottom: 2, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{l}</strong>
                          <p style={{ color: 'var(--ai-text-secondary)', fontSize: '0.82rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{v}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════ */}
            {/* TAB 5: LOOKBOOK */}
            {/* ══════════════════════════════════════════ */}
            {activeTab === 'lookbook' && (
              <motion.div key="lookbook" variants={contentVariants} initial="initial" animate="animate" exit="exit">
                <TabHeader 
                  category="Wedding Lookbook Generator"
                  title="Wedding Lookbook Generator"
                  icon={Image}
                  subtitle="Browse curated looks for each wedding style, tailored to your face shape and skin profile."
                />

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                  {Object.keys(looksData).map(lookKey => (
                    <motion.button key={lookKey} onClick={() => setSelectedLook(lookKey)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      style={{ padding: '8px 16px', borderRadius: 10, border: selectedLook === lookKey ? 'none' : `1px solid var(--ai-border)`, background: selectedLook === lookKey ? gold : 'var(--ai-card-subtle)', color: selectedLook === lookKey ? 'var(--text-white)' : 'var(--ai-text-secondary)', fontWeight: 650, cursor: 'pointer', fontSize: '0.78rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {lookKey}
                    </motion.button>
                  ))}
                </div>

                <motion.div style={{ ...glassCard, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }} key={selectedLook} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  
                  {/* Photo-based Event Preview */}
                  <div style={{ height: 340, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 24, overflow: 'hidden' }}>
                    <img src={looksData[selectedLook].img} alt={selectedLook} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, zIndex: 1 }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,15,18,0.95) 0%, rgba(15,15,18,0.3) 50%, transparent 100%)', zIndex: 2 }} />
                    
                    <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(5, 5, 5, 0.65)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: 8, fontSize: '0.6rem', fontWeight: 600, color: 'var(--ai-gold)', border: '1px solid rgba(212,175,55,0.2)', zIndex: 10 }}>AI Render</div>
                    
                    <div style={{ position: 'relative', zIndex: 5, textAlign: 'left' }}>
                      <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 1, color: 'var(--ai-gold)', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{selectedLook} Look</span>
                      <h4 style={{ fontSize: '1.6rem', fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#FFF', marginTop: 4, marginBottom: 0 }}>{looksData[selectedLook].name}</h4>
                      <p style={{ fontSize: '0.78rem', color: '#A5A5AA', marginTop: 2, marginBottom: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{looksData[selectedLook].sub}</p>
                    </div>
                  </div>

                  <div style={{ padding: 16, textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <span style={{ color: gold, fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Specifications</span>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--ai-text)', fontFamily: "'Playfair Display', serif", marginTop: 4, marginBottom: 16 }}>{selectedLook} Breakdown</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.82rem' }}>
                      {[
                        ['Lip Palette', looksData[selectedLook].lip],
                        ['Eye Shading', looksData[selectedLook].eye],
                        ['Hair Styling', looksData[selectedLook].hair],
                        ['Jewellery Match', looksData[selectedLook].jewellery],
                        ['Theme Accent', looksData[selectedLook].accent]
                      ].map(([l, v]) => (
                        <div key={l} style={{ display: 'flex', borderBottom: `1px solid var(--ai-border)`, paddingBottom: 6 }}>
                          <span style={{ width: 110, fontWeight: 600, color: 'var(--ai-text)', fontSize: '0.78rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{l}</span>
                          <span style={{ color: 'var(--ai-text-secondary)', fontSize: '0.78rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════ */}
            {/* TAB 6: BUDGET */}
            {/* ══════════════════════════════════════════ */}
            {activeTab === 'budget' && (
              <motion.div key="budget" variants={contentVariants} initial="initial" animate="animate" exit="exit">
                <TabHeader 
                  category="Beauty Budget Optimizer"
                  title="Beauty Budget Optimizer"
                  icon={Percent}
                  subtitle="Adjust your total budget and watch the AI dynamically allocate resources across all beauty services."
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 24 }}>
                  
                  {/* Left Column: Interactive Calculator & Savings */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div style={{ ...glassCard, padding: 16 }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--ai-text)', fontWeight: 700, display: 'block', marginBottom: 12, fontFamily: "'Plus Jakarta Sans', sans-serif", textTransform: 'uppercase', letterSpacing: 0.5 }}>Target Budget</label>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--ai-text-secondary)' }}>₹50K</span>
                        <strong style={{ fontSize: '1.6rem', color: gold, fontFamily: "'Playfair Display', serif" }}>₹{budgetVal.toLocaleString('en-IN')}</strong>
                        <span style={{ fontSize: '0.72rem', color: 'var(--ai-text-secondary)' }}>₹5L</span>
                      </div>
                      <input type="range" min="50000" max="500000" step="10000" value={budgetVal} onChange={(e) => setBudgetVal(Number(e.target.value))} style={{ width: '100%', height: 6, appearance: 'none', background: `linear-gradient(to right, ${gold} 0%, ${gold} ${(budgetVal/500000)*100}%, var(--ai-border) ${(budgetVal/500000)*100}%, var(--ai-border) 100%)`, borderRadius: 4, outline: 'none', cursor: 'pointer', marginBottom: 20 }} />
                      
                      <div style={{ background: `rgba(212,175,55,0.05)`, padding: 12, borderRadius: 12, border: `1px solid rgba(212,175,55,0.2)` }}>
                        <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: gold, textTransform: 'uppercase', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Savings Suggestion</span>
                        <p style={{ fontSize: '0.78rem', color: 'var(--ai-text-secondary)', marginTop: 4, marginBottom: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          Book skin & hair as a combined bundle to unlock <strong style={{ color: gold }}>15% discount (saves ₹{(budgetVal * 0.15).toLocaleString('en-IN')})</strong> at top South Delhi studios.
                        </p>
                      </div>
                    </div>

                    <div style={{ ...glassCard, padding: 16 }}>
                      <h4 style={{ fontSize: '0.85rem', color: 'var(--ai-text)', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>AI Savings Recommendations</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ background: 'var(--ai-card-subtle)', padding: 10, borderRadius: 8, border: '1px solid var(--ai-border)' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: gold, display: 'block' }}>HD vs Airbrush Makeup</span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--ai-text-secondary)', marginTop: 2, display: 'block' }}>Recommended: Standard HD Makeup over Premium Airbrush will save ₹25,000 without compromising high-resolution photography.</span>
                        </div>
                        <div style={{ background: 'var(--ai-card-subtle)', padding: 10, borderRadius: 8, border: '1px solid var(--ai-border)' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: gold, display: 'block' }}>Pre-wedding Skin Prep Packages</span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--ai-text-secondary)', marginTop: 2, display: 'block' }}>Opt for a 3-month timeline package rather than session-by-session booking. Saves up to ₹12,000 on Hydrafacials.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Allocation Breakdown & Circular chart */}
                  <div style={{ ...glassCard, padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <h4 style={{ fontSize: '0.85rem', color: 'var(--ai-text)', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>AI Allocation Breakdown</h4>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, alignItems: 'center' }}>
                      
                      {/* Breakdown lines */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.8rem' }}>
                        {[
                          { label: 'Bridal Makeup', val: breakdown.makeup, pct: 47, color: '#D4737A', badge: 'Dior Approved' },
                          { label: 'Clinical Skincare', val: breakdown.skincare, pct: 25, color: '#5B9BD5', badge: 'Clinical Grade' },
                          { label: 'Hair Couture', val: breakdown.hair, pct: 16, color: gold, badge: 'Sassoon Ratio' },
                          { label: 'Nails & Lashes', val: breakdown.nails, pct: 5, color: '#C9A0DC', badge: 'Modern Chic' },
                          { label: 'SOS Emergency', val: breakdown.emergency, pct: 7, color: successGreen, badge: 'Safety Buffer' },
                        ].map(item => (
                          <div key={item.label}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                              <span style={{ color: 'var(--ai-text-secondary)', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                                {item.label}
                                <span style={{ fontSize: '0.52rem', color: gold, background: 'rgba(212,175,55,0.08)', padding: '1px 5px', borderRadius: 4, letterSpacing: 0.3, textTransform: 'uppercase', fontWeight: 600 }}>{item.badge}</span>
                              </span>
                              <strong style={{ color: 'var(--ai-text)', fontSize: '0.72rem' }}>₹{item.val.toLocaleString('en-IN')}</strong>
                            </div>
                            <div style={{ width: '100%', height: 4, background: 'var(--ai-border)', borderRadius: 2, overflow: 'hidden' }}>
                              <motion.div style={{ width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: 2 }} initial={{ width: 0 }} animate={{ width: `${item.pct}%` }} transition={{ duration: 1 }} />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Large Circular chart */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(212,175,55,0.05)', filter: 'blur(30px)', zIndex: 0 }} />
                        <div style={{ position: 'relative', width: 210, height: 210, zIndex: 5 }}>
                          <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                            {[
                              { pct: 47, color: '#D4737A', offset: 0 },
                              { pct: 25, color: '#5B9BD5', offset: 47 },
                              { pct: 16, color: gold, offset: 72 },
                              { pct: 7, color: successGreen, offset: 88 },
                              { pct: 5, color: '#C9A0DC', offset: 95 },
                            ].map((seg, i) => {
                              const r = 38;
                              const circ = 2 * Math.PI * r;
                              const dash = (seg.pct / 100) * circ;
                              const dashOffset = -(seg.offset / 100) * circ;
                              return (
                                <circle key={i} cx="50" cy="50" r={r} fill="none" stroke={seg.color} strokeWidth={9}
                                  strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={dashOffset} strokeLinecap="round"
                                />
                              );
                            })}
                          </svg>
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.65rem', color: 'var(--ai-text-secondary)', fontFamily: "'Plus Jakarta Sans', sans-serif", textTransform: 'uppercase', letterSpacing: 0.5 }}>Total Allocation</span>
                            <span style={{ fontSize: '1.6rem', fontWeight: 700, color: gold, fontFamily: "'Playfair Display', serif" }}>100%</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════ */}
            {/* ══════════════════════════════════════════ */}
            {/* TAB 7: SOS */}
            {/* ══════════════════════════════════════════ */}
            {activeTab === 'emergency' && (
              <motion.div key="emergency" variants={contentVariants} initial="initial" animate="animate" exit="exit">
                <TabHeader 
                  category="Emergency · 24/7 AI Concierge"
                  title="Bridal SOS Co-Pilot"
                  icon={HeartPulse}
                  subtitle="AI-powered emergency diagnostics for last-minute skin and beauty crises — available 24/7 for Delhi NCR brides."
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <div style={{ ...glassCard, padding: 16, display: 'flex', flexDirection: 'column', minHeight: 380 }}>
                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.8rem', marginBottom: 12 }}>
                      {sosHistory.map((msg, i) => (
                        msg.from === 'bot' ? (
                          msg.text.includes('Analyzing') ? (
                            <motion.div key={i} style={{ color: gold, fontStyle: 'italic', fontSize: '0.78rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                              {msg.text}
                            </motion.div>
                          ) : (
                            <div key={i} style={{ background: 'var(--ai-card-subtle)', padding: 12, borderRadius: 12, borderTopLeftRadius: 2, alignSelf: 'flex-start', maxWidth: '85%', border: `1px solid ${'var(--ai-border)'}` }}>
                              <strong style={{ color: gold, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>SOS Bot:</strong> <span style={{ color: 'var(--ai-text-secondary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{msg.text}</span>
                            </div>
                          )
                        ) : (
                          <div key={i} style={{ background: `rgba(212,175,55,0.1)`, color: 'var(--ai-text)', padding: 12, borderRadius: 12, borderTopRightRadius: 2, alignSelf: 'flex-end', maxWidth: '85%', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {msg.text}
                          </div>
                        )
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 10, borderTop: `1px solid ${'var(--ai-border)'}`, paddingTop: 12 }}>
                      <input type="text" placeholder="Describe your emergency..." value={sosMsg} onChange={e => setSosMsg(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleSosSubmit(); }} disabled={isSosAnalyzing}
                        style={{ ...inputStyle, flex: 1 }} />
                      <motion.button style={{ background: `linear-gradient(135deg, ${gold}, ${softGold})`, border: 'none', borderRadius: 12, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => handleSosSubmit()} disabled={isSosAnalyzing}
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Send size={16} style={{ color: 'var(--text-white)' }} />
                      </motion.button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div style={{ ...glassCard, padding: 16 }}>
                      <h4 style={{ fontSize: '0.85rem', color: 'var(--ai-text)', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 14 }}>Expert Remedies</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <motion.div style={{ display: 'flex', alignItems: 'center', gap: 12 }} whileHover={{ x: 4 }}>
                          <SpotEraserSVG size={44} />
                          <div><h5 style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ai-text)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Precision Spot Eraser</h5><span style={{ fontSize: '0.6rem', padding: '2px 8px', borderRadius: 10, background: `rgba(212,175,55,0.1)`, color: gold, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Clinical Grade</span></div>
                        </motion.div>
                        <motion.div style={{ display: 'flex', alignItems: 'center', gap: 12 }} whileHover={{ x: 4 }}>
                          <div style={{ width: 44, height: 44, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', background: 'var(--ai-card-subtle)' }}>🧊</div>
                          <div><h5 style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ai-text)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Cryo-Soothe Compress</h5><span style={{ fontSize: '0.6rem', padding: '2px 8px', borderRadius: 10, background: `rgba(212,175,55,0.1)`, color: gold, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Rapid Relief</span></div>
                        </motion.div>
                      </div>
                    </div>
                    <div style={{ ...glassCard, padding: 16 }}>
                      <h4 style={{ fontSize: '0.85rem', color: 'var(--ai-text)', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 12 }}>24-Hour Recovery Plan</h4>
                      <div style={{ fontSize: '0.78rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        <div style={{ marginBottom: 10 }}><strong style={{ color: gold }}>1. Cold Compress (Now)</strong><p style={{ fontSize: '0.72rem', color: 'var(--ai-text-secondary)', marginTop: 2 }}>Ice wrapped in muslin — 5 minutes. Do not squeeze.</p></div>
                        <div><strong style={{ color: gold }}>2. Hydration Lock (12h)</strong><p style={{ fontSize: '0.72rem', color: 'var(--ai-text-secondary)', marginTop: 2 }}>Switch to alkaline water and use a silk pillowcase.</p></div>
                      </div>
                    </div>
                    <motion.div style={{ ...glassCard, padding: 16, display: 'flex', alignItems: 'center', gap: 12, border: `1px solid rgba(212,175,55,0.15)` }} whileHover={{ borderColor: gold }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${gold}, ${softGold})`, display: 'flex', color: 'var(--text-white)' }}><Phone size={16} style={{ margin: 'auto' }} /></div>
                      <div style={{ flex: 1 }}>
                        <strong style={{ fontSize: '0.78rem', color: 'var(--ai-text)', display: 'block', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Need a human consultant?</strong>
                        <span style={{ fontSize: '0.68rem', color: 'var(--ai-text-secondary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Connect with a South Delhi bridal expert immediately.</span>
                      </div>
                      <motion.button style={{ background: `linear-gradient(135deg, ${gold}, ${softGold})`, border: 'none', borderRadius: 10, padding: '8px 16px', color: 'var(--text-white)', fontWeight: 700, fontSize: '0.7rem', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleStartCall}>Call Now</motion.button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════ */}
            {/* TAB 8: COPILOT */}
            {/* ══════════════════════════════════════════ */}
            {activeTab === 'copilot' && (
              <motion.div key="copilot" variants={contentVariants} initial="initial" animate="animate" exit="exit" style={{ display: 'flex', flexDirection: 'column', minHeight: 500 }}>
                <TabHeader 
                  category="AI Wedding Beauty Copilot"
                  title="AI Wedding Beauty Copilot"
                  icon={MessageCircle}
                  subtitle="Ask about budget, products, routines, or timeline — your personal beauty assistant is here."
                />

                <div style={{ flex: 1, ...glassCard, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 300, maxHeight: 340 }}>
                  <AnimatePresence>
                    {chatHistory.map((msg, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.2 }}
                        style={{ maxWidth: '80%', padding: '10px 14px', borderRadius: 14, fontSize: '0.8rem', lineHeight: 1.6, alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', background: msg.sender === 'user' ? `linear-gradient(135deg, ${gold}, ${softGold})` : 'var(--ai-card-subtle)', color: msg.sender === 'user' ? 'var(--text-white)' : 'var(--ai-text)', borderTopRightRadius: msg.sender === 'user' ? 2 : 14, borderTopLeftRadius: msg.sender === 'ai' ? 2 : 14, whiteSpace: 'pre-line', border: msg.sender === 'ai' ? `1px solid ${'var(--ai-border)'}` : 'none', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {msg.text}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {isTyping && (
                    <motion.div style={{ alignSelf: 'flex-start', background: 'var(--ai-card-subtle)', color: 'var(--ai-text-secondary)', padding: '10px 14px', borderRadius: 14, fontSize: '0.8rem', borderTopLeftRadius: 2, fontFamily: "'Plus Jakarta Sans', sans-serif", border: `1px solid ${'var(--ai-border)'}` }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <span style={{ display: 'inline-block', animation: 'pulse-soft 1s infinite' }}>Typing...</span>
                    </motion.div>
                  )}
                </div>
                <form onSubmit={handleChatSubmit} style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                  <input type="text" placeholder="Ask about budget, skincare, or timelines..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                  <motion.button type="submit" style={{ background: `linear-gradient(135deg, ${gold}, ${softGold})`, border: 'none', borderRadius: 12, padding: '12px 24px', color: 'var(--text-white)', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Send size={16} />
                  </motion.button>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* SOS Interactive Calling Screen Modal */}
      {showCallModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(5, 5, 5, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--ai-card)', border: '1px solid var(--ai-border)', width: '380px', borderRadius: 24, padding: 32, boxShadow: 'var(--ai-glow), var(--ai-shadow)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: gold, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Noor 24/7 Concierge</div>
            
            {/* Avatar calling animation */}
            <div style={{ position: 'relative', width: 100, height: 100, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {callState === 'dialing' && (
                <>
                  <motion.div animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }} transition={{ repeat: Infinity, duration: 2 }} style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `2px solid ${gold}` }} />
                  <motion.div animate={{ scale: [1, 2.2, 1], opacity: [0.4, 0, 0.4] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }} style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `1.5px solid ${softGold}` }} />
                </>
              )}
              {callState === 'connected' && (
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ position: 'absolute', inset: -10, borderRadius: '50%', border: `2px solid ${successGreen}`, opacity: 0.2 }} />
              )}
              <img src="/ priya_profile.png" alt="Concierge" onError={e => e.target.src = '/priya_profile.png'} style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${callState === 'connected' ? successGreen : gold}`, zIndex: 5 }} />
            </div>

            {/* Calling Status */}
            <h4 style={{ margin: '0 0 6px 0', color: 'var(--ai-text)', fontFamily: "'Playfair Display', serif", fontSize: '1.25rem' }}>Dr. Ananya (Concierge)</h4>
            <div style={{ fontSize: '0.8rem', color: callState === 'connected' ? successGreen : gold, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: callState === 'connected' ? successGreen : gold, display: 'inline-block' }} />
              {callState === 'dialing' && 'DIALING...'}
              {callState === 'connected' && `CONNECTED (${Math.floor(callDuration / 60)}:${String(callDuration % 60).padStart(2, '0')})`}
              {callState === 'ended' && 'CALL ENDED'}
            </div>

            {/* Transcripts visualizer box */}
            <div style={{ width: '100%', background: 'var(--ai-card-subtle)', border: '1px solid var(--ai-border)', borderRadius: 16, height: 180, padding: 12, overflowY: 'auto', marginBottom: 28, textAlign: 'left', boxSizing: 'border-box' }}>
              {callTranscripts.length === 0 ? (
                <div style={{ color: 'var(--ai-text-secondary)', fontSize: '0.72rem', fontStyle: 'italic', textAlign: 'center', marginTop: 70, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {callState === 'dialing' ? 'Connecting to secure line...' : 'Listening...'}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {callTranscripts.map((t, idx) => (
                    <div key={idx} style={{ fontSize: '0.72rem', lineHeight: 1.4, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      <strong style={{ color: t.speaker === 'You' ? gold : successGreen }}>{t.speaker}:</strong>{' '}
                      <span style={{ color: 'var(--ai-text-secondary)' }}>{t.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Audio wave simulation */}
            {callState === 'connected' && (
              <div style={{ display: 'flex', gap: 3, alignItems: 'center', height: 20, marginBottom: 28 }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                  <motion.div key={i} animate={{ height: [4, Math.random() * 20 + 4, 4] }} transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }} style={{ width: 3, background: successGreen, borderRadius: 2 }} />
                ))}
              </div>
            )}

            {/* Hangup button */}
            <motion.button onClick={handleEndCall} style={{ background: '#e74c3c', border: 'none', borderRadius: '50%', width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 8px 24px rgba(231,76,60,0.3)' }} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
              <Phone size={20} style={{ color: 'var(--text-white)', transform: 'rotate(135deg)' }} />
            </motion.button>
          </div>
        </div>
      )}
    </section>
  );
}
