# Incident Management

## Overview

Welcome to the Incident Management reference sample application for CAP and development recommendations provided by the SAP BTP Developer Guide.  
This sample application has already been shown at these events:

- TechEd keynote demo 2019
- [TechEd hands-on sessions 2022](https://github.com/SAP-samples/teched2022-AD264/wiki)
- at the recap conference 2023

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
git clone https://github.com/cap-js/incidents-app
cd incidents-app
```

Navigate to the project root folder and edit the value of `name` in `package.json` file to `incidents-app`

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
   
    Alternatively, `bob` or `alice` can be used as well. They both hold the required `support` role to execute the app. In preparation for extensions, `alice` is additionally an `admin`.
    
    **Note:** if you get the 403 Forbidden Error and the popup doesn't show, try to open a browsen in an incognito mode or clear the browser cache.

## Deploy the Incident Management Application

The code base in this repository can be deployed in both SAP BTP, Cloud Foundry runtime and SAP BTP, Kyma runtime.
Follow these steps to deploy the application in the resepective runtime:

- [Deploy incident management app to SAP BTP Cloud Foundry Runtime](https://pages.github.tools.sap/cap/golden-path/deploy/to-cf)
- [Deploy incident management app to SAP BTP Kyma Runtime](https://pages.github.tools.sap/cap/golden-path/deploy/to-k8s)

## SAP BTP Developer Guide

The Incident Management application is used as a reference for the SAP BTP Developer guidance. The SAP BTP Developer Guide provides a curated learning journey and best practices for Pro Code developers. The tutorials will walk you through selected guides of the guide with the goal to build and deploy a full-stack application.


