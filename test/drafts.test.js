const cds = require('@sap/cds')

describe('Draft Choreography APIs', () => {

  const { GET, POST, DELETE, PATCH, expect, axios } = cds.test(__dirname+'/..')
  axios.defaults.auth = { username: 'alice' }

  const Incidents = '/odata/v4/processor/Incidents'
  const edit = 'ProcessorService.draftEdit'
  const activate = 'ProcessorService.draftActivate'
  const active = 'IsActiveEntity=true'
  const draft = 'IsActiveEntity=false'
  let ID

  it('should create a new incident', async () => {
    const { status, data } = await POST (`${Incidents}`, {
      title: 'Urgent attention required !',
      status_code: 'N'
    })
    expect(status).to.equal(201)
    ID = `ID=${data.ID}` //> captures the newly created Incident's ID for subsequent use...
  })

  it('should save the draft & check urgency code as H using custom logic', async () => {
    const { status, data } = await POST `${Incidents}(${ID},${draft})/${activate}`
    expect(status).to.eql(201)
    expect(data.urgency_code).to.eql('H')
  })

  it ('should test the incident status', async () => {
    const { status, data } = await GET `${Incidents}(${ID},${active})`
    expect(status).to.eql(200)
    expect(data.status_code).to.eql('N')
  })

  it ('should edit the incident again', async () => {
    const {status} = await POST `${Incidents}(${ID},${active})/${edit}`
    expect(status).to.equal(201)
  })

  it (`should set status to closed`, async () => {
    const { status } = await PATCH (`${Incidents}(${ID},${draft})`, { status_code: 'C' })
    expect(status).to.equal(200)
  })

  it ('should save the draft & check status code as C using custom logic', async () => {
    const {status} = await POST `${Incidents}(${ID},${draft})/${activate}`
    expect(status).to.eql(200)
  })

  it ('should test the incident status to be closed', async () => {
    const { status, data } = await GET `${Incidents}(${ID},${active})`
    expect(status).to.eql(200)
    expect(data.status_code).to.eql('C')
  })

  it (`should re-open the closed incident-${ID}`, async () => {
    const {status} = await POST `${Incidents}(${ID},${active})/${edit}`
    expect(status).to.equal(201)
  })

  it (`should fail setting the status to 'N'`, async () => {
    const {status} = await PATCH (`${Incidents}(${ID},${draft})`, { status_code: 'N' })
    expect(status).to.equal(200)
  })

  it ('should fail to save drafts for closed incidents', async () => {
    try {
      await POST `${Incidents}(${ID},${draft})/${activate}`
    } catch (error) {
      expect(error.response.status).to.eql(500)
      expect(error.response.data.error.message).to.include(`Can't modify a closed incident`)
    }
  })

  it ('should delete the Draft', async () => {
    const {status} = await DELETE `${Incidents}(${ID},${draft})`
    expect(status).to.eql(204)
  })

  it ('should delete the Incident', async () => {
    const {status} = await DELETE `${Incidents}(${ID},${active})`
    expect(status).to.eql(204)
  })

})
