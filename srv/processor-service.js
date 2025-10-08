const cds = require('@sap/cds')

class ProcessorService extends cds.ApplicationService {

  async populateDummyPDFs(Incidents) {
    // Dummy method to populate an actual PDF file into each incident record
    // In a real app, you would e.g. generate a PDF based on incident data
    // or print a PDF that is connected to the incident (e.g. a report that
    // is stored in a document management system)
    const path = require('path')
    const fs = require('fs')

    // Load the template PDF file
    const pdfPath = path.join(__dirname, '../xmpls', 'SolarPanelReport.pdf')
    const templatePDF = fs.readFileSync(pdfPath)
    console.log(`📄 Template PDF loaded: ${templatePDF.length} bytes`)

    // Get all existing incidents and update them with PDF data
    const incidents = await SELECT.from(Incidents)
    
    for (const incident of incidents) {
      // Update each incident with its own PDF file
      await UPDATE(Incidents)
        .set({
          file: templatePDF,
          fileName: `Incident_${incident.ID}_Report.pdf`
        })
        .where({ ID: incident.ID })
      
      console.log(`Stored PDF for incident ${incident.ID}: Incident_${incident.ID}_Report.pdf`)
    }
    
    console.log(`Populated ${incidents.length} incidents with PDF files`)
  }

  async init() {

    const { Incidents } = this.entities
    
    // Populate PDFs in the database during initialization
    await this.populateDummyPDFs(Incidents);

    // Connect to print service once during initialization
    const printer = await cds.connect.to('print');

    // Print action handler - print the stored PDF for this incident
    this.on('printIncidentFile', Incidents, async (req) => {
      // Get the incident with its stored PDF file - explicitly include file field
      // This is not automatically included in queries because it's a BLOB

      if(!req.data.qnameID || !req.data.copies) 
        return req.error(400, 'Please provide qnameID and copies in the request body')

      const incident = await SELECT.one.from(req.subject).columns(['ID', 'title', 'fileName', 'file'])
      
      if (!incident) {
        return req.error(404, 'Incident not found')
      }

      // Check if the incident has a PDF file
      if (!incident.file) {
        return req.error(400, 'No PDF file found for this incident')
      }

      try {
        // Send the incident's PDF to the print service
        await printer.print({
          qname: req.data.qnameID, //todo: allow user to select queue
          numberOfCopies: req.data.copies, //todo: allow user to select number of copies
          docsToPrint: [{
            fileName: incident.fileName,
            content: incident.file.toString('base64'),
            isMainDocument: true
          }]
        })

        // Success message to user
        req.info(`Incident "${incident.title}" PDF (${incident.fileName}) sent to printer successfully`)
      } catch (error) {
        console.error('Print error:', error)
        req.error(500, `Failed to print PDF: ${error.message}`)
      }
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
