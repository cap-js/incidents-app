const cds = require('@sap/cds/lib')
const { GET, expect, axios } = cds.test(__dirname + '/..', '--with-mocks')

axios.defaults.auth = { username: 'alice' }

describe('Test The GET Endpoints', () => {
  it('Should check Processor Service', async () => {
    const processorService = await cds.connect.to('ProcessorService')
    const { Incidents } = processorService.entities
    expect(await SELECT.from(Incidents)).to.have.length(4)
  })

  it('Should check Customers', async () => {
    const processorService = await cds.connect.to('ProcessorService')
    const { Customers } = processorService.entities
    expect(await SELECT.from(Customers)).to.have.length(3)
  })

  it('Test Expand Entity Endpoint', async () => {
    const { data } = await GET`/odata/v4/processor/Customers?$select=firstName&$expand=incidents`
    expect(data).to.be.an('object')
  })
})
