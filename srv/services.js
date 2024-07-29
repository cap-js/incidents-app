const cds = require('@sap/cds')

class ProcessorService extends cds.ApplicationService {
  /** Registering custom event handlers */
  init() {
    this.before('UPDATE', 'Incidents', req => this.onUpdate(req))
    this.before('CREATE', 'Incidents', req => this.changeUrgencyDueToSubject(req.data))
    return super.init()
  }

  changeUrgencyDueToSubject(data) {
    if (data) {
      const incidents = Array.isArray(data) ? data : [data]
      incidents.forEach(incident => {
        if (incident.title?.toLowerCase().includes('urgent')) {
          incident.urgency = { code: 'H', descr: 'High' }
        }
      })
    }
  }

  /** Custom Validation */
  async onUpdate(req) {
    const { status_code } = await SELECT.one(req.subject, i => i.status_code).where({ ID: req.data.ID })
    if (status_code === 'C') {
      return req.reject(`Can't modify a closed incident`)
    }
  }
}

class AdminService extends cds.ApplicationService {
  async init() {
    const { Customers } = this.entities

    const bupa = await cds.connect.to('API_BUSINESS_PARTNER')
    const { A_BusinessPartner } = bupa.entities

    async function upsertCustomer(id) {
      const remote = await bupa.get(A_BusinessPartner, id)
      const local = await SELECT.from(Customers, id)
      // TODO: field mapping from A_BusinessPartner to Customers
      if (local) await UPDATE(Customers, id).with(remote)
      else await INSERT.into(Customers).entries(remote)
    }

    bupa.on('BusinessPartner.Created', async function (msg) {
      await upsertCustomer(msg.data.BusinessPartner)
    })
    bupa.on('BusinessPartner.Changed', async function (msg) {
      await upsertCustomer(msg.data.BusinessPartner)
    })

    return super.init()
  }
}

module.exports = { ProcessorService, AdminService }


// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// For demo purposess only...
const _require = id => {try{ return require(id) } catch(e) { if (e.code !== 'MODULE_NOT_FOUND') throw e }}
cds.once("served", ()=> _require('./alert-notifications')?.prototype.init.call(cds.services.ProcessorService))
