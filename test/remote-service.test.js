const cds = require("@sap/cds")

describe("Integration Test for Remote Service", () => {

  const { GET, POST, PATCH , expect, axios} = cds.test(__dirname + '/../xmpls/remote-service', '--with-mocks')
  cds.env.features.mocked_bindings = false // we don't want to use remote bindings
  axios.defaults.auth = { username: 'alice' }

  const bupa = '/odata/v4/api-business-partner'
  const Incidents = '/odata/v4/processor/Incidents'
  const edit = 'ProcessorService.draftEdit'
  const activate = 'ProcessorService.draftActivate'
  const active = 'IsActiveEntity=true'
  const draft = 'IsActiveEntity=false'
  let ID = null, id = null

  describe("Test the BusinessPartner GET Endpoints", () => {

    it("Should return list of Business Partners", async () => {
      const {status} = await GET `${bupa}/A_BusinessPartner`
      expect(status).to.eql(200)
    })

    it("Should return list of Business Partners Address", async () => {
      const {status} = await GET `${bupa}/A_BusinessPartnerAddress`
      expect(status).to.eql(200)
    })
    it("Should return list of Business Partners Email Address", async () => {
      const {status} = await GET `${bupa}/A_AddressEmailAddress`
      expect(status).to.eql(200)
    })
    it("Should return list of Business Partners Address PhoneNumber", async () => {
      const {status} = await GET `${bupa}/A_AddressPhoneNumber`
      expect(status).to.eql(200)
    })
  })

  describe('Draft Choreography APIs', () => {
    it('Create an incident ', async () => {
      const { status, data } = await POST (`${Incidents}`, {
        title: 'Urgent attention required !',
        status_code: 'N',
        "customer": { ID: "1004100" }
      })
      expect(status).to.equal(201)
      ID = `ID=${id=data.ID}` //> captures the newly created Incident's ID for subsequent use...
    })
    it('+ Activate the draft & check Urgency code as H using custom logic', async () => {
      const { status, data} = await POST `${Incidents}(${ID},${draft})/${activate}`
      expect(status).to.eql(201)
      expect(data.urgency_code).to.eql('H')
    })
    it('+ Test the customer detail', async () => {
      const { status, data } = await GET(`${Incidents}?$filter=ID eq ${id}`)
      expect(status).to.eql(200)
      expect(data.value).to.exist
      expect(data.value[0]).to.contains({
        "customer_ID": "1004100"
      })
    })

    describe("Create and Update Business Partner", () => {
      it("Creates a new Business Partner", async () => {
        const {status} = await POST (`${bupa}/A_BusinessPartner`, {
          BusinessPartner: "17100015",
          BusinessPartnerIsBlocked: true,
          BusinessPartnerFullName: "John Doee",
        })
        expect(status).to.eql(201)
      })
      it("Update Business Partner", async () => {
        const {status} = await PATCH (`${bupa}/A_BusinessPartner('17100015')`, {
          BusinessPartnerIsBlocked: false
        })
        expect(status).to.eql(200)
      })
    })

    it(`Should Close the Incident-${id}`, async () => {
      const {status} = await POST `${Incidents}(${ID},${active})/${edit}`
      expect(status).to.equal(201)
    })
    it(`Update Business Partner details of the Incident`, async () => {
      const {status} = await PATCH(`${Incidents}(${ID},${draft})`, { customer_ID: '17100015' })
      expect(status).to.equal(200)
    })
  })
})
