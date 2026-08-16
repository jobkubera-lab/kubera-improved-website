'use strict';

const MITCHAM = [51.4038, -0.1681];
const categoryMeta = {
  football: { icon: '⚽', label: 'Football' }, basketball: { icon: '🏀', label: 'Basketball' },
  cricket: { icon: '🏏', label: 'Cricket' }, playground: { icon: '🛝', label: 'Playground' },
  post: { icon: '✉️', label: 'Post Office' }, recycling: { icon: '♻️', label: 'Recycling' },
  donations: { icon: '👕', label: 'Donate items' }, support: { icon: '➕', label: 'Support' }
};

const verifiedPlaces = [
  { id:'lavender-park', name:'Lavender Park', lat:51.4121564, lng:-0.1702661, categories:['football','playground'], address:'Steers Mead, Mitcham, CR4 3SE', description:'Accessible toddler and junior play areas beside a modern 3G five-a-side football area.', source:'verified', sourceUrl:'https://www.merton.gov.uk/leisure-recreation-and-culture/parks-and-open-spaces/parks-and-recreation-grounds/mitcham/lavender-park-open-space' },
  { id:'edenvale', name:'Edenvale Open Space', lat:51.4173939, lng:-0.1543993, categories:['basketball','football','playground'], address:'Woodland Way, Mitcham, CR4 2DZ', description:'Accessible play equipment with a single football goal and a basketball post in the adjacent grass area.', source:'verified', sourceUrl:'https://www.merton.gov.uk/leisure-recreation-and-culture/parks-and-open-spaces/parks-and-recreation-grounds/mitcham/edenvale-open-space' },
  { id:'rowan-road', name:'Rowan Road Recreation Ground', lat:51.4082271, lng:-0.1409719, categories:['basketball','football','playground'], address:'Rowan Road, Mitcham, SW16 5JF', description:'Large play area with a paddling pool, kickabout space and basketball nets.', source:'verified', sourceUrl:'https://www.merton.gov.uk/leisure-recreation-and-culture/parks-and-open-spaces/parks-and-recreation-grounds/mitcham/rowan-road-recreation-ground' },
  { id:'donnelly-green', name:'Donnelly Green', lat:51.3998879, lng:-0.1294104, categories:['playground'], address:'South Lodge Avenue, Mitcham, CR4 1LT', description:'Separate junior and toddler areas with swings, roundabout and multi-activity units.', source:'verified', sourceUrl:'https://www.merton.gov.uk/leisure-recreation-and-culture/parks-and-open-spaces/parks-and-recreation-grounds/mitcham/donnelly-green-open-space' },
  { id:'lewis-road', name:'Lewis Road Recreation Ground', lat:51.4066696, lng:-0.1731796, categories:['football','playground'], address:'Lewis Road, Mitcham, CR4', description:'Toddler and junior play areas, paddling pool and a kickabout area.', source:'verified', sourceUrl:'https://www.merton.gov.uk/leisure-recreation-and-culture/parks-and-open-spaces/parks-and-recreation-grounds/mitcham/lewis-road-recreation-ground' },
  { id:'london-road-fields', name:'London Road Playing Fields', lat:51.3997725, lng:-0.1731175, categories:['football','playground'], address:'London Road, Mitcham, CR4', description:'Play areas for toddlers and juniors within a large open space suitable for informal sport.', source:'verified', sourceUrl:'https://www.merton.gov.uk/leisure-recreation-and-culture/parks-and-open-spaces/parks-and-recreation-grounds/mitcham/london-road-playing-fields' },
  { id:'sherwood-rec', name:'Sherwood Recreation Ground', lat:51.3985693, lng:-0.1405055, categories:['playground'], address:'Abbotts Road, Mitcham, CR4 1JS', description:'Grass recreation area with toddler and junior play equipment and tennis courts outside school hours.', source:'verified', sourceUrl:'https://www.merton.gov.uk/leisure-recreation-and-culture/parks-and-open-spaces/parks-and-recreation-grounds/mitcham/sherwood-recreation-ground' },
  { id:'tamworth-farm', name:'Tamworth Recreation Ground', lat:51.4146067, lng:-0.1622619, categories:['playground'], address:'London Road, Mitcham, CR4 3LB', description:'Play equipment for toddlers and juniors, splash pad and tennis courts.', source:'verified', sourceUrl:'https://www.merton.gov.uk/leisure-recreation-and-culture/parks-and-open-spaces/parks-and-recreation-grounds/mitcham/tamworth-recreation-ground' },
  { id:'mitcham-cricket-green', name:'Mitcham Cricket Green', lat:51.4013010, lng:-0.1672341, categories:['cricket'], address:'Cricket Green, Mitcham, CR4', description:'Historic cricket area at the centre of Mitcham. Check club fixtures and access before playing.', source:'verified', sourceUrl:'https://www.merton.gov.uk/leisure-recreation-and-culture/parks-and-open-spaces' },
  { id:'mitcham-post', name:'Mitcham Post Office', lat:51.4051590, lng:-0.1628480, categories:['post'], address:'5 Langdale Parade, Mitcham, CR4 2PF', description:'Royal Mail and Parcelforce services. Mon–Fri 08:30–17:30; Sat 08:30–13:00.', source:'verified', sourceUrl:'https://www.postoffice.co.uk/branch-finder/174013x/mitcham' },
  { id:'church-road-post', name:'Church Road Post Office', lat:51.4035384, lng:-0.1762446, categories:['post'], address:'57–59 Church Road, Mitcham, CR4 3BF', description:'Post, banking, document certification and selected travel services.', source:'verified', sourceUrl:'https://www.postoffice.co.uk/branch-finder/0690139/church-road' },
  { id:'london-road-post', name:'London Road 494 Post Office', lat:51.3973142, lng:-0.1733613, categories:['post'], address:'494 London Road, Mitcham, CR4 4BA', description:'Long weekday hours plus Sunday opening; mail, banking, parcel and travel services.', source:'verified', sourceUrl:'https://www.postoffice.co.uk/branch-finder/0920134/london-road-494' },
  { id:'garth-road', name:'Garth Road Household Reuse and Recycling Centre', lat:51.3850509, lng:-0.2259745, categories:['recycling','donations'], address:'63–69 Amenity Way, Morden, SM4 4AX', description:'Reuse and recycling centre for Merton residents. Cars need a booking; pedestrians and cyclists do not.', source:'verified', sourceUrl:'https://www.merton.gov.uk/rubbish-and-recycling/garth-road' },
  { id:'majestic-way-textiles', name:'Majestic Way Textile Recycling Bank', lat:51.4063183, lng:-0.1630414, categories:['recycling','donations'], address:'Majestic Way, Mitcham, CR4 2JS', description:'Council-listed textile recycling point for clean clothing and paired shoes.', source:'verified', sourceUrl:'https://www.merton.gov.uk/rubbish-and-recycling/recycling-sites' },
  { id:'junction-textiles', name:'Mitcham Junction Textile Recycling Bank', lat:51.3930894, lng:-0.1587053, categories:['recycling','donations'], address:'Mitcham Junction Station, Carshalton Road, CR4 4HG', description:'Council-listed textile recycling point.', source:'verified', sourceUrl:'https://www.merton.gov.uk/rubbish-and-recycling/recycling-sites' },
  { id:'phipps-textiles', name:'Phipps Bridge Textile Recycling Bank', lat:51.4097, lng:-0.1815, categories:['recycling','donations'], address:'Haslemere Avenue / Thornville Grove, Mitcham', description:'Council-listed textile recycling point.', source:'verified', sourceUrl:'https://www.merton.gov.uk/rubbish-and-recycling/recycling-sites' },
  { id:'pollards-textiles', name:'Pollards Hill Textile Recycling Bank', lat:51.3999366, lng:-0.1322358, categories:['recycling','donations'], address:'South Lodge Avenue, Pollards Hill, CR4 1LT', description:'Council-listed textile recycling point outside the local shops.', source:'verified', sourceUrl:'https://www.merton.gov.uk/rubbish-and-recycling/recycling-sites' },
  { id:'red-cross-london', name:'British Red Cross — London Refugee Service', lat:51.4038, lng:-0.1681, categories:['support'], address:'London-wide service — contact before travelling', description:'Refugee support, emergency help, casework and signposting. Phone 020 7704 5670.', source:'verified', sourceUrl:'https://www.redcross.org.uk/get-help/get-help-as-a-refugee/contact-your-local-refugee-service', virtual:true }
];

let places = [...verifiedPlaces];
let activeFilter = 'all';
let searchTerm = '';
let userLocation = null;
let userMarker = null;
const markers = new Map();

const map = L.map('map', { zoomControl: true }).setView(MITCHAM, 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
const markerLayer = L.layerGroup().addTo(map);

const $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
const directionsUrl = p => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${p.lat},${p.lng}`)}`;
const radians = deg => deg * Math.PI / 180;
function distanceKm(a, b) {
  const R = 6371, dLat = radians(b[0]-a[0]), dLng = radians(b[1]-a[1]);
  const x = Math.sin(dLat/2)**2 + Math.cos(radians(a[0])) * Math.cos(radians(b[0])) * Math.sin(dLng/2)**2;
  return 2 * R * Math.asin(Math.sqrt(x));
}
function primaryCategory(place) { return place.categories[0] || 'support'; }
function markerIcon(place) {
  const meta = categoryMeta[primaryCategory(place)];
  return L.divIcon({ className:'', html:`<div class="custom-marker ${place.source}"><span>${meta.icon}</span></div>`, iconSize:[34,34], iconAnchor:[17,31], popupAnchor:[0,-28] });
}
function popupHtml(place) {
  return `<div class="popup"><h3>${esc(place.name)}</h3><p>${esc(place.address)}</p><p>${esc(place.description)}</p><a href="${esc(place.sourceUrl)}" target="_blank" rel="noopener">Official source</a>${place.virtual ? '' : ` · <a href="${directionsUrl(place)}" target="_blank" rel="noopener">Directions</a>`}</div>`;
}
function visiblePlaces() {
  const query = searchTerm.trim().toLowerCase();
  let out = places.filter(p => (activeFilter === 'all' || p.categories.includes(activeFilter)) && (!query || `${p.name} ${p.address} ${p.description} ${p.categories.join(' ')}`.toLowerCase().includes(query)));
  const mode = $('sortSelect').value;
  if (mode === 'name') out.sort((a,b)=>a.name.localeCompare(b.name));
  else if (mode === 'distance' && userLocation) out.sort((a,b)=>distanceKm(userLocation,[a.lat,a.lng])-distanceKm(userLocation,[b.lat,b.lng]));
  else out.sort((a,b)=>(a.source===b.source? a.name.localeCompare(b.name) : a.source==='verified'?-1:1));
  return out;
}
function render() {
  const items = visiblePlaces();
  markerLayer.clearLayers(); markers.clear();
  $('resultCount').textContent = items.length;
  $('resultsTitle').textContent = activeFilter === 'all' ? 'All locations' : categoryMeta[activeFilter]?.label || 'Locations';
  $('resultList').innerHTML = items.length ? items.map(placeCard).join('') : '<div class="empty-state">No matching places. Try another category or search term.</div>';
  items.forEach(p => {
    if (p.virtual) return;
    const marker = L.marker([p.lat,p.lng], { icon:markerIcon(p), title:p.name }).bindPopup(popupHtml(p));
    marker.addTo(markerLayer); markers.set(p.id, marker);
  });
  document.querySelectorAll('.place-card').forEach(card => card.addEventListener('click', e => {
    if (e.target.closest('a,button')) return;
    focusPlace(card.dataset.id);
  }));
  document.querySelectorAll('[data-focus]').forEach(btn => btn.addEventListener('click', ()=>focusPlace(btn.dataset.focus)));
}
function placeCard(p) {
  const meta = categoryMeta[primaryCategory(p)];
  const dist = userLocation && !p.virtual ? `${distanceKm(userLocation,[p.lat,p.lng]).toFixed(1)} km` : '';
  return `<article class="place-card" data-id="${esc(p.id)}"><div class="place-icon">${meta.icon}</div><div><div class="place-topline"><h3>${esc(p.name)}</h3><span class="source-badge ${p.source}">${p.source==='verified'?'Verified':'OSM'}</span></div><p class="place-address">${esc(p.address)}</p><p class="place-description">${esc(p.description)}</p><div class="place-meta">${p.categories.map(c=>`<span class="mini-tag">${categoryMeta[c]?.icon||''} ${esc(categoryMeta[c]?.label||c)}</span>`).join('')}${dist?`<span class="distance">${dist}</span>`:''}</div><div class="card-actions">${p.virtual?'':`<button type="button" data-focus="${esc(p.id)}">Show on map</button><a href="${directionsUrl(p)}" target="_blank" rel="noopener">Directions</a>`}<a href="${esc(p.sourceUrl)}" target="_blank" rel="noopener">Source</a></div></div></article>`;
}
function focusPlace(id) {
  const p = places.find(x=>x.id===id); if (!p || p.virtual) return;
  map.flyTo([p.lat,p.lng], 16, { duration:.7 }); markers.get(id)?.openPopup();
  document.querySelectorAll('.place-card').forEach(c=>c.classList.toggle('selected',c.dataset.id===id));
}

$('filterBar').addEventListener('click', e => { const b=e.target.closest('[data-filter]'); if(!b)return; activeFilter=b.dataset.filter; document.querySelectorAll('.filter-chip').forEach(x=>x.classList.toggle('active',x===b)); render(); });
$('searchInput').addEventListener('input', e=>{searchTerm=e.target.value;render();});
$('sortSelect').addEventListener('change', render);
$('resetButton').addEventListener('click', ()=>{map.setView(MITCHAM,13); activeFilter='all';searchTerm='';$('searchInput').value='';document.querySelectorAll('.filter-chip').forEach(x=>x.classList.toggle('active',x.dataset.filter==='all'));render();});
$('locateButton').addEventListener('click', ()=>{
  if (!navigator.geolocation) return alert('Location is not supported by this browser.');
  $('locateButton').textContent='Finding you…';
  navigator.geolocation.getCurrentPosition(pos=>{
    userLocation=[pos.coords.latitude,pos.coords.longitude];
    if(userMarker) map.removeLayer(userMarker);
    const icon=L.divIcon({className:'',html:'<div class="user-marker"></div>',iconSize:[18,18],iconAnchor:[9,9]});
    userMarker=L.marker(userLocation,{icon,title:'Your location'}).addTo(map).bindPopup('Your approximate location').openPopup();
    map.flyTo(userLocation,14); $('locateButton').textContent='Location found'; render();
  },()=>{ $('locateButton').textContent='Use my location'; alert('Location could not be accessed. Check your browser permissions.'); },{enableHighAccuracy:true,timeout:10000});
});

async function loadOpenStreetMapPlaces() {
  $('loadingMessage').hidden=false;
  const query=`[out:json][timeout:20];(nwr[leisure=playground](51.37,-0.22,51.44,-0.12);nwr[leisure=pitch][sport~"football|basketball|cricket"](51.37,-0.22,51.44,-0.12););out center tags;`;
  try {
    const res=await fetch('https://overpass-api.de/api/interpreter',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},body:'data='+encodeURIComponent(query)});
    if(!res.ok) throw new Error(`Overpass ${res.status}`);
    const data=await res.json();
    const extra=data.elements.map(el=>{
      const tags=el.tags||{}; const lat=el.lat??el.center?.lat, lng=el.lon??el.center?.lon; if(!lat||!lng)return null;
      const sport=tags.sport; const cat=tags.leisure==='playground'?'playground':sport;
      if(!categoryMeta[cat])return null;
      return {id:`osm-${el.type}-${el.id}`,name:tags.name||`Community ${categoryMeta[cat].label}`,lat,lng,categories:[cat],address:[tags['addr:housenumber'],tags['addr:street'],tags['addr:postcode']].filter(Boolean).join(' ')||'Mitcham / Merton area',description:'Community-mapped location. Facilities and public access have not been independently verified.',source:'community',sourceUrl:`https://www.openstreetmap.org/${el.type}/${el.id}`};
    }).filter(Boolean).filter(x=>!verifiedPlaces.some(v=>distanceKm([v.lat,v.lng],[x.lat,x.lng])<0.12 && v.categories.some(c=>x.categories.includes(c))));
    places=[...verifiedPlaces,...extra]; render();
  } catch(err) { console.warn('Could not load OSM community layer:',err); }
  finally { $('loadingMessage').hidden=true; }
}

render();
loadOpenStreetMapPlaces();
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('./sw.js').catch(()=>{});
