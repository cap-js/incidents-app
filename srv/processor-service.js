const cds = require('@sap/cds')
const { OrchestrationClient } = require('@sap-ai-sdk/orchestration');

const orchestrationClient = new OrchestrationClient({
  promptTemplating: {
    model: {
      name: 'mistralai--mistral-small'
    }
  }
});

const LOG = cds.log('processor')

class ProcessorService extends cds.ApplicationService {
  async init() {

    const { Incidents, SimilarIncidents } = this.entities

    this.before ('UPDATE', Incidents, async req => {
      let closed = await SELECT.one(1) .from (req.subject) .where `status.code = 'C'`
      if (closed) req.reject `Can't modify a closed incident!`
    })

    this.before (['CREATE','UPDATE'], Incidents, req => {
      let urgent = req.data.title?.match(/urgent/i)
      if (urgent) req.data.urgency_code = 'H'
    })
    this.before('READ', Incidents, req => {
      const cols = req.query.SELECT?.columns
      if (!cols) return

      const similarCol = cols.find(c => c?.ref?.[0] === 'similar')
      if (!similarCol) return

      // Inject orderBy and limit into the expand inline
      similarCol.orderBy = [{ ref: ['score'], sort: 'desc' }]
      similarCol.limit = { rows: { val: 2 } }
    })

    this.before('READ', SimilarIncidents, req => {
      req.query.SELECT.limit = { rows: { val: 2 } }
      req.query.SELECT.orderBy = [{ ref: ['score'], sort: 'desc' }]
    })

    await this.schedule('summarize').every('10s')
    this.emit('summarize')
    this.on('summarize', async () => {
      const incidents = await SELECT.from(Incidents)
        .columns `ID, title, modifiedAt, createdAt, conversation { message }`
        .where `summarizedAt is null or modifiedAt > summarizedAt`
        .limit(10)
      LOG.debug('summarize', incidents.length, 'incidents')

      for (const incident of incidents) {
        const { ID, title, conversation, modifiedAt, createdAt } = incident
        const prompt = `
          Summarize the ticket briefly with a maximum of 2 sentences.
          Focus on the problem the customer faces.
        `
        const content = `
          Title: ${title}
          Messages: ${conversation.map(c => `${c.timestamp} - ${c.message}`).join('\n----\n')}
        `
        const response = await orchestrationClient.chatCompletion({
          messages: [
            { role: 'system', content: prompt },
            { role: 'user', content }
          ]
        });
        const summary = response.getContent()

        const { expr } = cds.ql
        const source = expr('INCIDENTSAI')
        await UPDATE(Incidents, ID).with({
          summarizedAt: modifiedAt || createdAt,
          modifiedAt,
          summary,
          embedding: expr`vector_embedding(
            summary,
            'DOCUMENT', 'SAP_GXY.20250407'
          )`})
        LOG.debug('peristed summary:', summary)
      }
    })

    this.on('search', async req => {
      const { query } = req.data
      const { expr } = cds.ql
      const source = expr('INCIDENTSAI')
      const queryEmbedding = expr`vector_embedding(${query}, 'QUERY', 'SAP_GXY.20250407')`
      const { Incidents } = cds.entities('sap.capire.incidents')
      return await SELECT.from(Incidents)
        .columns `ID, title, summary, cosine_similarity(embedding, ${queryEmbedding}) as score`
        .where `embedding is not null`
        .orderBy `score desc`
        .limit(5)
    })

    return super.init()
  }

}

module.exports = { ProcessorService }
