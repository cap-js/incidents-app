sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'ns/incidents/test/integration/FirstJourney',
		'ns/incidents/test/integration/pages/IncidentsList',
		'ns/incidents/test/integration/pages/IncidentsObjectPage',
		'ns/incidents/test/integration/pages/ConversationsObjectPage'
    ],
    function(JourneyRunner, opaJourney, IncidentsList, IncidentsObjectPage, ConversationsObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('ns/incidents') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheIncidentsList: IncidentsList,
					onTheIncidentsObjectPage: IncidentsObjectPage,
					onTheConversationsObjectPage: ConversationsObjectPage
                }
            },
            opaJourney.run
        );
    }
);