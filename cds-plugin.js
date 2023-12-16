const cds = require("@sap/cds");
cds.once('bootstrap', (app) => {
  app.serve('/incidents/app').from('@capire/incidents', 'app/incidents/webapp')
})
