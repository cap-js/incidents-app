# Incident Management

## Overview

Welcome to the Incident Management reference sample application for CAP and development recommendations provided by Golden Path.  
This sample application has already been shown at these events:

- [TechEd keynote demo 2019](https://github.wdf.sap.corp/teched2019-extensions/teched2019-keynote)
- [TechEd hands-on sessions 2022](https://github.com/SAP-samples/teched2022-AD264/wiki)
- [Demo in d-com Keynote 2023](https://github.tools.sap/D053371/dcom23-incident-mgmt)

## Business Scenario

ACME, a  manufacturer of washing machines engages the service of call center to process and manage the incidents reported by its customers. A call center employee (Processor) receives a phone call from the customer of ACME and based on the complaint, he/she creates the new Incident on behalf of customer and adds the conversation.
 
These are assumptions that are used in this sample scenario:
- Customer details are already existing within the Customer entity.
- Incidents are always created by the Call Center employee (Processor).

## Domain

The application allows customers to create incidents, processed by support team members. 
Both add comments to a conversation.

![domain drawio](https://github.com/SAP-samples/cap-sample-incidents-mgmt/assets/12186013/a1de9cf1-1346-427d-b5a2-55a14428e8f5)

## Run the Incidents Management Application

1. Clone the Incident Management application repository:

```sh
git clone https://github.tools.sap/cap/incidents-mgmt
cd incidents-mgmt
```

Navigate to the project root folder and edit the value of `name` in `package.json` file to `incidents-mgmt`

```sh
npm i
```

2. Run the application:

```sh
cds w
```
3. Test the application:

```sh
npm t
```
4. Display the user interface of the application.

 1. Start the application with `cds w`.
 2. In a browser, open the server URL: `http://localhost:4004`.
 3. There are two URLs under web applications:
 
    - /launchpage.html uses a [local launchpage](!https://pages.github.tools.sap/cap/golden-path/develop/Launchpage/Launchpage)
    - /incidents/webapp/index.html uses the index.html from [ui5 app](!https://pages.github.tools.sap/cap/golden-path/develop/btp-app-create-ui-fiori-elements/btp-app-create-ui-fiori-elements)
    
 4. When you are prompted to authenticate, use the following credentials:
 
    - Username: `incident.support@tester.sap.com`
    - Password: `initial` 
    
    **Note:** if you get the 403 Forbidden Error and the popup doesn't show, try to open a browsen in an incognito mode or clear the browser cache.

## Deploy the Incident Management Application

The code base in this repository can be deployed in both SAP BTP, Cloud Foundry runtime and SAP BTP, Kyma runtime.
Follow these steps to deploy the application in the resepective runtime:

- [Deploy incident management app to SAP BTP Cloud Foundry Runtime](https://pages.github.tools.sap/cap/golden-path/deploy/to-cf)
- [Deploy incident management app to SAP BTP Kyma Runtime](https://pages.github.tools.sap/cap/golden-path/deploy/to-k8s)

## Golden Path Guidance for SAP BTP

The Incident Management application is used as a reference for the Golden Path guidance. The Golden Path guidance provides a curated learning journey and best practices for Pro Code developers. The Golden Path Beginner's tutorial walks you through selected guides of the Golden Path documentation with the goal to build and deploy a full-stack application. Refer to the [Golden Path Beginner's Tutorial](https://pages.github.tools.sap/cap/golden-path/bootstrap/beginner-tutorial) for more information.


