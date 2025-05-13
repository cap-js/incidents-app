// The things in here are for demo purposes only.
// They are not required in real projects.

const cds = require('@sap/cds')
if (cds.env.profiles.includes('development')) {

  // Add support role to mock users
  const { alice, bob } = cds.requires.auth.users
  alice.roles = ['admin','support']
  bob.roles = ['support']

  // Extend ProcessorService impl with custom handlers from alert-notifications.js
  // eslint-disable-next-line no-global-assign
  require = id => {try{ return module.require(id) } catch(e) { if (e.code !== 'MODULE_NOT_FOUND') throw e }}
  cds.once("served", ()=> require('./alert-notifications')?.prototype.init.call(cds.services.ProcessorService))
}
