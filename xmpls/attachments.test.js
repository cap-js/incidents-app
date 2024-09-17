const { expect } = require("chai");
const cds = require("@sap/cds");
const axios = require("axios");
const { urls } = require("./util/config");
const { getAccessToken } = require("./utils.js");
const { createReadStream } = cds.utils.fs;
const { join } = cds.utils.path;

axios.defaults.baseURL = urls.baseURL;

describe('REST API Tests', () => {
  let accessToken;
  
  before(async () => {
    accessToken = await getAccessToken();
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`; 
  });

  describe('Create a new incident', () => {
    let draftId = null;
    let docId = null;
    const newIncident = {
      title: 'attachments working 14',
      status_code: 'N'
    };

    it('Create an incident', async () => {
      try {
        const res = await axios.post("/odata/v4/processor/Incidents", newIncident, {
          headers: { 'Content-Type': 'application/json' }
        });
        expect(res.status).to.equal(201); // HTTP 201 Created status expected
        draftId = res.data.ID;
        expect(res.data).to.include.keys('ID', 'title', 'status_code');
        expect(res.data.title).to.equal(newIncident.title);
        expect(res.data.status_code).to.equal(newIncident.status_code);
      } catch (error) {
        console.error('Error creating incident:', error.response ? error.response.data : error.message);
        throw error;
      }
    });

    it('+ Activate the draft', async () => {
      console.log(`Draft ID: ${draftId}`);
      try {
        const res = await axios.post(`/odata/v4/processor/Incidents(ID=${draftId},IsActiveEntity=false)/ProcessorService.draftActivate`, {}, {
          headers: { 'Content-Type': 'application/json' }
        });
        expect(res.status).to.equal(201); // HTTP 201 Created status expected
      } catch (error) {
        console.error('Error activating draft:', error.response ? error.response.data : error.message);
        throw error;
      }
    });

    it('Upload attachment to the incident', async () => {
      try {
        // Draft Edit
        await axios.post(`/odata/v4/processor/Incidents(ID=${draftId},IsActiveEntity=true)/ProcessorService.draftEdit`, 
        { PreserveChanges: true }, { headers: { 'Content-Type': 'application/json' } });

        const content = createReadStream(join(__dirname, "util/SolarPanelReport.pdf"));
        const attachRes = await axios.post(`/odata/v4/processor/Incidents(ID=${draftId},IsActiveEntity=false)/attachments`, 
        {
          up__ID: draftId,
          filename: "SolarPanelReport.pdf",
          mimeType: "application/pdf",
          status: "Clean",
          createdAt: new Date(),
        }, { headers: { 'Content-Type': 'application/json' } });

        docId = attachRes.data.ID;

        // Upload the file content with PUT
        const uploadResp = await axios.put(
          `/odata/v4/processor/Incidents_attachments(up__ID=${draftId},ID=${docId},IsActiveEntity=false)/content`,
          content,
          { headers: { 'Content-Type': 'application/pdf' } }
        );
        expect(uploadResp.status).to.equal(204); // HTTP 204 No Content indicates success

        // Prepare draft actions
        await axios.post(`/odata/v4/processor/Incidents(ID=${draftId},IsActiveEntity=false)/ProcessorService.draftPrepare`, {
          SideEffectsQualifier: "",
        });
      } catch (error) {
        console.error('Error uploading attachment:', error.response ? error.response.data : error.message);
        throw error;
      }
    });

    it('+ Activate the draft again', async () => {
      try {
        const res = await axios.post(`/odata/v4/processor/Incidents(ID=${draftId},IsActiveEntity=false)/ProcessorService.draftActivate`, {});
        expect(res.status).to.equal(200); // Expecting HTTP 200 status on final activation
      } catch (error) {
        console.error('Error activating draft:', error.response ? error.response.data : error.message);
        throw error;
      }
    });

    it('Read the file content', async () => {
      try {
        const response = await axios.get(`/odata/v4/processor/Incidents(ID=${draftId},IsActiveEntity=true)/attachments(up__ID=${draftId},ID=${docId},IsActiveEntity=true)/content`);
        expect(response.status).to.equal(200);
        expect(response.data).to.not.be.undefined;
      } catch (error) {
        console.error('Error reading file content:', error.response ? error.response.data : error.message);
        throw error;
      }
    });

    it('- Delete the Incident', async () => {
      try {
        const res = await axios.delete(`/odata/v4/processor/Incidents(ID=${draftId},IsActiveEntity=true)`);
        expect(res.status).to.equal(204); // HTTP 204 No Content expected
      } catch (error) {
        console.error('Error deleting incident:', error.response ? error.response.data : error.message);
        throw error;
      }
    });
  });
});
