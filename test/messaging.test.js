const cds = require("@sap/cds")

describe("Integration Test for Eventing", () => {

  const { GET, POST, PATCH, expect, axios } = cds.test(__dirname + '/../xmpls/messaging','--with-mocks')
  cds.env.features.mocked_bindings = false // we don't want to use remote bindings
  axios.defaults.auth = { username: "alice" }

  const bupa = '/odata/v4/api-business-partner'
  const Incidents = '/odata/v4/processor/Incidents'
  const edit = 'ProcessorService.draftEdit'
  const activate = 'ProcessorService.draftActivate'
  const active = 'IsActiveEntity=true'
  const draft = 'IsActiveEntity=false'
  let ID, id

  describe("GET should return 200", () => {

    it("Should return list of Business Partners", async () => {
      const { status } = await GET `${bupa}/A_BusinessPartner`
      expect(status).to.eql(200)
    })

    it("Should return list of Business Partners Address", async () => {
      const { status } = await GET `${bupa}/A_BusinessPartnerAddress`
      expect(status).to.eql(200)
    })

    it("Should return list of Business Partners Email Address", async () => {
      const { status } = await GET `${bupa}/A_AddressEmailAddress`
      expect(status).to.eql(200)
    })

    it("Should return list of Business Partners Address PhoneNumber", async () => {
      const { status } = await GET `${bupa}/A_AddressPhoneNumber`
      expect(status).to.eql(200)
    })

  })


  describe('Draft Choreography APIs', () => {

    it('Create an incident ', async () => {
      let { status, data } = await POST(`${Incidents}`, {
        title: 'Urgent attention required !',
        status_code: 'N',
        customer: { ID: '1004100' }
      })
      expect(status).to.equal(201)
      ID = `ID=${id=data.ID}` //> captures the newly created Incident's ID for subsequent use...
    })

    it('+ Activate the draft & check Urgency code as H using custom logic', async () => {
      let { status, data } = await POST `${Incidents}(${ID},${draft})/${activate}`
      expect(status).to.eql(201)
      expect(data.urgency_code).to.eql('H')
    })

    it('+ Test the customer detail', async () => {
      let { status, data } = await GET `${Incidents}?$filter=ID eq ${id}`
      expect(status).to.eql(200)
      expect(data.value).to.exist
      expect(data.value[0]).to.contains({
        customer_ID: '1004100'
      })
    })

    describe("Create annd Update Business Partner", () => {

      it("Update Business Partner", async () => {
        let { status } = await PATCH(`${bupa}/A_BusinessPartner('1004100')`, {
          to_BusinessPartnerAddress: [{
            AddressID: "457",
            to_EmailAddress: [{
              AddressID: "457",
              Person: "johnson",
              OrdinalNumber: "334",
              EmailAddress: "sunny@test.com"
            }]
          }]
        })
        expect(status).to.eql(200)
      })

      it("Verify the Address of Business Partner", async () => {
        let { status, data } = await GET `${bupa}/A_BusinessPartnerAddress?$filter=BusinessPartner eq '1004100'`
        expect(status).to.eql(200)
        expect(data.value).to.exist
        expect(data.value[0]).to.contains({
          AddressID: "457",
        })
      })

      it("Verify the Email address of Business Partner", async () => {
        let { status, data } = await GET `${bupa}/A_AddressEmailAddress?$filter=AddressID eq '457'`
        expect(status).to.eql(200)
        expect(data.value).to.exist
        expect(data.value[0]).to.contains({
          AddressID: "457",
          Person: "johnson",
          OrdinalNumber: "334",
          EmailAddress: "sunny@test.com"
        })
      })

    })

    it(`Should Close the Incident-${ID}`, async () => {
      const { status } = await POST `${Incidents}(${ID},${active})/${edit}`
      expect(status).to.equal(201)
    })
  })
})
