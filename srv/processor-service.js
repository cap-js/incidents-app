const cds = require('@sap/cds')

class ProcessorService extends cds.ApplicationService {
  async init() {

    const { Incidents } = this.entities

    // Connect to print service once during initialization
    const printer = await cds.connect.to('print');

    // Print action handler - using the established connection
    this.on('printIncidentFile', Incidents, async (req) => {
      // For bound actions, we can use req.subject to get the entity
      const incident = await SELECT.one.from(req.subject)
      
      if (!incident) {
        return req.error(404, 'Incident not found')
      }

      // Create print content  
      const printContent = `
INCIDENT REPORT
===============
Title: ${incident.title}
ID: ${incident.ID}
Status: ${incident.status_code}
Urgency: ${incident.urgency_code}
Customer ID: ${incident.customer_ID}
Created: ${incident.createdAt}
Modified: ${incident.modifiedAt}
===============
      `.trim()

      // Call the printer service (similar to notifications)
      await printer.print({
        qname: 'CONSOLE_DEFAULT',
        numberOfCopies: 1,
        docsToPrint: [{
          fileName: `incident_${incident.ID}.txt`,
          content: Buffer.from(printContent).toString('base64'),
          isMainDocument: true
        }]
      })

      // Success message to user
      req.info(`Incident "${incident.title}" sent to printer`)
    })

    this.before ('UPDATE', Incidents, async req => {
      let closed = await SELECT.one(1) .from (req.subject) .where `status.code = 'C'`
      if (closed) req.reject `Can't modify a closed incident!`
    })

    this.before (['CREATE','UPDATE'], Incidents, req => {
      let urgent = req.data.title?.match(/urgent/i)
      if (urgent) req.data.urgency_code = 'H'
    })

    return super.init()
  }

  
}

module.exports = { ProcessorService }
