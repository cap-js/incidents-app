const cds = require('@sap/cds/lib')
const { GET, POST, DELETE, PATCH, expect, axios } = cds.test(__dirname + '/..', '--with-mocks')

axios.defaults.auth = { username: 'alice' }

describe('Draft Choreography APIs', () => {
  let draftId, incidentId

  it('Create a new incident', async () => {
    const { status, statusText, data } = await POST(`/odata/v4/processor/Incidents`, {
      title: 'Urgent attention required !',
      status_code: 'N'
    })
    draftId = data.ID
    expect(status).to.equal(201)
    expect(statusText).to.equal('Created')
  })

  it('Save the draft & check urgency code as H using custom logic', async () => {
    const response = await POST(
      `/odata/v4/processor/Incidents(ID=${draftId},IsActiveEntity=false)/ProcessorService.draftActivate`
    )
    expect(response.status).to.eql(201)
    expect(response.data.urgency_code).to.eql('H')
  })

  it ('should test the incident status', async () => {
    const {
      status,
      data: { status_code, ID }
    } = await GET(`/odata/v4/processor/Incidents(ID=${draftId},IsActiveEntity=true)`)
    incidentId = ID
    expect(status).to.eql(200)
    expect(status_code).to.eql('N')
  })

  it ('should edit the incident again', async () => {
    const { status } = await POST(
      `/odata/v4/processor/Incidents(ID=${incidentId},IsActiveEntity=true)/ProcessorService.draftEdit`,
      {
        PreserveChanges: true
      }
    )
    expect(status).to.equal(201)
  })

  it (`should set status to closed`, async () => {
    const { status } = await PATCH(`/odata/v4/processor/Incidents(ID=${incidentId},IsActiveEntity=false)`, {
      status_code: 'C'
    })
    expect(status).to.equal(200)
  })

  it ('should save the draft & check status code as C using custom logic', async () => {
    const response = await POST(
      `/odata/v4/processor/Incidents(ID=${incidentId},IsActiveEntity=false)/ProcessorService.draftActivate`
    )
    expect(response.status).to.eql(200)
  })

  it ('should test the incident status to be closed', async () => {
    const {
      status,
      data: { status_code }
    } = await GET(`/odata/v4/processor/Incidents(ID=${incidentId},IsActiveEntity=true)`)
    expect(status).to.eql(200)
    expect(status_code).to.eql('C')
  })

  it (`should re-open the closed incident-${draftId}`, async () => {
    const { status } = await POST(
      `/odata/v4/processor/Incidents(ID=${incidentId},IsActiveEntity=true)/ProcessorService.draftEdit`,
      {
        PreserveChanges: true
      }
    )
    expect(status).to.equal(201)
  })

  it (`should fail setting the status to 'N'`, async () => {
    const { status } = await PATCH(`/odata/v4/processor/Incidents(ID=${incidentId},IsActiveEntity=false)`, {
      status_code: 'N'
    })
    expect(status).to.equal(200)
  })

  it ('should fail to save drafts for closed incidents', async () => {
    try {
      await POST(
        `/odata/v4/processor/Incidents(ID=${incidentId},IsActiveEntity=false)/ProcessorService.draftActivate`
      )
    } catch (error) {
      expect(error.response.status).to.eql(500)
      expect(error.response.data.error.message).to.include(`Can't modify a closed incident`)
    }
  })

  it ('should delete the Draft', async () => {
    const response = await DELETE(`/odata/v4/processor/Incidents(ID=${draftId},IsActiveEntity=false)`)
    expect(response.status).to.eql(204)
  })

  it ('should delete the Incident', async () => {
    const response = await DELETE(`/odata/v4/processor/Incidents(ID=${draftId},IsActiveEntity=true)`)
    expect(response.status).to.eql(204)
  })
})
