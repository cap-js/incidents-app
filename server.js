require('@sap/xotel-agent-ext-js/dist/common/tracer');
const app = require('express')()
const fesr = require("@sap/fesr-to-otel-js");
// Initialization of Exception Monitoring:
const sdklogs = require ('@opentelemetry/sdk-logs');
const calmExtAutoConf = require('@sap/xotel-agent-ext-js/dist/config/AutoInstrumentationConfig');
const cflog = require("cf-nodejs-logging-support");
const otellog = require('@sap/opentelemetry-exporter-for-sap-cloud-logging');

// Create an instance of the OpenTelemetryLogsOutputPlugin.
// By default, it will use the global logger provider.
// Use a custom loggerProvider to capture Cloud Foundry attributes.
const cfLoggerProvider = new sdklogs.LoggerProvider({resource: new otellog.CFApplicationDetector().detect()});
const otelOutputPlugin = new cflog.OpenTelemetryLogsOutputPlugin(cfLoggerProvider)

// Optionally set whether additional log fields should be included as log attributes.
// Default: include custom fields only.
otelOutputPlugin.setIncludeFieldsAsAttributes(cflog.FieldInclusionMode.CustomFieldsOnly)

// register the plugin
cflog.addOutputPlugin(otelOutputPlugin)
 
// add CALM Extension Exception Monitoring log processor
cfLoggerProvider.addLogRecordProcessor(calmExtAutoConf.createEXMLogRecordProcessor());
cfLoggerProvider.addLogRecordProcessor(new sdklogs.BatchLogRecordProcessor(new otellog.AutoCloudLoggingLogsExporter()))

cds.serve('all').in(app)
app.listen()
cds.on("bootstrap", (app) => fesr.registerFesrEndpoint(app));

 module.exports = cds.server