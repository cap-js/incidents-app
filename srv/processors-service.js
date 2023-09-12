const cds = require('@sap/cds')

class ProcessorsService extends cds.ApplicationService {
  /** Registering custom event handlers */
  init() {
    this.before("SAVE", "Incidents", (req) => this.ensureTimestampIsPresent(req))
    return super.init()
  }

  async ensureTimestampIsPresent (req) {
    if (req.data.conversations) {
      for(const conversation of req.data.conversations) {
        if(!conversation.timestamp) {
            conversation.timestamp = new Date(Date.now())
        }
      }
    }
  }
}

module.exports = ProcessorsService