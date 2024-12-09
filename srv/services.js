

//const { someOtherImport } = await import("some-other-module");
const cds = require('@sap/cds')

class ProcessorService extends cds.ApplicationService {
  /** Registering custom event handlers */
  init() {
    this.before('UPDATE', 'Incidents', req => this.onUpdate(req))
    this.before(['CREATE', 'UPDATE'], 'Incidents', req => this.changeUrgencyDueToSubject(req.data))
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
    this.fillAIfields();
    const { status_code } = await SELECT.one(req.subject, i => i.status_code).where({ ID: req.data.ID })
    if (status_code === 'C') {
      return req.reject(`Can't modify a closed incident`)
    }
  }

  async fillAIfields() {
    const { OrchestrationClient } = await import ('@sap-ai-sdk/orchestration');
    const orchestrationClient = new OrchestrationClient({
      llm: {
        model_name: 'gpt-4-32k',
        model_params: { max_tokens: 50, temperature: 0.1 }
      },
      templating: {
        template: [
          { role: 'user', content: 'What is the capital of {{?country}}?' }
        ]
      }
    }, { resourceGroup: 'aic', scenarioId: '???',  });
    
    const response = await orchestrationClient.chatCompletion({
      inputParams: { country: 'France' }
    });
    
    const responseContent = response.getContent();
  }
}

module.exports = { ProcessorService }





// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// For demo purposess only...
const _require = id => {try{ return require(id) } catch(e) { if (e.code !== 'MODULE_NOT_FOUND') throw e }}
cds.once("served", ()=> _require('./alert-notifications')?.prototype.init.call(cds.services.ProcessorService))
