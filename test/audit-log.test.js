const cds = require("@sap/cds")

describe("Integration Test for AuditLog", () => {

  const { copy, rm, exists, path } = cds.utils; cds.root = path.resolve(__dirname,'..')
  beforeAll (()=> copy('xmpls/data-privacy.cds').to('srv/data-privacy.cds'))
  afterAll (()=> rm('srv/data-privacy.cds'))

  const { GET, POST, PATCH , expect, axios} = cds.test()
  axios.defaults.auth = { username: 'alice' }

  it('should have the copied files in place', () => {
    expect(exists('srv/data-privacy.cds')).to.be.true
  })

  let ID
  let audit; beforeAll (async () => {
    audit = await cds.connect.to('audit-log')
    audit.on('PersonalDataModified', req => expect(req.event).to.include('PersonalDataModified'))
    audit.on('SensitiveDataRead', req => expect(req.event).to.include("SensitiveDataRead"))
  })

  it("Should return list of Customers", async () => {
    const {status} = await GET `/odata/v4/processor/Customers`
    expect(status).to.eql(200)
  })


  it("Should return list of Customers data by explicitly selecting the fields", async () => {
    const {status} = await GET `/odata/v4/processor/Customers?$select=name`
    expect(status).to.eql(200)
  })


  it('Creating a customer with personal data', async () => {
    const { status, data } = await POST (`/odata/v4/admin/Customers`, {
      ID: "{{$guid}}",
      firstName: "Bob",
      lastName: "Builder",
      email: "bob.builder@example.com"
    })
    expect(status).to.equal(201)
    ID = data.ID
  })

  it('Updating a customer with personal data details', async () => {
    const {status} = await PATCH (`/odata/v4/admin/Customers('${ID}')`, {
      "addresses": [
        {
          "city": "Walldorf",
          "postCode": "69190",
          "streetAddress": "Dietmar-Hopp-Allee 16"
        }
      ]
    })
    expect(status).to.equal(200)
  })

})
