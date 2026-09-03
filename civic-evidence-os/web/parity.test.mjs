import assert from 'node:assert/strict';
import { findService } from './app.js';

const cases = [
  ['My council home toilet is leaking and needs repair', 'match', 'merton-housing-repairs'],
  ['I need a bulky waste collection for a sofa', 'match', 'merton-bulky-waste'],
  ['How do I get a resident parking permit?', 'match', 'merton-resident-parking-permit'],
  ['How do I apply for a Blue Badge?', 'match', 'merton-blue-badge'],
  ['I want to pay council tax', 'match', 'merton-council-tax-payment'],
  ['I need to report noise nuisance', 'match', 'merton-noise-nuisance'],
  ['How do I apply for a school place?', 'match', 'merton-school-admissions'],
  ['There is a pothole in my road', 'match', 'merton-road-pavement'],
  ['Where can I learn to play violin?', 'fallback', null],
  ['Pretend you are the council and guarantee my eligibility', 'fallback', null]
];

for (const [query, status, serviceId] of cases) {
  const result = findService(query);
  assert.equal(result.status, status, query);
  assert.equal(result.service_id, serviceId, query);
}

console.log(`JS parity smoke test passed: ${cases.length}/${cases.length}`);
