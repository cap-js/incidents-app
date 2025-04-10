# Steps after Subscription

## Establish App2App Communication

- After you have subscribed to the application, Login to your `Subscriber IAS Tenant`.
- Search for `SAP Build Work Zone, standard edition(your_subscriber_subaccount_name)`.
- Go to `Application APIs/Dependencies`. Add a new dependency.
- Give dependency name as `incidents-api`.
- In the application dropdown, search for IAS app with name `Display name for IAS instance(subscriber_subaccount_name)`. e.g. **incident-management-saas-cdm (subscriber_subaccount)**.
- The provided API from the app will get selected automatically.

## Assign AMS policies to users
- Login to your `Subscriber IAS Tenant`. And go to `Applications & Resources`.
- Search for Application `Display name for IAS instance(subscriber_subaccount_name)`. e.g. **incident-management-saas-cdm (subscriber_subaccount)**.
- Go to `Authorizations` tab, and you will see the list of the policies.
- Select the policies and assign users.

## Access Application
- In Subscriber Subaccount, go to `HTML5 Applications` tab and click on the application hyperlink.
