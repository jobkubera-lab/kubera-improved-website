export const SERVICES = [
  {id:'merton-housing-repairs',name:'Housing repairs',description:'Report a repair if Merton Council is responsible for your home.',url:'https://www.merton.gov.uk/council-tax-benefits-and-housing/housing/housing-repairs',reviewed_on:'2026-08-27',terms:['leak','leaking','toilet','repair','council home','housing repair']},
  {id:'merton-benefits-advice',name:'Benefits advice',description:'Find council information about benefits and financial support.',url:'https://www.merton.gov.uk/council-tax-benefits-and-housing/benefits',reviewed_on:'2026-08-27',terms:['benefit','benefits','universal credit','low income','financial support']},
  {id:'merton-street-cleaning',name:'Litter and street cleaning',description:'Report litter, fly-tipping or a street-cleaning problem.',url:'https://www.merton.gov.uk/rubbish-and-recycling/litter-fly-tipping-and-street-cleaning',reviewed_on:'2026-08-27',terms:['litter','fly tipping','fly-tipping','street cleaning','rubbish street']},
  {id:'merton-bulky-waste',name:'Bulky waste collection',description:'Book or manage a council collection for furniture, fridges and other bulky household items.',url:'https://www.merton.gov.uk/rubbish-and-recycling/bulky-hazardous-and-clinical-waste/furniture-fridges-and-bulky-items',reviewed_on:'2026-09-03',terms:['bulky waste','bulky collection','sofa collection','fridge collection','mattress collection']},
  {id:'merton-resident-parking-permit',name:'Resident parking permits',description:'Check eligibility and apply for or renew a resident parking permit in Merton.',url:'https://www.merton.gov.uk/streets-parking-transport/parking/permits/resident',reviewed_on:'2026-09-03',terms:['resident parking permit','parking permit','cpz permit','resident permit']},
  {id:'merton-blue-badge',name:'Blue Badge',description:'Find Merton guidance for applying for or renewing a Blue Badge.',url:'https://www.merton.gov.uk/streets-parking-transport/parking/bluebadge',reviewed_on:'2026-09-03',terms:['blue badge','disabled parking badge','disability parking']},
  {id:'merton-council-tax-payment',name:'Pay Council Tax',description:'Find official options for paying Merton Council Tax or checking payment information.',url:'https://www.merton.gov.uk/council-tax-benefits-and-housing/council-tax/paying-your-council-tax',reviewed_on:'2026-09-03',terms:['pay council tax','council tax payment','council tax direct debit','council tax balance']},
  {id:'merton-noise-nuisance',name:'Noise and nuisance complaints',description:'Use Merton Council guidance to report serious, ongoing noise or other nuisance problems.',url:'https://www.merton.gov.uk/communities-and-neighbourhoods/noise-nuisance/report-nuisance/complaint',reviewed_on:'2026-09-03',terms:['noise complaint','noise nuisance','report noise','loud music complaint','barking dog noise']},
  {id:'merton-school-admissions',name:'School admissions',description:'Find official Merton information for applying for a school place or transfer.',url:'https://www.merton.gov.uk/education-and-learning/schools/admissions',reviewed_on:'2026-09-03',terms:['school place','school admission','school admissions','primary school application','secondary school application','school transfer']},
  {id:'merton-road-pavement',name:'Road and pavement problems',description:'Report potholes, damaged pavements and other road or pavement defects in Merton.',url:'https://www.merton.gov.uk/streets-parking-transport/streets-and-pavements/potholes',reviewed_on:'2026-09-03',terms:['pothole','road damage','damaged pavement','pavement damage','road surface problem']},
  {id:'merton-contact',name:'Contact Merton Council',description:'Use the council contact directory when no specific service can be identified.',url:'https://www.merton.gov.uk/council-and-local-democracy/contact-us',reviewed_on:'2026-08-27',terms:['contact council','council contact','speak to council']}
];

const UNSAFE_PATTERNS = [
  /\bpretend (?:you are|to be) (?:the )?council\b/u,
  /\bfake (?:a|an|the) (?:council|official)\b/u,
  /\bguarantee (?:my )?eligibility\b/u
];

export function normalise(text) {
  return ((String(text).toLocaleLowerCase('en-GB').match(/[\p{L}\p{N}_'-]+/gu)) || []).join(' ');
}

function matches(query, terms) {
  const padded = ` ${query} `;
  return terms.filter(term => padded.includes(` ${normalise(term)} `));
}

function fallback(reason, description) {
  return {status:'fallback',service_id:null,service_name:null,description,official_url:'https://www.merton.gov.uk/council-and-local-democracy/contact-us',reviewed_on:'2026-08-27',matched_terms:[],reason};
}

export function findService(query) {
  const normalised = normalise(query);
  if (!normalised) return fallback('empty_query','Please describe what help you need.');
  if (UNSAFE_PATTERNS.some(pattern => pattern.test(normalised))) return fallback('safety_guard','I cannot impersonate a council or create an official decision.');

  const ranked = SERVICES.map(service => ({service, matched: matches(normalised, service.terms)}))
    .filter(item => item.matched.length)
    .sort((a,b) => b.matched.length - a.matched.length);

  if (!ranked.length) return fallback('no_evidence','No controlled service matched. Use the official council contact directory.');
  if (ranked.length > 1 && ranked[0].matched.length === ranked[1].matched.length) return fallback('ambiguous','More than one service matched. Please make the question more specific.');

  const {service, matched} = ranked[0];
  return {status:'match',service_id:service.id,service_name:service.name,description:service.description,official_url:service.url,reviewed_on:service.reviewed_on,matched_terms:matched,reason:'controlled_terms_matched'};
}

function render(result) {
  const box = document.querySelector('#result');
  if (!box) return;
  const title = result.status === 'match' ? result.service_name : 'Official fallback';
  box.innerHTML = `<h2>${title}</h2><p>${result.description}</p><p><strong>Reason:</strong> ${result.reason}</p><p><strong>Checked:</strong> ${result.reviewed_on || 'n/a'}</p><p><a href="${result.official_url}" target="_blank" rel="noopener">Open official Merton source</a></p>`;
}

if (typeof document !== 'undefined') {
  const form = document.querySelector('#finder-form');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    render(findService(document.querySelector('#query').value));
  });
}
