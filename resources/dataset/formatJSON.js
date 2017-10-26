const plData = require('./pl_data.json');
const fs = require('fs');
const plDataShort = [];

plData.forEach(person => {
  const personObj = {
    name: person.nom,
    profession: person.personnalites[0].activite,
    objectID: person.personnalites[0].id,
    birth_day: person.personnalites[0].date_naissance,
    death_day: person.personnalites[0].date_deces,
    _geoloc: {
      lat: Number(person.node_osm.latitude),
      lng: Number(person.node_osm.longitude)
    }
  }
  plDataShort.push(personObj);
});

fs.writeFileSync('pl_data_short.json', JSON.stringify(plDataShort, '', 2));
