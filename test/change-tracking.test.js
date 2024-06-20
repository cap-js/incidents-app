const cds = require("@sap/cds");
const { GET, POST, PATCH, DELETE , expect, axios} = cds.test(__dirname + '/..', '--with-mocks')

describe("Integration Test for ChangeTracking", () => {
    let draftId,incidentId;
    axios.defaults.auth = { username: "alice" };
    let processorService = null;
    let ChangeView = null;
    beforeAll(async () => {
      processorService = await cds.connect.to('ProcessorService');
      ChangeView = processorService.entities.ChangeView;
    });
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

      it('+ Test the incident status', async () => {
        const { status, data: { status_code, ID } } = await GET(`/odata/v4/processor/Incidents(ID=${draftId},IsActiveEntity=true)`);
        incidentId = ID;
        expect(status).to.eql(200);
        expect(status_code).to.eql('N');
      });

      it('+ Test the title detail in ChangeView', async () => {
        const response = await GET(`/odata/v4/processor/Incidents?$filter=ID eq ${draftId}`);
        const incidentChanges = await SELECT.from(ChangeView).where({
                entity: "sap.capire.incidents.Incidents",
                attribute: "title",
            })
        expect(incidentChanges.length).to.equal(1);
        const incidentChange = incidentChanges[0];
        expect(incidentChange.entityKey).to.equal(draftId);
        expect(incidentChange.attribute).to.equal("title");
        expect(incidentChange.modification).to.equal("create");
        expect(incidentChange.valueChangedFrom).to.equal("");
        expect(incidentChange.valueChangedTo).to.equal("Urgent attention required !");
      });

      it('+ Test the status detail in ChangeView', async () => {
        const response = await GET(`/odata/v4/processor/Incidents?$filter=ID eq ${draftId}`);
        const incidentChanges = await SELECT.from(ChangeView).where({
                entity: "sap.capire.incidents.Incidents",
                attribute: "status",
            })
        expect(incidentChanges.length).to.equal(1);
        const incidentChange = incidentChanges[0];
        expect(incidentChange.entityKey).to.equal(draftId);
        expect(incidentChange.attribute).to.equal("status");
        expect(incidentChange.modification).to.equal("create");
        expect(incidentChange.valueChangedFrom).to.equal("");
        expect(incidentChange.valueChangedTo).to.equal("N");
      });

      it('+ Test the customer detail in ChangeView', async () => {
        const response = await GET(`/odata/v4/processor/Incidents?$filter=ID eq ${draftId}`);
        const incidentChanges = await SELECT.from(ChangeView).where({
                entity: "sap.capire.incidents.Incidents",
                attribute: "customer",
            })
        expect(incidentChanges.length).to.equal(1);
        const incidentChange = incidentChanges[0];
        expect(incidentChange.entityKey).to.equal(draftId);
        expect(incidentChange.attribute).to.equal("customer");
        expect(incidentChange.modification).to.equal("create");
        expect(incidentChange.valueChangedFrom).to.equal("");
        expect(incidentChange.valueChangedTo).to.equal("Sunny Sunshine");
      });
    
    describe("Test Changes for Update Incident", () => {
      it(`Should Close the Incident-${draftId}`, async ()=>{
        const {status} = await POST(`/odata/v4/processor/Incidents(ID=${draftId},IsActiveEntity=true)/ProcessorService.draftEdit`,
        {
          "PreserveChanges": true
         });
        expect(status).to.equal(201);
      });
      it(`Should Close the Incident-${draftId}`, async ()=>{
        const {status } = await PATCH(`/odata/v4/processor/Incidents(ID=${draftId},IsActiveEntity=false)`,{status_code: 'C'});
        expect(status).to.equal(200);
      });
      it('+ Activate the draft & check Status code as C using custom logic', async () => {
        const response = await POST(
          `/odata/v4/processor/Incidents(ID=${draftId},IsActiveEntity=false)/ProcessorService.draftActivate`
        );
        expect(response.status).to.eql(200);
      });
      it('+ Test the status detail in ChangeView', async () => {
        const response = await GET(`/odata/v4/processor/Incidents?$filter=ID eq ${draftId}`);
        const incidentChanges = await SELECT.from(ChangeView).where({
                entity: "sap.capire.incidents.Incidents",
                attribute: "status",
                modification: 'update',
            })
        expect(incidentChanges.length).to.equal(1);
        const incidentChange = incidentChanges[0];
        expect(incidentChange.entityKey).to.equal(draftId);
        expect(incidentChange.attribute).to.equal("status");
        expect(incidentChange.modification).to.equal("update");
        expect(incidentChange.valueChangedFrom).to.equal("N");
        expect(incidentChange.valueChangedTo).to.equal("C");
      });
    });  

    describe("Test Changes for Delete Incident", () => {
      it('- Delete the Incident', async () => {
        const response = await DELETE(`/odata/v4/processor/Incidents(ID=${draftId},IsActiveEntity=true)`);
        expect(response.status).to.eql(204);
      });

      it('+ Test the status detail in ChangeView', async () => {
        const incidentChanges = await SELECT.from(ChangeView).where({
                entity: "sap.capire.incidents.Incidents",
                attribute: "status",
            })
        expect(incidentChanges.length).to.equal(0);
      });
    });
});
