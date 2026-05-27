import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const TICKER = ['Render', 'MongoDB Atlas', 'Cloudinary', 'Resend', 'Supabase', 'Paystack', 'Railway', 'Firebase', 'Vercel', 'Auth0']

export default function Landing() {
  const navigate = useNavigate()
  const [tickIdx, setTickIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setTickIdx(i => (i + 1) % TICKER.length)
        setVisible(true)
      }, 300)
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={styles.page}>
      {/* Grid background */}
      <div style={styles.grid} />

      {/* Nav */}
      <nav style={styles.nav}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>$</span>
          <span style={styles.logoText}>DevBudget</span>
        </div>
        <div style={styles.navLinks}>
          <a href="https://github.com" target="_blank" style={styles.navLink}>GitHub ↗</a>
        </div>
      </nav>

      {/* Hero */}
      <main style={styles.hero}>
        <div style={styles.badge}>
          <span style={styles.badgeDot} />
          Free & Open Source
        </div>

        <h1 style={styles.headline}>
          Stop guessing what<br />
          <span style={styles.highlight}>
            <span style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.3s' }}>
              {TICKER[tickIdx]}
            </span>
          </span>
          <br />
          will cost you.
        </h1>

        <p style={styles.sub}>
          Answer 5 questions. Get a real cost breakdown across every popular service — 
          at any scale. Built for developers, especially those of us in Africa.
        </p>

        <div style={styles.ctaRow}>
          <button style={styles.ctaBtn} onClick={() => navigate('/calculator')}>
            Calculate my stack →
          </button>
          <span style={styles.ctaNote}>Takes 30 seconds. No signup.</span>
        </div>

        {/* Features row */}
        <div style={styles.features}>
          {[
            { icon: '⚡', text: 'Real pricing data' },
            { icon: '📊', text: 'Scale simulation' },
            { icon: '🌍', text: 'Africa-aware flags' },
            { icon: '🔗', text: 'Shareable results' },
          ].map((f, i) => (
            <div key={i} style={styles.feat}>
              <span style={styles.featIcon}>{f.icon}</span>
              <span style={styles.featText}>{f.text}</span>
            </div>
          ))}
        </div>
      </main>

      {/* Preview card */}
      <div style={styles.previewWrap}>
        <div style={styles.previewCard}>
          <div style={styles.previewHeader}>
            <span style={styles.previewTitle}>Your stack estimate</span>
            <span style={styles.previewBadge}>1,000 users</span>
          </div>
          {[
            { cat: 'Storage', service: 'Cloudinary', cost: '$0', tag: 'Free tier', safe: true },
            { cat: 'Email', service: 'Resend', cost: '$0', tag: 'Free tier', safe: true },
            { cat: 'Hosting', service: 'Render', cost: '$7', tag: 'Starter', safe: true },
            { cat: 'Database', service: 'MongoDB Atlas', cost: '$0', tag: 'M0 Free', safe: true },
            { cat: 'Payments', service: 'Paystack', cost: '1.5%', tag: '🇳🇬 Recommended', safe: true },
          ].map((row, i) => (
            <div key={i} style={styles.previewRow}>
              <div style={styles.previewLeft}>
                <span style={styles.previewCat}>{row.cat}</span>
                <span style={styles.previewService}>{row.service}</span>
              </div>
              <div style={styles.previewRight}>
                <span style={row.safe ? styles.previewTagSafe : styles.previewTagWarn}>{row.tag}</span>
                <span style={styles.previewCost}>{row.cost}</span>
              </div>
            </div>
          ))}
          <div style={styles.previewTotal}>
            <span>Est. monthly total</span>
            <span style={styles.previewTotalAmt}>$7 / mo</span>
          </div>
        </div>
      </div>

      {/* Africa section */}
      <section style={styles.africaSection}>
        <div style={styles.africaInner}>
          <div style={styles.africaTag}>🌍 Made for African developers</div>
          <h2 style={styles.africaTitle}>
            Some tools don't tell you they won't work in Nigeria.
          </h2>
          <p style={styles.africaSub}>
            DevBudget surfaces restrictions, card requirements, and better local alternatives 
            before you waste time integrating a service that won't accept your card.
          </p>
          <div style={styles.africaExamples}>
            {[
              { service: 'Stripe', warn: true, note: 'Nigerian devs cannot create accounts directly' },
              { service: 'Fly.io', warn: true, note: 'Requires international card for free tier' },
              { service: 'Paystack', warn: false, note: 'Built for Nigeria. Works perfectly.' },
              { service: 'Resend', warn: false, note: 'Works with Nigerian cards. Developer-friendly.' },
            ].map((ex, i) => (
              <div key={i} style={{ ...styles.africaEx, borderColor: ex.warn ? 'rgba(255,107,53,0.3)' : 'rgba(0,255,136,0.3)', background: ex.warn ? 'rgba(255,107,53,0.05)' : 'rgba(0,255,136,0.05)' }}>
                <div style={styles.africaExTop}>
                  <span style={ex.warn ? styles.africaWarnDot : styles.africaSafeDot} />
                  <span style={styles.africaExService}>{ex.service}</span>
                </div>
                <p style={styles.africaExNote}>{ex.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA bottom */}
      <section style={styles.bottomCta}>
        <h2 style={styles.bottomTitle}>Ready to know what you're building into?</h2>
        <button style={styles.ctaBtn} onClick={() => navigate('/calculator')}>
          Start calculating →
        </button>
        <p style={styles.bottomNote}>Free forever. Open source. No signup required.</p>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <span style={styles.footerLogo}>DevBudget</span>
        <span style={styles.footerNote}>Built by a developer, for developers 🌍</span>
        <a href="https://github.com" target="_blank" style={styles.footerLink}>GitHub ↗</a>
      </footer>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', position: 'relative', overflow: 'hidden' },
  grid: {
    position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
    backgroundImage: `linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)`,
    backgroundSize: '60px 60px',
  },
  nav: {
    position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', padding: '24px 48px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  logo: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoIcon: {
    fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: '500',
    color: 'var(--accent)', background: 'var(--accent-dim)',
    padding: '4px 10px', borderRadius: '6px',
    border: '1px solid rgba(0,255,136,0.2)',
  },
  logoText: { fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: '700', letterSpacing: '-0.5px' },
  navLinks: { display: 'flex', gap: '24px' },
  navLink: { color: 'var(--text-muted)', fontSize: '14px', fontFamily: 'var(--font-mono)', transition: 'color 0.2s' },
  hero: {
    position: 'relative', zIndex: 1, maxWidth: '860px',
    margin: '0 auto', padding: '100px 48px 60px', textAlign: 'center',
    animation: 'fadeUp 0.8s ease forwards',
  },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    background: 'var(--accent-dim)', border: '1px solid rgba(0,255,136,0.2)',
    borderRadius: '100px', padding: '6px 16px', fontSize: '13px',
    fontFamily: 'var(--font-mono)', color: 'var(--accent)', marginBottom: '32px',
  },
  badgeDot: {
    width: '6px', height: '6px', borderRadius: '50%',
    background: 'var(--accent)', animation: 'pulse 2s infinite',
    display: 'inline-block',
  },
  headline: {
    fontFamily: 'var(--font-display)', fontSize: 'clamp(42px, 6vw, 80px)',
    fontWeight: '800', lineHeight: 1.05, letterSpacing: '-2px',
    marginBottom: '28px', color: 'var(--text)',
  },
  highlight: {
    color: 'var(--accent)',
    textShadow: '0 0 40px rgba(0,255,136,0.4)',
    display: 'inline-block', minWidth: '320px',
  },
  sub: {
    fontSize: '18px', color: 'var(--text-muted)', maxWidth: '600px',
    margin: '0 auto 40px', lineHeight: 1.7,
  },
  ctaRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '60px' },
  ctaBtn: {
    background: 'var(--accent)', color: '#000', fontFamily: 'var(--font-display)',
    fontWeight: '700', fontSize: '16px', padding: '16px 36px',
    borderRadius: '100px', cursor: 'pointer', transition: 'all 0.2s',
    animation: 'glow 3s ease infinite',
    boxShadow: '0 0 30px rgba(0,255,136,0.3)',
  },
  ctaNote: { color: 'var(--text-dim)', fontSize: '14px', fontFamily: 'var(--font-mono)' },
  features: { display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' },
  feat: {
    display: 'flex', alignItems: 'center', gap: '8px',
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: '100px', padding: '8px 18px',
  },
  featIcon: { fontSize: '14px' },
  featText: { fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' },
  previewWrap: { display: 'flex', justifyContent: 'center', padding: '0 48px 80px', position: 'relative', zIndex: 1 },
  previewCard: {
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '600px',
    boxShadow: '0 0 60px rgba(0,255,136,0.05), 0 20px 60px rgba(0,0,0,0.5)',
  },
  previewHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  previewTitle: { fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '16px' },
  previewBadge: {
    background: 'var(--blue-dim)', color: 'var(--blue)', border: '1px solid rgba(77,159,255,0.2)',
    borderRadius: '100px', padding: '4px 12px', fontSize: '12px', fontFamily: 'var(--font-mono)',
  },
  previewRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '14px 0', borderBottom: '1px solid var(--border)',
  },
  previewLeft: { display: 'flex', flexDirection: 'column', gap: '2px' },
  previewCat: { fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1px' },
  previewService: { fontSize: '15px', fontWeight: '500' },
  previewRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  previewTagSafe: {
    background: 'var(--safe-dim)', color: 'var(--safe)',
    border: '1px solid rgba(0,255,136,0.2)', borderRadius: '100px',
    padding: '3px 10px', fontSize: '11px', fontFamily: 'var(--font-mono)',
  },
  previewTagWarn: {
    background: 'var(--warn-dim)', color: 'var(--warn)',
    border: '1px solid rgba(255,107,53,0.2)', borderRadius: '100px',
    padding: '3px 10px', fontSize: '11px', fontFamily: 'var(--font-mono)',
  },
  previewCost: { fontFamily: 'var(--font-mono)', fontWeight: '500', fontSize: '15px', color: 'var(--accent)', minWidth: '50px', textAlign: 'right' },
  previewTotal: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: '20px', color: 'var(--text-muted)', fontSize: '14px',
  },
  previewTotalAmt: { fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: '800', color: 'var(--accent)' },
  africaSection: {
    position: 'relative', zIndex: 1, padding: '80px 48px',
    borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
    background: 'linear-gradient(180deg, transparent, rgba(255,107,53,0.03), transparent)',
  },
  africaInner: { maxWidth: '860px', margin: '0 auto', textAlign: 'center' },
  africaTag: {
    display: 'inline-block', background: 'rgba(255,107,53,0.1)',
    border: '1px solid rgba(255,107,53,0.2)', color: 'var(--warn)',
    borderRadius: '100px', padding: '6px 16px', fontSize: '13px',
    fontFamily: 'var(--font-mono)', marginBottom: '24px',
  },
  africaTitle: {
    fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 48px)',
    fontWeight: '800', letterSpacing: '-1.5px', marginBottom: '16px', lineHeight: 1.1,
  },
  africaSub: { color: 'var(--text-muted)', maxWidth: '540px', margin: '0 auto 40px', lineHeight: 1.7 },
  africaExamples: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', textAlign: 'left' },
  africaEx: { border: '1px solid', borderRadius: '12px', padding: '16px' },
  africaExTop: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' },
  africaWarnDot: { width: '8px', height: '8px', borderRadius: '50%', background: 'var(--warn)', flexShrink: 0 },
  africaSafeDot: { width: '8px', height: '8px', borderRadius: '50%', background: 'var(--safe)', flexShrink: 0 },
  africaExService: { fontWeight: '600', fontSize: '15px' },
  africaExNote: { fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 },
  bottomCta: {
    position: 'relative', zIndex: 1,
    textAlign: 'center', padding: '100px 48px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px',
  },
  bottomTitle: { fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '800', letterSpacing: '-1.5px', maxWidth: '600px' },
  bottomNote: { color: 'var(--text-dim)', fontSize: '14px', fontFamily: 'var(--font-mono)' },
  footer: {
    position: 'relative', zIndex: 1, borderTop: '1px solid var(--border)',
    padding: '28px 48px', display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', flexWrap: 'wrap', gap: '12px',
  },
  footerLogo: { fontFamily: 'var(--font-display)', fontWeight: '700', color: 'var(--text-muted)' },
  footerNote: { color: 'var(--text-dim)', fontSize: '13px' },
  footerLink: { color: 'var(--accent)', fontSize: '13px', fontFamily: 'var(--font-mono)' },
}
