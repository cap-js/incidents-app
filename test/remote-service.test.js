const cds = require("@sap/cds");
const { GET, POST, PATCH, DELETE, expect, axios } = cds.test(__dirname + '../../', '--with-mocks');
axios.defaults.auth = { username: "alice" };

describe("Integration Test for Remote Service", () => {
    let draftId,incidentId;
    describe("Test the BusinessPartner GET Endpoints", () => {
        
        it("Should return list of Business Partners", async () => {
        const response = await GET("/odata/v4/api-business-partner/A_BusinessPartner");
        expect(response.status).to.eql(200);
      });
  
      it("Should return list of Business Partners Address", async () => {
        const response = await GET("/odata/v4/api-business-partner/A_BusinessPartnerAddress");
        expect(response.status).to.eql(200);
      });
      it("Should return list of Business Partners Email Address", async () => {
        const response = await GET("/odata/v4/api-business-partner/A_AddressEmailAddress");
        expect(response.status).to.eql(200);
      });
      it("Should return list of Business Partners Address PhoneNumber", async () => {
        const response = await GET("/odata/v4/api-business-partner/A_AddressPhoneNumber");
        expect(response.status).to.eql(200);
      });
    });

    describe('Draft Choreography APIs', () => {
      it('Create an incident ', async () => {
        const { status, statusText, data } = await POST(`/odata/v4/processor/Incidents`, {
          title: 'Urgent attention required !',
          status_code: 'N',
          "customer": {ID:"1004100"}
        });
        draftId = data.ID;
        expect(status).to.equal(201);
        expect(statusText).to.equal('Created');
      });
      it('+ Activate the draft & check Urgency code as H using custom logic', async () => {
        const response = await POST(
          `/odata/v4/processor/Incidents(ID=${draftId},IsActiveEntity=false)/ProcessorService.draftActivate`
        );
        expect(response.status).to.eql(201);
        expect(response.data.urgency_code).to.eql('H');
      });
      it('+ Test the customer detail', async () => {
        const response = await GET(`/odata/v4/processor/Incidents?$filter=ID eq ${draftId}`);
        //incidentId = ID;
        expect(response.status).to.eql(200);
        expect(response.data.value).to.exist;
        expect(response.data.value[0]).to.contains({
            "customer_ID": "1004100"
          });
          incidentId = response.data.ID;  
      });
   
        describe("Create annd Update Business Partner", () => {
            it("Creates a new Business Partner", async () => {
            const payload = {
                BusinessPartner: "17100015",
                BusinessPartnerIsBlocked: true,
                BusinessPartnerFullName: "John Doee",
            };
            const response = await POST(
                "/odata/v4/api-business-partner/A_BusinessPartner",
                payload
            );
            expect(response.status).to.eql(201);
            });
            it("Update Business Partner", async () => {
                const response = await PATCH(
                `/odata/v4/api-business-partner/A_BusinessPartner('17100015')`,
                {BusinessPartnerIsBlocked: false}
                );
                expect(response.status).to.eql(200);
            });
        }); 
         
            it(`Should Close the Incident-${draftId}`, async ()=>{
                const {status} = await POST(`/odata/v4/processor/Incidents(ID=${draftId},IsActiveEntity=true)/ProcessorService.draftEdit`,
                {
                "PreserveChanges": true
                });
                expect(status).to.equal(201);
            }); 
            it(`Update Business Partner details of the Incident`, async ()=>{
                const {status } = await PATCH(`/odata/v4/processor/Incidents(ID=${draftId},IsActiveEntity=false)`,{customer_ID: '17100015'});
                expect(status).to.equal(200);
            }); 
    });
});
