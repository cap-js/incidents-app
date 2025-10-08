const cds = require("@sap/cds/lib");

// Dummy method to populate an actual PDF file into each incident record
// In a real app, you would e.g. generate a PDF based on incident data
// or print a PDF that is connected to the incident (e.g. a report that
// is stored in a document management system)

module.exports = async function () {
  const { "sap.capire.incidents.Incidents.attachments": Attachments } =
    cds.model.entities;
  const path = require("path");
  const fs = require("fs");
  const { Incidents } = cds.model.entities;

  // Load the template PDF file
  const pdfPath = path.join(__dirname, "../xmpls", "SolarPanelReport.pdf");
  const templatePDF = fs.readFileSync(pdfPath);

  console.log(`📄 Template PDF loaded: ${templatePDF.length} bytes`);

  const newIncidents = [
    {
      ID: "3b23bb4b-4ac7-4a24-ac02-aa10cabd842c",
      customer_ID: 1004155,
      title: "Inverter not functional",
      urgency_code: "H",
      status_code: "C",
    },
    {
      ID: "3a4ede72-244a-4f5f-8efa-b17e032d01ee",
      customer_ID: 1004161,
      title: "No current on a sunny day",
      urgency_code: "H",
      status_code: "N",
    },
    {
      ID: "3ccf474c-3881-44b7-99fb-59a2a4668418",
      customer_ID: 1004161,
      title: "Strange noise when switching off Inverter",
      urgency_code: "M",
      status_code: "N",
    },
    {
      ID: "3583f982-d7df-4aad-ab26-301d4a157cd7",
      customer_ID: 1004100,
      title: "Solar panel broken",
      urgency_code: "H",
      status_code: "I",
    },
  ];

  for (const incident of newIncidents) {
    await INSERT.into(Incidents).entries({
      ...incident,
      file: templatePDF,
      fileName: `Incident_${incident.ID}_Report.pdf`,
    });
    console.log(`Inserted incident ${incident.ID}: ${incident.title}`);
  }
};
