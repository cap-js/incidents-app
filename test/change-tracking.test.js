const cds = require("@sap/cds")

describe("Integration Test for ChangeTracking", () => {

  const { copy, rm, exists, path } = cds.utils; cds.root = path.resolve(__dirname,'..')
  beforeAll (()=> copy('xmpls/change-tracking.cds').to('srv/change-tracking.cds'))
  afterAll (() => rm('srv/change-tracking.cds'))

  it('should have the srv/change-tracking.cds file in place', () => {
    expect(exists('srv/change-tracking.cds')).to.be.true
  })

  const { GET, POST, PATCH, DELETE, expect, axios} = cds.test()
  axios.defaults.auth = { username: 'alice' }

  const Incidents = '/odata/v4/processor/Incidents'
  const edit = 'ProcessorService.draftEdit'
  const activate = 'ProcessorService.draftActivate'
  const active = 'IsActiveEntity=true'
  const draft = 'IsActiveEntity=false'
  let ID = null, id = null

  let processorService = null
  let ChangeView = null

  beforeAll(async () => {
    processorService = await cds.connect.to('ProcessorService')
    ChangeView = processorService.entities.ChangeView
  })

  it('Create an incident ', async () => {
    const { status, data } = await POST (`${Incidents}`, {
      title: 'Urgent attention required !',
      status_code: 'N',
      customer: { ID: '1004100' }
    })
    expect(status).to.equal(201)
    ID = `ID=${id=data.ID}` //> captures the newly created Incident's ID for subsequent use...
  })

  it('+ Activate the draft & check Urgency code as H using custom logic', async () => {
    const response = await POST `${Incidents}(${ID},${draft})/${activate}`
    expect(response.status).to.eql(201)
    expect(response.data.urgency_code).to.eql('H')
  })

  it('+ Test the incident status', async () => {
    const { status, data } = await GET `${Incidents}(${ID},${active})`
    expect(status).to.eql(200)
    expect(data.status_code).to.eql('N')
  })

  it('+ Test the title detail in ChangeView', async () => {
    const changes = await SELECT.from(ChangeView).where({
      entity: "sap.capire.incidents.Incidents",
      attribute: "title",
    })
    expect(changes.length).to.equal(1)
    const [change] = changes
    expect(change.entityKey).to.equal(id)
    expect(change.attribute).to.equal("title")
    expect(change.modification).to.equal("create")
    expect(change.valueChangedFrom).to.equal("")
    expect(change.valueChangedTo).to.equal("Urgent attention required !")
  })

  it('+ Test the status detail in ChangeView', async () => {
    const changes = await SELECT.from(ChangeView).where({
      entity: "sap.capire.incidents.Incidents",
      attribute: "status",
    })
    expect(changes.length).to.equal(1)
    const [change] = changes
    expect(change.entityKey).to.equal(id)
    expect(change.attribute).to.equal("status")
    expect(change.modification).to.equal("create")
    expect(change.valueChangedFrom).to.equal("")
    expect(change.valueChangedTo).to.equal("N")
  })

  it('+ Test the customer detail in ChangeView', async () => {
    const changes = await SELECT.from(ChangeView).where({
      entity: "sap.capire.incidents.Incidents",
      attribute: "customer",
    })
    expect(changes.length).to.equal(1)
    const [change] = changes
    expect(change.entityKey).to.equal(id)
    expect(change.attribute).to.equal("customer")
    expect(change.modification).to.equal("create")
    expect(change.valueChangedFrom).to.equal("")
    expect(change.valueChangedTo).to.equal("Sunny Sunshine")
  })

  describe("Test Changes for Update Incident", () => {
    it(`Should Close the Incident-${id}`, async ()=>{
      const {status} = await POST `${Incidents}(${ID},${active})/${edit}`
      expect(status).to.equal(201)
    })
    it(`Should Close the Incident-${id}`, async ()=>{
      const {status} = await PATCH (`${Incidents}(${ID},${draft})`,{status_code: 'C'})
      expect(status).to.equal(200)
    })
    it('+ Activate the draft & check Status code as C using custom logic', async () => {
      const {status} = await POST `${Incidents}(${ID},${draft})/${activate}`
      expect(status).to.eql(200)
    })
    it('+ Test the status detail in ChangeView', async () => {
      // await GET `${Incidents}?$filter=ID eq ${id}`
      const changes = await SELECT.from(ChangeView).where({
        entity: "sap.capire.incidents.Incidents",
        attribute: "status",
        modification: 'update',
      })
      expect(changes.length).to.equal(1)
      const [change] = changes
      expect(change.entityKey).to.equal(id)
      expect(change.attribute).to.equal("status")
      expect(change.modification).to.equal("update")
      expect(change.valueChangedFrom).to.equal("N")
      expect(change.valueChangedTo).to.equal("C")
    })
  })

  describe("Test Changes for Delete Incident", () => {
    it('- Delete the Incident', async () => {
      const {status} = await DELETE `${Incidents}(${ID},${active})`
      expect(status).to.eql(204)
    })

    it('+ Test the status detail in ChangeView', async () => {
      const changes = await SELECT.from(ChangeView).where({
        entity: "sap.capire.incidents.Incidents",
        attribute: "status",
      })
      expect(changes.length).to.equal(0)
    })
  })

})
