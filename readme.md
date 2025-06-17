# Incident Management – CAP Reference Application

Welcome to the Incident Management reference sample application for the [SAP Cloud Application Programming Model (CAP)](https:/cap.cloud.sap).

The application allows to create and process incidents on behalf of registered customers with the basic domain model is depicted below.

![domain drawio](xmpls/schema.drawio.svg)



## Setup

Assumed you prepared for CAP development as documented in capire's *[Initial Setup](https://cap.cloud.sap/docs/get-started/#setup)* section, ...

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
(for testing with authorization, copy the file `xmpls/authorizations.cds` into the `srv` folder. Then, login as `alice`, no password required).

<details>
    <summary> Troubleshooting </summary>
  If you get a 403 Forbidden Error and the logon popup doesn't show, try to open a browser in an incognito mode or clear the browser cache.
</details>



## Test

Run enclosed tests with:

```sh
npm test
```

## Add plugins

If you want to use the Incidents App with CAP plugins like Change Tracking, Attachment Handling etc. have a look at the [readme file in the xmpls folder](./xmpls/readme.md).

## Deploy

See: *[BTP Developer Guidelines Deployment Guides](https://help.sap.com/docs/btp/btp-developers-guide/deploy-cap)*
