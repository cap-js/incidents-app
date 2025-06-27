/**
* Same as Remote Service Sample. Added additional Handlers for recieving and
* handling events/messages
*/
const cds = require('@sap/cds')

class ProcessorService extends cds.ApplicationService {
  /** Registering custom event handlers */
  async init() {
    this.before("UPDATE", "Incidents", (req) => this.onUpdate(req));
    this.before("CREATE", "Incidents", (req) => this.changeUrgencyDueToSubject(req.data));
    this.on('READ', 'Customers', (req) => this.onCustomerRead(req));
    this.on(['CREATE','UPDATE'], 'Incidents', (req, next) => this.onCustomerCache(req, next));
    this.S4bupa = await cds.connect.to('API_BUSINESS_PARTNER');
    this.remoteService = await cds.connect.to("RemoteService"); // REVISIT: What is this for?

    // Added Handlers for Eventing on top of remote service sample
    this.messaging = await cds.connect.to('messaging');
    this.messaging.on('sap.s4.beh.businesspartner.v1.BusinessPartner.Changed.v1', async ({ event, data }) => await this.onBusinessPartnerChanged(event, data))
    return super.init();
  }

  async onBusinessPartnerChanged(event, data){
    const {Customers} = this.entities;
    const {BusinessPartnerAddress} = this.remoteService.entities;
    console.log('<< received', event, data)
    const Id = data.BusinessPartner;
    const customer =  await this.S4bupa.run(SELECT.one(BusinessPartnerAddress, address => {
      address('*'),
      address.email(emails => {
        emails('*')})
      }).where({BusinessPartner: Id}));
    if(customer){
      customer.email = customer.email[0]?.email
      const result= await cds.run(UPDATE(Customers).where({ID: customer.ID}).set({email:customer.email}));
      console.log("result",result);
    }
  }

  async onCustomerCache(req, next) {
    const { Customers } = this.entities;
    const newCustomerId = req.data.customer_ID;
    const result = await next();
    const { BusinessPartner } = this.remoteService.entities;
    if (newCustomerId && newCustomerId !== "") {
      console.log('>> CREATE or UPDATE customer!');

      // Expands are required as the runtime does not support path expressions for remote services
      const customer = await this.S4bupa.run(SELECT.one(BusinessPartner, bp => {
        bp('*');
          bp.addresses(address => {
            address('email', 'phoneNumber');
              address.email(emails => {
                emails('email')
              });
              address.phoneNumber(phoneNumber => {
                phoneNumber('phone')
              })
          })
      }).where({ ID: newCustomerId }));

      if(customer) {
        customer.email = customer.addresses[0]?.email[0]?.email;
        customer.phone = customer.addresses[0]?.phoneNumber[0]?.phone;
        delete customer.addresses;
        delete customer.name;
        await UPSERT.into(Customers).entries(customer);
      }
    }
    return result;
  }


  async onCustomerRead(req) {
    console.log('>> delegating to S4 service...', req.query);
    let { limit, one } = req.query.SELECT
    if(!limit) limit = { rows: { val: 55 }, offset: { val: 0 } } //default limit to 55 rows

    const { BusinessPartner } = this.remoteService.entities;
    const query = SELECT.from(BusinessPartner, bp => {
      bp('*');
      bp.addresses(address => {
        address('email');
        address.email(emails => {
          emails('email');
        });
      });
    }).limit(limit)

    if(one){
      // support for single entity read
      query.where({ ID: req.data.ID });
    }
    // Expands are required as the runtime does not support path expressions for remote services
    let result = await this.S4bupa.run(query);

    result = result.map((bp) => ({
      ID: bp.ID,
      name: bp.name,
      email: (bp.addresses[0]?.email[0]?.email || '')
    }));

    // Explicitly set $count so the values show up in the value help in the UI
    result.$count = 1000;
    console.log("after result", result);
    return result;
  }


  changeUrgencyDueToSubject(data) {
    let urgent = data.title?.match(/urgent/i)
    if (urgent) data.urgency_code = 'H'
  }

  /** Custom Validation */
  async onUpdate (req) {
    let closed = await SELECT.one(1) .from (req.subject) .where `status.code = 'C'`
    if (closed) req.reject `Can't modify a closed incident!`
  }
}
module.exports = { ProcessorService }