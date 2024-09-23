//This enables mocking events for local runs 
module.exports = function () {
    const { A_BusinessPartner } = this.entities;
   
    this.after('UPDATE', A_BusinessPartner, async data => {
      const messaging =  await cds.connect.to('messaging');
      const event = { BusinessPartner: data.BusinessPartner }
      console.log('>> BusinessPartner.Changed')
      await messaging.emit('sap.s4.beh.businesspartner.v1.BusinessPartner.Changed.v1', event);
    })
  }