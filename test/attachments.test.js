const cds = require('@sap/cds')

describe('Test attachments service', () => {

  const { copy, rm, exists, path } = cds.utils; cds.root = path.resolve(__dirname,'..')
  beforeAll (()=> copy('xmpls/attachments.cds').to('srv/attachments.cds'))
  afterAll (() => rm('srv/attachments.cds'))

  it('should have the srv/attachments.cds file in place', () => {
    expect(exists('srv/attachments.cds')).to.be.true
  })

  const { GET, POST, PUT, DELETE , expect, axios} = cds.test()
  axios.defaults.auth = { username: 'alice' }

  const Incidents = '/odata/v4/processor/Incidents'
  const edit = 'ProcessorService.draftEdit'
  const activate = 'ProcessorService.draftActivate'
  const active = 'IsActiveEntity=true'
  const draft = 'IsActiveEntity=false'
  let ID = null, id = null

  it('should create a new incident ', async () => {
    const { status, data } = await POST(`${Incidents}`, {
      title: 'Urgent attention required !',
      status_code: 'N'
    })
    expect(status).to.equal(201)
    ID = `ID=${data.ID}` //> captures the newly created Incident's ID for subsequent use...
  })

  it('should activate the draft', async () => {
    const response = await POST `${Incidents}(${ID},${draft})/${activate}`
    expect(response.status).to.eql(201)
  })

  it(`should edit the incident to add an attachment`, async () => {
    await POST `${Incidents}(${ID},${active})/${edit}`

    // Add an attachment entry
    const created = await POST (`${Incidents}(${ID},${draft})/attachments`, {
      up__ID: ID,
      filename: "SolarPanelReport.pdf",
      mimeType: "application/pdf",
      status: "Clean",
    }, { headers: { 'Content-Type': 'application/json' }})
    expect(created.status).to.equal(201)
    id = `ID=${created.data.ID}` //> captures the newly created Attachments's ID for subsequent use...

    // Upload the file
    const filePath = path.join(cds.root, 'xmpls', 'SolarPanelReport.pdf');
    const fileSize = require('fs').statSync(filePath).size;

    const uploaded = await PUT (`${Incidents}_attachments(up__${ID},${id},${draft})/content`,
      require('fs').createReadStream (filePath),
      { headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': fileSize
      }}
    )
    expect(uploaded.status).to.equal(204)

    // Activate the draft
    const activated = await POST `${Incidents}(${ID},${draft})/${activate}`
    expect(activated.status).to.eql(200)
  })


  it('should check the uploaded file', async () => {
    const { status, data} = await GET `${Incidents}(${ID},${active})/attachments(up__${ID},${id})/content`
    expect(status).to.equal(200)
    expect(data).to.not.be.undefined
  })

  it('should delete the incident', async () => {
    const { status } = await DELETE `${Incidents}(${ID},${active})`
    expect(status).to.eql(204)
  })
})
