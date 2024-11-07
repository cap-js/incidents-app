const cds = require("@sap/cds")
cds.once('bootstrap', (app) => {
  app.serve('/incidents/app').from(__dirname,'/app/incidents/webapp')
})
