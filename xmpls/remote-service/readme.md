# Remote Service - Sample

Sample app based on [Incident Management](https://github.com/cap-js/incidents-app) for showcasing how to integrate a remote service into a CAP based application.

## Business Use Case

In this tutorial, we will integrate SAP S/4 HANA Cloud Business Partner API to the Incident Management Application.

When a new incident is created by the processor, he/she has to assign the incident to a customer on behalf of whom they are receiving the phone call. This option to choose customer will be given as a value help and the list of customers in the value help will be fetched from SAP S/4HANA Cloud system. We will be using S/4HANA Business Partner API for the same.

### Setup

1. Clone the calesi repository

    ```sh
    git clone https://github.com/cap-js/calesi.git --recursive
    ```
2. Navigate to the folder samples/remote-service

3. Run the below command to copy files from remote service sample to the incident management application.

    ```sh
    cp -r ./db ./srv ./tests package.json ../../incidents-app
    ```

4. Navigate to incidents-app and open package.json file.

5. Change the name in package.json file to `incident-management`

6. [Run a developer test with Mock Data](https://github.com/SAP-samples/btp-developer-guide-cap/blob/main/documentation/remote-service/develop/test-with-mock.md#run-the-incident-management-application)

### Deploy and Run the application in SAP BTP

* [Make sure prerequisites are fulfilled and all required systems are in place](https://github.com/SAP-samples/btp-developer-guide-cap/blob/main/documentation/remote-service/mission-prerequisites/README.md)
* [Configure the connectivity between SAP S/4HANA Cloud and SAP BTP](https://github.com/SAP-samples/btp-developer-guide-cap/blob/main/documentation/remote-service/s4hana-cloud-to-btp-connectivity/README.md)
* [Prepare the app for Production](https://github.com/SAP-samples/btp-developer-guide-cap/blob/main/documentation/remote-service/deploy/prep-for-prod/prep-for-prod.md)
* [Configure Mock Server - optional](https://github.com/SAP-samples/btp-developer-guide-cap/blob/main/documentation/remote-service/install-mock-server/README.md)
* [Option 1 - Deploy to SAP BTP Cloud Foundry](https://github.com/SAP-samples/btp-developer-guide-cap/blob/main/documentation/remote-service/deploy/cf/README.md)
* [Option 2 - Deploy to SAP BTP Kyma Runtime](https://github.com/SAP-samples/btp-developer-guide-cap/blob/main/documentation/remote-service/deploy/kyma/README.md)
* [Test the end to end flow](https://github.com/SAP-samples/btp-developer-guide-cap/blob/main/documentation/remote-service/test-the-application/test-the-app.md)

   