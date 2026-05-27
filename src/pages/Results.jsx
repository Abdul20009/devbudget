import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import servicesData from '../data/services.json'

function getRecommendation(category, answers) {
  const data = servicesData[category]
  if (!data) return null

  const services = data.services.map(s => {
    let cost = 0
    let tierLabel = ''
    let isFree = false
    let hasWarning = false

    if (category === 'storage') {
      const gb = answers.storageGB || 1
      const tier = [...s.tiers].sort((a, b) => a.limitGB - b.limitGB).find(t => t.limitGB >= gb) || s.tiers[s.tiers.length - 1]
      cost = tier.price
      tierLabel = `${tier.limitGB}GB`
      isFree = cost === 0
    } else if (category === 'email') {
      const estimatedEmails = answers.userScale * 2
      const tier = [...s.tiers].sort((a, b) => a.limitEmails - b.limitEmails).find(t => t.limitEmails >= estimatedEmails) || s.tiers[s.tiers.length - 1]
      cost = tier.price
      tierLabel = `${tier.limitEmails.toLocaleString()}/mo`
      isFree = cost === 0
    } else if (category === 'hosting' || category === 'database' || category === 'auth') {
      const tier = s.tiers[0]
      cost = tier.price || 0
      tierLabel = tier.label || tier.note || ''
      isFree = cost === 0
    } else if (category === 'payments') {
      cost = 0
      tierLabel = s.tiers[0].note
      isFree = true
    }

    hasWarning = answers.isAfrica && s.africaRestrictions

    return {
      ...s,
      estimatedCost: cost,
      tierLabel,
      isFree,
      hasWarning,
    }
  })

  // Sort: no warnings first, then by cost
  services.sort((a, b) => {
    if (a.hasWarning !== b.hasWarning) return a.hasWarning ? 1 : -1
    return a.estimatedCost - b.estimatedCost
  })

  return {
    ...data,
    services,
    recommended: services[0],
  }
}

export default function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(null)

  const answers = location.state?.answers

  if (!answers) {
    navigate('/calculator')
    return null
  }

  const selectedServices = answers.services || []
  const results = {}
  let totalCost = 0

  // Always include hosting and database
  const categoriesToShow = [...new Set(['hosting', 'database', ...selectedServices])]

  categoriesToShow.forEach(cat => {
    if (servicesData[cat]) {
      const rec = getRecommendation(cat, answers)
      results[cat] = rec
      if (rec.recommended) totalCost += rec.recommended.estimatedCost
    }
  })

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const scaleLabel = answers.userScale >= 100000 ? '10,000+' :
    answers.userScale >= 10000 ? '1,000 – 10,000' :
    answers.userScale >= 1000 ? '100 – 1,000' : '0 – 100'

  const warningCount = Object.values(results).filter(r => r.recommended?.hasWarning).length

  return (
    <div style={styles.page}>
      <div style={styles.grid} />

      <nav style={styles.nav}>
        <div style={styles.logo} onClick={() => navigate('/')}>
          <span style={styles.logoIcon}>$</span>
          <span style={styles.logoText}>DevBudget</span>
        </div>
        <div style={styles.navActions}>
          <button style={styles.shareBtn} onClick={handleCopy}>
            {copied ? '✓ Copied!' : '🔗 Share results'}
          </button>
          <button style={styles.recalcBtn} onClick={() => navigate('/calculator')}>
            Recalculate
          </button>
        </div>
      </nav>

      <main style={styles.main}>
        {/* Summary */}
        <div style={styles.summary}>
          <div style={styles.summaryLeft}>
            <div style={styles.summaryLabel}>Estimated monthly cost</div>
            <div style={styles.summaryAmount}>
              ${totalCost.toFixed(0)}
              <span style={styles.summaryPer}>/mo</span>
            </div>
            <div style={styles.summaryMeta}>
              For ~{scaleLabel} users · {categoriesToShow.length} services
            </div>
          </div>
          <div style={styles.summaryRight}>
            <div style={styles.summaryBadges}>
              <div style={styles.summaryBadge}>
                <span style={styles.bdgNum}>{categoriesToShow.length}</span>
                <span style={styles.bdgLbl}>Services</span>
              </div>
              {warningCount > 0 && (
                <div style={{ ...styles.summaryBadge, ...styles.summaryBadgeWarn }}>
                  <span style={styles.bdgNum}>{warningCount}</span>
                  <span style={styles.bdgLbl}>⚠️ Flags</span>
                </div>
              )}
              {answers.isAfrica && (
                <div style={{ ...styles.summaryBadge, ...styles.summaryBadgeAfrica }}>
                  <span style={styles.bdgNum}>🌍</span>
                  <span style={styles.bdgLbl}>Africa Mode</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Africa warning banner */}
        {answers.isAfrica && warningCount > 0 && (
          <div style={styles.warnBanner}>
            <span style={styles.warnIcon}>⚠️</span>
            <div>
              <div style={styles.warnTitle}>{warningCount} service{warningCount > 1 ? 's' : ''} may have restrictions for African developers</div>
              <div style={styles.warnSub}>Look for the orange flags below. We've suggested alternatives where possible.</div>
            </div>
          </div>
        )}

        {/* Results grid */}
        <div style={styles.resultsGrid}>
          {Object.entries(results).map(([cat, data]) => {
            const rec = data.recommended
            const isExpanded = expanded === cat
            return (
              <div key={cat} style={{ ...styles.resultCard, ...(rec.hasWarning ? styles.resultCardWarn : {}) }}>
                <div style={styles.cardHeader}>
                  <div style={styles.cardLeft}>
                    <span style={styles.cardIcon}>{data.icon}</span>
                    <div>
                      <div style={styles.cardCat}>{data.label}</div>
                      <div style={styles.cardService}>{rec.name}</div>
                    </div>
                  </div>
                  <div style={styles.cardRight}>
                    {rec.hasWarning && (
                      <span style={styles.warnFlag}>⚠️ Restricted</span>
                    )}
                    {!rec.hasWarning && rec.isFree && (
                      <span style={styles.freeFlag}>✓ Free tier</span>
                    )}
                    <span style={styles.cardCost}>
                      {rec.estimatedCost === 0 ? 'Free' : `$${rec.estimatedCost}/mo`}
                    </span>
                  </div>
                </div>

                {/* Africa note */}
                {answers.isAfrica && (
                  <div style={{ ...styles.africaNote, ...(rec.hasWarning ? styles.africaNoteWarn : styles.africaNoteSafe) }}>
                    <span>{rec.hasWarning ? '⚠️' : '✅'}</span>
                    <span>{rec.africaNotes}</span>
                  </div>
                )}

                {/* Free tier info */}
                <div style={styles.freeTierInfo}>{rec.freeTier}</div>

                {/* Alternatives toggle */}
                <button style={styles.altToggle} onClick={() => setExpanded(isExpanded ? null : cat)}>
                  {isExpanded ? 'Hide alternatives ↑' : `See ${data.services.length - 1} alternatives ↓`}
                </button>

                {isExpanded && (
                  <div style={styles.altList}>
                    {data.services.slice(1).map(alt => (
                      <div key={alt.name} style={styles.altRow}>
                        <div style={styles.altLeft}>
                          <span style={styles.altName}>{alt.name}</span>
                          {alt.hasWarning && answers.isAfrica && (
                            <span style={styles.altWarnBadge}>⚠️ Restricted</span>
                          )}
                        </div>
                        <div style={styles.altRight}>
                          <span style={styles.altCost}>
                            {alt.estimatedCost === 0 ? 'Free' : `$${alt.estimatedCost}/mo`}
                          </span>
                          {alt.website && (
                            <a href={alt.website} target="_blank" style={styles.altLink}>↗</a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Scale comparison */}
        <div style={styles.scaleSection}>
          <h2 style={styles.scaleTitle}>How costs grow with scale</h2>
          <div style={styles.scaleGrid}>
            {[100, 1000, 10000, 100000].map(scale => {
              let scaledTotal = 0
              categoriesToShow.forEach(cat => {
                if (servicesData[cat]) {
                  const rec = getRecommendation(cat, { ...answers, userScale: scale })
                  if (rec.recommended) scaledTotal += rec.recommended.estimatedCost
                }
              })
              const isCurrentScale = scale === answers.userScale
              return (
                <div key={scale} style={{ ...styles.scaleCard, ...(isCurrentScale ? styles.scaleCardActive : {}) }}>
                  <div style={styles.scaleUsers}>{scale.toLocaleString()} users</div>
                  <div style={styles.scaleCost}>${scaledTotal.toFixed(0)}<span style={styles.scaleMo}>/mo</span></div>
                  {isCurrentScale && <div style={styles.scaleCurrentBadge}>Your estimate</div>}
                </div>
              )
            })}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={styles.disclaimer}>
          <span style={styles.disclaimerIcon}>ℹ️</span>
          Pricing data last verified May 2025. Always confirm current pricing on each service's website before making decisions. Estimates assume average usage patterns.
        </div>

        {/* CTA */}
        <div style={styles.cta}>
          <button style={styles.ctaBtn} onClick={handleCopy}>
            {copied ? '✓ Link copied!' : '🔗 Share this estimate'}
          </button>
          <button style={styles.ctaSecondary} onClick={() => navigate('/calculator')}>
            Recalculate →
          </button>
        </div>
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
    position: 'sticky', top: 0, zIndex: 100,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 48px', borderBottom: '1px solid var(--border)',
    background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(12px)',
  },
  logo: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' },
  logoIcon: {
    fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--accent)',
    background: 'var(--accent-dim)', padding: '3px 9px', borderRadius: '6px',
    border: '1px solid rgba(0,255,136,0.2)',
  },
  logoText: { fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: '700' },
  navActions: { display: 'flex', gap: '12px' },
  shareBtn: {
    background: 'var(--accent-dim)', color: 'var(--accent)',
    border: '1px solid rgba(0,255,136,0.2)', borderRadius: '100px',
    padding: '8px 18px', fontSize: '13px', fontFamily: 'var(--font-mono)', cursor: 'pointer',
  },
  recalcBtn: {
    background: 'var(--bg3)', color: 'var(--text-muted)',
    border: '1px solid var(--border)', borderRadius: '100px',
    padding: '8px 18px', fontSize: '13px', fontFamily: 'var(--font-mono)', cursor: 'pointer',
  },
  main: { position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto', padding: '48px 24px 80px' },
  summary: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: '20px', padding: '32px 40px', marginBottom: '20px',
    boxShadow: '0 0 60px rgba(0,255,136,0.05)',
    flexWrap: 'wrap', gap: '20px',
    animation: 'fadeUp 0.5s ease forwards',
  },
  summaryLeft: {},
  summaryLabel: { fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' },
  summaryAmount: { fontFamily: 'var(--font-display)', fontSize: '56px', fontWeight: '800', color: 'var(--accent)', letterSpacing: '-2px', lineHeight: 1 },
  summaryPer: { fontSize: '20px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' },
  summaryMeta: { color: 'var(--text-dim)', fontSize: '13px', fontFamily: 'var(--font-mono)', marginTop: '8px' },
  summaryRight: {},
  summaryBadges: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  summaryBadge: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: '12px', padding: '14px 20px', minWidth: '80px',
  },
  summaryBadgeWarn: { background: 'var(--warn-dim)', border: '1px solid rgba(255,107,53,0.2)' },
  summaryBadgeAfrica: { background: 'rgba(77,159,255,0.08)', border: '1px solid rgba(77,159,255,0.2)' },
  bdgNum: { fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '22px' },
  bdgLbl: { fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px' },
  warnBanner: {
    display: 'flex', alignItems: 'flex-start', gap: '14px',
    background: 'var(--warn-dim)', border: '1px solid rgba(255,107,53,0.25)',
    borderRadius: '12px', padding: '18px 24px', marginBottom: '20px',
  },
  warnIcon: { fontSize: '20px', flexShrink: 0 },
  warnTitle: { fontWeight: '600', fontSize: '14px', color: 'var(--warn)', marginBottom: '4px' },
  warnSub: { fontSize: '13px', color: 'var(--text-muted)' },
  resultsGrid: { display: 'grid', gap: '12px', marginBottom: '40px' },
  resultCard: {
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: '16px', padding: '24px',
    animation: 'fadeUp 0.5s ease forwards',
    transition: 'all 0.2s',
  },
  resultCardWarn: { borderColor: 'rgba(255,107,53,0.3)', background: 'rgba(255,107,53,0.03)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' },
  cardLeft: { display: 'flex', alignItems: 'center', gap: '14px' },
  cardIcon: { fontSize: '28px' },
  cardCat: { fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' },
  cardService: { fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '18px' },
  cardRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  warnFlag: {
    background: 'var(--warn-dim)', color: 'var(--warn)',
    border: '1px solid rgba(255,107,53,0.2)', borderRadius: '100px',
    padding: '4px 12px', fontSize: '12px', fontFamily: 'var(--font-mono)',
  },
  freeFlag: {
    background: 'var(--safe-dim)', color: 'var(--safe)',
    border: '1px solid rgba(0,255,136,0.2)', borderRadius: '100px',
    padding: '4px 12px', fontSize: '12px', fontFamily: 'var(--font-mono)',
  },
  cardCost: { fontFamily: 'var(--font-mono)', fontWeight: '500', fontSize: '20px', color: 'var(--accent)' },
  africaNote: {
    display: 'flex', gap: '8px', alignItems: 'flex-start',
    borderRadius: '8px', padding: '10px 14px', fontSize: '13px',
    marginBottom: '10px', lineHeight: 1.5,
  },
  africaNoteSafe: { background: 'var(--safe-dim)', color: 'var(--text-muted)' },
  africaNoteWarn: { background: 'var(--warn-dim)', color: 'var(--text-muted)' },
  freeTierInfo: { fontSize: '13px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginBottom: '14px' },
  altToggle: {
    background: 'none', border: 'none', color: 'var(--text-dim)',
    fontSize: '13px', fontFamily: 'var(--font-mono)', cursor: 'pointer',
    padding: '0', transition: 'color 0.2s',
  },
  altList: { marginTop: '14px', borderTop: '1px solid var(--border)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' },
  altRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  altLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  altName: { fontSize: '14px', color: 'var(--text-muted)' },
  altWarnBadge: {
    background: 'var(--warn-dim)', color: 'var(--warn)',
    borderRadius: '100px', padding: '2px 8px', fontSize: '11px',
    fontFamily: 'var(--font-mono)',
  },
  altRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  altCost: { fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--text-muted)' },
  altLink: { color: 'var(--accent)', fontSize: '13px', fontFamily: 'var(--font-mono)' },
  scaleSection: { marginBottom: '32px' },
  scaleTitle: { fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '20px', marginBottom: '16px', letterSpacing: '-0.5px' },
  scaleGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' },
  scaleCard: {
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: '14px', padding: '20px', textAlign: 'center',
  },
  scaleCardActive: { border: '1px solid var(--accent)', background: 'var(--accent-dim)' },
  scaleUsers: { fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-dim)', marginBottom: '8px' },
  scaleCost: { fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '28px', color: 'var(--accent)' },
  scaleMo: { fontSize: '14px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' },
  scaleCurrentBadge: {
    marginTop: '8px', background: 'var(--accent)', color: '#000',
    borderRadius: '100px', padding: '2px 10px', fontSize: '11px',
    fontFamily: 'var(--font-mono)', fontWeight: '600', display: 'inline-block',
  },
  disclaimer: {
    display: 'flex', gap: '10px', alignItems: 'flex-start',
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: '10px', padding: '14px 18px',
    fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)',
    marginBottom: '32px', lineHeight: 1.6,
  },
  disclaimerIcon: { flexShrink: 0 },
  cta: { display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' },
  ctaBtn: {
    background: 'var(--accent)', color: '#000', fontFamily: 'var(--font-display)',
    fontWeight: '700', fontSize: '15px', padding: '14px 32px',
    borderRadius: '100px', cursor: 'pointer',
  },
  ctaSecondary: {
    background: 'var(--bg2)', color: 'var(--text)',
    border: '1px solid var(--border)', fontFamily: 'var(--font-display)',
    fontWeight: '600', fontSize: '15px', padding: '14px 32px',
    borderRadius: '100px', cursor: 'pointer',
  },
}
