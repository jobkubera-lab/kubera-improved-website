# Mitcham Survival Map

A practical community map for residents, migrants and new arrivals in Mitcham and the London Borough of Merton.

## Live demo

https://mitcham-survival-map.kubera1979.chatgpt.site/

## Purpose

The project brings useful local services into one clear interface. It is designed for people who need fast access to everyday information without searching across many websites.

## Main categories

- Football pitches
- Basketball courts
- Cricket grounds
- Children's playgrounds
- Parks and recreation areas
- Post offices
- Recycling centres
- Donation and item-reuse points
- British Red Cross and community support
- Libraries
- GP and NHS services
- Job support
- Churches, temples and mosques
- Indian and Polish shops
- Public toilets
- Public bins
- Parking and transport

## Features

- Interactive Leaflet and OpenStreetMap interface
- Category filters
- Search by place, service or postcode
- User geolocation
- Distance-based sorting
- Verified official locations shown separately from community data
- Mobile-friendly interface
- Direct links to routes and official sources

## Technology

- HTML5
- CSS3
- JavaScript
- Leaflet.js
- OpenStreetMap
- Geolocation API
- JSON-ready data architecture

## Trust model

The map separates:

1. **Verified locations** — checked through official council, Post Office, NHS or charity sources.
2. **Community locations** — sourced from OpenStreetMap and requiring periodic review.

Opening hours and services can change. Users should check official sources before travelling.

## Portfolio value

This project demonstrates:

- civic technology product thinking;
- geospatial data organisation;
- user-centred design;
- multilingual and migrant-friendly service design;
- frontend development;
- practical local research;
- public-interest AI and digital mapping concepts.

## Planned structure

```text
mitcham-survival-map/
├── index.html
├── styles.css
├── app.js
├── manifest.webmanifest
├── README.md
├── CHANGELOG.md
├── data/
│   ├── sports.json
│   ├── playgrounds.json
│   ├── post-offices.json
│   ├── recycling.json
│   ├── donations.json
│   ├── support.json
│   └── community-services.json
└── docs/
    ├── DATA_SOURCES.md
    ├── ROADMAP.md
    └── CASE_STUDY.md
```

## Roadmap

- [x] Create interactive map prototype
- [x] Add search and filters
- [x] Add geolocation
- [x] Add sport, playground, post, recycling and support categories
- [ ] Move all locations into structured JSON files
- [x] Recheck mapped park coordinates against official Merton Council Google Maps links
- [ ] Add source verification dates to every non-park location
- [ ] Add accessibility information
- [ ] Add multilingual interface
- [ ] Add user-submitted corrections
- [ ] Expand to Wimbledon, Morden, Croydon and Sutton
- [ ] Publish as a standalone GitHub repository

## Author

**Nikola Kubera**  
AI generalist · Civic technology builder · Migration services specialist

GitHub: https://github.com/jobkubera-lab  
Email: jobkubera@gmail.com
