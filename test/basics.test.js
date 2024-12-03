const cds = require('@sap/cds')

describe('Test The GET Endpoints', () => {
  const { GET, expect, axios } = cds.test(__dirname+'/..')
  axios.defaults.auth = { username: 'alice' }

  it('Should check Processor Service', async () => {
    let srv = await cds.connect.to('ProcessorService')
    let {Incidents} = srv.entities
    let incidents = await SELECT.from(Incidents)
    expect(incidents).to.have.length(4)
  })

  it('Should check Customers', async () => {
    let srv = await cds.connect.to('ProcessorService')
    let {Customers} = srv.entities
    let customers = await SELECT.from(Customers)
    expect(customers).to.have.length(3)
  })

  it('Test Expand Entity Endpoint', async () => {
    let {data} = await GET `/odata/v4/processor/Customers?$select=firstName&$expand=incidents`
    expect(data).to.be.an('object')
  })
})
