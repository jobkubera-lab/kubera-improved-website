# Kubera LIVE — Mitcham & Merton

**Status:** design/MVP specification — not yet a live inventory service.

Kubera LIVE extends the existing **Kubera Park & Local Intelligence — Mitcham and Merton** PWA into a local, machine-readable availability network.

The core question is deliberately simple:

> **What do you need, where can you get it nearby, is it actually available now, what does it cost, and when was that fact last verified?**

The same model is intended to support independent shops, charities/community organisations, food banks, clubs/activities and public/community services without pretending that all of them are retail stores.

## Why this belongs here

The current Mitcham/Merton prototype already has a mobile-first PWA, Leaflet map, verified source links, verification dates, confidence metadata, local places and a support-service category. Kubera LIVE should reuse that work rather than create another disconnected map.

Related Kubera work to reuse rather than rewrite:

- `mitcham-survival-map/` — mobile PWA, map, place cards, geolocation, source/verification UI.
- `jobkubera-lab/mock-hsds-api` — existing HSDS mock-service API work for human/community services.
- `jobkubera-lab/kubera-local-ai` — agent runtime and Evidence Ledger concepts for auditable AI/tool outputs.

## Three proven patterns to borrow — not copy

### 1. NearSt pattern: POS/ERP → clean live feed → many discovery channels

NearSt connects retailer inventory/POS/ERP data, cleans/enriches product records and distributes local availability to discovery channels. Its public material describes barcode-to-product enrichment and inventory freshness measured in minutes.

**Kubera LIVE adaptation:** build an adapter interface rather than a new POS. A provider can connect an existing inventory source, upload CSV, or use a simple phone scanner. Kubera stores only the availability fields needed for discovery and provenance.

Reference: https://www.near.st/solution/technology

### 2. Google Local Inventory pattern: product + store + availability + quantity + price

Google Merchant local inventory separates the main product record from store-specific inventory and uses fields such as store code, product id, availability, quantity and price. Third-party providers can build interfaces on top of the Merchant Inventories API.

**Kubera LIVE adaptation:** keep `Product` separate from `Offer/Availability`. One barcode/product can have different price and stock at different providers. Do not mix catalog truth with current stock truth.

References:
- https://developers.google.com/merchant/api/guides/inventories/overview
- https://support.google.com/merchants/answer/3271956

### 3. Open Food Facts + Open Prices pattern: reusable product identity and price evidence

Open Food Facts provides an open product database/API; Open Prices is an open project/API for product prices and explicitly encourages reuse of its dataset.

**Kubera LIVE adaptation:** use GTIN/barcodes and external catalog enrichment where licensing/API terms allow. Never invent product identity, price or availability from an AI guess.

References:
- https://github.com/openfoodfacts/openfoodfacts-server
- https://github.com/openfoodfacts/open-prices

## Community-service pattern

Retail inventory alone is not enough. For charities, support organisations and public/community services, use a provider/service model compatible in spirit with **Open Referral HSDS** rather than forcing everything into a retail schema.

Reference: https://github.com/openreferral/specification

The existing Kubera `mock-hsds-api` can be used as a test fixture during development.

## Product model

Kubera LIVE has five core concepts.

### Provider

A real organisation or location that can make something available.

Examples: independent shop, food bank, charity branch/service, chess club, community centre.

Minimum fields:

- `provider_id`
- `name`
- `provider_type`
- `location` or explicit `virtual=true`
- `source_url`
- `verification_status`
- `last_verified_at`

### Item

Something discoverable that a person may need.

An item can be:

- a physical product;
- a donated/free item;
- a service;
- an activity/session;
- a resource/appointment slot in a later phase.

Physical products should support GTIN/barcode identifiers where available.

### Offer

The relationship between a Provider and an Item.

Minimum fields:

- `provider_id`
- `item_id`
- `availability`: `in_stock | low_stock | out_of_stock | available | unavailable | unknown`
- `quantity` only when the provider has supplied a reliable quantity
- `price` and `currency`, or `free=true`
- `updated_at`
- `source_type`: `pos | api | csv | barcode_scan | provider_manual | verified_external`
- `confidence`

### Evidence

Every live claim needs provenance.

Minimum fields:

- claim type;
- source/provider;
- observed or supplied timestamp;
- ingestion method;
- verification state;
- expiry/freshness rule.

An old stock record must degrade to **unknown/stale**, not remain falsely labelled `in_stock` forever.

### Demand Signal

Privacy-preserving aggregate of unsuccessful or successful searches, for example:

- query category;
- coarse area;
- time bucket;
- match/no-match;
- anonymous count.

No individual customer profile is required for the MVP. Do not expose raw user searches to merchants.

## Phone experience — MVP

The existing PWA is the starting point. The first Kubera LIVE interface should work from a phone without an app-store install.

User flow:

1. User enters a need in plain language: `rice 5kg under £8`, `winter coat free`, `chess tonight`.
2. Search resolves the request to structured constraints.
3. Results are ranked by actual availability first, then distance/relevance/price as appropriate.
4. Each result displays provider, distance, price/free status, availability, **last updated**, and source confidence.
5. User can open the existing map/directions view.
6. Later: `notify me when available` and provider-confirmed reservation.

AI may interpret the request and explain results. AI must not fabricate inventory.

## Provider experience — MVP

Support three ingestion paths so small organisations are not forced to buy new software:

1. **Manual/mobile:** scan barcode or search product, set price and availability.
2. **CSV:** upload/export a simple stock file.
3. **Adapter:** connect existing POS/ERP/inventory API.

A future provider dashboard can show aggregated unmet demand such as `people searched for this category but no current match existed`. It must not reveal identifiable user behaviour.

## Charity / community example

Do **not** claim that British Red Cross or any other named organisation exposes item-level live stock unless an official integration exists.

The model can support a participating charity in two modes:

- **service availability:** what help is offered, where, when and under what conditions;
- **item availability:** only when the organisation itself supplies a reliable inventory feed or authorised manual updates.

This distinction is mandatory.

## Architecture for the first implementation

```text
Phone/PWA
   |
Search + map (reuse Mitcham Survival Map)
   |
Kubera LIVE API
   |---- Provider/Service records (HSDS-compatible mapping where useful)
   |---- Product catalog enrichment (GTIN/Open Food Facts where permitted)
   |---- Offer/availability store
   |---- Evidence/freshness ledger
   |---- Aggregate demand signals
   |
Ingestion adapters
   |---- manual/barcode
   |---- CSV
   |---- POS/ERP API
   `---- authorised organisation API
```

For the MVP, prefer a small API and PostgreSQL/PostGIS-compatible model. Do not deploy ERPNext, Odoo or another full ERP merely to prove local availability. They are integration targets, not our product.

## Open-source components to evaluate before building equivalents

- OpenStreetMap + existing Leaflet implementation for geography.
- MapLibre only if the current Leaflet stack becomes insufficient.
- Open Food Facts for product identity/enrichment where terms and data quality fit.
- Open Prices as a reference/open price-data source, not as a substitute for provider-confirmed live stock.
- Open Referral HSDS for human/community service interoperability.
- ZXing browser tooling or native BarcodeDetector where appropriate for phone barcode capture.
- PostgreSQL/PostGIS for provider/location/offer data when a backend is introduced.
- Existing Kubera Evidence Ledger ideas for append-only provenance/audit events.

## Five-project family

Kubera LIVE is the practical first product in the wider project family:

1. **Kubera LIVE** — live local availability network for products, charity/community resources and activities.
2. **Merton City Brain** — local intelligence layer joining verified places, services, availability and public data.
3. **Public Service Agent** — natural-language discovery of council/GOV.UK/NHS/community services with authoritative sources.
4. **Civic Simulation Engine** — later `what-if` modelling over open local data; not part of LIVE MVP.
5. **Kubera Trust & Evidence Engine** — provenance, freshness, confidence, audit and evaluation shared by the other projects.

## MVP boundary

Build first:

- provider + item + offer + evidence data model;
- 3–5 synthetic/demo providers clearly labelled as demo data;
- product/service search;
- availability/price/freshness display;
- map integration;
- simple manual inventory update flow;
- automated tests for stale stock, unknown stock, price, free items and source provenance.

Do not build yet:

- payments;
- delivery marketplace;
- automated government decisions;
- biometric/surveillance features;
- full ERP/POS;
- scraping that violates site terms;
- claims of real-time stock without an authorised feed;
- merchant analytics based on identifiable users.

## Success test

The MVP succeeds when a phone user can ask for a need and the system can answer, from structured evidence:

**where it is, whether it is available, what it costs (or whether it is free), how fresh that information is, and who supplied the claim.**

Everything else is phase two.
