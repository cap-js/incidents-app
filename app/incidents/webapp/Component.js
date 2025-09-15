sap.ui.define(
  ["sap/fe/core/AppComponent", "sap/ui/performance/trace/FESR"], function(Component, FESR) {
      "use strict";
    FESR.setActive(true, new URI(sap.ui.require.toUrl("ukrs01.incidents")).path() + "/fesr");
      return Component.extend("ukrs01.incidents.Component", {
 	 metadata: {
 	     manifest: "json"
 	 }
      });
  }
 );