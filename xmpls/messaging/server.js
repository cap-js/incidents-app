const cds = require ('@sap/cds')

// Add routes to UI
cds.once('bootstrap',(app)=>{
    if  (cds.watched) app.serve ('/incidents') .from ('../..', 'app/incidents/webapp')
})

if (cds.env.profiles.includes('development')) {

  // Add support role to mock users
  const { alice, bob } = cds.requires.auth.users
  alice.roles = ['admin','support']
  bob.roles = ['support']
}

// Returning cds.server
module.exports = cds.server