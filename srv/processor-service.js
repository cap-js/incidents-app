const cds = require('@sap/cds')

class ProcessorService extends cds.ApplicationService {
  init() {

    const { Incidents } = this.entities

    this.before ('UPDATE', Incidents, async req => {
      const closed = await SELECT.one(1) .from (req.subject) .where `status.code = 'C'`
      if (closed) req.reject `Can't modify a closed incident!`
    })

    this.before (['WRITE'], Incidents, ({data}) => {
      if (data.title?.match(/urgent/)) data.urgency_code = 'H'
    })

    return super.init()
  }
}

module.exports = { ProcessorService }


// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// For demo purposess only...
const _require = id => {try{ return require(id) } catch(e) { if (e.code !== 'MODULE_NOT_FOUND') throw e }}
cds.once("served", ()=> _require('./alert-notifications')?.prototype.init.call(cds.services.ProcessorService))
