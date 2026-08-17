'use strict';

const CENTER = [51.404, -0.168];
const CHECKED = '2026-08-16';
const categoryMeta = {
  park:{icon:'🌳',label:'Parks'}, playground:{icon:'🛝',label:'Playgrounds'}, sport:{icon:'⚽',label:'Sport'},
  toilets:{icon:'🚻',label:'Toilets confirmed'}, water:{icon:'🚰',label:'Water confirmed'}, benches:{icon:'🪑',label:'Benches confirmed'},
  post:{icon:'✉️',label:'Post offices'}, recycling:{icon:'♻️',label:'Recycling'}, support:{icon:'➕',label:'Support'}
};
const filters = ['all','park','playground','sport','toilets','water','benches','post','recycling','support'];
const preciseParkCoordinates = {
  'lavender-park':[51.4121564,-0.1702661], 'edenvale-open-space':[51.4173939,-0.1543993],
  'rowan-park':[51.4082271,-0.1409719], 'london-road-playing-fields':[51.3997725,-0.1731175],
  'sherwood-recreation-ground':[51.3985693,-0.1405055], 'tamworth-recreation-ground':[51.4146067,-0.1622619]
};
const supplementalPlaces = [
  {id:'donnelly-green',name:'Donnelly Green',lat:51.3998879,lng:-0.1294104,categories:['park','playground'],address:'South Lodge Avenue, Mitcham, CR4 1LT',description:'Separate junior and toddler play areas.',sourceUrl:'https://www.merton.gov.uk/leisure-recreation-and-culture/parks-and-open-spaces/parks-and-recreation-grounds/mitcham/donnelly-green-open-space'},
  {id:'lewis-road',name:'Lewis Road Recreation Ground',lat:51.4066696,lng:-0.1731796,categories:['park','playground','sport'],address:'Lewis Road, Mitcham, CR4',description:'Play areas, paddling pool and kickabout space.',sourceUrl:'https://www.merton.gov.uk/leisure-recreation-and-culture/parks-and-open-spaces/parks-and-recreation-grounds/mitcham/lewis-road-recreation-ground'},
  {id:'mitcham-cricket-green',name:'Mitcham Cricket Green',lat:51.401301,lng:-0.1672341,categories:['sport'],address:'Cricket Green, Mitcham, CR4',description:'Historic cricket area at the centre of Mitcham.',sourceUrl:'https://www.merton.gov.uk/leisure-recreation-and-culture/parks-and-open-spaces'},
  {id:'mitcham-post',name:'Mitcham Post Office',lat:51.405159,lng:-0.162848,categories:['post'],address:'5 Langdale Parade, Mitcham, CR4 2PF',description:'Royal Mail, Parcelforce and Post Office services.',sourceUrl:'https://www.postoffice.co.uk/branch-finder/174013x/mitcham'},
  {id:'church-road-post',name:'Church Road Post Office',lat:51.4035384,lng:-0.1762446,categories:['post'],address:'57–59 Church Road, Mitcham, CR4 3BF',description:'Post, banking and selected document services.',sourceUrl:'https://www.postoffice.co.uk/branch-finder/0690139/church-road'},
  {id:'london-road-post',name:'London Road 494 Post Office',lat:51.3973142,lng:-0.1733613,categories:['post'],address:'494 London Road, Mitcham, CR4 4BA',description:'Mail, banking, parcel and travel services.',sourceUrl:'https://www.postoffice.co.uk/branch-finder/0920134/london-road-494'},
  {id:'garth-road',name:'Garth Road Household Reuse and Recycling Centre',lat:51.3850509,lng:-0.2259745,categories:['recycling'],address:'63–69 Amenity Way, Morden, SM4 4AX',description:'Merton reuse and recycling centre. Cars require booking.',sourceUrl:'https://www.merton.gov.uk/rubbish-and-recycling/garth-road'},
  {id:'majestic-way-textiles',name:'Majestic Way Textile Recycling Bank',lat:51.4063183,lng:-0.1630414,categories:['recycling'],address:'Majestic Way, Mitcham, CR4 2JS',description:'Council-listed textile recycling point.',sourceUrl:'https://www.merton.gov.uk/rubbish-and-recycling/recycling-sites'},
  {id:'junction-textiles',name:'Mitcham Junction Textile Recycling Bank',lat:51.3930894,lng:-0.1587053,categories:['recycling'],address:'Mitcham Junction Station, CR4 4HG',description:'Council-listed textile recycling point.',sourceUrl:'https://www.merton.gov.uk/rubbish-and-recycling/recycling-sites'},
  {id:'phipps-textiles',name:'Phipps Bridge Textile Recycling Bank',lat:51.4097,lng:-0.1815,categories:['recycling'],address:'Haslemere Avenue / Thornville Grove, Mitcham',description:'Council-listed textile recycling point.',sourceUrl:'https://www.merton.gov.uk/rubbish-and-recycling/recycling-sites'},
  {id:'pollards-textiles',name:'Pollards Hill Textile Recycling Bank',lat:51.3999366,lng:-0.1322358,categories:['recycling'],address:'South Lodge Avenue, Pollards Hill, CR4 1LT',description:'Council-listed textile recycling point.',sourceUrl:'https://www.merton.gov.uk/rubbish-and-recycling/recycling-sites'},
  {id:'red-cross-london',name:'British Red Cross — London Refugee Service',lat:51.4038,lng:-0.1681,categories:['support'],address:'London-wide service — contact before travelling',description:'Emergency help, casework and signposting. Phone 020 7704 5670.',sourceUrl:'https://www.redcross.org.uk/get-help/get-help-as-a-refugee/contact-your-local-refugee-service',virtual:true}
].map(p=>({...p,source:'official',checked:CHECKED,confidence:'high'}));

const $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
const radians = deg => deg*Math.PI/180;
function distanceKm(a,b){const R=6371,dLat=radians(b[0]-a[0]),dLng=radians(b[1]-a[1]);const x=Math.sin(dLat/2)**2+Math.cos(radians(a[0]))*Math.cos(radians(b[0]))*Math.sin(dLng/2)**2;return 2*R*Math.asin(Math.sqrt(x));}
const directionsUrl = p => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${p.lat},${p.lng}`)}`;
const field = (props,key) => props[key] && typeof props[key] === 'object' ? props[key] : null;
const confirmed = f => Boolean(f && f.value && f.status !== 'UNVERIFIED');

function parkFromFeature(feature){
  const p=feature.properties,[rawLng,rawLat]=feature.geometry.coordinates;
  const override=preciseParkCoordinates[feature.id];
  const facilities=(p.facilitiesNote||[]).map(x=>x.value).filter(Boolean);
  const searchable=facilities.join(' ').toLowerCase();
  const categories=['park'];
  if(/play|paddling|splash/.test(searchable)) categories.push('playground');
  if(/football|basketball|tennis|cricket|gym|sport|pitch/.test(searchable)) categories.push('sport');
  if(confirmed(field(p,'toilets'))) categories.push('toilets');
  if(confirmed(field(p,'drinkingWater'))) categories.push('water');
  if(confirmed(field(p,'benches'))) categories.push('benches');
  const official=[p.name,p.address,p.size,p.openingHours,p.contact,...(p.facilitiesNote||[])].filter(Boolean).find(x=>x.sourceUrl);
  return {id:feature.id,name:p.name.value,lat:override?.[0]??rawLat,lng:override?.[1]??rawLng,categories:[...new Set(categories)],address:p.address?.value||'Address not confirmed',description:facilities.slice(0,2).join(' · ')||'Park facilities are being documented.',source:override||String(p.coordinateStatus).startsWith('VERIFIED')?'official':'estimated',coordinateStatus:override?'VERIFIED_OFFICIAL':p.coordinateStatus,checked:official?.dateChecked||CHECKED,confidence:override?'high':p.coordinateConfidence||'medium',sourceUrl:official?.sourceUrl||p.coordinateSource,props:p,facilities};
}

const intelligenceParks=(window.PARK_INTELLIGENCE?.features||[]).map(parkFromFeature);
const parkIds=new Set(intelligenceParks.map(p=>p.id));
const places=[...intelligenceParks,...supplementalPlaces.filter(p=>!parkIds.has(p.id))];
let communityPlaces=[],activeFilter='all',searchTerm='',userLocation=null,userMarker=null;
const markers=new Map();
const map=L.map('map',{zoomControl:true}).setView(CENTER,13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);
const markerLayer=L.layerGroup().addTo(map);

function primaryCategory(p){return p.categories[0]||'support'}
function sourceClass(p){return p.source==='community'?'community':p.source==='estimated'?'estimated':'official'}
function markerIcon(p){const meta=categoryMeta[primaryCategory(p)]||categoryMeta.park;return L.divIcon({className:'',html:`<div class="custom-marker ${sourceClass(p)}"><span>${meta.icon}</span></div>`,iconSize:[34,34],iconAnchor:[17,31],popupAnchor:[0,-28]})}
function popupHtml(p){return `<div class="popup"><h3>${esc(p.name)}</h3><p>${esc(p.address)}</p><p>${esc(p.description)}</p><a href="${esc(p.sourceUrl)}" target="_blank" rel="noopener">Source</a>${p.virtual?'':` · <a href="${directionsUrl(p)}" target="_blank" rel="noopener">Directions</a>`}</div>`}
function allPlaces(){return [...places,...communityPlaces]}
function visiblePlaces(){const q=searchTerm.trim().toLowerCase();let out=allPlaces().filter(p=>(activeFilter==='all'||p.categories.includes(activeFilter))&&(!q||`${p.name} ${p.address} ${p.description} ${p.categories.join(' ')} ${(p.facilities||[]).join(' ')}`.toLowerCase().includes(q)));const mode=$('sortSelect').value;if(mode==='name')out.sort((a,b)=>a.name.localeCompare(b.name));else if(mode==='distance'&&userLocation)out.sort((a,b)=>distanceKm(userLocation,[a.lat,a.lng])-distanceKm(userLocation,[b.lat,b.lng]));else out.sort((a,b)=>sourceClass(a).localeCompare(sourceClass(b))||a.name.localeCompare(b.name));return out}
function placeCard(p){const meta=categoryMeta[primaryCategory(p)]||categoryMeta.park;const dist=userLocation&&!p.virtual?`${distanceKm(userLocation,[p.lat,p.lng]).toFixed(1)} km`:'';const label=p.source==='community'?'OSM':p.source==='estimated'?'Estimated':'Checked';return `<article class="place-card" data-id="${esc(p.id)}"><div class="place-icon">${meta.icon}</div><div><div class="place-top"><h3>${esc(p.name)}</h3><span class="badge ${sourceClass(p)}">${label}</span></div><p class="address">${esc(p.address)}</p><p class="description">${esc(p.description)}</p><div class="tags">${p.categories.slice(0,4).map(c=>`<span class="tag">${categoryMeta[c]?.icon||''} ${esc(categoryMeta[c]?.label||c)}</span>`).join('')}${dist?`<span class="tag">${dist}</span>`:''}</div><div class="card-actions"><button type="button" data-details="${esc(p.id)}">Details & sources</button>${p.virtual?'':`<button type="button" data-focus="${esc(p.id)}">Show on map</button><a href="${directionsUrl(p)}" target="_blank" rel="noopener">Directions</a>`}</div></div></article>`}
function render(){const items=visiblePlaces();markerLayer.clearLayers();markers.clear();$('resultCount').textContent=items.length;$('resultsTitle').textContent=activeFilter==='all'?'All useful places':categoryMeta[activeFilter]?.label||'Places';$('resultList').innerHTML=items.length?items.map(placeCard).join(''):'<div class="empty-state">No confirmed matches. Try another filter.</div>';items.forEach(p=>{if(p.virtual)return;const marker=L.marker([p.lat,p.lng],{icon:markerIcon(p),title:p.name}).bindPopup(popupHtml(p));marker.addTo(markerLayer);markers.set(p.id,marker)});document.querySelectorAll('[data-focus]').forEach(b=>b.addEventListener('click',()=>focusPlace(b.dataset.focus)));document.querySelectorAll('[data-details]').forEach(b=>b.addEventListener('click',()=>openDetails(b.dataset.details)));setTimeout(()=>map.invalidateSize(),0)}
function focusPlace(id){const p=allPlaces().find(x=>x.id===id);if(!p||p.virtual)return;map.flyTo([p.lat,p.lng],16,{duration:.6});markers.get(id)?.openPopup();document.querySelectorAll('.place-card').forEach(c=>c.classList.toggle('selected',c.dataset.id===id))}
function factRow(label,f){const value=confirmed(f)?f.value:'Not confirmed';return `<div class="fact"><b>${esc(label)}</b><span>${esc(value)}</span></div>`}
function openDetails(id){const p=allPlaces().find(x=>x.id===id);if(!p)return;const props=p.props;const facts=props?factRow('Opening hours',field(props,'openingHours'))+factRow('Toilets',field(props,'toilets'))+factRow('Benches',field(props,'benches'))+factRow('Bins',field(props,'bins'))+factRow('Dog rules',field(props,'dogRules'))+factRow('Car park',field(props,'carPark')):`<div class="fact"><b>Verification</b><span>Checked ${esc(p.checked)}</span></div>`;const sourceSet=new Set([p.sourceUrl,...(props?.facilitiesNote||[]).map(x=>x.sourceUrl)].filter(Boolean));$('dialogContent').innerHTML=`<div class="dialog-body"><p class="kicker dark">${esc(p.coordinateStatus||'Verified source')}</p><h2>${esc(p.name)}</h2><p>${esc(p.address)}</p><p>${esc(p.description)}</p><div class="fact-grid">${facts}</div><p><b>Checked:</b> ${esc(p.checked||'Not recorded')} · <b>Confidence:</b> ${esc(p.confidence||'not recorded')}</p><h3>Sources</h3><div class="source-list">${[...sourceSet].map((url,i)=>`<a href="${esc(url)}" target="_blank" rel="noopener">Source ${i+1}: ${esc(url)}</a>`).join('')||'<span>Source not yet recorded.</span>'}</div></div>`;$('detailsDialog').showModal()}

function buildFilters(){$('filterBar').innerHTML=filters.map(key=>`<button class="filter-chip ${key==='all'?'active':''}" type="button" data-filter="${key}">${key==='all'?'All places':`${categoryMeta[key].icon} ${categoryMeta[key].label}`}</button>`).join('')}
buildFilters();
$('filterBar').addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(!b)return;activeFilter=b.dataset.filter;document.querySelectorAll('.filter-chip').forEach(x=>x.classList.toggle('active',x===b));render()});
$('searchInput').addEventListener('input',e=>{searchTerm=e.target.value;render()});$('sortSelect').addEventListener('change',render);
$('resetButton').addEventListener('click',()=>{activeFilter='all';searchTerm='';userLocation=null;$('searchInput').value='';document.querySelectorAll('.filter-chip').forEach(x=>x.classList.toggle('active',x.dataset.filter==='all'));map.setView(CENTER,13);render()});
$('locateButton').addEventListener('click',()=>{if(!navigator.geolocation)return alert('Location is not supported by this browser.');$('locateButton').textContent='Finding you…';navigator.geolocation.getCurrentPosition(pos=>{userLocation=[pos.coords.latitude,pos.coords.longitude];if(userMarker)map.removeLayer(userMarker);const icon=L.divIcon({className:'',html:'<div class="user-marker"></div>',iconSize:[18,18],iconAnchor:[9,9]});userMarker=L.marker(userLocation,{icon,title:'Your location'}).addTo(map).bindPopup('Your approximate location').openPopup();map.flyTo(userLocation,14);$('locateButton').textContent='Location found';render()},()=>{$('locateButton').textContent='Use my location';alert('Location could not be accessed. Check browser permissions.')},{enableHighAccuracy:true,timeout:10000})});
$('closeDialog').addEventListener('click',()=> $('detailsDialog').close());$('detailsDialog').addEventListener('click',e=>{if(e.target===$('detailsDialog'))$('detailsDialog').close()});

async function loadCommunity(){ $('loadingMessage').hidden=false;const query='[out:json][timeout:18];(nwr[leisure=playground](51.37,-0.23,51.44,-0.12);nwr[leisure=pitch][sport~"football|basketball|cricket"](51.37,-0.23,51.44,-0.12););out center tags;';try{const res=await fetch('https://overpass-api.de/api/interpreter',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},body:'data='+encodeURIComponent(query)});if(!res.ok)throw new Error(String(res.status));const data=await res.json();communityPlaces=data.elements.map(el=>{const t=el.tags||{},lat=el.lat??el.center?.lat,lng=el.lon??el.center?.lon;if(!lat||!lng)return null;const playground=t.leisure==='playground';return {id:`osm-${el.type}-${el.id}`,name:t.name||`Community ${playground?'playground':'sports pitch'}`,lat,lng,categories:[playground?'playground':'sport'],address:[t['addr:street'],t['addr:postcode']].filter(Boolean).join(', ')||'Mitcham / Merton area',description:'Community-mapped location; facilities and access are not independently verified.',source:'community',sourceUrl:`https://www.openstreetmap.org/${el.type}/${el.id}`}}).filter(Boolean).filter(x=>!places.some(p=>!p.virtual&&distanceKm([p.lat,p.lng],[x.lat,x.lng])<.12));render()}catch(error){console.warn('Community layer unavailable',error)}finally{$('loadingMessage').hidden=true}}

render();loadCommunity();window.addEventListener('resize',()=>setTimeout(()=>map.invalidateSize(),120));window.addEventListener('orientationchange',()=>setTimeout(()=>map.invalidateSize(),250));document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(()=>map.invalidateSize(),100)});if('ResizeObserver'in window)new ResizeObserver(()=>map.invalidateSize()).observe($('map'));if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(console.warn);
