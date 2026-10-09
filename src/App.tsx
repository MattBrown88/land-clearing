import { useRef, useState } from 'react'
import { Treeline, LogoMark } from './components/Brand'
import { EstimateResult } from './components/EstimateResult'
import { EstimatorForm } from './components/EstimatorForm'
import { CheckIcon, PhoneIcon, ShieldIcon } from './components/Icons'
import { contractorConfig as config } from './config/contractor'
import { calculateEstimate, type Estimate } from './lib/estimate'
import { emptyForm, validate, type FormErrors, type FormValues } from './lib/form'

/** `?embed` renders only the estimator card (no demo site header/footer) for use in an iframe. */
const embedMode = new URLSearchParams(window.location.search).has('embed')

export default function App() {
  const [values, setValues] = useState<FormValues>(emptyForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [estimate, setEstimate] = useState<Estimate | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const scrollToCard = () => {
    const top = (cardRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 16
    if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' })
  }

  const handleChange = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const handleSubmit = () => {
    const found = validate(values, config)
    setErrors(found)
    const firstInvalid = Object.keys(found)[0]
    if (firstInvalid) {
      const el = document.getElementById(firstInvalid)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el?.focus({ preventScroll: true })
      return
    }
    setEstimate(
      calculateEstimate(
        {
          acres: Number(values.acres),
          vegetation: values.vegetation,
          clearingType: values.clearingType,
          terrain: values.terrain,
          access: values.access,
        },
        config,
      ),
    )
    scrollToCard()
  }

  const handleEdit = () => {
    setEstimate(null)
    scrollToCard()
  }

  const card = (
    <div className="card" ref={cardRef}>
      <header className="card-header">
        <div className="card-brand">
          <LogoMark size={34} />
          <span>{config.companyName}</span>
        </div>
        <h1>{config.estimatorTitle}</h1>
        <p className="card-subtitle">{config.estimatorSubtitle}</p>
        <p className="card-note">
          <CheckIcon width={16} height={16} strokeWidth={2.4} />
          {config.estimatorNote}
        </p>
      </header>

      <div className="card-body view-enter" key={estimate ? 'result' : 'form'}>
        {estimate ? (
          <EstimateResult estimate={estimate} values={values} onEdit={handleEdit} />
        ) : (
          <EstimatorForm values={values} errors={errors} onChange={handleChange} onSubmit={handleSubmit} />
        )}
      </div>

      {config.showDemoDisclaimer && <div className="demo-ribbon">{config.demoDisclaimer}</div>}
    </div>
  )

  if (embedMode) return <main className="embed">{card}</main>

  return (
    <>
      <div className="hero">
        <nav className="site-header">
          <div className="site-brand">
            <LogoMark size={42} />
            <div>
              <span className="site-name">{config.companyName}</span>
              <span className="site-tagline">{config.tagline}</span>
            </div>
          </div>
          <a className="btn btn-ghost" href={`tel:${config.phone.replace(/\D/g, '')}`}>
            <PhoneIcon width={17} height={17} />
            <span>{config.phone}</span>
          </a>
        </nav>
        <Treeline />
      </div>

      <main className="page">
        {card}

        {config.trustPoints.length > 0 && (
          <ul className="trust">
            {config.trustPoints.map((point) => (
              <li key={point}>
                <ShieldIcon width={18} height={18} />
                {point}
              </li>
            ))}
          </ul>
        )}
      </main>

      <footer className="site-footer">
        <span>
          © {new Date().getFullYear()} {config.companyName} · {config.serviceArea}
        </span>
      </footer>
    </>
  )
}
