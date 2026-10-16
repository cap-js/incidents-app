// cds bind -2 <aicore>
// cds bind --exec -- node fetch-models.js
import xsenv from "@sap/xsenv"

// Read aicore credentials from VCAP_SERVICES (injected by cds bind --exec)
const { clientid, clientsecret, url: tokenUrl, serviceurls } = xsenv.serviceCredentials({ label: "aicore" })
const aiApiUrl = serviceurls?.AI_API_URL

if (!aiApiUrl) throw new Error("AI_API_URL not found in aicore service credentials")

// Fetch OAuth token
const tokenRes = await fetch(`${tokenUrl}/oauth/token`, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientid,
    client_secret: clientsecret,
  }),
})
if (!tokenRes.ok) throw new Error(`Token request failed: ${tokenRes.status} ${await tokenRes.text()}`)
const { access_token } = await tokenRes.json()

// Discover foundation models
const modelsRes = await fetch(`${aiApiUrl}/v2/lm/deployments`, {
  headers: {
    Authorization: `Bearer ${access_token}`,
    "Content-Type": "application/json",
    "AI-Resource-Group": "default",
  },
})
if (!modelsRes.ok) throw new Error(`Models request failed: ${modelsRes.status} ${await modelsRes.text()}`)
const models = await modelsRes.json()

console.log(JSON.stringify(models, null, 2))
