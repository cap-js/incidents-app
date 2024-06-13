#!/bin/bash

echo "Adding Remote Service"
cp -r xmpls/remote-service/* .

echo "Adding Messaging"
cp -r xmpls/messaging/* .

echo "Adding Change Tracking"
npm add @cap-js/change-tracking 
cp xmpls/change-tracking.cds ./srv
cp xmpls/change-tracking.test.js ./test

echo "Adding Audit Log"
npm add @cap-js/audit-logging
cp xmpls/data-privacy.cds ./srv
cp xmpls/audit-log.test.js ./test