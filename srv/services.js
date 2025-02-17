

//const { someOtherImport } = await import("some-other-module");
const cds = require('@sap/cds')
const LOG = cds.log("aicore")

class ProcessorService extends cds.ApplicationService {
  /** Registering custom event handlers */
  init() {
    this.before('UPDATE', 'Incidents', req => this.onUpdate(req))
    this.before(['CREATE', 'UPDATE'], 'Incidents', req => this.changeUrgencyDueToSubject(req.data))
    this.on('UPDATE', 'Incidents', (req, next) => this.fillAIfields(req, next))
    return super.init()
  }

  changeUrgencyDueToSubject(data) {
    if (data) {
      const incidents = Array.isArray(data) ? data : [data]
      incidents.forEach(incident => {
        if (incident.title?.toLowerCase().includes('urgent')) {
          incident.urgency = { code: 'H', descr: 'High' }
        }
      })
    }
  }

  /** Custom Validation */
  async onUpdate(req) {
    const { status_code } = await SELECT.one(req.subject, i => i.status_code).where({ ID: req.data.ID })
    if (status_code === 'C') {
      return req.reject(`Can't modify a closed incident`)
    }
  }

  async fillAIfields(req, next) {

    await next() // actually UPDATE the subject entity
    //extract the messages from the Conversations
    let responseContent;
    let conversation = req.data.conversation;
    let messageContent = conversation.map(result => result.message)
    let messages = JSON.stringify(messageContent)
    //mock a response for local testing
    if (!cds.env.production && !cds.env.profiles.includes("hybrid")) {
      responseContent = {
        completion : 70,
        summary : "The solar panel is completely broken"
      }
    // for production
    } else {
    const { AzureOpenAiChatClient } = await import ('@sap-ai-sdk/foundation-models')

    const chatClient = new AzureOpenAiChatClient({
      deploymentId: 'dd9e85c621ccac71',
      resourceGroup: 'aic'
    });

    const response = await chatClient.run({
      messages: [
        {
          role: 'system',
          content: 'You are reading messages sent between an incident processor and a customer for an incident created. '
          + 'Based on the conversation, your task is writing a short incident summary ' +
          + 'and provide a guess to what percentage the incident is resolved (Integer between 0 and 100). '
          + 'Provide the result in a valid json object with this structure: '
          + '{completion: 70, summary: "The solar panel is broken and spare parts are being sent"} '
          + 'Make sure the json can be parsed using the javascript JSON.parse function'
        },
        {
          role: 'user',
          content: messages
        }
      ]
    });

    const responseString = response.getContent();
    LOG.info(`Request used ${JSON.stringify(response.getTokenUsage())} tokens`)
   
    try {
      responseContent = JSON.parse(responseString);
      // Validate that responseContent only has 'completion' and 'summary' properties
      if (responseContent && typeof responseContent === "object") {
        const { completion, summary } = responseContent;
        responseContent = { completion, summary };
      } else {
        throw new Error("Invalid response content format");
      }
      // type validations
      if (
        typeof responseContent.completion !== "number" ||
        typeof responseContent.summary !== "string"
      ) {
        throw new Error("Invalid types for completion or summary");
      }
    } catch (error) {
      console.error("Error parsing response content:", error);
      // Handle the error appropriately..
    }

  }

  await UPDATE (req.subject).with(responseContent)

  }
}

module.exports = { ProcessorService }



// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// For demo purposess only...
const _require = id => {try{ return require(id) } catch(e) { if (e.code !== 'MODULE_NOT_FOUND') throw e }}
cds.once("served", ()=> _require('./alert-notifications')?.prototype.init.call(cds.services.ProcessorService))
