import type { FormEvent, ReactNode } from 'react'
import { contractorConfig as config, type EstimateOption } from '../config/contractor'
import { formatPhone, type FormErrors, type FormValues } from '../lib/form'
import { ArrowRightIcon } from './Icons'
import { PhotoUpload } from './PhotoUpload'

interface Props {
  values: FormValues
  errors: FormErrors
  onChange: <K extends keyof FormValues>(key: K, value: FormValues[K]) => void
  onSubmit: () => void
}

interface FieldProps {
  id: keyof FormValues
  label: string
  error?: string
  hint?: string
  children: ReactNode
}

function Field({ id, label, error, hint, children }: FieldProps) {
  return (
    <div className={`field${error ? ' has-error' : ''}`}>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      {children}
      {error ? (
        <span className="error" id={`${id}-error`}>
          {error}
        </span>
      ) : (
        hint && <span className="hint">{hint}</span>
      )}
    </div>
  )
}

function Section({ step, title, children }: { step: number; title: string; children: ReactNode }) {
  return (
    <section className="form-section" role="group" aria-labelledby={`step-${step}`}>
      <h2 className="section-title" id={`step-${step}`}>
        <span className="step">{step}</span>
        {title}
      </h2>
      {children}
    </section>
  )
}

export function EstimatorForm({ values, errors, onChange, onSubmit }: Props) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  const inputProps = (id: keyof FormValues) => ({
    id,
    name: id,
    'aria-invalid': Boolean(errors[id]),
    'aria-describedby': errors[id] ? `${id}-error` : undefined,
  })

  const select = (id: 'vegetation' | 'clearingType' | 'terrain' | 'access', placeholder: string, options: EstimateOption[]) => (
    <select {...inputProps(id)} value={values[id]} onChange={(e) => onChange(id, e.target.value)}>
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o.id} value={o.id}>
          {o.label}
        </option>
      ))}
    </select>
  )

  return (
    <form className="estimator-form" onSubmit={handleSubmit} noValidate>
      <Section step={1} title="About the property">
        <div className="grid-2">
          <Field id="acres" label="Property size" error={errors.acres}>
            <div className="input-suffix">
              <input
                {...inputProps('acres')}
                type="number"
                inputMode="decimal"
                min="0"
                step="0.1"
                placeholder="e.g. 5"
                value={values.acres}
                onChange={(e) => onChange('acres', e.target.value)}
              />
              <span>acres</span>
            </div>
          </Field>
          <Field id="location" label="Location" error={errors.location}>
            <input
              {...inputProps('location')}
              type="text"
              autoComplete="postal-code"
              placeholder="City or ZIP code"
              value={values.location}
              onChange={(e) => onChange('location', e.target.value)}
            />
          </Field>
          <Field id="vegetation" label="Vegetation / growth" error={errors.vegetation}>
            {select('vegetation', 'Select growth type', config.vegetation)}
          </Field>
          <Field id="clearingType" label="Clearing type" error={errors.clearingType}>
            {select('clearingType', 'Select clearing type', config.clearingType)}
          </Field>
          <Field id="terrain" label="Terrain" error={errors.terrain}>
            {select('terrain', 'Select terrain', config.terrain)}
          </Field>
          <Field id="access" label="Equipment access" error={errors.access}>
            {select('access', 'Select access', config.access)}
          </Field>
        </div>
      </Section>

      <Section step={2} title="Show us the site">
        <div className="grid-2 grid-media">
          <PhotoUpload file={values.photo} onChange={(file) => onChange('photo', file)} />
          <div className="field">
            <label className="label" htmlFor="description">
              Project description <span className="optional">Optional</span>
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Tell us anything else about the property or what you want cleared."
              value={values.description}
              onChange={(e) => onChange('description', e.target.value)}
            />
          </div>
        </div>
      </Section>

      <Section step={3} title="Your contact information">
        <div className="grid-3">
          <Field id="name" label="Name" error={errors.name}>
            <input
              {...inputProps('name')}
              type="text"
              autoComplete="name"
              placeholder="Full name"
              value={values.name}
              onChange={(e) => onChange('name', e.target.value)}
            />
          </Field>
          <Field id="email" label="Email" error={errors.email}>
            <input
              {...inputProps('email')}
              type="email"
              autoComplete="email"
              placeholder="you@email.com"
              value={values.email}
              onChange={(e) => onChange('email', e.target.value)}
            />
          </Field>
          <Field id="phone" label="Phone" error={errors.phone}>
            <input
              {...inputProps('phone')}
              type="tel"
              autoComplete="tel"
              placeholder="(555) 555-5555"
              value={values.phone}
              onChange={(e) => onChange('phone', formatPhone(e.target.value))}
            />
          </Field>
        </div>
      </Section>

      <div className="submit-row">
        <button type="submit" className="btn btn-primary btn-lg">
          Get My Estimate
          <ArrowRightIcon />
        </button>
        <p className="submit-note">Your information is only shared with {config.companyName}.</p>
      </div>
    </form>
  )
}
