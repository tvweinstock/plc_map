import algoliasearch from 'algoliasearch';
import algoliasearchHelper from 'algoliasearch-helper';
import hogan from 'hogan.js';
require('./scss/main.scss')

// INITIALIZATION
const APPLICATION_ID = '7Y37FN61ON';
const SEARCH_ONLY_API_KEY = 'a89293ea82af8f76f6d67cdc3bb62cdf';
const INDEX_NAME = 'plc';
const PARAMS = {hitsPerPage: 60};

// Client + Helper initialization
const algolia = algoliasearch(APPLICATION_ID, SEARCH_ONLY_API_KEY);
const algoliaHelper = algoliasearchHelper(algolia, INDEX_NAME, PARAMS);
algoliaHelper.setQueryParameter('getRankingInfo', true);

// DOM AND TEMPLATES BINDING
const mapContainer = document.querySelector('#plc-map');
const hitsContainer = document.querySelector('#hits');
const searchInput = document.querySelector('#search-input');
const hitsTemplateString = document.querySelector('#hits-template').textContent;
const hitsTemplate = hogan.compile(hitsTemplateString);
const noHitsTemplateString = document.querySelector('#no-results-template').textContent;
const noHitsTemplate = hogan.compile(noHitsTemplateString);

// Map initialization
const plcMap = new google.maps.Map(mapContainer, {
  center: {lat: 48.860955, lng: 2.393714},
  zoom: 16,
  styles: [{
      "featureType": "water",
      "stylers": [{"visibility": "on"}, {"color": "#b5cbe4"}] },
    { "featureType": "landscape",
      "stylers": [{"color": "#efefef"}] },
    { "featureType": "road.highway", "elementType": "geometry",
      "stylers": [{"color": "#83a5b0"}] },
    { "featureType": "road.arterial", "elementType": "geometry",
      "stylers": [{ "color": "#bdcdd3" }] },
    { "featureType": "road.local", "elementType": "geometry",
      "stylers": [{ "color": "#ffffff" }] },
    { "featureType": "poi.park", "elementType": "geometry",
      "stylers": [{ "color": "#e3eed3" }] },
    { "featureType": "administrative",
      "stylers": [{ "visibility": "on" }, { "lightness": 33 }]},
    { "featureType": "road" },
    { "featureType": "poi.park", "elementType": "labels",
    "stylers": [{"visibility": "on"}, {"lightness": 20}]},
    {"featureType": "road","stylers": [{"lightness": 20}]}]
});
let markers = [];

// TEXTUAL SEARCH
searchInput.addEventListener('keyup', function(e) {
  const query = this.value;
  algoliaHelper.setQuery(query).search();
});


// DISPLAY RESULTS
algoliaHelper.on('result', function(content) {
  renderMap(content);
  renderHits(content);
});

algoliaHelper.on('error', function(error) {
  console.error(error);
});

function renderHits(content) {
  if (content.hits.length === 0) {
    hits.innerHTML = noHitsTemplate.render();
    return;
  }
  const searchedHits = content.hits.slice(0, 20);
  searchedHits.map(hit => {
    hit.displayName = hit.name;
    hit.displayProfession = hit.profession;
  });
  hitsContainer.innerHTML = hitsTemplate.render(content)
}

function removeMarkersFromMap() {
  markers.map((marker) => {
    console.log(marker);
    marker.setMap(null);
  });
}

function renderMap(content) {
  removeMarkersFromMap();
  markers = [];
  // console.log(content.hits);

  content.hits.map(hit => {
    const {name, objectID, profession, birth_day, death_day} = hit;
    const marker = new google.maps.Marker({
      position: {lat: hit._geoloc.lat, lng: hit._geoloc.lng},
      map: plcMap,
      plot_id: objectID,
      title:`${name} - ${birth_day} - ${death_day}`
    });

    markers.push(marker);
    console.log(markers);

  });
}
