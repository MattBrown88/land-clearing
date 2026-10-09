import { useState } from 'react'
import { contractorConfig as config } from '../config/contractor'
import { formatAcres, formatCurrency, formatDayRange, type Estimate, type Impact } from '../lib/estimate'
import type { FormValues } from '../lib/form'
import {
  ArrowLeftIcon,
  CameraIcon,
  CheckIcon,
  ClockIcon,
  MapPinIcon,
  MountainIcon,
  RulerIcon,
  ToolIcon,
  TreeIcon,
  TruckIcon,
} from './Icons'

interface Props {
  estimate: Estimate
  values: FormValues
  onEdit: () => void
}

const impactLabel: Record<Impact, string> = {
  lighter: 'Lighter work',
  standard: 'Standard',
  'adds-time': 'Adds time',
  major: 'Major factor',
}

const factorIcon: Record<string, typeof TreeIcon> = {
  Vegetation: TreeIcon,
  Terrain: MountainIcon,
  Access: TruckIcon,
  'Clearing Type': ToolIcon,
}

const calculationFactors = [
  { icon: RulerIcon, title: 'Acreage', text: 'The size of the area to be cleared.' },
  { icon: TreeIcon, title: 'Vegetation', text: 'How dense the growth is and the size of the trees.' },
  { icon: MountainIcon, title: 'Terrain', text: 'Slopes and ground conditions that slow equipment down.' },
  { icon: TruckIcon, title: 'Access', text: 'How easily our machines can reach the work area.' },
  { icon: ToolIcon, title: 'Type of clearing', text: 'Mulching, selective work, full clearing and more.' },
]

export function EstimateResult({ estimate, values, onEdit }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const firstName = values.name.trim().split(/\s+/)[0]

  const requestQuote = () => {
    setStatus('sending')
    // Demo only — nothing is sent. A real deployment would post to a form service, CRM or email here.
    window.setTimeout(() => setStatus('sent'), 900)
  }

  return (
    <div className="result">
      <div className="result-top">
        <button type="button" className="back-link" onClick={onEdit}>
          <ArrowLeftIcon width={16} height={16} />
          Edit project details
        </button>
        <span className="result-meta">
          <MapPinIcon width={15} height={15} />
          {values.location.trim()}
          {values.photo && (
            <>
              <span className="dot" aria-hidden="true" />
              <CameraIcon width={15} height={15} />
              Photo attached
            </>
          )}
        </span>
      </div>

      <p className="eyebrow">Your preliminary estimate</p>
      <h2 className="result-heading">Here’s what your project could look like, {firstName}.</h2>

      <div className="result-grid">
        <div className="price-panel">
          <span className="price-label">Estimated Price</span>
          <span className="price-value">
            {formatCurrency(estimate.priceLow)}
            <span className="price-dash"> – </span>
            {formatCurrency(estimate.priceHigh)}
          </span>
          {config.priceIncludes && <p className="price-includes">{config.priceIncludes}</p>}
          <div className="price-stats">
            <div>
              <span className="stat-label">
                <ClockIcon width={15} height={15} /> Estimated Machine Time
              </span>
              <span className="stat-value">{formatDayRange(estimate.daysLow, estimate.daysHigh)}</span>
            </div>
            <div>
              <span className="stat-label">
                <RulerIcon width={15} height={15} /> Property
              </span>
              <span className="stat-value">{formatAcres(estimate.acres)}</span>
            </div>
          </div>
        </div>

        <div className="breakdown">
          <h3 className="breakdown-title">Project breakdown</h3>
          <ul>
            {estimate.factors.map((f) => {
              const Icon = factorIcon[f.category]
              return (
                <li key={f.category}>
                  <span className="breakdown-icon">
                    <Icon width={18} height={18} />
                  </span>
                  <span className="breakdown-text">
                    <span className="breakdown-category">{f.category}</span>
                    <span className="breakdown-value">{f.label}</span>
                  </span>
                  <span className={`impact impact-${f.impact}`}>{impactLabel[f.impact]}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <p className="fine-print">
        This is a preliminary estimate based on the information provided. Final pricing depends on an on-site or remote
        property review.
      </p>

      <div className={`cta-panel${status === 'sent' ? ' is-sent' : ''}`} aria-live="polite">
        {status === 'sent' ? (
          <div className="success">
            <span className="success-icon">
              <CheckIcon width={26} height={26} strokeWidth={2.5} />
            </span>
            <div>
              <h3>Request received — thanks, {firstName}!</h3>
              <p>
                A member of {config.companyName} will review your property information and contact you within{' '}
                {config.responseTime} at {values.phone || values.email} to confirm the scope.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="cta-text">
              <h3>Ready for a firm number?</h3>
              <p>
                A member of {config.companyName} would review your property information and contact you to confirm the
                scope.
              </p>
            </div>
            <div className="cta-actions">
              <button
                type="button"
                className="btn btn-accent btn-lg"
                onClick={requestQuote}
                disabled={status === 'sending'}
              >
                {status === 'sending' ? <span className="spinner" aria-hidden="true" /> : null}
                {status === 'sending' ? 'Sending…' : 'Request a Final Quote'}
              </button>
              <span className="cta-call">
                or call <a href={`tel:${config.phone.replace(/\D/g, '')}`}>{config.phone}</a>
              </span>
            </div>
          </>
        )}
      </div>

      <details className="how-calculated">
        <summary>How this estimate was calculated</summary>
        <p>
          We estimate the machine time your project needs based on what you told us, then apply our day rate. Every
          property is different, so we show a range rather than a single number.
        </p>
        <ul>
          {calculationFactors.map(({ icon: Icon, title, text }) => (
            <li key={title}>
              <Icon width={18} height={18} />
              <span>
                <strong>{title}</strong>
                {text}
              </span>
            </li>
          ))}
        </ul>
      </details>
    </div>
  )
}
