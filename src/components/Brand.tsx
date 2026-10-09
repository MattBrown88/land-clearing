import { contractorConfig as config } from '../config/contractor'

/** Uses the contractor's logo if configured, otherwise a generated mark in their brand color. */
export function LogoMark({ size = 40 }: { size?: number }) {
  if (config.logoUrl) {
    return <img src={config.logoUrl} alt="" width={size} height={size} className="logo-img" />
  }
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" className="logo-mark">
      <rect width="40" height="40" rx="9" fill="var(--primary)" />
      <path d="M20 7l-7.5 11h3.8L11 25.5h5L12 31h16l-4-5.5h5L23.7 18h3.8z" fill="#fff" />
      <rect x="18.2" y="31" width="3.6" height="3" fill="#fff" />
      <rect x="8" y="34" width="24" height="2" rx="1" fill="var(--accent)" />
    </svg>
  )
}

/** Decorative pine tree line used along the bottom of the hero band. */
export function Treeline() {
  // Deterministic pseudo-random heights so the silhouette is stable between renders.
  const trees: string[] = []
  let x = -10
  let seed = 7
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
  while (x < 1450) {
    const w = 18 + rand() * 22
    const h = 30 + rand() * 60
    trees.push(`M${x} 100 L${x + w / 2} ${100 - h} L${x + w} 100 Z`)
    x += w * (0.45 + rand() * 0.35)
  }
  return (
    <svg className="treeline" viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true">
      <path d={trees.join(' ')} />
    </svg>
  )
}
