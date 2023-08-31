const cds = require('@sap/cds')

// Add routes to UIs from imported packages
cds.once('bootstrap', (app) => {
  app.serve('/incidents').from('@capire/incidents', 'app/incidents/webapp')
})
