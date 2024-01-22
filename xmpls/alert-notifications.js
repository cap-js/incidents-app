const cds = require('@sap/cds')
/**
 * Here we add handlers to the incidents app's ProcessorService
 * programatically send alert notifications.
 */
module.exports = class ProcessorService extends cds.ApplicationService {
  async init() {

    const alert = await cds.connect.to('notifications')
    const { Incidents } = this.entities

    /**
     * Send an ad-hoc notification when a new incident is created.
     */
    this.after ('CREATE', Incidents, async incident => {
      let [ customer, supporters ] = await Promise.all ([
        customer4 (incident),
        supporters4 (incident)
      ])
      await alert.notify ({
        recipients: supporters,
        priority: { H: 'HIGH', L: 'LOW' }[incident.urgency_code],
        title: `New incident created by ${customer.info}`,
        description: incident.title,
      })
    })

    /**
     * Send a notification using a pre-defined template when an incident is resolved.
     */
    this.after ('UPDATE', Incidents, async incident => {
      if (incident.status_code === 'C') {
        let customer = await customer4 (incident)
        await alert.notify ('IncidentResolved', {
          recipients: [ customer.id ],
          data: {
            customer: customer.info,
            title: incident.title,
            user: cds.context.user.id,
          }
        })
      }
    })


    const { Customers } = this.entities
    const customer4 = async incident => {
      let customer = await SELECT.from (Customers, incident.customer_ID, c => {
        c.firstName, c.lastName, c.email
      })
      customer.info = `${customer.firstName} ${customer.lastName} (${customer.email})`
      customer.id = cds.context.user.id // Fake customer id for demo purposes only
      return customer
    }

    // Fake supporters for demo purposes
    const supporters4 = () => [ cds.context.user.id ]

    // return super.init()
  }
}
