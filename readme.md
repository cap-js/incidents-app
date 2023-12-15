# Incident Management

Welcome to the Incident Management reference sample application for CAP and development recommendations provided by the SAP BTP Developer Guide.  

## Domain Model

The application allows customers to create incidents, processed by support team members. Both add comments to a conversation.

![domain drawio](https://github.com/SAP-samples/cap-sample-incidents-mgmt/assets/12186013/a1de9cf1-1346-427d-b5a2-55a14428e8f5)

The incidents are allways created on behalf of pre-registered customers by support personell, i.e., call center employees.



## Setup

Assumed you prepared for CAP development as documented in capire's *[Getting Started > Jumpstart](https://cap.cloud.sap/docs/get-started/jumpstart)* page, ...

Clone the repository and install dependencies:

```sh
git clone https://github.com/cap-js/incidents-app
cd incidents-app
```

```sh
npm install
```



## Run

Run the application locally:

```sh
cds watch
```
Then open http://localhost:4004 and navigate to [/incidents/webapp](http://localhost:4004/incidents/webapp/index.html). <br>
(login as `alice`, no password required).

<details>
    <summary> Troubleshooting </summary>
  If you get a 403 Forbidden Error and the logon popup doesn't show, try to open a browser in an incognito mode or clear the browser cache.
</details>



## Test

Run enclosed tests with:

```sh
npm test
```


## Deploy

See: *[BTP Developer Guidelines Deployment Guides](https://help.sap.com/docs/btp/btp-developers-guide/deploy-cap)*
