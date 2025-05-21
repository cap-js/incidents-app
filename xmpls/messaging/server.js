const cds = require ('@sap/cds')

// Add routes to UI
cds.once('bootstrap',(app)=>{
    if  (cds.watched) app.serve ('/incidents') .from ('../..', '../../app/incidents/webapp')
})

// Returning cds.server
module.exports = cds.server