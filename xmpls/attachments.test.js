const cds = require('@sap/cds')
const { GET, POST, PUT, DELETE , expect, axios} = cds.test(__dirname + '/..', '--with-mocks')
const { createReadStream } = cds.utils.fs;
const { join } = cds.utils.path;
axios.defaults.auth = { username: 'alice' }

jest.setTimeout(11111)

describe('Test attachments service', () => {
    let draftId = null;
    let docId = null;

  it('Create an incident ', async () => {
    const { status, statusText, data } = await POST(`/odata/v4/processor/Incidents`, {
      title: 'Urgent attention required !',
      status_code: 'N'
    })
    draftId = data.ID
    expect(status).to.equal(201)
    expect(statusText).to.equal('Created')
  })

  it('+ Activate the draft', async () => {
    const response = await POST(
      `/odata/v4/processor/Incidents(ID=${draftId},IsActiveEntity=false)/ProcessorService.draftActivate`
    )
    expect(response.status).to.eql(201)

  })


  describe('Test the file upload', () => {
    it(`Should Close the Incident-${draftId}`, async () => {
      const { status } = await POST(
        `/odata/v4/processor/Incidents(ID=${draftId},IsActiveEntity=true)/ProcessorService.draftEdit`,
        {
          PreserveChanges: true
        }
      )
 

    const content = createReadStream(join(__dirname, "../xmpls/SolarPanelReport.pdf"));
    const attachRes = await POST(`/odata/v4/processor/Incidents(ID=${draftId},IsActiveEntity=false)/attachments`, 
    {
      up__ID: draftId,
      filename: "SolarPanelReport.pdf",
      mimeType: "application/pdf",
      status: "Clean",
      createdAt: new Date(),
    }, { headers: { 'Content-Type': 'application/json' } });
    
        console.log(attachRes);
    docId = attachRes.data.ID;
        console.log("doc id"+docId);
    // Upload the file content with PUT
    const uploadResp = await PUT(
      `/odata/v4/processor/Incidents_attachments(up__ID=${draftId},ID=${docId},IsActiveEntity=false)/content`,
      content,
      { headers: { 'Content-Type': 'application/pdf' } }
    );
    expect(uploadResp.status).to.equal(204);
    // add attachments here

 
      const response = await POST(
        `/odata/v4/processor/Incidents(ID=${draftId},IsActiveEntity=false)/ProcessorService.draftActivate`
      )
      expect(response.status).to.eql(200)
    })
    

  })
  it('Check the uploaded file', async () => {
    const response = await GET(`/odata/v4/processor/Incidents(ID=${draftId},IsActiveEntity=true)/attachments(up__ID=${draftId},ID=${docId},IsActiveEntity=true)/content`);
    expect(response.status).to.equal(200);
    expect(response.data).to.not.be.undefined;
  })

  it('- Delete the Incident', async () => {
    const response = await DELETE(`/odata/v4/processor/Incidents(ID=${draftId},IsActiveEntity=true)`)
    expect(response.status).to.eql(204)
  })
})
