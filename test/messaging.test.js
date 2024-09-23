const cds = require("@sap/cds");
const { GET, POST, PATCH, DELETE, expect, axios } = cds.test(__dirname + '/..', '--with-mocks')

describe("Integration Test for Eventing", () => {
    let draftId,incidentId;
    axios.defaults.auth = { username: "alice" };
    describe("GET should return 200", () => {
        
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
        expect(response.status).to.eql(200);
        expect(response.data.value).to.exist;
        expect(response.data.value[0]).to.contains({
            "customer_ID": "1004100"
          });
          incidentId = response.data.ID;  
      });
   
        describe("Create annd Update Business Partner", () => {
            it("Update Business Partner", async () => {
                const response = await PATCH(
                `/odata/v4/api-business-partner/A_BusinessPartner('1004100')`,
                {
                  to_BusinessPartnerAddress: [{
                     AddressID: "457",
                     to_EmailAddress:[{
                         AddressID: "457",
                         Person: "johnson",
                         OrdinalNumber: "334",
                         EmailAddress: "sunny@test.com"
                     }]
                 }]
             }
                );
                expect(response.status).to.eql(200);
            });
            describe("Verify the updated Business Partner", () => {
              it("Verify the Address of Business Partner", async () => {
                const response = await GET(`/odata/v4/api-business-partner/A_BusinessPartnerAddress?$filter=BusinessPartner eq '1004100'`);
                expect(response.status).to.eql(200);
                expect(response.data.value).to.exist;
                expect(response.data.value[0]).to.contains({
                  AddressID: "457",
                });
              }); 

              it("Verify the Email address of Business Partner", async () => {
                const response = await GET(`/odata/v4/api-business-partner/A_AddressEmailAddress?$filter=AddressID eq '457'`);
                expect(response.status).to.eql(200);
                expect(response.data.value).to.exist;
                expect(response.data.value[0]).to.contains({
                  AddressID: "457",
                  Person: "johnson",
                  OrdinalNumber: "334",
                  EmailAddress: "sunny@test.com"
                });
              }); 
            });
        }); 
         
            it(`Should Close the Incident-${draftId}`, async ()=>{
                const {status} = await POST(`/odata/v4/processor/Incidents(ID=${draftId},IsActiveEntity=true)/ProcessorService.draftEdit`,
                {
                "PreserveChanges": true
                });
                expect(status).to.equal(201);
            }); 
    });
});
