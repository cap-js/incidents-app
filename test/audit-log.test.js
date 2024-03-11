const cds = require("@sap/cds");
const { GET, POST, PATCH, DELETE, expect, axios, assert } = cds.test(__dirname + '/..', '--with-mocks')

axios.defaults.auth = { username: "alice" };
describe("Integration Test for AuditLog", () => {
  let customerID,audit;
  beforeAll(async () => {
     audit = await cds.connect.to('audit-log')
  });

      it("Should return list of Customers", async () => {
        const response = await GET("/odata/v4/processor/Customers");
        
        audit.on('SensitiveDataRead', function (req) {
            const { event, data } = req
            assert.ok(event.includes("SensitiveDataRead"))
          })
        expect(response.status).to.eql(200);
      });


      it("Should return list of Customers data by explicitly selecting the fields", async () => {
        const response = await GET("/odata/v4/processor/Customers?$select=name");
        expect(response.status).to.eql(200);
      });


      it('Creating a customer with personal data', async () => {
        const response = await POST(`/odata/v4/admin/Customers`, {
            ID: "{{$guid}}",
            firstName: "Bob",
            lastName: "Builder",
            email: "bob.builder@example.com"
        });
        audit.on('PersonalDataModified', function (req) {
          const { event, data } = req
          assert.ok(event.includes("PersonalDataModified"))
        })
        customerID = response.data.ID;
        expect(response.status).to.equal(201);
      });


      it('Updating a customer with personal data details', async () => {
        const audit = await cds.connect.to('audit-log')
        audit.on('PersonalDataModified', function (req) {
            const { event, data } = req
            assert.ok(event.includes("PersonalDataModified"))
          })
        const response = await PATCH(`/odata/v4/admin/Customers('${customerID}')`, {
          "addresses": [
            {
              "city": "Walldorf",
              "postCode": "69190",
              "streetAddress": "Dietmar-Hopp-Allee 16"
            }
          ]
        });
        expect(response.status).to.equal(200);
      });

});
