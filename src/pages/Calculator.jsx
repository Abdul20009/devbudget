import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STEPS = [
  {
    id: 'appType',
    question: 'What are you building?',
    sub: 'This helps us recommend the right services for your use case.',
    options: [
      { value: 'mobile', label: 'Mobile App', icon: '📱', desc: 'Flutter, React Native, native' },
      { value: 'web', label: 'Web App', icon: '🌐', desc: 'React, Vue, Next.js, etc.' },
      { value: 'saas', label: 'SaaS Product', icon: '🚀', desc: 'Subscription-based software' },
      { value: 'api', label: 'API / Backend Only', icon: '⚙️', desc: 'Headless or microservice' },
    ]
  },
  {
    id: 'userScale',
    question: 'Expected users in first 6 months?',
    sub: 'Your best guess is fine — you can always recalculate later.',
    options: [
      { value: 100, label: '0 – 100', icon: '🌱', desc: 'Just launching, testing' },
      { value: 1000, label: '100 – 1,000', icon: '🌿', desc: 'Early traction' },
      { value: 10000, label: '1,000 – 10,000', icon: '🌳', desc: 'Growing product' },
      { value: 100000, label: '10,000+', icon: '🏔️', desc: 'Scaling up' },
    ]
  },
  {
    id: 'services',
    question: 'Which services do you need?',
    sub: 'Select all that apply to your stack.',
    multi: true,
    options: [
      { value: 'storage', label: 'File/Image Storage', icon: '🗄️', desc: 'Cloudinary, S3, Firebase Storage' },
      { value: 'email', label: 'Email Sending', icon: '📧', desc: 'Transactional emails, notifications' },
      { value: 'hosting', label: 'Backend Hosting', icon: '🖥️', desc: 'Deploy your Node.js, Express API' },
      { value: 'database', label: 'Database', icon: '🗃️', desc: 'MongoDB, Postgres, Firebase' },
      { value: 'payments', label: 'Payment Processing', icon: '💳', desc: 'Accept money from users' },
      { value: 'auth', label: 'Authentication', icon: '🔐', desc: 'Login, signup, sessions' },
    ]
  },
  {
    id: 'storageGB',
    question: 'How much file storage do you expect to use?',
    sub: 'Think about user uploads, images, documents.',
    options: [
      { value: 1, label: 'Under 5GB', icon: '📁', desc: 'Profile photos, small uploads' },
      { value: 10, label: '5 – 25GB', icon: '📂', desc: 'Moderate media uploads' },
      { value: 50, label: '25 – 100GB', icon: '💾', desc: 'Heavy media, videos' },
      { value: 200, label: '100GB+', icon: '🏗️', desc: 'Large scale storage needs' },
    ]
  },
  {
    id: 'isAfrica',
    question: 'Are you based in Africa?',
    sub: 'We\'ll flag services that don\'t work well for African developers — card restrictions, signup blockers, and local alternatives.',
    options: [
      { value: true, label: 'Yes, I\'m in Africa', icon: '🌍', desc: 'Nigeria, Ghana, Kenya, and more' },
      { value: false, label: 'No, outside Africa', icon: '🌎', desc: 'Rest of the world' },
    ]
  },
]

export default function Calculator() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({
    appType: null,
    userScale: null,
    services: [],
    storageGB: null,
    isAfrica: null,
  })

  const current = STEPS[step]
  const isMulti = current.multi

  // Skip storage question if storage not selected
  const getNextStep = (currentStep, currentAnswers) => {
    const next = currentStep + 1
    if (next < STEPS.length) {
      if (STEPS[next].id === 'storageGB' && !currentAnswers.services.includes('storage')) {
        return next + 1
      }
      return next
    }
    return null
  }

  const handleSelect = (value) => {
    if (isMulti) {
      const list = answers[current.id]
      const updated = list.includes(value) ? list.filter(v => v !== value) : [...list, value]
      setAnswers({ ...answers, [current.id]: updated })
    } else {
      const newAnswers = { ...answers, [current.id]: value }
      setAnswers(newAnswers)
      const next = getNextStep(step, newAnswers)
      if (next !== null && next < STEPS.length) {
        setTimeout(() => setStep(next), 300)
      } else {
        setTimeout(() => {
          navigate('/results', { state: { answers: newAnswers } })
        }, 300)
      }
    }
  }

  const handleMultiNext = () => {
    if (answers.services.length === 0) return
    const next = getNextStep(step, answers)
    if (next !== null && next < STEPS.length) {
      setStep(next)
    } else {
      navigate('/results', { state: { answers } })
    }
  }

  const isSelected = (value) => {
    if (isMulti) return answers[current.id].includes(value)
    return answers[current.id] === value
  }

  const progress = ((step) / STEPS.length) * 100

  return (
    <div style={styles.page}>
      <div style={styles.grid} />

      {/* Nav */}
      <nav style={styles.nav}>
        <div style={styles.logo} onClick={() => navigate('/')}>
          <span style={styles.logoIcon}>$</span>
          <span style={styles.logoText}>DevBudget</span>
        </div>
        <span style={styles.stepCount}>{step + 1} of {STEPS.length}</span>
      </nav>

      {/* Progress bar */}
      <div style={styles.progressTrack}>
        <div style={{ ...styles.progressBar, width: `${progress}%` }} />
      </div>

      {/* Content */}
      <main style={styles.main}>
        <div style={styles.card} key={step}>
          <div style={styles.stepBadge}>Step {step + 1}</div>
          <h1 style={styles.question}>{current.question}</h1>
          <p style={styles.sub}>{current.sub}</p>

          <div style={{ ...styles.options, gridTemplateColumns: current.options.length > 4 ? 'repeat(auto-fit, minmax(200px, 1fr))' : 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {current.options.map((opt) => (
              <button
                key={String(opt.value)}
                style={{
                  ...styles.option,
                  ...(isSelected(opt.value) ? styles.optionSelected : {}),
                }}
                onClick={() => handleSelect(opt.value)}
              >
                <span style={styles.optionIcon}>{opt.icon}</span>
                <span style={styles.optionLabel}>{opt.label}</span>
                <span style={styles.optionDesc}>{opt.desc}</span>
                {isSelected(opt.value) && <span style={styles.check}>✓</span>}
              </button>
            ))}
          </div>

          {isMulti && (
            <div style={styles.multiFooter}>
              <span style={styles.selectedCount}>
                {answers.services.length} selected
              </span>
              <button
                style={{ ...styles.nextBtn, opacity: answers.services.length === 0 ? 0.4 : 1 }}
                onClick={handleMultiNext}
                disabled={answers.services.length === 0}
              >
                Continue →
              </button>
            </div>
          )}
        </div>

        {step > 0 && (
          <button style={styles.backBtn} onClick={() => {
            const prev = step - 1
            // Skip storage step backwards if needed
            if (STEPS[prev].id === 'storageGB' && !answers.services.includes('storage')) {
              setStep(prev - 1)
            } else {
              setStep(prev)
            }
          }}>
            ← Back
          </button>
        )}
      </main>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', position: 'relative' },
  grid: {
    position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
    backgroundImage: `linear-gradient(rgba(0,255,136,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.02) 1px, transparent 1px)`,
    backgroundSize: '60px 60px',
  },
  nav: {
    position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', padding: '20px 48px',
    borderBottom: '1px solid var(--border)',
  },
  logo: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' },
  logoIcon: {
    fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--accent)',
    background: 'var(--accent-dim)', padding: '3px 9px', borderRadius: '6px',
    border: '1px solid rgba(0,255,136,0.2)',
  },
  logoText: { fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: '700' },
  stepCount: { fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-dim)' },
  progressTrack: { height: '2px', background: 'var(--border)', position: 'relative', zIndex: 10 },
  progressBar: { height: '100%', background: 'var(--accent)', transition: 'width 0.4s ease', boxShadow: '0 0 10px var(--accent-glow)' },
  main: {
    position: 'relative', zIndex: 1,
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '60px 24px 40px', minHeight: 'calc(100vh - 73px)',
  },
  card: {
    width: '100%', maxWidth: '800px',
    animation: 'fadeUp 0.4s ease forwards',
  },
  stepBadge: {
    fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent)',
    background: 'var(--accent-dim)', border: '1px solid rgba(0,255,136,0.2)',
    display: 'inline-block', padding: '4px 12px', borderRadius: '100px',
    marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px',
  },
  question: {
    fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)',
    fontWeight: '800', letterSpacing: '-1.5px', marginBottom: '12px', lineHeight: 1.1,
  },
  sub: { color: 'var(--text-muted)', marginBottom: '40px', maxWidth: '500px', lineHeight: 1.6 },
  options: {
    display: 'grid', gap: '12px',
  },
  option: {
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '20px 24px', textAlign: 'left',
    cursor: 'pointer', transition: 'all 0.2s', position: 'relative',
    display: 'flex', flexDirection: 'column', gap: '6px',
  },
  optionSelected: {
    border: '1px solid var(--accent)', background: 'var(--accent-dim)',
    boxShadow: '0 0 20px rgba(0,255,136,0.1)',
  },
  optionIcon: { fontSize: '24px', marginBottom: '4px' },
  optionLabel: { fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '16px', color: 'var(--text)' },
  optionDesc: { fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' },
  check: {
    position: 'absolute', top: '16px', right: '16px',
    background: 'var(--accent)', color: '#000', borderRadius: '50%',
    width: '22px', height: '22px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '12px', fontWeight: '700',
  },
  multiFooter: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginTop: '28px', paddingTop: '28px', borderTop: '1px solid var(--border)',
  },
  selectedCount: { fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '14px' },
  nextBtn: {
    background: 'var(--accent)', color: '#000', fontFamily: 'var(--font-display)',
    fontWeight: '700', fontSize: '15px', padding: '14px 32px', borderRadius: '100px',
    cursor: 'pointer', transition: 'all 0.2s',
  },
  backBtn: {
    marginTop: '24px', background: 'transparent', color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)', fontSize: '13px', cursor: 'pointer',
    border: 'none', padding: '8px',
  },
}
