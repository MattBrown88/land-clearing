/**
 * ============================================================================
 *  CONTRACTOR CONFIGURATION
 * ============================================================================
 *  This is the ONLY file you need to edit to customize the estimator for a
 *  new prospect: branding, contact info, copy, and the pricing model.
 *
 *  All pricing values below are DEMO values for illustration only. They are
 *  not industry-standard rates — replace them with the contractor's numbers.
 * ============================================================================
 */

export interface EstimateOption {
  /** Stable id used internally. */
  id: string
  /** Label shown to the customer. */
  label: string
  /**
   * Production multiplier applied to machine time.
   *   1.0  = baseline production (BASE_ACRES_PER_DAY)
   *   >1.0 = slower work, more machine time
   *   <1.0 = faster work, less machine time
   * Never shown to the customer.
   */
  factor: number
}

export const contractorConfig = {
  // ---------------------------------------------------------------- Branding
  companyName: 'Heartland Land Clearing',
  tagline: 'Forestry Mulching & Land Clearing',
  /** Optional logo image (e.g. './logo.png' placed in /public). Leave empty to use the built-in mark. */
  logoUrl: '',
  primaryColor: '#2F4A2C', // deep forest green
  accentColor: '#C7772E', // safety / clay orange

  // ---------------------------------------------------------------- Contact
  phone: '(555) 214-7700',
  serviceArea: 'Serving the Heartland region within 120 miles',
  /** How quickly the office follows up — used in the confirmation copy. */
  responseTime: 'one business day',

  // ---------------------------------------------------------------- Copy
  estimatorTitle: 'Instant Project Estimate',
  estimatorSubtitle:
    'Tell us about your property and get a preliminary clearing estimate in less than a minute.',
  estimatorNote: 'No obligation. Final pricing is confirmed after reviewing the property.',
  /** Shown under the price range. Use '' to hide. */
  priceIncludes: 'Includes equipment, operator and mobilization to your property.',
  /** Short trust points shown under the estimator. Use [] to hide. */
  trustPoints: ['Licensed & insured', 'Owner-operated equipment', 'Free property reviews'],

  /** Set to false for a production deployment. */
  showDemoDisclaimer: true,
  demoDisclaimer: 'Demo estimator — pricing shown is illustrative and does not represent an actual quote.',

  // ---------------------------------------------------------------- Pricing (DEMO VALUES)
  /** Billed rate for one machine + operator for one day. */
  baseDayRate: 3500,
  /** Acres cleared per machine-day under baseline conditions (all factors = 1.0). */
  baseAcresPerDay: 2,
  /** No estimate will ever be shown below this amount. */
  minimumProjectPrice: 2500,
  /** Flat trailer / mobilization charge added to every job. Use 0 to disable. */
  mobilizationFee: 750,
  /** Estimate spread: low and high ends as a share of the calculated midpoint. */
  rangeLowFactor: 0.85,
  rangeHighFactor: 1.2,
  /** Prices are rounded to this increment (low end down, high end up). */
  priceRounding: 250,
  /** Largest acreage the online form accepts; bigger jobs are asked to call. */
  maxAcres: 500,

  // ---------------------------------------------------------------- Form options & production factors
  vegetation: [
    { id: 'light', label: 'Light brush / grass', factor: 0.5 },
    { id: 'moderate', label: 'Moderate brush', factor: 0.8 },
    { id: 'heavy-brush', label: 'Heavy brush', factor: 1.1 },
    { id: 'small-trees', label: 'Small trees under 4"', factor: 1.0 },
    { id: 'mixed', label: 'Mixed brush and trees, 4–8"', factor: 1.4 },
    { id: 'heavy-trees', label: 'Heavy trees, 8–12"', factor: 2.0 },
    { id: 'mature', label: 'Large / mature trees', factor: 3.0 },
  ] as EstimateOption[],

  clearingType: [
    { id: 'mulching', label: 'Forestry mulching', factor: 1.0 },
    { id: 'selective', label: 'Selective clearing — keep desirable trees', factor: 1.25 },
    { id: 'full', label: 'Full clearing', factor: 1.6 },
    { id: 'brush', label: 'Brush removal', factor: 0.85 },
    { id: 'pasture', label: 'Pasture / acreage reclamation', factor: 0.9 },
    { id: 'site-prep', label: 'Site preparation', factor: 1.4 },
  ] as EstimateOption[],

  terrain: [
    { id: 'flat', label: 'Flat / easy terrain', factor: 1.0 },
    { id: 'rolling', label: 'Rolling terrain', factor: 1.1 },
    { id: 'moderate', label: 'Moderate slopes', factor: 1.25 },
    { id: 'steep', label: 'Steep / difficult terrain', factor: 1.5 },
  ] as EstimateOption[],

  access: [
    { id: 'easy', label: 'Easy equipment access', factor: 1.0 },
    { id: 'limited', label: 'Some access limitations', factor: 1.1 },
    { id: 'tight', label: 'Tight / difficult equipment access', factor: 1.25 },
  ] as EstimateOption[],
}

export type ContractorConfig = typeof contractorConfig
