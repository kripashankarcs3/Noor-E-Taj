import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  CalendarDays,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react';
import './login-page.css';

const TRUST_ITEMS = [
  {
    icon: BrainCircuit,
    title: 'AI-Powered',
    subtitle: 'Beauty Intelligence',
  },
  {
    icon: BadgeCheck,
    title: 'Verified & Trusted',
    subtitle: 'Professionals',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Private',
    subtitle: 'Your Data is Safe',
  },
];

const DEFAULT_USER = {
  email: 'priya@example.com',
  password: 'noor2025',
  fullName: 'Priya Sharma',
  phone: '98765 43210',
  membership: 'Standard',
};

const HERO_STATS = [
  {
    icon: UsersRound,
    value: '10,000+',
    label: 'Happy Brides',
  },
  {
    icon: BadgeCheck,
    value: '500+',
    label: 'Verified Artists',
  },
  {
    icon: CalendarDays,
    value: '50,000+',
    label: 'Bookings',
  },
];

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="login-social__icon login-social__icon--apple">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.57 2.95-1.39" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="login-social__icon">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
    </svg>
  );
}

function CrownIcon() {
  return (
    <svg viewBox="0 0 44 32" aria-hidden="true" className="login-brand__crown">
      <path d="M22 2L28 14L38 6L34 24H10L6 6L16 14L22 2Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="6" cy="6" r="2.5" fill="currentColor" />
      <circle cx="22" cy="2" r="2.5" fill="currentColor" />
      <circle cx="38" cy="6" r="2.5" fill="currentColor" />
      <rect x="10" y="25" width="24" height="3" rx="1.5" fill="currentColor" />
    </svg>
  );
}

function buildProfile(foundUser) {
  let activeProfile = {
    fullName: foundUser.fullName || 'Priya Sharma',
    phone: foundUser.phone || '98765 43210',
    email: foundUser.email,
    gender: 'Female',
    occupation: 'Product Designer',
    dob: '1998-05-14',
    location: 'New Delhi',
    preferredLanguage: 'English',
    avatarImg: '/priya_profile.png',
    weddingDate: '2026-01-22',
    partnerName: 'Rahul Verma',
    weddingLocation: 'New Delhi',
    weddingBudget: 'Rs 4,25,000',
    skinType: 'Combination',
    hairTexture: 'Wavy',
    faceShape: 'Heart',
    specialistNotes: 'Requires gentle hydration treatments.',
    membership: foundUser.membership || 'Standard',
  };

  const existingProfile = localStorage.getItem('noor_profile');
  if (existingProfile) {
    try {
      const parsed = JSON.parse(existingProfile);
      activeProfile = { ...activeProfile, ...parsed };
    } catch {
      // Ignore malformed local storage and use defaults.
    }
  }

  activeProfile.fullName = foundUser.fullName;
  activeProfile.phone = foundUser.phone;
  activeProfile.email = foundUser.email;
  activeProfile.membership = foundUser.membership || 'Standard';
  return activeProfile;
}

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const toastTimerRef = useRef(null);

  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('noor_users');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fall through to the seeded default user.
    }

    localStorage.setItem('noor_users', JSON.stringify([DEFAULT_USER]));
    return [DEFAULT_USER];
  });

  useEffect(() => {
    const previousZoom = document.documentElement.style.zoom;
    document.documentElement.style.zoom = '1';

    return () => {
      document.documentElement.style.zoom = previousZoom;
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = (message) => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }

    setToast(message);
    toastTimerRef.current = window.setTimeout(() => {
      setToast('');
      toastTimerRef.current = null;
    }, 2200);
  };

  const handleLogin = (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    const userName = email.split('@')[0];
    const fakeUser = {
      email: email.toLowerCase(),
      password: password,
      fullName: userName,
      phone: '',
      membership: 'Standard',
    };
    localStorage.setItem('noor_logged_in', 'true');
    localStorage.setItem('noor_profile', JSON.stringify(buildProfile(fakeUser)));
    showToast('Login successful. Welcome back.');
    window.setTimeout(() => {
      onLoginSuccess();
    }, 800);
  };

  const handleRegister = (event) => {
    event.preventDefault();

    if (!regFullName.trim() || !regEmail.trim() || !regPassword.trim() || !regPhone.trim() || !regConfirmPassword.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const emailExists = users.some((user) => user.email.toLowerCase() === regEmail.toLowerCase());
    if (emailExists) {
      setError('This email address is already registered.');
      return;
    }

    const newUser = {
      email: regEmail.toLowerCase(),
      password: regPassword,
      fullName: regFullName.trim(),
      phone: regPhone.trim(),
      membership: 'Standard',
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('noor_users', JSON.stringify(updatedUsers));

    setRegFullName('');
    setRegEmail('');
    setRegPassword('');
    setRegConfirmPassword('');
    setRegPhone('');
    setError('');
    setIsRegistering(false);
    showToast('Account created. You can login now.');
  };

  const handleSocialLogin = (platform) => {
    showToast(`Connecting with ${platform}...`);
    const profile = {
      fullName: `${platform} User`,
      phone: '',
      email: `${platform.toLowerCase()}@user.com`,
      gender: 'Female',
      occupation: '',
      dob: '',
      location: 'New Delhi',
      preferredLanguage: 'English',
      avatarImg: '/priya_profile.png',
      weddingDate: '2026-01-22',
      partnerName: '',
      weddingLocation: 'New Delhi',
      weddingBudget: '',
      skinType: 'Combination',
      hairTexture: 'Wavy',
      faceShape: 'Heart',
      specialistNotes: '',
      membership: 'Standard',
    };
    localStorage.setItem('noor_profile', JSON.stringify(profile));
    window.setTimeout(() => {
      localStorage.setItem('noor_logged_in', 'true');
      onLoginSuccess();
    }, 1100);
  };

  const openRegisterModal = () => {
    setError('');
    setIsRegistering(true);
  };

  const closeRegisterModal = () => {
    setError('');
    setIsRegistering(false);
  };

  return (
    <div className="login-screen">
      <div className="login-screen__layout">
        <aside className="login-screen__hero">
          <div className="login-hero__media" aria-hidden="true">
            <img
              src="/login_bride_portrait_only.png"
              alt=""
              className="login-screen__hero-image"
            />
            <div className="login-hero__media-overlay" />
          </div>

          <div className="login-hero__content">
            <div className="login-brand">
              <CrownIcon />
              <h2 className="login-brand__title">NOOR-E-TAJ</h2>
              <p className="login-brand__subtitle">Delhi&apos;s Premium Bridal Beauty Marketplace</p>
              <div className="login-brand__ornament" aria-hidden="true">
                <span />
                <span className="login-brand__ornament-mark">✦</span>
                <span />
              </div>
            </div>

            <div className="login-hero__copy">
              <h1 className="login-hero__headline">
                Plan.
                <br />
                Book.
                <br />
                <span>
                  Glow.
                  <Sparkles className="login-hero__headline-mark" size={34} strokeWidth={1.8} />
                </span>
              </h1>
              <div className="login-hero__divider" aria-hidden="true">
                <span />
                <span className="login-hero__divider-mark">✦</span>
                <span />
              </div>
              <p className="login-hero__description">
                Your AI-powered
                <br />
                bridal journey
                <br />
                starts here.
              </p>
            </div>

            <div className="login-hero__footer">
              <div className="login-hero__stats">
                {HERO_STATS.map(({ icon: Icon, value, label }) => (
                  <div key={label} className="login-hero__stat">
                    <div className="login-hero__stat-icon">
                      <Icon size={20} strokeWidth={1.7} />
                    </div>
                    <div className="login-hero__stat-value">{value}</div>
                    <div className="login-hero__stat-label">{label}</div>
                  </div>
                ))}
              </div>

              <div className="login-hero__rating">
                <p className="login-hero__rating-label">Trusted by brides across Delhi NCR</p>
                <div className="login-hero__rating-row">
                  <div className="login-hero__stars" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} size={17} strokeWidth={1.9} fill="currentColor" />
                    ))}
                  </div>
                  <span className="login-hero__rating-score">4.9 (1200+ Reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="login-screen__panel">
          <div className="login-screen__panel-inner">
            <section className="login-card">
              <header className="login-card__header">
                <h1 className="login-card__title">
                  Welcome Back <Sparkles className="login-card__sparkle" size={30} strokeWidth={1.8} />
                </h1>
                <p className="login-card__subtitle">Continue your bridal journey</p>
                <div className="login-card__ornament" aria-hidden="true">
                  <span />
                  <span className="login-card__ornament-mark">❦</span>
                  <span />
                </div>
              </header>

              {error ? <div className="login-card__error">{error}</div> : null}

              <form className="login-form" onSubmit={handleLogin}>
                <label className="login-field">
                  <span className="login-field__label">Email Address</span>
                  <span className="login-field__control">
                    <Mail size={18} strokeWidth={1.8} />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </span>
                </label>

                <label className="login-field">
                  <span className="login-field__label">Password</span>
                  <span className="login-field__control">
                    <Lock size={18} strokeWidth={1.8} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                    <button
                      type="button"
                      className="login-field__toggle"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={18} strokeWidth={1.8} /> : <Eye size={18} strokeWidth={1.8} />}
                    </button>
                  </span>
                </label>

                <button
                  type="button"
                  className="login-form__forgot"
                  onClick={() => showToast('Password reset link sent to your email.')}
                >
                  Forgot Password?
                </button>

                <button type="submit" className="login-form__submit">
                  <span>Continue</span>
                  <ArrowRight size={20} strokeWidth={2.2} />
                </button>
              </form>

              <div className="login-card__divider" aria-hidden="true">
                <span />
                <p>or continue with</p>
                <span />
              </div>

              <div className="login-card__socials">
                <button type="button" className="login-social" onClick={() => handleSocialLogin('Google')}>
                  <GoogleIcon />
                  <span>Continue with Google</span>
                </button>
                <button type="button" className="login-social" onClick={() => handleSocialLogin('Apple')}>
                  <AppleIcon />
                  <span>Continue with Apple</span>
                </button>
              </div>

              <p className="login-card__signup">
                Don&apos;t have an account?{' '}
                <button type="button" className="login-card__signup-link" onClick={openRegisterModal}>
                  Create Account
                </button>
              </p>
            </section>

            <section className="login-trust" aria-label="Why brides trust Noor-E-Taj">
              {TRUST_ITEMS.map(({ icon: Icon, title, subtitle }) => (
                <div key={title} className="login-trust__item">
                  <div className="login-trust__icon">
                    <Icon size={21} strokeWidth={1.7} />
                  </div>
                  <p className="login-trust__title">{title}</p>
                  <p className="login-trust__subtitle">{subtitle}</p>
                </div>
              ))}
            </section>
          </div>
        </main>
      </div>

      {isRegistering ? (
        <div className="login-modal" role="dialog" aria-modal="true" aria-labelledby="register-title" onClick={closeRegisterModal}>
          <div className="login-modal__card" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="login-modal__close" onClick={closeRegisterModal} aria-label="Close registration form">
              <X size={18} strokeWidth={2} />
            </button>

            <div className="login-modal__header">
              <p className="login-modal__eyebrow">Noor-E-Taj</p>
              <h2 id="register-title">Create Your Bridal Account</h2>
              <p>Save planners, bookings, moodboards and expert recommendations in one place.</p>
            </div>

            {error ? <div className="login-card__error login-card__error--modal">{error}</div> : null}

            <form className="login-register" onSubmit={handleRegister}>
              <label className="login-field">
                <span className="login-field__label">Full Name</span>
                <span className="login-field__control">
                  <UserRound size={18} strokeWidth={1.8} />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    value={regFullName}
                    onChange={(event) => setRegFullName(event.target.value)}
                  />
                </span>
              </label>

              <label className="login-field">
                <span className="login-field__label">Email Address</span>
                <span className="login-field__control">
                  <Mail size={18} strokeWidth={1.8} />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    value={regEmail}
                    onChange={(event) => setRegEmail(event.target.value)}
                  />
                </span>
              </label>

              <label className="login-field">
                <span className="login-field__label">Phone Number</span>
                <span className="login-field__control">
                  <Phone size={18} strokeWidth={1.8} />
                  <input
                    type="tel"
                    placeholder="Enter your mobile number"
                    autoComplete="tel"
                    value={regPhone}
                    onChange={(event) => setRegPhone(event.target.value)}
                  />
                </span>
              </label>

              <label className="login-field">
                <span className="login-field__label">Password</span>
                <span className="login-field__control">
                  <Lock size={18} strokeWidth={1.8} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create password"
                    autoComplete="new-password"
                    value={regPassword}
                    onChange={(event) => setRegPassword(event.target.value)}
                  />
                </span>
              </label>

              <label className="login-field">
                <span className="login-field__label">Confirm Password</span>
                <span className="login-field__control">
                  <Lock size={18} strokeWidth={1.8} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                    value={regConfirmPassword}
                    onChange={(event) => setRegConfirmPassword(event.target.value)}
                  />
                </span>
              </label>

              <button type="submit" className="login-form__submit login-form__submit--register">
                <span>Create Account</span>
                <ArrowRight size={20} strokeWidth={2.2} />
              </button>
            </form>
          </div>
        </div>
      ) : null}

      {toast ? <div className="login-toast">{toast}</div> : null}
    </div>
  );
}
