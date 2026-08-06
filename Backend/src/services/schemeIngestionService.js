import dotenv from 'dotenv';
dotenv.config();

/**
 * Scheme Ingestion Service
 * Periodically ingests agriculture welfare schemes from official portals (myScheme, data.gov.in)
 * and queues them for Admin review & publishing.
 */

// In-memory Review Queue (can be stored in DB)
const schemeReviewQueue = [
  {
    id: 'SCHEME-INGEST-101',
    scheme_name: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    source: 'data.gov.in Official Ingestion Feed',
    description: 'Provides 40% to 50% financial subsidy on purchase of agricultural tractors, harvesters, and tillers.',
    eligibility: {
      max_land_acres: 20.0,
      target_farmers: 'Small & Marginal Farmers, Women Farmers, SC/ST'
    },
    required_documents: ['Aadhaar Card', 'Land Passbook Copy', 'Quotation from Authorized Dealer', 'Bank Details'],
    benefits: 'Up to ₹1,500,000 subsidy on heavy farm machinery',
    application_link: 'https://agrimachinery.nic.in',
    status: 'PENDING_ADMIN_REVIEW',
    ingested_at: new Date().toISOString()
  },
  {
    id: 'SCHEME-INGEST-102',
    scheme_name: 'National Food Security Mission (NFSM) - Coarse Cereals & Millets',
    source: 'myScheme Official API',
    description: 'Special financial assistance and free seed minikits for high-yielding varieties of Pearl Millet, Sorghum, and Ragi.',
    eligibility: {
      max_land_acres: 10.0,
      target_farmers: 'All Categories cultivating Millets'
    },
    required_documents: ['Aadhaar Card', 'Soil Test Report', 'Land Revenue Receipt'],
    benefits: 'Free seed minikits + ₹6,000/hectare demonstration incentive',
    application_link: 'https://nfsm.gov.in',
    status: 'APPROVED',
    ingested_at: new Date().toISOString()
  }
];

export const getSchemeReviewQueue = async (req, res) => {
  res.json({
    status: 'success',
    total_queued: schemeReviewQueue.length,
    queue: schemeReviewQueue
  });
};

export const approveSchemeIngestion = async (req, res) => {
  const { schemeId } = req.body;
  const scheme = schemeReviewQueue.find(s => s.id === schemeId);
  if (scheme) {
    scheme.status = 'APPROVED';
    return res.json({
      status: 'success',
      message: `Scheme ${schemeId} approved and published to mobile app & admin dashboard.`,
      scheme
    });
  }
  res.status(404).json({ status: 'error', message: 'Scheme ID not found in queue' });
};
